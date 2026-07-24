# Claude Code CLI 安装与使用教程导航

这是一份 Claude Code 入门教程，带你从安装、配置到第一次在项目中使用 Claude Code。

这不是 Anthropic 官方中文翻译。安装方式、认证方式、环境变量和插件命令会随 Claude Code 版本变化；遇到差异时，请以 Claude Code 官方文档为准。如果你的组织提供 LLM Gateway 或专用配置，请同时遵循组织给出的配置说明。

## 学习路径

1. [01 - 安装 Claude Code CLI：先把本机环境跑通](01-install-and-verify.md)

   适合从零开始。先安装终端和 Git，再优先用官方 PowerShell 脚本安装 Claude Code；如果网络、安全软件或系统策略拦截，再改用 WinGet。最后用 `claude --version` 和 `claude doctor` 判断本机环境是否健康。

2. [02 - 可选：接入 LLM Gateway 或组织提供的模型服务](02-gateway-configuration.md)

   适合已经拿到组织网关账号、API Key 或专用配置的用户。重点讲清楚 `ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN`、模型名和 `settings.json` 的关系。没有这类网关配置的读者可以先跳过这一篇。

3. [03 - 快速上手与增强能力：让 Claude Code 真正进入项目工作流](03-daily-workflow-and-extensions.md)

   适合完成安装后马上开始使用。包括进入项目目录、常用指令、终端建议、Superpowers、OpenSpec 和常见问题处理。

## 一句话路线

```text
准备 Windows Terminal、Git
  -> 优先用官方 PowerShell 脚本安装 Claude Code
  -> 如果脚本被网络或系统策略拦截，改用 WinGet
  -> 用 claude --version 和 claude doctor 验证
  -> 按需安装 Node.js LTS
  -> 如果有组织网关配置，写入 C:\Users\<你的用户名>\.claude\settings.json
  -> 启动 claude
  -> 用 /status 确认当前认证和模型状态
  -> 进入项目目录开始使用
```

## 什么时候看哪一篇？

| 我现在的处境 | 下一步 |
| --- | --- |
| 我还没有装 Claude Code | 先看 [01 - 安装 Claude Code CLI](01-install-and-verify.md) |
| 我已经能运行 `claude --version`，并且拿到了组织网关配置 | 看 [02 - 可选：接入 LLM Gateway](02-gateway-configuration.md) |
| 我能进入 Claude Code，但不知道怎么开始项目 | 看 [03 - 快速上手与增强能力](03-daily-workflow-and-extensions.md) |
| `/status` 没显示预期的网关地址或模型 | 回到 [02 - 检查配置是否生效](02-gateway-configuration.md#check-status) |
| `npm -v` 在 PowerShell 里报脚本策略错误 | 看 [01 - PowerShell npm 脚本策略问题](01-install-and-verify.md#powershell-npm-policy) |

## 本教程采用的口径

- Windows 用户优先使用 Claude Code 官方 PowerShell 安装脚本；WinGet 是网络、安全策略或脚本执行受限时的备用方案。
- npm 全局安装只作为旧环境兼容方案保留，不作为新手主流程。官方公开 README 已将 npm 安装标为 deprecated。
- 看到“从 URL 下载脚本并执行”不要简单理解成非官方或不安全；这里的 `install.ps1` 是 Claude Code 官方 Windows 推荐安装入口。如果被代理、登录页或安全软件拦截，再切换 WinGet。
- Git for Windows 在原生 Windows 上推荐安装，因为它可以让 Claude Code 使用 Git Bash；如果没有 Git for Windows，Claude Code 会回退到 PowerShell。
- WSL 用户应在 WSL 发行版内部安装和启动 Claude Code，不需要额外安装 Git for Windows 来给 WSL 使用。
- Node.js LTS 不是官方原生安装 Claude Code 的前置条件；本教程仍建议安装它，是因为很多项目脚本、npm 工具和 OpenSpec 会用到。
- 如果你的组织提供 LLM Gateway 配置，应优先复制组织后台生成的 Claude Code `settings.json`，不要手写猜测模型名和接口路径；这应被理解为“Gateway 提供 Claude Code 兼容接口”，不是“Claude Code 原生直连某个非 Anthropic 模型”。
- API Key 不应写进教程、截图或仓库；截图时必须打码。

## 参考来源

- Claude Code 官方 README：https://github.com/anthropics/claude-code
- Claude Code 官方安装文档：https://code.claude.com/docs/en/installation
- Claude Code LLM Gateway 文档：https://code.claude.com/docs/en/llm-gateway
- Claude Code 环境变量文档：https://code.claude.com/docs/en/env-vars
- Claude Code settings 文档：https://code.claude.com/docs/en/settings
- Claude Code 插件参考：https://code.claude.com/docs/en/plugins-reference
