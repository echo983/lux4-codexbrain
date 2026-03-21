# Use Codex With The Agents SDK

## Running Codex as an MCP Server

Codex can run as an MCP server and be connected from other MCP clients, including agents built with the OpenAI Agents SDK.

Start the server:

```bash
codex mcp-server
```

Or launch it with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector codex mcp-server
```

The server exposes two MCP tools:

### `codex`

Starts a Codex conversation.

Important properties:

- `prompt` required
- `approval-policy`
- `base-instructions`
- `config`
- `cwd`
- `include-plan-tool`
- `model`
- `profile`
- `sandbox`

### `codex-reply`

Continues an existing Codex conversation.

Important properties:

- `prompt` required
- `threadId` required
- `conversationId` deprecated alias of `threadId`

Use `structuredContent.threadId` returned from the `codex` tool response for follow-up turns.

Example response shape:

```json
{
  "structuredContent": {
    "threadId": "019bbb20-bff6-7130-83aa-bf45ab33250e",
    "content": "`ls -lah` (or `ls -alh`) — long listing, includes dotfiles, human-readable sizes."
  },
  "content": [
    {
      "type": "text",
      "text": "`ls -lah` (or `ls -alh`) — long listing, includes dotfiles, human-readable sizes."
    }
  ]
}
```

Modern MCP clients usually read `structuredContent` if present.

## Minimal Agents SDK Bootstrap

Create a working directory and add an API key:

```bash
mkdir codex-workflows
cd codex-workflows
printf "OPENAI_API_KEY=sk-..." > .env
```

Install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade openai openai-agents python-dotenv
```

Minimal MCP bootstrap:

```python
import asyncio

from agents.mcp import MCPServerStdio


async def main() -> None:
    async with MCPServerStdio(
        name="Codex CLI",
        params={
            "command": "npx",
            "args": ["-y", "codex", "mcp-server"],
        },
        client_session_timeout_seconds=360000,
    ) as codex_mcp_server:
        print("Codex MCP server started.")


if __name__ == "__main__":
    asyncio.run(main())
```

## Single-Agent Workflow Pattern

Recommended shape:

- one agent uses Codex MCP as its execution engine
- another agent can prepare the brief and hand off implementation

Important instruction pattern for Codex-executing agents:

- save outputs to explicit file paths
- explicitly set:
  - `"approval-policy": "never"`
  - `"sandbox": "workspace-write"`

Typical setup:

- `Game Designer`
- `Game Developer`

The designer hands a 3-sentence brief to the developer, and the developer uses Codex MCP to create files such as `index.html`.

## Multi-Agent Workflow Pattern

Representative agent set:

- `Project Manager`
- `Designer`
- `Frontend Developer`
- `Backend Developer`
- `Tester`

Key orchestration ideas:

- Project Manager writes shared root artifacts first:
  - `REQUIREMENTS.md`
  - `TEST.md`
  - `AGENT_TASKS.md`
- each role writes only to its own folder
- hand-offs are gated by required files existing
- Codex MCP is used as the file-producing execution backend

Useful pieces from the example:

- `RECOMMENDED_PROMPT_PREFIX`
- `MCPServerStdio`
- explicit hand-offs
- `max_turns`
- traces for post-run inspection

## Practical Notes

- `threadId` is the continuation key when calling `codex-reply`
- Codex MCP is a good fit when you want:
  - long-running sessions
  - deterministic file production
  - auditable tool usage
  - multi-agent orchestration outside the CLI
- this is relevant if `lux4-codexbrain` later wants to move some logic from `codex exec` into a long-running MCP-backed agent runtime

## Links Mentioned In The Source Material

- Agents SDK MCP guide:
  - https://openai.github.io/openai-agents-js/guides/mcp/
- Model Context Protocol:
  - https://modelcontextprotocol.io/
- MCP Inspector:
  - https://modelcontextprotocol.io/legacy/tools/inspector
- OpenAI Cookbook example:
  - https://github.com/openai/openai-cookbook/blob/main/examples/codex/codex_mcp_agents_sdk/building_consistent_workflows_codex_cli_agents_sdk.ipynb
- Traces dashboard:
  - https://platform.openai.com/trace
