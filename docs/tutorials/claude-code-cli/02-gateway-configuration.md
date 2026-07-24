# 02 - 可选：接入 LLM Gateway 或组织提供的模型服务

这一篇假设你已经完成第一篇：本机能运行 `claude --version`。如果你使用官方 Claude 账号登录 Claude Code，可以先跳到第三篇。本篇只适用于一种情况：你的学校、团队或组织提供了 LLM Gateway、API Key 或 Claude Code 专用配置，需要把 Claude Code 指向这个网关。

请把本篇里的地址、模型名和 key 都当成占位示例。真实配置以你的组织后台生成的 Claude Code 配置为准。不要猜接口地址、模型名或 key 格式。

## 为什么要用 Gateway

LLM Gateway 可以理解为 Claude Code 和模型服务之间的“中转站”。组织提供 Gateway 时，通常是为了：

- 统一认证。
- 统一模型路由。
- 使用量统计。
- 预算和限流。
- 审计和合规。
- 在不同模型或供应商之间做路由。

Claude Code 官方文档也把 LLM Gateway 描述为 Claude Code 和模型服务之间的集中代理层。关键要求是：Gateway 必须能提供 Claude Code 所需的 Anthropic Messages 格式接口，而不是只提供 OpenAI `/v1/chat/completions`。

如果组织后台显示 DeepSeek 或其他模型名，应理解为“Gateway 把 Claude Code 兼容请求路由到指定模型”。不要理解成“Claude Code 原生直连某个非 Anthropic 模型”，否则容易把客户端能力和网关能力混在一起。

## 生成 Claude Code 专用 API Key

打开组织提供的网关后台，进入模型或 API Key 页面。常见步骤是：

1. 使用你的组织账号登录。
2. 进入模型广场或模型列表。
3. 选择允许给 Claude Code 使用的模型。
4. 在生成 Key 时，工具类型选择 `Claude Code`。
5. 复制后台生成的 Claude Code `settings.json`。
6. 妥善保存 API Key，不要发到聊天、文档、截图或仓库。

如果后台同时提供多种工具类型，一定要选 `Claude Code`。给普通 OpenAI SDK、curl 或其他工具使用的 key 配置，不一定能直接给 Claude Code 用。

## 理解 settings.json

Claude Code 的用户级配置通常在：

```text
C:\Users\<你的用户名>\.claude\settings.json
```

在 PowerShell 中可以这样打开：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude" | Out-Null
notepad "$env:USERPROFILE\.claude\settings.json"
```

组织后台复制出来的内容可能类似：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://gateway.example.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-你的key",
    "ANTHROPIC_MODEL": "company-approved-model",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "company-approved-model",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "company-approved-model",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "company-approved-model",
    "CLAUDE_CODE_SUBAGENT_MODEL": "company-approved-model"
  }
}
```

这里最重要的是：

| 配置项 | 用途 |
| --- | --- |
| `ANTHROPIC_BASE_URL` | 把 Claude Code 请求发到 Gateway |
| `ANTHROPIC_AUTH_TOKEN` | 作为 Authorization bearer token 发给 Gateway |
| `ANTHROPIC_MODEL` | 默认模型名 |
| `ANTHROPIC_DEFAULT_*_MODEL` | 给不同模型档位指定网关模型 |
| `CLAUDE_CODE_SUBAGENT_MODEL` | 子任务或子代理使用的模型 |

官方环境变量文档说明，`ANTHROPIC_BASE_URL` 用于覆盖 API endpoint，把请求路由到代理或网关；`ANTHROPIC_AUTH_TOKEN` 会作为 Authorization header 的 bearer token 使用。`settings.json` 的 `env` 字段可以让这些变量对每次 Claude Code 会话生效。

## 写入配置

把组织后台复制出的 JSON 粘贴到：

```text
C:\Users\<你的用户名>\.claude\settings.json
```

保存后，完全退出 Claude Code，重新打开终端。环境变量通常在新会话启动时读取，旧窗口可能仍然拿不到新配置。

## 测试 Gateway 接口

如果 Gateway 提供 Anthropic Messages 兼容接口，可以先在 PowerShell 中测试：

