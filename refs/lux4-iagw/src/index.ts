import { WorkflowEntrypoint as RuntimeWorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from 'cloudflare:workers';

const AI_MODEL = '@cf/openai/gpt-oss-20b';
const GRAPHBRAIN_BASE_URL = 'http://graphbrain.internal';
const WORKFLOW_NAME = 'lux4-chat-workflow';
const WORKFLOW_POLL_INTERVAL_MS = 1000;
const WORKFLOW_POLL_TIMEOUT_MS = 90000;

const REPLY_INSTRUCTIONS = [
	'You are Lux, a helpful assistant replying to Rocket.Chat users.',
	'Use the provided RECENT_CONTEXT as background information when it is relevant.',
	'Use the provided USER_ASSERTIONS as stable user facts when they are relevant.',
	'Reply in the same language as the latest user message unless the user explicitly asks for another language.',
	'Answer directly and concisely.',
	'Do not claim to perform actions you cannot actually perform.',
	'If the message is unclear, ask one short clarifying question.',
].join(' ');

const TRANSLATION_INSTRUCTIONS = [
	'You translate arbitrary text into natural English for knowledge storage.',
	'Use the supplied context only to resolve ambiguity and references.',
	'Use the supplied user assertions only as factual grounding when they help disambiguate the text.',
	'Output only the English translation.',
	'Do not add notes, labels, explanations, or quotes unless they are already part of the original text.',
	'Preserve names, URLs, code, IDs, and factual meaning.',
	'If the input is already English, return a clean English rendering with the same meaning.',
].join(' ');

const PROPOSITION_INSTRUCTIONS = [
	'You preprocess text for machine-readable knowledge storage.',
	'Extract only durable or semantically meaningful logical/factual propositions that are worth storing for machine reading.',
	'If the input contains logical or factual semantic content, rewrite it as plain-text propositions.',
	'Output one proposition per line.',
	'Do not number the lines.',
	'Do not add commentary, labels, markdown, or explanations.',
	'Do not output greetings, acknowledgements, politeness, conversational fillers, emotional support, invitations to continue chatting, or generic offers of help.',
	'Do not output propositions that merely restate "I can help", "let me know", "feel free to ask", "okay", "thanks", "understood", or similar social boilerplate.',
	'Questions without asserted facts should usually produce an empty string.',
	'Assistant replies that only provide courtesy, encouragement, or an invitation for follow-up should produce an empty string.',
	'If the input does not contain meaningful logical or factual semantic content for machine reading, output an empty string.',
].join(' ');

type JsonRecord = Record<string, unknown>;

abstract class WorkflowEntrypointFallback<WorkflowEnv = unknown, Payload = unknown> {
	protected ctx: ExecutionContext;
	protected env: WorkflowEnv;

	constructor(ctx: ExecutionContext, env: WorkflowEnv) {
		this.ctx = ctx;
		this.env = env;
	}

	abstract run(event: Readonly<WorkflowEvent<Payload>>, step: WorkflowStep): Promise<unknown>;
}

const WorkflowEntrypointBase =
	(RuntimeWorkflowEntrypoint ?? WorkflowEntrypointFallback) as typeof RuntimeWorkflowEntrypoint;

interface NormalizedIncomingMessage {
	source: 'rocketchat';
	siteUrl: string;
	roomId: string;
	messageId: string;
	text: string;
	senderUsername: string;
	senderUserId: string;
	receivedAt?: string;
}

interface WorkflowPayload {
	queueMessageId: string;
	incomingMessage: NormalizedIncomingMessage;
}

interface ReplyQueueMessage {
	version: 1;
	kind: 'reply_message';
	source: 'rocketchat';
	siteUrl: string;
	roomId: string;
	replyMode: 'message';
	text: string;
}

interface GraphbrainProbeRequest {
	userId?: string;
	siteUrl?: string;
	roomId?: string;
	senderUsername?: string;
	text?: string;
	replyText?: string;
}

interface GraphbrainContextResponse {
	user_id: string;
	prompt_context: string;
}

interface GraphbrainAssertionsResponse {
	user_id: string;
	assertions_context: string;
}

interface GraphbrainSearchResponse {
	user_id: string;
	results: string[];
}

interface GraphbrainAcceptedMessageResponse {
	status: string;
	messageId?: string;
	userId?: string;
}

interface MemoryContext {
	promptContext: string;
	assertionsContext: string;
}

type WorkflowTerminalStatus = Extract<
	InstanceStatus['status'],
	'complete' | 'errored' | 'terminated' | 'unknown'
>;

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/__tests/graphbrain/health') {
			return proxyGraphbrainRequest(env, '/health');
		}

		if (url.pathname === '/__tests/graphbrain/context') {
			const userId = requiredQuery(url, 'userId');
			if (userId instanceof Response) {
				return userId;
			}

			return proxyGraphbrainRequest(env, `/context/llm?user_id=${encodeURIComponent(userId)}`);
		}

		if (url.pathname === '/__tests/graphbrain/assertions') {
			const userId = requiredQuery(url, 'userId');
			if (userId instanceof Response) {
				return userId;
			}

			return proxyGraphbrainRequest(env, `/context/assertions?user_id=${encodeURIComponent(userId)}`);
		}

		if (url.pathname === '/__tests/graphbrain/search') {
			const userId = requiredQuery(url, 'userId');
			if (userId instanceof Response) {
				return userId;
			}

			const query = url.searchParams.get('query') ?? '';
			return proxyGraphbrainRequest(
				env,
				`/knowledge/search?user_id=${encodeURIComponent(userId)}&query=${encodeURIComponent(query)}`,
			);
		}

		if (url.pathname === '/__tests/graphbrain/probe' && request.method === 'POST') {
			return runGraphbrainProbe(request, env);
		}

		return Response.json({
			ok: true,
			service: 'lux4-iagw',
			model: AI_MODEL,
			workflow: WORKFLOW_NAME,
			graphbrainTestEndpoints: [
				'/__tests/graphbrain/health',
				'/__tests/graphbrain/context?userId=...',
				'/__tests/graphbrain/assertions?userId=...',
				'/__tests/graphbrain/search?userId=...&query=...',
				'/__tests/graphbrain/probe',
			],
		});
	},

	async queue(batch, env): Promise<void> {
		for (const message of batch.messages) {
			const normalized = normalizeIncomingMessage(message.body);
			if (!normalized) {
				console.error('Dropping invalid incoming queue message', {
					queueMessageId: message.id,
					body: message.body,
				});
				message.ack();
				continue;
			}

			const workflowId = buildWorkflowInstanceId(message.id);

			try {
				console.log('Starting workflow for queue message', {
					queueMessageId: message.id,
					workflowId,
					attempts: message.attempts,
					userId: normalized.senderUserId,
					roomId: normalized.roomId,
					messageId: normalized.messageId,
				});

				const instance = await ensureWorkflowInstance(env, workflowId, {
					queueMessageId: message.id,
					incomingMessage: normalized,
				});
				const status = await waitForWorkflowTerminalStatus(instance);

				if (status.status !== 'complete') {
					throw new Error(formatWorkflowFailure(status));
				}

				message.ack();
			} catch (error) {
				console.error('Queue message processing failed', {
					queueMessageId: message.id,
					attempts: message.attempts,
					error: serializeError(error),
				});
				message.retry();
			}
		}
	},
} satisfies ExportedHandler<Env>;

