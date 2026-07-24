# Claude Code 基础使用手册与方法论

这是一套面向中文开发者的实践型 tutorial，目标是帮助你把 Claude Code 用进真实项目：让它理解仓库、管理上下文、澄清任务、修改代码、验证结果，并把可重复的经验沉淀成团队资产。

它不是官方文档翻译、认证备考资料、提示词合集，也不是某个框架的完整项目实战。你不需要先学完 Matt Pocock Skills workflow 才能开始；那些内容只会在进阶小节里作为更成熟工作流的参考。

## 适合谁阅读

- 已经会基本编程、理解 Git 和常见项目结构，但还没有形成 Claude Code 工作流的开发者。
- 会使用 ChatGPT 或 IDE 补全，但还不熟悉让 agent 读取仓库、调用工具、修改文件并验证结果的读者。
- 想把个人经验沉淀成团队规则、skills、spec、tickets、review criteria 和 CI prompt 的工程师或技术负责人。

本教程不面向零编程基础读者，也不覆盖企业 SSO、合规审计、复杂多代理编排、Agent SDK 深度开发或 MCP server 完整实现。

## 推荐顺序

如果你第一次系统学习 Claude Code，建议按真实开发任务生命周期顺序阅读：

```text
理解 Claude Code
  -> 安装并安全启动
  -> 读懂真实项目
  -> 完成第一次小改动
  -> 调试、测试和验证
  -> 管理上下文与项目规则
  -> 规划和拆任务
  -> 沉淀可复用工作流
  -> 判断进阶工具边界
  -> 扩展到团队协作
  -> 用反模式和清单复盘
```

## 章节导航

| 顺序 | 章节 | 用途 |
| --- | --- | --- |
| 01 | [什么是 Claude Code](01-what-is-claude-code.md) | 建立 agentic coding tool 的基础心智模型，区分 Claude Code、普通聊天和代码补全。 |
| 02 | [安装与第一次启动](02-install-and-first-run.md) | 说明 CLI、IDE、桌面端和 Web 的入口差异，以及工作目录、权限提示和第一次安全使用。 |
| 03 | [让 Claude Code 先读懂真实项目](03-read-a-real-project.md) | 展示如何从宽问题到窄问题理解陌生仓库，控制上下文，并得到可复用的读代码产物。 |
| 04 | [完成第一次小范围修改](04-make-your-first-change.md) | 讲清如何描述需求、判断是否需要 planning、执行修改、查看 diff 并确认范围。 |
| 05 | [调试、测试与验证闭环](05-debug-test-and-verify.md) | 建立先复现、再定位、再修复的调试纪律，并组合测试、lint、typecheck、diff 和 review。 |
| 06 | [上下文、memory 与 CLAUDE.md](06-context-memory-and-claude-md.md) | 说明 `CLAUDE.md`、memory、rules、imports、handoff 的用途、层级和维护边界。 |
| 07 | [Planning mode 与任务拆分](07-planning-and-task-splitting.md) | 帮你判断什么时候先规划，如何把模糊需求变成 spec 和可执行 tickets。 |
| 08 | [Skills 与可复用工作流](08-skills-and-repeatable-workflows.md) | 讲 skill 和普通 prompt 的区别，以及如何把高频任务封装成 focused, repeatable workflow。 |
| 09 | [MCP、subagents、hooks 等进阶工具边界](09-advanced-tooling-mcp-subagents-hooks.md) | 从判断和安全边界角度介绍 MCP、subagents、hooks、permissions，不写复杂实现教程。 |
| 10 | [团队工作流、CI 与 review](10-team-workflow-ci-and-review.md) | 把个人使用升级为团队共享资产、PR/MR 审查和受控的无人值守流程。 |
| 11 | [反模式、模板与检查清单](11-anti-patterns-and-checklists.md) | 汇总常见误区、任务前中后的检查清单，以及可按场景改写的最小模板。 |

## 我遇到 X，该读哪章？

| 我现在的问题 | 建议阅读 |
| --- | --- |
| 我还不确定 Claude Code 和聊天机器人、IDE 补全有什么区别。 | [01 - 什么是 Claude Code](01-what-is-claude-code.md) |
| 我想知道该从 CLI、IDE、桌面端还是 Web 开始。 | [02 - 安装与第一次启动](02-install-and-first-run.md) |
| 我进入一个陌生仓库，不知道该让 Claude 先读什么。 | [03 - 让 Claude Code 先读懂真实项目](03-read-a-real-project.md) |
| 我有一个小需求，想让 Claude 改代码但又怕范围扩散。 | [04 - 完成第一次小范围修改](04-make-your-first-change.md) |
| 程序报错了，我想让 Claude 帮忙 debug。 | [05 - 调试、测试与验证闭环](05-debug-test-and-verify.md) |
| 我不知道怎么组织错误信息、复现步骤和失败命令。 | [05 - 调试、测试与验证闭环](05-debug-test-and-verify.md) |
| 我想写或维护 `CLAUDE.md`，但不确定该放什么。 | [06 - 上下文、memory 与 CLAUDE.md](06-context-memory-and-claude-md.md) |
| 会话变长了，我担心上下文污染或丢细节。 | [06 - 上下文、memory 与 CLAUDE.md](06-context-memory-and-claude-md.md) |
| 我不知道什么时候该用 planning mode。 | [07 - Planning mode 与任务拆分](07-planning-and-task-splitting.md) |
| 一个大需求应该怎么拆成 agent 可以完成的 tickets？ | [07 - Planning mode 与任务拆分](07-planning-and-task-splitting.md) |
| 我想把重复流程沉淀成 skill，而不是每次复制 prompt。 | [08 - Skills 与可复用工作流](08-skills-and-repeatable-workflows.md) |
| 我在判断是否需要 MCP、subagent、hooks 或 permissions。 | [09 - MCP、subagents、hooks 等进阶工具边界](09-advanced-tooling-mcp-subagents-hooks.md) |
| 我想把 Claude Code 用法推广到团队、review 或 CI。 | [10 - 团队工作流、CI 与 review](10-team-workflow-ci-and-review.md) |
| 我想在开始任务、验证前或交接前快速自查。 | [11 - 反模式、模板与检查清单](11-anti-patterns-and-checklists.md) |

## 阅读与发布方式

Markdown 是本教程唯一手工维护的 source of truth。后续生成的 HTML 包只是从当前 Markdown 导出的 release / offline artifact，不应手工编辑 HTML 后再反向同步。

在线阅读时，可以使用仓库 Web UI。离线分发时，运行 `npm run export:claude-code-basic-manual-html` 会从当前 Markdown 生成 `dist/claude-code-basic-manual-html/`，导出范围是 README 和编号章节。其中 `index.html` 是入口页，章节间链接会从 `.md` 重写为 `.html` 并尽量保留锚点。读者直接打开本地 `index.html` 即可阅读，不需要启动本地服务器。

HTML 包是生成物，默认不作为手工维护源；如果发现内容问题，应修改 Markdown 后重新导出。PDF 或 Word 可以作为未来扩展，但不是第一优先级。

## 给后续章节作者的写作约束

- 使用中文，写成实践型 tutorial，而不是功能百科或官方文档摘要。
- 按真实开发任务生命周期组织内容：进入项目、理解上下文、收束任务、修改代码、验证结果、沉淀规则。
- 每章应能独立回答一个真实问题，同时顺序阅读时形成递进。
- 给场景、判断标准、产物形态和下一步，不堆脱离上下文的可复制 prompt 模板。
- Advanced 内容要短而清晰，只作为补强；不要让 Matt Pocock workflow、MCP、subagents 或 hooks 压过基础主线。
