import { describe, it, expect, vi } from 'vitest';
import worker, { runChatWorkflowSteps } from '../src/index';

function createQueueMessage(body: unknown) {
	return {
		id: 'queue-msg-1',
		timestamp: new Date('2026-03-11T12:00:00Z'),
		body,
		attempts: 1,
		ack: vi.fn(),
		retry: vi.fn(),
	} satisfies Message;
}

function createBatch(message: ReturnType<typeof createQueueMessage>) {
	return {
		messages: [message],
		queue: 'queue-lux4-incoming',
		ackAll: vi.fn(),
		retryAll: vi.fn(),
	} satisfies MessageBatch;
}

function createWorkflowStatus(status: InstanceStatus['status'], error?: InstanceStatus['error']): InstanceStatus {
	return {
		status,
		error,
	};
}

function createEnv(overrides?: Partial<Env>): Env {
	return {
		AI: {
			run: vi.fn().mockResolvedValue({ output_text: 'hello from AI' }),
		} as unknown as Ai,
		QUEUE_LUX4_REPLY: {
			send: vi.fn().mockResolvedValue(undefined),
		} as unknown as Queue,
		VPC_SERVICE: {
			fetch: vi.fn(),
		} as unknown as Fetcher,
		CHAT_WORKFLOW: {
			create: vi.fn(),
			get: vi.fn(),
		} as unknown as Workflow<unknown>,
		...overrides,
	} as Env;
}

function createStepMock(): WorkflowStep {
	return {
		do: vi.fn(async (_name: string, configOrCallback: unknown, maybeCallback?: unknown) => {
			const callback =
				typeof configOrCallback === 'function'
					? (configOrCallback as (ctx: { attempt: number }) => Promise<unknown>)
					: (maybeCallback as (ctx: { attempt: number }) => Promise<unknown>);
			return callback({ attempt: 1 });
		}),
		sleep: vi.fn(),
		sleepUntil: vi.fn(),
		waitForEvent: vi.fn(),
	} as unknown as WorkflowStep;
}