export class ChatWorkflow extends WorkflowEntrypointBase<Env, WorkflowPayload> {
	async run(event: Readonly<WorkflowEvent<WorkflowPayload>>, step: WorkflowStep): Promise<ReplyQueueMessage> {
		return runChatWorkflowSteps(event.payload, this.env, step);
	}
}

export async function runChatWorkflowSteps(
	payload: WorkflowPayload,
	env: Env,
	step: WorkflowStep,
): Promise<ReplyQueueMessage> {
	const message = payload.incomingMessage;

	const context = await step.do('load memory context', async () => {
		const result = await getGraphbrainMemoryContext(env, message.senderUserId);
		return {
			promptContext: result.prompt_context,
			assertionsContext: result.assertions_context,
		};
	});

	const preprocessedIncoming = await step.do('preprocess incoming for logic', async () => {
		return {
			text: await preprocessForMachineReading(message.text, context, env),
		};
	});

	if (preprocessedIncoming.text) {
		const translatedIncoming = await step.do('translate incoming to english', async () => {
			return {
				text: await translateToEnglish(preprocessedIncoming.text, context, env),
			};
		});

		await step.do('persist incoming in graphbrain', async () => {
			return postGraphbrainIncomingMessage(env, message, translatedIncoming.text);
		});
	}

	const reply = await step.do('generate user reply', async () => {
		return {
			text: await generateReply(message, context, env),
		};
	});

	const preprocessedReply = await step.do('preprocess reply for logic', async () => {
		return {
			text: await preprocessForMachineReading(reply.text, context, env),
		};
	});

	if (preprocessedReply.text) {
		const translatedReply = await step.do('translate reply to english', async () => {
			return {
				text: await translateToEnglish(preprocessedReply.text, context, env),
			};
		});

		await step.do('persist reply in graphbrain', async () => {
			return postGraphbrainReplyMessage(env, message, translatedReply.text);
		});
	}

	return step.do('enqueue outgoing reply', async () => {
		const outgoing: ReplyQueueMessage = {
			version: 1,
			kind: 'reply_message',
			source: 'rocketchat',
			siteUrl: message.siteUrl,
			roomId: message.roomId,
			replyMode: 'message',
			text: reply.text,
		};

		await env.QUEUE_LUX4_REPLY.send(outgoing);
		return outgoing;
	});
}