```powershell
$settings = Get-Content "$env:USERPROFILE\.claude\settings.json" -Raw | ConvertFrom-Json
$env:ANTHROPIC_BASE_URL = $settings.env.ANTHROPIC_BASE_URL
$env:ANTHROPIC_AUTH_TOKEN = $settings.env.ANTHROPIC_AUTH_TOKEN
$model = $settings.env.ANTHROPIC_MODEL

Invoke-RestMethod -Method Post -Uri "$env:ANTHROPIC_BASE_URL/v1/messages" `
  -Headers @{
    "Authorization" = "Bearer $env:ANTHROPIC_AUTH_TOKEN"
    "anthropic-version" = "2023-06-01"
  } `
  -ContentType "application/json" `
  -Body (@{
    model = $model
    max_tokens = 8
    messages = @(@{ role = "user"; content = "ping" })
  } | ConvertTo-Json -Depth 5)
```

成功标准：返回 JSON，并且能看到 `id`、`content` 或 `model` 一类字段。

如果返回 `401`，优先怀疑 key 复制错误、key 过期、工具类型选错，或前后多了空格。

如果返回“模型不存在”，说明地址和认证可能已经通了，问题集中在模型名。回到网关后台复制最新 Claude Code 配置，不要猜模型名。

<a id="check-status"></a>
## 启动 Claude Code 并检查状态

打开新的终端，进入项目目录：

```powershell
cd D:\你的项目目录
claude
```

进入 Claude Code 后输入：

```text
/status
```

检查：

- 能看到 Anthropic base URL 或类似字段。
- 地址是你预期的 Gateway。
- 认证方式显示已配置。
- 当前模型是组织允许使用的模型，或能通过 `/model` 选择组织允许使用的模型。

然后发送一句简单测试：

```text
请用一句话回复：Claude Code 网关连接成功。
```

如果能正常回复，就可以进入第三篇开始项目工作流。

## 不想把 key 明文写入 settings.json

如果你不想把 key 写进配置文件，可以只在当前 PowerShell 会话里临时设置：

```powershell
$env:ANTHROPIC_BASE_URL = "https://gateway.example.com"
$env:ANTHROPIC_AUTH_TOKEN = "sk-你的key"
$env:ANTHROPIC_MODEL = "company-approved-model"
claude
```

缺点是每次打开新终端都要重新设置。如果你在组织环境中使用 Claude Code，请优先遵循组织后台和安全规范。

## 常见问题

### 只支持 OpenAI 格式的网关能不能直接用？

不能只靠 OpenAI `/v1/chat/completions` 就让 Claude Code 稳定工作。Gateway 需要提供 Anthropic Messages 格式接口，或提供明确的 Claude Code 兼容配置。

### `/status` 没有显示 Gateway 地址

检查：

```powershell
notepad "$env:USERPROFILE\.claude\settings.json"
```

确认 JSON 合法，并且 `env` 里存在 `ANTHROPIC_BASE_URL`。保存后完全退出 Claude Code，再重新打开。

### 401 Unauthorized

处理顺序：

1. 回到网关后台重新复制 Claude Code 配置。
2. 确认工具类型是 `Claude Code`。
3. 确认 `ANTHROPIC_AUTH_TOKEN` 没有前后空格。
4. 确认 key 没有过期或被禁用。
5. 重新打开终端和 Claude Code。

### 连接超时

先确认当前网络和 Gateway 地址可访问。如果组织要求代理，请按组织网络说明配置代理；不要随意使用个人代理转发源码或密钥。

## 本篇总校验

完成本篇后，你应该能确认：

- `settings.json` 已保存到正确位置。
- `ANTHROPIC_BASE_URL` 指向预期 Gateway。
- `ANTHROPIC_AUTH_TOKEN` 使用自己的 key。
- 模型名来自网关后台，而不是手写猜测。
- `/v1/messages` 测试能返回 JSON，或者 Claude Code 能正常回复。
- `/status` 能看到 Gateway 地址。

## 参考来源

- Claude Code LLM Gateway 文档：https://code.claude.com/docs/en/llm-gateway
- Claude Code 环境变量文档：https://code.claude.com/docs/en/env-vars
- Claude Code settings 文档：https://code.claude.com/docs/en/settings
