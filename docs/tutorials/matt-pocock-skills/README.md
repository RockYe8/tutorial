# Matt Pocock Skills 教程导航

这组教程是我的个人学习笔记，也面向正在学习 Matt Pocock Skills 的开发者。它不把 Skills 当成一串要背的命令，而是把它们放进真实 AI 编程流程里：什么时候该先被追问，什么时候该沉淀领域语言，什么时候该写 spec，什么时候该拆 tickets，什么时候才轮到实现和 review。

整组教程使用 Todo 应用作为贯穿示例。Todo 足够熟悉，读者不用先学习复杂业务，就能把注意力放在工作流本身。第一篇从一个个人 Todo MVP 开始，帮助新手理解 Codex Skills 为什么不是普通 prompt；第二篇接着一个已有 Todo 应用，演示如何把标签、筛选和归档功能从模糊想法推进到可实现、可验证的工程工作。

## 学习路径

1. [01 - 从 Todo MVP 理解 Codex Skills](01-codex-skills-basics.md)（已完成）

   适合第一次接触 Codex Skills 的读者。你会看到普通 prompt 为什么容易让 AI 过早动手，以及 `/grill-me`、`/handoff`、`/ask-matt`、`/teach` 这类 Skills 如何把一次聊天变成更稳定的学习和澄清流程。

2. [02 - 从 Setup 到 Code Review 的工程主链路](02-engineering-workflow.md)（已完成）

   适合已经在仓库里工作的读者。它会从 `/setup-matt-pocock-skills` 开始，走过 `/grill-with-docs`、`/wayfinder`、`/to-spec`、`/to-tickets`、`/implement`、`/tdd` 和 `/code-review`，展示一个 Todo 功能怎样被拆成有上下文、有标准、有验收方式的开发工作。

本 README 可以作为路线图使用：表格里的链接指向稳定章节锚点，方便读者从自己的处境直接跳到对应场景。

## 我遇到 X，该用哪个 Skill？

| 我现在的处境 | 优先使用的 Skill | 跳转到教程场景 |
| --- | --- | --- |
| 我只有一个模糊想法，比如“想做个 Todo App”，但还不知道范围 | `/grill-me` | [01: 用 `/grill-me` 把模糊想法问清楚](01-codex-skills-basics.md#grill-me) |
| 我想理解 agent 为什么要先追问，而不是立刻写方案 | `/grilling` | [01: `/grilling` 是追问背后的工作纪律](01-codex-skills-basics.md#grilling) |
| 我想理解 Skills 和普通 prompt 到底有什么不同 | `/ask-matt` 或先读基础篇 | [01: Skills 是可复用工作流，不是魔法 prompt](01-codex-skills-basics.md#skills-as-workflows) |
| 我不知道该用哪个 Skill 或流程 | `/ask-matt` | [01: 用 `/ask-matt` 选择下一步](01-codex-skills-basics.md#ask-matt) |
| 会话变长了，我想保留上下文，之后继续做 | `/handoff` | [01: 用 `/handoff` 保存上下文](01-codex-skills-basics.md#handoff) |
| 我想边做边学，把仓库当成长期学习环境 | `/teach` | [01: 用 `/teach` 学会工作流](01-codex-skills-basics.md#teach) |
| 我在真实仓库里开始用这些 Skills，不确定本地约定是否齐全 | `/setup-matt-pocock-skills` | [02: 先做仓库约定设置](02-engineering-workflow.md#setup-matt-pocock-skills) |
| 我在已有 Todo App 里想加标签、筛选和归档，但需求还不稳 | `/grill-with-docs` | [02: 用 `/grill-with-docs` 做带文档的澄清](02-engineering-workflow.md#grill-with-docs) |
| 讨论里出现了“任务”“标签”“归档”等术语，需要统一语言 | `/domain-modeling` | [02: 用 `/domain-modeling` 保存领域语言](02-engineering-workflow.md#domain-modeling) |
| 目标太大，未知点很多，不适合直接写 spec | `/wayfinder` | [02: 用 `/wayfinder` 先画出未知地图](02-engineering-workflow.md#wayfinder) |
| 讨论已经清楚了，我想把它变成正式可构建说明 | `/to-spec` | [02: 用 `/to-spec` 合成正式规格](02-engineering-workflow.md#to-spec) |
| 已经有 spec，需要拆成可以逐个交给 agent 的工作 | `/to-tickets` | [02: 用 `/to-tickets` 拆垂直切片](02-engineering-workflow.md#to-tickets) |
| 我有一个明确 ticket，希望 Codex 自己实现、验证、review | `/implement` | [02: 用 `/implement` 执行一个 ticket](02-engineering-workflow.md#implement) |
| 我正在实现，需要先写失败测试再让代码通过 | `/tdd` | [02: `/tdd` 是实现内部的红绿循环](02-engineering-workflow.md#tdd) |
| 代码写完了，想同时检查仓库标准和原始 spec | `/code-review` | [02: 用 `/code-review` 关闭反馈环](02-engineering-workflow.md#code-review) |
| 外部来了一个原始 issue，需要判断是否 ready | `/triage` | [02: 用 `/triage` 处理原始输入](02-engineering-workflow.md#triage) |
| 程序坏了或测试失败了，我不想靠猜修 bug | `/diagnosing-bugs` | [02: 用 `/diagnosing-bugs` 建立红色反馈](02-engineering-workflow.md#diagnosing-bugs) |
| 我不确定某个 UI 或状态模型是否可行，只想低成本试一下 | `/prototype` | [02: 用 `/prototype` 回答一个设计问题](02-engineering-workflow.md#prototype) |
| 需要查资料，并把来源和结论留在仓库里 | `/research` | [02: 用 `/research` 做可追溯调研](02-engineering-workflow.md#research) |
| 我想改善代码结构，但还没有明确改哪个模块 | `/improve-codebase-architecture` | [02: 用 `/improve-codebase-architecture` 找架构改进点](02-engineering-workflow.md#improve-codebase-architecture) |
| 我正在讨论模块边界、接口深浅、测试接缝 | `/codebase-design` | [02: 用 `/codebase-design` 讨论模块设计](02-engineering-workflow.md#codebase-design) |
| 合并或 rebase 时出现冲突，需要保留双方意图 | `/resolving-merge-conflicts` | [02: 用 `/resolving-merge-conflicts` 解决冲突](02-engineering-workflow.md#resolving-merge-conflicts) |
| 我以后想写自己的 Skill | `/writing-great-skills` | [02: 用 `/writing-great-skills` 学写 Skill](02-engineering-workflow.md#writing-great-skills) |

## 推荐读法

如果你是第一次接触，按第一篇从头读到尾，然后回到上面的查询表，把自己的真实处境对应到一个 Skill。不要急着把所有 Skills 都用一遍；先学会在正确时机让 AI 慢下来、问清楚、留下可复用上下文。

如果你已经在仓库里工作，可以直接从第二篇开始。重点看主链路：setup 建立约定，grilling 澄清方向，spec 固化意图，tickets 拆小执行，implement 负责交付，code-review 对照标准和 spec 收尾。这个链路才是 Matt Pocock Skills 最有价值的地方。