async function runGraphbrainProbe(request: Request, env: Env): Promise<Response> {
	const payload = await parseJsonBody<GraphbrainProbeRequest>(request);
	if (payload instanceof Response) {
		return payload;
	}

	const userId = payload.userId?.trim() || `probe-${crypto.randomUUID()}`;
	const siteUrl = payload.siteUrl?.trim() || 'https://rocket.cambian.art';
	const roomId = payload.roomId?.trim() || 'graphbrain-probe-room';
	const senderUsername = payload.senderUsername?.trim() || 'lux4-probe';
	const text = payload.text?.trim() || 'This is a connectivity probe from lux4-iagw.';
	const replyText = payload.replyText?.trim() || 'This is a reply persistence probe from lux4-iagw.';
	const messageId = `probe-${crypto.randomUUID()}`;
	const now = new Date().toISOString();

	const incomingResponse = await fetchGraphbrain<GraphbrainAcceptedMessageResponse>(env, '/message/incoming', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			version: 1,
			kind: 'incoming_message',
			source: 'rocketchat',
			siteUrl,
			roomId,
			senderUsername,
			senderUserId: userId,
			messageId,
			text,
			receivedAt: now,
		}),
	});

	const replyResponse = await fetchGraphbrain<GraphbrainAcceptedMessageResponse>(env, '/message/reply', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			version: 1,
			kind: 'reply_message',
			source: 'rocketchat',
			siteUrl,
			roomId,
			userId,
			replyMode: 'message',
			text: replyText,
		}),
	});

	return Response.json({
		ok: incomingResponse.ok && replyResponse.ok,
		userId,
		messageId,
		incoming: incomingResponse,
		reply: replyResponse,
	});
}

