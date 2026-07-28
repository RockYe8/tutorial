# Codex CLI 安装与使用教程导航

这是一份 Codex 入门教程，带你从安装、认证到第一次在真实项目中使用 Codex。

这不是 OpenAI 官方中文翻译。Codex 的安装脚本、认证方式、桌面端入口、CLI 参数和安全策略会随版本变化；遇到差异时，请以 OpenAI Codex 官方文档和你所在组织的配置说明为准。

## 学习路径

1. [01 - 安装 Codex CLI：先把本机环境跑通](01-install-and-verify.md)

   适合从零开始。先准备终端和 Git，再按系统选择官方安装脚本、npm、Homebrew 或二进制包。最后用 `codex --version` 判断命令是否可用。

2. [02 - 登录与认证：选择 ChatGPT 账号或 API Key](02-authentication-and-configuration.md)

   适合已经安装好 Codex，但还没完成登录的用户。重点讲清楚 `codex login`、`codex login status`、ChatGPT 登录、API Key 登录和 `CODEX_HOME` 的关系。

3. [03 - 第一次进入项目：让 Codex 安全地开始工作](03-first-project-workflow.md)

   适合完成登录后马上开始使用。包括进入项目目录、第一次提问、`AGENTS.md`、审批与沙箱、验证闭环和常见问题处理。

## 一句话路线

```text
准备 Windows Terminal 或系统终端、Git
  -> Windows 优先用官方 PowerShell 安装脚本
  -> macOS/Linux 可用官方 shell 脚本
  -> 需要包管理器时再用 npm 或 Homebrew
  -> 用 codex --version 验证
  -> 运行 codex login 并完成浏览器登录
  -> 用 codex login status 检查认证
  -> 进入项目根目录
  -> 让 Codex 先读项目、再计划、再修改、再验证
```

## 什么时候看哪一篇？

| 我现在的处境 | 下一步 |
| --- | --- |
| 我还没有装 Codex | 先看 [01 - 安装 Codex CLI](01-install-and-verify.md) |
| 我已经能运行 `codex --version`，但还没登录 | 看 [02 - 登录与认证](02-authentication-and-configuration.md) |
| 我已经登录，但不知道怎么在项目里开始 | 看 [03 - 第一次进入项目](03-first-project-workflow.md) |
| 浏览器登录打不开或不方便 | 看 [02 - 设备码登录](02-authentication-and-configuration.md#device-auth) |
| Codex 要求批准命令或网络访问 | 看 [03 - 审批与沙箱](03-first-project-workflow.md#permissions) |

## 本教程采用的口径

- Windows 用户优先使用 Codex 官方 PowerShell 安装脚本；如果脚本被网络、安全策略或代理拦截，再考虑 npm、二进制包或团队分发方式。
- macOS 和 Linux 用户优先使用官方 shell 安装脚本；macOS 也可以用 Homebrew。
- npm 全局安装是通用备用方案，但会额外引入 Node.js、全局包目录、Path 和 PowerShell 执行策略等问题。
- 日常使用优先用 ChatGPT 账号登录；API Key 更适合用量计费、自动化或组织要求的场景。
- Codex 默认会通过审批和沙箱降低风险。新手不要一开始就关闭审批或使用绕过沙箱的高风险模式。
- `AGENTS.md` 是给 Codex 的项目说明书，适合写项目结构、运行命令、测试命令、代码规范和完成标准。
- API Key、访问令牌和组织密钥不应写进教程、截图或仓库；截图时必须打码。

## 参考来源

- Codex 官方文档：https://developers.openai.com/codex
- Codex CLI README：https://github.com/openai/codex
- Codex 认证文档：https://developers.openai.com/codex/auth
- Codex 命令参考：https://learn.chatgpt.com/docs/developer-commands?surface=cli
- Codex AGENTS.md 文档：https://learn.chatgpt.com/docs/agent-configuration/agents-md
- Codex 审批与安全文档：https://learn.chatgpt.com/docs/agent-approvals-security