describe('lux4-iagw worker', () => {
	it('returns service metadata on fetch', async () => {
		const response = await worker.fetch!(new Request('https://example.com'), createEnv(), {} as ExecutionContext);
		expect(await response.json()).toEqual(expect.objectContaining({
			ok: true,
			service: 'lux4-iagw',
			model: '@cf/openai/gpt-oss-20b',
			workflow: 'lux4-chat-workflow',
		}));
	});

	it('proxies graphbrain health through the vpc binding', async () => {
		const env = createEnv({
			VPC_SERVICE: {
				fetch: vi.fn().mockResolvedValue(
					new Response(JSON.stringify({ status: 'ok', service: 'lux4-graphbrain' }), {
						status: 200,
						headers: { 'content-type': 'application/json' },
					}),
				),
			} as unknown as Fetcher,
		});

		const response = await worker.fetch!(
			new Request('https://example.com/__tests/graphbrain/health'),
			env,
			{} as ExecutionContext,
		);

		expect(env.VPC_SERVICE.fetch).toHaveBeenCalledWith('http://graphbrain.internal/health');
		expect(await response.json()).toEqual({ status: 'ok', service: 'lux4-graphbrain' });
	});

	it('runs a graphbrain write probe through the vpc binding', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(new Response(JSON.stringify({ status: 'accepted', messageId: 'probe-msg' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({ status: 'accepted', userId: 'user-123' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}));
		const env = createEnv({
			VPC_SERVICE: {
				fetch: fetchMock,
			} as unknown as Fetcher,
		});

		const response = await worker.fetch!(
			new Request('https://example.com/__tests/graphbrain/probe', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					userId: 'user-123',
					siteUrl: 'https://rocket.cambian.art',
					roomId: 'room-graphbrain',
					senderUsername: 'edwin',
					text: 'probe incoming',
					replyText: 'probe reply',
				}),
			}),
			env,
			{} as ExecutionContext,
		);

		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			'http://graphbrain.internal/message/incoming',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			'http://graphbrain.internal/message/reply',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(await response.json()).toEqual(expect.objectContaining({
			ok: true,
			userId: 'user-123',
		}));
	});

	it('creates a workflow instance and acks once it completes', async () => {
		const message = createQueueMessage(JSON.stringify({
			version: 1,
			kind: 'incoming_message',
			source: 'rocketchat',
			siteUrl: 'https://rocket.cambian.art',
			roomId: 'room-1',
			senderUsername: 'edwin',
			senderUserId: 'user-1',
			messageId: 'msg-1',
			text: 'Hola',
			receivedAt: '2026-03-11T12:00:00Z',
		}));
		const batch = createBatch(message);
		const instance = {
			id: 'incoming-queue-msg-1',
			status: vi.fn().mockResolvedValue(createWorkflowStatus('complete')),
		} as unknown as WorkflowInstance;
		const env = createEnv({
			CHAT_WORKFLOW: {
				create: vi.fn().mockResolvedValue(instance),
				get: vi.fn(),
			} as unknown as Workflow<unknown>,
		});

		await worker.queue!(batch, env, {} as ExecutionContext);

		expect(env.CHAT_WORKFLOW.create).toHaveBeenCalledWith(expect.objectContaining({
			id: 'incoming-queue-msg-1',
			params: expect.objectContaining({
				queueMessageId: 'queue-msg-1',
				incomingMessage: expect.objectContaining({
					senderUserId: 'user-1',
					senderUsername: 'edwin',
				}),
			}),
		}));
		expect(message.ack).toHaveBeenCalledTimes(1);
		expect(message.retry).not.toHaveBeenCalled();
	});

	it('retries when the workflow finishes with an error', async () => {
		const message = createQueueMessage(JSON.stringify({
			version: 1,
			kind: 'incoming_message',
			source: 'rocketchat',
			siteUrl: 'https://rocket.cambian.art',
			roomId: 'room-1',
			senderUsername: 'edwin',
			senderUserId: 'user-1',
			messageId: 'msg-1',
			text: 'Hola',
		}));
		const batch = createBatch(message);
		const instance = {
			id: 'incoming-queue-msg-1',
			status: vi.fn().mockResolvedValue(createWorkflowStatus('errored', {
				name: 'Error',
				message: 'graphbrain unavailable',
			})),
		} as unknown as WorkflowInstance;
		const env = createEnv({
			CHAT_WORKFLOW: {
				create: vi.fn().mockResolvedValue(instance),
				get: vi.fn(),
			} as unknown as Workflow<unknown>,
		});

		await worker.queue!(batch, env, {} as ExecutionContext);

		expect(message.ack).not.toHaveBeenCalled();
		expect(message.retry).toHaveBeenCalledTimes(1);
	});

	it('acks malformed messages without starting a workflow', async () => {
		const message = createQueueMessage('not json at all');
		const batch = createBatch(message);
		const env = createEnv();

		await worker.queue!(batch, env, {} as ExecutionContext);

		expect(env.CHAT_WORKFLOW.create).not.toHaveBeenCalled();
		expect(message.ack).toHaveBeenCalledTimes(1);
		expect(message.retry).not.toHaveBeenCalled();
	});

	it('workflow loads context, translates, persists, replies, and enqueues', async () => {
		const aiRun = vi
			.fn()
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'I like blueberries.' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'Hello there' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: '你好，我可以帮你什么？' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'You can help me.' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'Hello, how can I help you?' }] }] });
		const vpcFetch = vi
			.fn()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				user_id: 'user-1',
				prompt_context: '[CHAT_HISTORY_START]\n- User: (Earlier context)\n[CHAT_HISTORY_END]',
			}), { status: 200, headers: { 'content-type': 'application/json' } }))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				user_id: 'user-1',
				assertions_context: '[ASSERTIONS_START]\n- likes blueberries\n[ASSERTIONS_END]',
			}), { status: 200, headers: { 'content-type': 'application/json' } }))
			.mockResolvedValueOnce(new Response(JSON.stringify({ status: 'accepted', messageId: 'msg-1' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({ status: 'accepted', userId: 'user-1' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}));
		const env = createEnv({
			AI: {
				run: aiRun,
			} as unknown as Ai,
			VPC_SERVICE: {
				fetch: vpcFetch,
			} as unknown as Fetcher,
		});
		const step = createStepMock();

		const result = await runChatWorkflowSteps({
			queueMessageId: 'queue-msg-1',
			incomingMessage: {
				source: 'rocketchat',
				siteUrl: 'https://rocket.cambian.art',
				roomId: 'room-1',
				messageId: 'msg-1',
				text: '你好',
				senderUsername: 'edwin',
				senderUserId: 'user-1',
				receivedAt: '2026-03-11T12:00:00Z',
			},
		}, env, step);

		expect(vpcFetch).toHaveBeenNthCalledWith(1, 'http://graphbrain.internal/context/llm?user_id=user-1', undefined);
		expect(vpcFetch).toHaveBeenNthCalledWith(2, 'http://graphbrain.internal/context/assertions?user_id=user-1', undefined);
		expect(aiRun).toHaveBeenNthCalledWith(1, '@cf/openai/gpt-oss-20b', expect.objectContaining({
			input: expect.stringContaining('[TEXT_TO_PREPROCESS]'),
		}));
		expect(aiRun).toHaveBeenNthCalledWith(2, '@cf/openai/gpt-oss-20b', expect.objectContaining({
			input: expect.stringContaining('[TEXT_TO_TRANSLATE]'),
		}));
		expect(aiRun.mock.calls[0]?.[1]).toEqual(expect.objectContaining({
			input: expect.stringContaining('[USER_ASSERTIONS]'),
		}));
		expect(aiRun).toHaveBeenNthCalledWith(3, '@cf/openai/gpt-oss-20b', expect.objectContaining({
			input: expect.stringContaining('[LATEST_USER_MESSAGE]'),
		}));
		expect(aiRun.mock.calls[2]?.[1]).toEqual(expect.objectContaining({
			input: expect.stringContaining('likes blueberries'),
		}));
		expect(aiRun).toHaveBeenNthCalledWith(4, '@cf/openai/gpt-oss-20b', expect.objectContaining({
			input: expect.stringContaining('[TEXT_TO_PREPROCESS]'),
		}));
		expect(aiRun).toHaveBeenNthCalledWith(5, '@cf/openai/gpt-oss-20b', expect.objectContaining({
			input: expect.stringContaining('You can help me.'),
		}));
		expect(vpcFetch).toHaveBeenNthCalledWith(
			3,
			'http://graphbrain.internal/message/incoming',
			expect.objectContaining({
				method: 'POST',
				body: expect.stringContaining('"text":"Hello there"'),
			}),
		);
		expect(vpcFetch).toHaveBeenNthCalledWith(
			4,
			'http://graphbrain.internal/message/reply',
			expect.objectContaining({
				method: 'POST',
				body: expect.stringContaining('"text":"Hello, how can I help you?"'),
			}),
		);
		expect(env.QUEUE_LUX4_REPLY.send).toHaveBeenCalledWith({
			version: 1,
			kind: 'reply_message',
			source: 'rocketchat',
			siteUrl: 'https://rocket.cambian.art',
			roomId: 'room-1',
			replyMode: 'message',
			text: '你好，我可以帮你什么？',
		});
		expect(result).toEqual({
			version: 1,
			kind: 'reply_message',
			source: 'rocketchat',
			siteUrl: 'https://rocket.cambian.art',
			roomId: 'room-1',
			replyMode: 'message',
			text: '你好，我可以帮你什么？',
		});
	});

	it('skips incoming translation and graphbrain write when incoming preprocessing is empty', async () => {
		const aiRun = vi
			.fn()
			.mockResolvedValueOnce({ output_text: '' })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: '你好，我可以帮你什么？' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'You can help me.' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'Hello, how can I help you?' }] }] });
		const vpcFetch = vi
			.fn()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				user_id: 'user-1',
				prompt_context: '[CHAT_HISTORY_START]\n- User: (Earlier context)\n[CHAT_HISTORY_END]',
			}), { status: 200, headers: { 'content-type': 'application/json' } }))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				user_id: 'user-1',
				assertions_context: '[ASSERTIONS_START]\n- likes blueberries\n[ASSERTIONS_END]',
			}), { status: 200, headers: { 'content-type': 'application/json' } }))
			.mockResolvedValueOnce(new Response(JSON.stringify({ status: 'accepted', userId: 'user-1' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}));
		const env = createEnv({
			AI: { run: aiRun } as unknown as Ai,
			VPC_SERVICE: { fetch: vpcFetch } as unknown as Fetcher,
		});

		await runChatWorkflowSteps({
			queueMessageId: 'queue-msg-1',
			incomingMessage: {
				source: 'rocketchat',
				siteUrl: 'https://rocket.cambian.art',
				roomId: 'room-1',
				messageId: 'msg-1',
				text: '你好',
				senderUsername: 'edwin',
				senderUserId: 'user-1',
			},
		}, env, createStepMock());

		expect(vpcFetch).toHaveBeenCalledTimes(3);
		expect(vpcFetch).not.toHaveBeenCalledWith(
			'http://graphbrain.internal/message/incoming',
			expect.anything(),
		);
		expect(env.QUEUE_LUX4_REPLY.send).toHaveBeenCalledTimes(1);
	});

	it('still enqueues reply when reply preprocessing is empty', async () => {
		const aiRun = vi
			.fn()
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'I like blueberries.' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'Hello there' }] }] })
			.mockResolvedValueOnce({ output: [{ type: 'message', content: [{ type: 'output_text', text: '你好，我可以帮你什么？' }] }] })
			.mockResolvedValueOnce({ output_text: '' });
		const vpcFetch = vi
			.fn()
			.mockResolvedValueOnce(new Response(JSON.stringify({
				user_id: 'user-1',
				prompt_context: '[CHAT_HISTORY_START]\n- User: (Earlier context)\n[CHAT_HISTORY_END]',
			}), { status: 200, headers: { 'content-type': 'application/json' } }))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				user_id: 'user-1',
				assertions_context: '[ASSERTIONS_START]\n- likes blueberries\n[ASSERTIONS_END]',
			}), { status: 200, headers: { 'content-type': 'application/json' } }))
			.mockResolvedValueOnce(new Response(JSON.stringify({ status: 'accepted', messageId: 'msg-1' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}));
		const env = createEnv({
			AI: { run: aiRun } as unknown as Ai,
			VPC_SERVICE: { fetch: vpcFetch } as unknown as Fetcher,
		});

		const result = await runChatWorkflowSteps({
			queueMessageId: 'queue-msg-1',
			incomingMessage: {
				source: 'rocketchat',
				siteUrl: 'https://rocket.cambian.art',
				roomId: 'room-1',
				messageId: 'msg-1',
				text: '你好',
				senderUsername: 'edwin',
				senderUserId: 'user-1',
			},
		}, env, createStepMock());

		expect(vpcFetch).toHaveBeenCalledTimes(3);
		expect(vpcFetch).not.toHaveBeenCalledWith(
			'http://graphbrain.internal/message/reply',
			expect.anything(),
		);
		expect(env.QUEUE_LUX4_REPLY.send).toHaveBeenCalledTimes(1);
		expect(result).toEqual(expect.objectContaining({
			text: '你好，我可以帮你什么？',
		}));
	});
});