async function ensureWorkflowInstance(
	env: Env,
	workflowId: string,
	params: WorkflowPayload,
): Promise<WorkflowInstance> {
	try {
		return await env.CHAT_WORKFLOW.create({
			id: workflowId,
			params,
			retention: {
				successRetention: '1 day',
				errorRetention: '7 days',
			},
		});
	} catch (error) {
		console.warn('Workflow create failed, attempting to reuse existing instance', {
			workflowId,
			error: serializeError(error),
		});
		return env.CHAT_WORKFLOW.get(workflowId);
	}
}

async function waitForWorkflowTerminalStatus(instance: WorkflowInstance): Promise<InstanceStatus> {
	const startedAt = Date.now();

	for (;;) {
		const status = await instance.status();
		if (isTerminalWorkflowStatus(status.status)) {
			return status;
		}

		if (Date.now() - startedAt > WORKFLOW_POLL_TIMEOUT_MS) {
			throw new Error(`Workflow ${instance.id} timed out while waiting for completion`);
		}

		await sleep(WORKFLOW_POLL_INTERVAL_MS);
	}
}

async function getGraphbrainMemoryContext(
	env: Env,
	userId: string,
): Promise<GraphbrainContextResponse & GraphbrainAssertionsResponse> {
	const [contextResponse, assertionsResponse] = await Promise.all([
		fetchGraphbrain<GraphbrainContextResponse>(env, `/context/llm?user_id=${encodeURIComponent(userId)}`),
		fetchGraphbrain<GraphbrainAssertionsResponse>(env, `/context/assertions?user_id=${encodeURIComponent(userId)}`),
	]);

	if (!contextResponse.ok || !contextResponse.body || typeof contextResponse.body.prompt_context !== 'string') {
		throw new Error(`Failed to load graphbrain context for user ${userId}`);
	}

	if (
		!assertionsResponse.ok ||
		!assertionsResponse.body ||
		typeof assertionsResponse.body.assertions_context !== 'string'
	) {
		throw new Error(`Failed to load graphbrain assertions for user ${userId}`);
	}

	return {
		...contextResponse.body,
		...assertionsResponse.body,
	};
}

async function postGraphbrainIncomingMessage(
	env: Env,
	message: NormalizedIncomingMessage,
	englishText: string,
): Promise<GraphbrainAcceptedMessageResponse> {
	const response = await fetchGraphbrain<GraphbrainAcceptedMessageResponse>(env, '/message/incoming', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			version: 1,
			kind: 'incoming_message',
			source: message.source,
			siteUrl: message.siteUrl,
			roomId: message.roomId,
			senderUsername: message.senderUsername,
			senderUserId: message.senderUserId,
			messageId: message.messageId,
			text: englishText,
			receivedAt: message.receivedAt ?? new Date().toISOString(),
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to persist incoming message in graphbrain: HTTP ${response.status}`);
	}

	return response.body ?? { status: 'unknown' };
}

async function postGraphbrainReplyMessage(
	env: Env,
	message: NormalizedIncomingMessage,
	englishReplyText: string,
): Promise<GraphbrainAcceptedMessageResponse> {
	const response = await fetchGraphbrain<GraphbrainAcceptedMessageResponse>(env, '/message/reply', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			version: 1,
			kind: 'reply_message',
			source: message.source,
			siteUrl: message.siteUrl,
			roomId: message.roomId,
			userId: message.senderUserId,
			replyMode: 'message',
			text: englishReplyText,
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to persist reply in graphbrain: HTTP ${response.status}`);
	}

	return response.body ?? { status: 'unknown' };
}

async function preprocessForMachineReading(text: string, memory: MemoryContext, env: Env): Promise<string> {
	const response = await env.AI.run(AI_MODEL, {
		instructions: PROPOSITION_INSTRUCTIONS,
		input: buildPreprocessInput(text, memory),
		max_output_tokens: 500,
		reasoning: {
			effort: 'low',
			summary: 'auto',
		},
	});

	return extractReplyText(response).trim();
}

