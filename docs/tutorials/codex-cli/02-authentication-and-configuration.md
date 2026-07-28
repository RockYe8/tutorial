# 02 - 登录与认证：选择 ChatGPT 账号或 API Key

这一篇假设你已经完成第一篇：本机能运行 `codex --version`。如果还不能运行，请先回到 [01 - 安装 Codex CLI](01-install-and-verify.md)。

Codex 支持两类常见认证方式：ChatGPT 账号登录和 API Key 登录。新手优先使用 ChatGPT 账号登录；API Key 更适合组织要求、用量计费或自动化脚本。

## 优先：使用 ChatGPT 账号登录

在终端中执行：

```powershell
codex login
```

Codex 会打开浏览器，让你完成 ChatGPT 登录。登录完成后，回到终端。

检查登录状态：

```powershell
codex login status
```

成功标准是命令正常退出，并显示当前已经登录。之后进入项目目录，直接运行：

```powershell
codex
```

## ChatGPT 登录适合什么场景

ChatGPT 登录适合：

- 你已经有 Plus、Pro、Business、Edu 或 Enterprise 账号。
- 你希望 Codex 遵循 ChatGPT 工作区的权限、角色和数据策略。
- 你主要在本机 CLI、IDE 扩展或 ChatGPT 桌面端里工作。
- 你不想手动管理 API Key。

如果你所在组织统一管理 ChatGPT 工作区，登录后仍可能受到座席、角色、模型可用性、插件策略和管理员配置影响。这不是安装失败，而是组织权限的一部分。

<a id="device-auth"></a>
## 浏览器登录不方便：使用设备码

如果终端所在机器无法直接打开浏览器，或浏览器回跳失败，可以试试设备码登录：

```powershell
codex login --device-auth
```

按终端提示，在另一台能打开浏览器的设备上输入设备码并完成登录。

## API Key 登录

如果你需要使用 API Key，可以把 key 通过标准输入传给 Codex。不要把 key 写进命令历史、截图或仓库。

macOS / Linux：

```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```

Windows PowerShell：

```powershell
$env:OPENAI_API_KEY | codex login --with-api-key
```

如果你还没有设置环境变量，可以只在当前终端临时设置：

```powershell
$env:OPENAI_API_KEY = "sk-你的key"
$env:OPENAI_API_KEY | codex login --with-api-key
```

登录后检查：

```powershell
codex login status
```

## 不同认证方式的区别

| 方式 | 适合场景 | 注意点 |
| --- | --- | --- |
| ChatGPT 登录 | 日常本地开发、桌面端、IDE、团队工作区 | 受 ChatGPT 工作区权限和产品可用性影响 |
| API Key 登录 | API 组织计费、自动化、组织指定 API 项目 | 受 API 组织的数据保留、计费和模型权限影响 |
| Access token 登录 | 受信任自动化或组织托管流程 | 不适合随意复制传播，需要按组织规范管理 |

认证只解决“你是谁、用哪个账号计费或授权”。Codex 是否能读写文件、访问网络、运行命令，还会受到沙箱、审批策略、配置文件和组织管理策略影响。

## CODEX_HOME 是什么

Codex 的本地配置、认证缓存和项目级扩展通常放在 Codex home 目录中。默认情况下：

- Windows 原生环境通常是 `%USERPROFILE%\.codex`。
- macOS / Linux / WSL 通常是 `~/.codex`。

如果你同时使用 Windows 原生 Codex 和 WSL 内 Codex，要注意它们默认不是同一个目录。需要共享配置时，可以设置 `CODEX_HOME`，但新手不建议一开始就改，先让每个环境独立跑通更容易排错。

## 登出

如果要移除当前保存的认证：

```powershell
codex logout
```

然后重新检查：

```powershell
codex login status
```

## 常见问题

### `codex login` 打不开浏览器

先尝试：

```powershell
codex login --device-auth
```

如果仍失败，检查默认浏览器、公司代理、终端是否能访问登录页面。

### `codex login status` 显示未登录

重新运行：

```powershell
codex login
```

如果你刚切换了 Windows、WSL、桌面端或不同用户账号，确认当前环境使用的是哪个 `CODEX_HOME`。

### API Key 登录后还是不能用某个模型

API Key 只代表认证成功，不代表所有模型都可用。检查 API 组织、项目权限、模型可用性和账单状态。不要把 ChatGPT 订阅权限和 API Key 权限混为一谈。

## 本篇总校验

完成本篇后，你应该能确认：

- `codex login status` 显示已登录。
- 你知道自己是 ChatGPT 登录还是 API Key 登录。
- 你知道 Windows、WSL 和桌面端可能使用不同的 Codex home。
- 你没有把 API Key 写进仓库、截图或教程。
- 你可以进入第三篇，在真实项目里启动 Codex。

## 参考来源

- Codex 认证文档：https://developers.openai.com/codex/auth
- Codex CLI 命令参考：https://learn.chatgpt.com/docs/developer-commands?surface=cli
- Codex 环境变量文档：https://learn.chatgpt.com/docs/config-file/environment-variables
- ChatGPT Windows 桌面端文档：https://learn.chatgpt.com/docs/windows/windows-app
