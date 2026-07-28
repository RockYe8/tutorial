# 01 - 安装 Codex CLI：先把本机环境跑通

这一篇只解决一件事：让你的电脑能正常运行 `codex`。先不要急着配置模型、安装插件或调整权限；先把本机命令跑通，后面排错会轻很多。

本文以 Windows 10/11 为主，同时保留 macOS、Linux、WSL 的安装入口。安装方式会随 Codex 版本变化，遇到差异时以官方 README 和官方文档为准。

<a id="before-you-start"></a>
## 开始前准备

你需要准备：

- 可联网的终端。
- Windows Terminal、PowerShell、CMD、macOS Terminal 或 Linux shell。
- Git，推荐安装。
- Node.js LTS，只有在你要用 npm 安装 Codex 或运行项目脚本时才必需。
- 一个可用于登录的 ChatGPT 账号，或组织/API 平台提供的 API Key。

如果你使用 ChatGPT 桌面端，也建议先安装 Git、Node.js、Python 或团队项目需要的运行时。Codex 修改项目后通常需要运行测试、构建或格式化命令，这些工具会派上用场。

## Windows：优先使用官方 PowerShell 安装脚本

在 PowerShell 中执行：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

安装完成后，关闭当前终端，重新打开一个新终端，再执行：

```powershell
codex --version
```

成功标准是看到 Codex 的版本号。

如果安装脚本返回 HTML、登录页、脚本解析错误或网络错误，通常说明代理、网关、安全软件或系统策略没有返回真正的安装脚本。不要反复执行同一条命令，先换网络或改用 npm、二进制包，或询问团队是否有内部安装方式。

## macOS / Linux：使用官方 shell 安装脚本

在终端中执行：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

安装完成后，重新打开终端，执行：

```bash
codex --version
```

如果命令不存在，检查安装脚本提示的安装目录是否已经加入 `PATH`。

## 备用：npm 全局安装

如果你已经安装 Node.js LTS，也可以使用 npm：

```cmd
npm install -g @openai/codex
```

验证：

```cmd
codex --version
```

在 Windows PowerShell 里，如果 `npm` 报“禁止运行脚本”一类错误，可以先用 CMD 执行，或在 PowerShell 中使用：

```powershell
npm.cmd install -g @openai/codex
```

npm 方案的好处是通用；缺点是会受 Node.js、npm 全局目录、Path、代理和 PowerShell 执行策略影响。新手优先用官方安装脚本更省心。

## macOS 备用：Homebrew

macOS 用户也可以使用 Homebrew：

```bash
brew install --cask codex
```

验证：

```bash
codex --version
```

## 使用 ChatGPT 桌面端

如果你更喜欢图形界面，Windows 和 macOS 可以安装 ChatGPT 桌面端，然后在 ChatGPT 下拉入口中选择 Codex。

Windows 可通过 Microsoft Store 安装，也可以在 PowerShell 中执行：

```powershell
winget install --id 9PLM9XGG6VKS -s msstore
```

桌面端适合管理项目、并行任务、查看文件改动、使用内置浏览器和审查结果。CLI 更适合终端工作流。两者不是互斥关系，可以按场景混用。

## WSL 用户怎么选

如果项目主要放在 WSL 文件系统里，建议在 WSL 发行版内部安装并运行 Codex：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex --version
```

如果你使用 Windows 桌面端，也可以让桌面端使用 WSL agent。注意：Windows 原生 Codex 的配置目录通常是 `%USERPROFILE%\.codex`，WSL 内的 CLI 默认使用 Linux 的 `~/.codex`，两边不会天然共享登录状态和配置。

## 本篇总校验

完成本篇后，你应该能确认：

- `git --version` 能输出版本号，或你知道自己还没安装 Git。
- 如果使用 npm，`node -v` 和 `npm -v` 能输出版本号。
- `codex --version` 能输出版本号。
- 你知道自己是在 Windows PowerShell、CMD、macOS Terminal、Linux shell 还是 WSL 里运行 Codex。
- 你知道下一步是执行 `codex login`，而不是立刻给 Codex 大范围权限。

## 参考来源

- Codex CLI README：https://github.com/openai/codex
- Codex 官方文档：https://developers.openai.com/codex
- ChatGPT Windows 桌面端文档：https://learn.chatgpt.com/docs/windows/windows-app
- Node.js：https://nodejs.org/
- Git for Windows：https://git-scm.com/download/win