async function translateToEnglish(text: string, memory: MemoryContext, env: Env): Promise<string> {
	const response = await env.AI.run(AI_MODEL, {
		instructions: TRANSLATION_INSTRUCTIONS,
		input: buildTranslationInput(text, memory),
		max_output_tokens: 600,
		reasoning: {
			effort: 'low',
			summary: 'auto',
		},
	});

	const translatedText = extractReplyText(response);
	if (!translatedText) {
		throw new Error('Translation returned an empty response');
	}

	return translatedText;
}

async function generateReply(message: NormalizedIncomingMessage, memory: MemoryContext, env: Env): Promise<string> {
	const response = await env.AI.run(AI_MODEL, {
		instructions: REPLY_INSTRUCTIONS,
		input: buildReplyInput(message, memory),
		max_output_tokens: 700,
		reasoning: {
			effort: 'low',
			summary: 'auto',
		},
	});

	const replyText = extractReplyText(response);
	if (!replyText) {
		throw new Error('AI returned an empty response');
	}

	return replyText;
}

function buildPreprocessInput(text: string, memory: MemoryContext): string {
	return [
		'[RECENT_CONTEXT]',
		memory.promptContext || '(none)',
		'[/RECENT_CONTEXT]',
		'[USER_ASSERTIONS]',
		memory.assertionsContext || '(none)',
		'[/USER_ASSERTIONS]',
		'[TEXT_TO_PREPROCESS]',
		text,
		'[/TEXT_TO_PREPROCESS]',
	].join('\n');
}

function buildTranslationInput(text: string, memory: MemoryContext): string {
	return [
		'[RECENT_CONTEXT]',
		memory.promptContext || '(none)',
		'[/RECENT_CONTEXT]',
		'[USER_ASSERTIONS]',
		memory.assertionsContext || '(none)',
		'[/USER_ASSERTIONS]',
		'[TEXT_TO_TRANSLATE]',
		text,
		'[/TEXT_TO_TRANSLATE]',
	].join('\n');
}

function buildReplyInput(message: NormalizedIncomingMessage, memory: MemoryContext): string {
	return [
		`[USER_ID] ${message.senderUserId}`,
		`[USERNAME] ${message.senderUsername}`,
		'[RECENT_CONTEXT]',
		memory.promptContext || '(none)',
		'[/RECENT_CONTEXT]',
		'[USER_ASSERTIONS]',
		memory.assertionsContext || '(none)',
		'[/USER_ASSERTIONS]',
		'[LATEST_USER_MESSAGE]',
		message.text,
		'[/LATEST_USER_MESSAGE]',
	].join('\n');
}

function normalizeIncomingMessage(input: unknown): NormalizedIncomingMessage | null {
	if (typeof input === 'string') {
		try {
			return normalizeIncomingMessage(JSON.parse(input));
		} catch {
			return null;
		}
	}

	const candidates = collectCandidateObjects(input);

	const kind = pickString(candidates, ['kind']);
	if (kind && kind !== 'incoming_message') {
		return null;
	}

	const source = pickString(candidates, ['source']);
	if (source && source !== 'rocketchat') {
		return null;
	}

	const siteUrl = pickString(candidates, ['siteUrl', 'siteURL', 'site_url']);
	const roomId = pickString(candidates, ['roomId', 'rid', 'room_id']);
	const messageId = pickString(candidates, ['messageId', 'msgId', '_id', 'id']);
	const text = pickString(candidates, ['text', 'message', 'msg', 'content']);
	const senderUsername = pickString(candidates, ['senderUsername', 'username', 'user_name']);
	const senderUserId = pickString(candidates, ['senderUserId', 'userId', 'sender_id', 'uid']);
	const receivedAt = pickString(candidates, ['receivedAt', 'createdAt', 'ts']);

	if (!siteUrl || !roomId || !messageId || !text || !senderUsername || !senderUserId) {
		return null;
	}

	return {
		source: 'rocketchat',
		siteUrl,
		roomId,
		messageId,
		text,
		senderUsername,
		senderUserId,
		receivedAt: receivedAt ?? undefined,
	};
}

