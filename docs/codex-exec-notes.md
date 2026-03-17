# Codex Exec Notes

这份备忘整理的是 `codex exec` 非交互模式里，后续接入 `lux4-codexbrain` 最可能直接用到的点。

## 核心定位

- `codex exec` 适合脚本、daemon、CI、定时任务这类非交互场景。
- 运行时进度写到 `stderr`。
- 最终 agent 回复写到 `stdout`。
- 如果只想拿最终文本结果，这个模式很适合被上游程序调用。

## 最小调用

```bash
codex exec "reply to the user message briefly"
```

如果不想把 rollout/session 文件落盘：

```bash
codex exec --ephemeral "reply to the user message briefly"
```

## 权限相关

- 默认是只读 sandbox。
- 允许自动编辑：`--full-auto`
- 更宽权限：`--sandbox danger-full-access`
- `danger-full-access` 只适合受控环境。

后续如果 `lux4-codexbrain` 只是把用户消息交给 `codex exec` 生成回复，而不希望它随意改文件，应该优先从更小权限开始，不要默认给 `danger-full-access`。

## 结构化输出

如果 daemon 后续不想靠纯文本解析，可以用 JSON schema 约束最终输出：

```bash
codex exec "Extract project metadata" \
  --output-schema ./schema.json \
  -o ./project-metadata.json
```

这对下面几类场景有价值：

- 让 Codex 返回固定字段的 reply 结构
- 返回机器可读的分类、标签、动作意图
- 为后续自动流水线提供稳定 JSON 输出

## JSONL 事件流

如果需要更细的过程观测，可以用：

```bash
codex exec --json "summarize the repo structure"
```

此时 `stdout` 会变成 JSON Lines 事件流，包含：

- `thread.started`
- `turn.started`
- `turn.completed`
- `turn.failed`
- `item.*`
- `error`

如果将来 `lux4-codexbrain` 需要：

- 记录 Codex 调用过程
- 分析失败原因
- 统计命令执行和文件修改

那么 `--json` 会比只拿最终文本更适合。

## 只保存最终结果

如果只关心最终回复文本，可以用：

```bash
codex exec "reply to the user" -o ./last-message.txt
```

这会把最终消息写到文件，同时仍然输出到 `stdout`。

## 认证

自动化场景推荐 API key：

- 环境变量：`CODEX_API_KEY`
- 可单次调用内联：

```bash
CODEX_API_KEY=<api-key> codex exec --json "triage open bug reports"
```

注意点：

- `CODEX_API_KEY` 只支持 `codex exec`
- 这是后续 daemon 集成时最直接的认证方式
- 不要把 key 打进日志

## 会话续接

如果后续要做两阶段流水线，可以用：

```bash
codex exec "review the change for race conditions"
codex exec resume --last "fix the race conditions you found"
```

或者：

```bash
codex exec resume <SESSION_ID> "continue from previous context"
```

这对 `lux4-codexbrain` 未来的多步 agent 编排可能有帮助，但当前第一阶段 echo 并不需要。

## Git 仓库要求

- `codex exec` 默认要求当前目录是 Git 仓库。
- 可以用 `--skip-git-repo-check` 跳过。

当前 `lux4-codexbrain` 已经是 Git 仓库，所以一般不需要额外处理。

## 对本项目最有价值的部分

后续将 `EchoService` 替换成真正的 Codex responder 时，最值得优先尝试的是：

1. 用 `codex exec --ephemeral` 做单轮回复生成。
2. 用 `CODEX_API_KEY` 做 daemon 级认证。
3. 初期先读取最终 `stdout` 文本，不急着上 `--json`。
4. 如果后面需要稳定结构，再引入 `--output-schema`。
5. 如果要保留跨轮 agent 上下文，再研究 `resume`。

## 一个可能的最小接入方向

示意命令：

```bash
CODEX_API_KEY=... codex exec --ephemeral \
  "You are replying to a chat user. Reply in the same language as the user. User message: ..."
```

对 `lux4-codexbrain` 来说，最初版只需要：

- 组 prompt
- 调 `codex exec`
- 拿 `stdout`
- 写入 Cloudflare Queue reply payload

不需要一开始就接入完整的多步 agent 工作流。
