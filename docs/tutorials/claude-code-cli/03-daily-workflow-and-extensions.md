# 03 - 快速上手与增强能力：让 Claude Code 真正进入项目工作流

这一篇从“能启动 Claude Code”之后开始。目标不是堆命令，而是让新手知道每天应该怎样进入项目、怎样问、什么时候装增强能力。

## 进入项目目录

每次使用前，先进入项目根目录：

```powershell
cd D:\你的项目目录
claude
```

不要在桌面、下载目录或用户目录里随便启动 Claude Code，然后让它猜项目在哪里。Claude Code 的很多判断都依赖当前目录：它会读项目文件、运行命令、查看 Git 状态，也可能读取项目里的 Claude Code 配置。

## 第一次提问应该问什么

刚进入一个项目时，可以先让 Claude Code 建立上下文：

```text
请先阅读这个项目的 README、配置文件和主要目录结构。然后用简短列表告诉我：这个项目是做什么的、如何启动、如何测试、最重要的目录有哪些。不要修改文件。
```

## 常用指令

| 指令 | 用途 |
| --- | --- |
| `/help` | 查看当前可用命令 |
| `/status` | 查看当前认证、模型、目录和配置状态 |
| `/model` | 查看或切换可用模型 |
| `/config` | 打开或调整配置 |
| `/clear` | 清理当前会话上下文，从较干净状态继续 |
| `claude --version` | 查看 Claude Code 版本 |
| `claude doctor` | 做只读安装和配置诊断 |

具体命令会随版本变化，遇到差异时以 `/help` 和官方文档为准。

## 推荐工作方式

对新手来说，最稳的节奏是：

```text
先问清楚
  -> 再让 Claude Code 给计划
  -> 你确认计划
  -> 再允许它修改文件
  -> 修改后让它运行验证
  -> 最后让它总结改了什么
```

可以这样要求：

```text
我想修改这个功能。请先分析相关文件并提出计划，不要立刻改代码。计划里写清楚要改哪些文件、为什么改、如何验证。
```

确认后再说：

```text
按刚才的计划执行。改完后运行项目已有的测试或最小验证，并总结结果。
```

## 安装 Superpowers

Superpowers 是一组增强 Claude Code 工程流程的插件/技能集合，常用于需求澄清、计划、执行、调试、TDD 和 review。

进入 Claude Code 后执行：

```text
/plugin install superpowers@claude-plugins-official
```

安装完成后，完全退出 Claude Code，再重新进入。

如果提示 marketplace 不存在，可以根据你所在团队认可的来源添加备用 marketplace。不要安装来源不明的插件，因为插件可能影响 Claude Code 的行为、读取项目文件或引导执行命令。

验证方式：

```text
/help
```

能看到相关命令或能力，即说明安装生效。具体命令名称以当前安装版本显示为准。

## 安装 OpenSpec

OpenSpec 更适合复杂需求或多人协作。它的价值是先写清楚规格、变更和任务，再让 Claude Code 按规格实现。

如果你只做小修小补，可以先不用 OpenSpec。遇到跨模块功能、架构改造、长期需求，再考虑启用。

安装 CLI：

```cmd
npm.cmd install -g @fission-ai/openspec@latest
```

验证：

```cmd
openspec --version
```

在项目中初始化：

```cmd
cd D:\你的项目目录
openspec init --tools claude
```

初始化后，项目里通常会出现 `openspec` 相关目录。后续可以让 Claude Code 先读 OpenSpec 变更说明，再动手实现。

## 终端体验优化

这些不是安装前置条件，但能减少使用时的小麻烦：

- 优先使用 Windows Terminal。
- 如果 Git Bash 显示更稳定，可以从 Git Bash 启动项目。
- 如果 PowerShell 更符合团队脚本习惯，也可以继续用 PowerShell。
- 遇到界面边框错位、颜色异常、快捷键不工作，先换 Windows Terminal 再排查 Claude Code。

## 安全提醒

- 不要把 API Key 写进仓库。
- 不要把含 key 的截图发到群里。
- 不要让 Claude Code 访问未获批准的源码、客户数据、个人信息或保密资料。
- 让 Claude Code 修改文件前，先让它说明计划。
- 涉及删除、批量替换、数据库迁移、部署发布时，先人工确认。

## 最小可复制提示词

### 了解项目

```text
请阅读当前项目的 README、package.json 或主要配置文件，告诉我项目用途、启动命令、测试命令和主要目录。不要修改文件。
```

### 修改前先出计划

```text
我想实现这个需求：...
请先分析相关文件并给出计划，不要修改文件。计划要包含改动范围、风险和验证方式。
```

### 执行并验证

```text
按计划执行。完成后运行已有测试或最小验证，并说明验证结果。如果无法验证，请明确原因。
```

## 本篇总校验

你已经可以日常使用 Claude Code，如果：

- 能在项目根目录启动 `claude`。
- `/status` 显示配置正常。
- 能让 Claude Code 先读项目再总结。
- 知道修改前要先要计划。
- 知道什么时候使用 Superpowers。
- 知道什么时候使用 OpenSpec。

## 参考来源

- Claude Code settings 文档：https://code.claude.com/docs/en/settings
- Claude Code 插件参考：https://code.claude.com/docs/en/plugins-reference
- Claude Code 官方安装文档：https://code.claude.com/docs/en/installation