function collectCandidateObjects(input: unknown): JsonRecord[] {
	if (!isRecord(input)) {
		return [];
	}

	const candidates: JsonRecord[] = [input];
	for (const key of ['payload', 'message', 'data', 'event']) {
		const value = input[key];
		if (isRecord(value)) {
			candidates.push(value);
		}
	}

	return candidates;
}

function pickString(candidates: JsonRecord[], keys: string[]): string | null {
	for (const candidate of candidates) {
		for (const key of keys) {
			const value = candidate[key];
			if (typeof value === 'string') {
				const trimmed = value.trim();
				if (trimmed) {
					return trimmed;
				}
			}
		}
	}

	return null;
}

function isRecord(value: unknown): value is JsonRecord {
	return typeof value === 'object' && value !== null;
}

function serializeError(error: unknown): JsonRecord {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack ?? null,
		};
	}

	if (isRecord(error)) {
		return error;
	}

	return {
		value: String(error),
	};
}

function extractReplyText(response: ResponsesOutput): string {
	const direct = response.output_text?.trim();
	if (direct) {
		return direct;
	}

	for (const item of response.output ?? []) {
		if (item.type !== 'message') {
			continue;
		}

		for (const content of item.content ?? []) {
			if (content.type !== 'output_text') {
				continue;
			}

			const text = content.text?.trim();
			if (text) {
				return text;
			}
		}
	}

	return '';
}

async function proxyGraphbrainRequest(env: Env, path: string): Promise<Response> {
	const upstream = await env.VPC_SERVICE.fetch(`${GRAPHBRAIN_BASE_URL}${path}`);
	const bodyText = await upstream.text();
	const contentType = upstream.headers.get('content-type') ?? 'application/json; charset=utf-8';

	return new Response(bodyText, {
		status: upstream.status,
		headers: {
			'content-type': contentType,
			'x-graphbrain-status': String(upstream.status),
		},
	});
}

async function fetchGraphbrain<T>(
	env: Env,
	path: string,
	init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: T | null }> {
	const upstream = await env.VPC_SERVICE.fetch(`${GRAPHBRAIN_BASE_URL}${path}`, init);
	const bodyText = await upstream.text();

	return {
		ok: upstream.ok,
		status: upstream.status,
		body: parseJsonText(bodyText) as T | null,
	};
}

function requiredQuery(url: URL, key: string): string | Response {
	const value = url.searchParams.get(key)?.trim();
	if (value) {
		return value;
	}

	return Response.json(
		{
			ok: false,
			error: `Missing required query parameter: ${key}`,
		},
		{ status: 400 },
	);
}

async function parseJsonBody<T>(request: Request): Promise<T | Response> {
	try {
		return (await request.json()) as T;
	} catch {
		return Response.json(
			{
				ok: false,
				error: 'Request body must be valid JSON',
			},
			{ status: 400 },
		);
	}
}

function parseJsonText(bodyText: string): unknown {
	try {
		return JSON.parse(bodyText);
	} catch {
		return bodyText || null;
	}
}

function buildWorkflowInstanceId(queueMessageId: string): string {
	return `incoming-${queueMessageId}`;
}

function isTerminalWorkflowStatus(status: InstanceStatus['status']): status is WorkflowTerminalStatus {
	return status === 'complete' || status === 'errored' || status === 'terminated' || status === 'unknown';
}

function formatWorkflowFailure(status: InstanceStatus): string {
	if (status.error) {
		return `Workflow ended with status ${status.status}: ${status.error.name}: ${status.error.message}`;
	}

	return `Workflow ended with status ${status.status}`;
}

function sleep(durationMs: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, durationMs);
	});
}
