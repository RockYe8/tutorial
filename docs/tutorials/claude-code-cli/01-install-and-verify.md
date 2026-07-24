# 01 - 安装 Claude Code CLI：先把本机环境跑通

这一篇只解决一件事：让你的电脑能正常运行 `claude`。不要一上来就配置模型、安装插件或改复杂设置；先把本机命令跑通，后面排错会轻松很多。

本文以 Windows 10/11 为主，同时保留 macOS、Linux、WSL 的官方安装口径。Windows 主流程优先使用官方 PowerShell 安装脚本；WinGet 是网络、安全软件或系统策略拦截脚本时的备用方案；npm 只作为旧环境兼容方案。

<a id="before-you-start"></a>
## 开始前准备

你需要准备：

- Windows 10 1809+ 或 Windows Server 2019+。
- 4 GB 以上内存。
- 可联网的终端。
- PowerShell、CMD 或 Windows Terminal。
- Git for Windows，推荐安装。
- Node.js LTS，如果你需要运行项目脚本、安装 OpenSpec，或不得不采用 npm 兼容安装。

官方文档说明 Claude Code 支持 macOS、Windows、Ubuntu、Debian 和 Alpine；Windows 上可以原生运行，也可以在 WSL 中运行。原生 Windows 更适合 Windows 项目和工具链；WSL 2 更适合 Linux 工具链和需要沙箱能力的场景。

## 先装一个舒服的终端

推荐使用 Windows Terminal。它比传统 CMD 更适合显示 Claude Code 的交互界面、颜色、表格和长输出。

如果你已经习惯 PowerShell 或 CMD，也可以继续使用。要注意区分两种提示符：

```text
PS C:\Users\你>
C:\Users\你>
```

第一行是 PowerShell，第二行是 CMD。官方安装命令对 PowerShell 和 CMD 不一样，复制命令时不要混用。

## 安装 Git for Windows

打开：

```text
https://git-scm.com/download/win
```

下载安装包后按默认选项安装即可。安装完成后，关闭当前终端，重新打开一个新的终端，执行：

```powershell
git --version
```

成功标准是看到类似输出：

```text
git version 2.x.x.windows.x
```

在原生 Windows 上，Git for Windows 是推荐项。它提供 Git Bash；如果 Claude Code 找不到 Git Bash，会使用 PowerShell 工具继续工作。

## 按需安装 Node.js LTS

如果你只用官方 PowerShell 脚本安装 Claude Code，Node.js 不是必需前置条件。Claude Code 的官方原生安装方式会处理自己的运行环境。

仍然建议安装 Node.js LTS，因为后面这些场景会用到它：

- 安装 OpenSpec。
- 运行前端或 Node.js 项目脚本。
- 使用 npm 安装其他命令行工具。
- 兼容旧版 Claude Code npm 安装流程。

打开：

```text
https://nodejs.org/
```

下载 LTS 版本安装包并按默认选项安装。安装完成后，重新打开终端，执行：

```cmd
node -v
npm -v
```

成功标准是看到两个版本号，例如：

```text
v20.x.x
10.x.x
```

<a id="powershell-npm-policy"></a>
### PowerShell npm 脚本策略问题

如果在 PowerShell 中执行 `npm -v` 时看到“因为在此系统上禁止运行脚本”，这通常是 PowerShell 执行策略问题，不代表 Node.js 安装失败。

最简单的处理方式是改用 CMD：

```cmd
npm -v
```

或者在 PowerShell 中执行：

```powershell
npm.cmd -v
```

如果你希望以后 PowerShell 里的 `npm -v` 也能直接运行，可以设置当前用户的执行策略：

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

出现确认提示时输入：

```text
Y
```

然后关闭 PowerShell，重新打开再验证。

## 安装 Claude Code

官方当前推荐原生安装，也提供 Homebrew、WinGet、npm 等方式。Windows 新手主流程应优先使用官方 PowerShell 安装脚本；如果网络、代理、安全软件或终端策略导致脚本不可用，再改用 WinGet。npm 安装已不适合作为新教程主线，只保留给旧环境或不得不用 npm 的情况。

### 先理解三种安装方式

| 方式 | 本教程定位 | 什么时候用 |
| --- | --- | --- |
| PowerShell 官方脚本 | Windows 首选 | 能访问 `claude.ai`，终端能正常执行 PowerShell 脚本 |
| WinGet | 备用安装方式 | 安全策略不允许执行官方 PowerShell 安装脚本，或脚本返回 HTML、登录页、代理错误 |
| npm | 旧环境兼容 | 旧脚本依赖 npm，或团队明确要求；新手主流程不推荐 |

关键点是：`irm https://claude.ai/install.ps1 | iex` 不是“野路子”，它是 Claude Code 官方 Windows 推荐入口。只是有些网络、安全软件或系统策略会拦截“下载脚本并立即执行”这种动作，所以本教程给出 WinGet 作为稳妥备用。

### 首选：Windows PowerShell 官方安装

在 PowerShell 中执行：

```powershell
irm https://claude.ai/install.ps1 | iex
```

如果命令正常完成，关闭终端并重新打开，再执行 `claude --version` 验证。

如果命令返回 HTML、`<script>`、JavaScript、PowerShell 解析错误或网络错误，通常说明网络、代理、登录页或安全策略没有返回真正的安装脚本。先不要反复执行，改用下面的 WinGet 备用方案。

### 备用：WinGet 安装

在 PowerShell 或 CMD 中执行：

```powershell
winget install Anthropic.ClaudeCode
```

WinGet 适合不允许“下载脚本并立即执行”的电脑。它的缺点是更新节奏可能和官方原生安装不同；后续可以定期执行：

```powershell
winget upgrade Anthropic.ClaudeCode
```

### 兼容旧环境：npm 安装

如果你已经安装 Node.js，也可以使用 npm：

```cmd
npm install -g @anthropic-ai/claude-code
```

官方公开 README 已将 npm 安装标为 deprecated，因此新手教程不建议把它作为主路径。只有在旧环境、历史脚本或团队明确要求时再使用。不要用来源不明的安装包。安装完成后关闭终端，重新打开。

## 验证安装

执行：

```cmd
claude --version
```

成功标准是看到 Claude Code 的版本号。官方文档示例中版本号形如：

```text
2.x.x (Claude Code)
```

再执行：

```cmd
claude doctor
```

`claude doctor` 会做只读诊断，包括安装健康度、设置文件错误和一些建议。它不等于启动 Claude Code 会话，适合安装完成后先跑一次。

## 启动一次 Claude Code

进入任意项目目录：

```powershell
cd D:\你的项目目录
claude
```

如果你还没有登录官方账号，或还没有配置组织提供的网关，Claude Code 可能会提示登录或认证。这说明命令本身已经可用；下一篇只在你需要接入 LLM Gateway 时再看。

## 本篇总校验

完成本篇后，你应该能确认：

- `git --version` 能输出版本号。
- 如果你的项目或 OpenSpec 需要 Node.js，`node -v` 能输出版本号。
- 如果你的项目或 OpenSpec 需要 npm，`npm -v` 或 `npm.cmd -v` 能输出版本号。
- `claude --version` 能输出版本号。
- `claude doctor` 能完成诊断。
- 你知道自己是在 PowerShell、CMD、Windows Terminal 还是 WSL 中运行命令。

## 常见问题

### `claude` 命令不存在

先关闭终端，重新打开再试：

```cmd
claude --version
```

如果还不行，检查 npm 全局目录是否在 Path 中：

```cmd
npm config get prefix
```

输出的目录通常类似：

```text
C:\Users\你的用户名\AppData\Roaming\npm
```

把这个目录加入 Windows 用户 Path 后，重新打开终端。

### PowerShell 官方安装脚本失败

如果 `irm https://claude.ai/install.ps1 | iex` 返回 HTML 或脚本错误，通常是网络、代理、登录页、终端或安全策略导致。新手不要在这里纠缠，优先改用 WinGet。npm 只作为旧环境兼容方案。

### 为什么不把 npm 放在主流程？

因为官方公开 README 已经把 npm 安装标为 deprecated。npm 还会额外引入 Node.js、全局安装目录、Path、权限和 PowerShell 执行策略等问题。对入门读者来说，npm 更适合保留为旧环境兼容方案，而不是作为第一条安装路线。

### 为什么官方脚本是首选，但教程还要写 WinGet？

官方脚本是首选，因为它不依赖 npm 或 Node.js，也符合 Claude Code 当前推荐安装路线。WinGet 是备用，因为有些网络、代理、登录页、安全软件或 PowerShell 策略会拦截脚本。遇到这类拦截时，继续反复执行脚本意义不大，切到 WinGet 更容易完成安装。

### WSL 应该怎么装？

如果项目在 WSL 里，就进入 WSL 发行版后执行 Linux 安装命令：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

WSL 中启动 `claude` 时，也应在 WSL 终端里启动，不要在 Windows PowerShell 里混用路径和工具链。

## 参考来源

- Claude Code 官方 README：https://github.com/anthropics/claude-code
- Claude Code 官方安装文档：https://code.claude.com/docs/en/installation
- Node.js：https://nodejs.org/
- Git for Windows：https://git-scm.com/download/win
