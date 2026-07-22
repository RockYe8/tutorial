# Matt Pocock Skills 教程导航

这组教程是我的个人学习笔记，也面向正在学习 Matt Pocock Skills 的开发者。它不把 Skills 当成一串要背的命令，而是把它们放进真实 AI 编程流程里：什么时候该先被追问，什么时候该沉淀领域语言，什么时候该写 spec，什么时候该拆 tickets，什么时候才轮到实现和 review。

整组教程使用 Todo 应用作为贯穿示例。Todo 足够熟悉，读者不用先学习复杂业务，就能把注意力放在工作流本身。第一篇从一个个人 Todo MVP 开始，帮助新手理解 Codex Skills 为什么不是普通 prompt；第二篇接着一个已有 Todo 应用，演示如何把标签、筛选和归档功能从模糊想法推进到可实现、可验证的工程工作。

## 学习路径

0. [先安装 Skills](01-codex-skills-basics.md#before-you-start)

   如果你还没有安装 Matt Pocock Skills，先看第一篇的安装部分。教程建议直接安装整套 Skills，因为后续章节会把它们作为一组可组合工作流使用，而不是只挑几个命令背下来。

1. [01 - 从 Todo MVP 理解 Codex Skills](01-codex-skills-basics.md)（已完成）

   适合第一次接触 Codex Skills 的读者。你会看到普通 prompt 为什么容易让 AI 过早动手，以及 `/grill-me`、`/handoff`、`/ask-matt`、`/teach` 这类 Skills 如何把一次聊天变成更稳定的学习和澄清流程。

2. [02 - 从 Setup 到 Code Review 的工程主链路](02-engineering-workflow.md)（已完成）

   适合已经在仓库里工作的读者。它会从 `/setup-matt-pocock-skills` 开始，走过 `/grill-with-docs`、`/wayfinder`、`/to-spec`、`/to-tickets`、`/implement`、`/tdd` 和 `/code-review`，展示一个 Todo 功能怎样被拆成有上下文、有标准、有验收方式的开发工作。

## 工作流地图

把整套流程压成一张图，大致是：

```text
澄清想法
  -> 写成共识契约 spec
  -> 拆成 tracer-bullet tickets
  -> 用 /implement 执行，并在合适接缝用 /tdd
  -> 用 /code-review 和 QA 验收关闭反馈环
  -> 交付后继续维护领域语言和架构健康
```

如果过程中发现问题不适合继续往前推，就先分流：问题太大用 `/wayfinder`，需要资料用 `/research`，UI/状态手感不确定用 `/prototype`，上下文太长用 `/handoff`。这些 shaping 产物应该回流到 spec、tickets 或设计决策，而不是直接跳到实现。

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
| 资料不足，想先调研并留下来源 | `/research` | [02: 用 `/research` 做可追溯调研](02-engineering-workflow.md#research) |
| UI、状态模型或交互手感不确定 | `/prototype` | [02: 用 `/prototype` 回答一个设计问题](02-engineering-workflow.md#prototype) |
| research、prototype 或 wayfinder 有了结论，不知道怎么回主线 | 回到 `/grill-with-docs`、`/to-spec` 或 `/to-tickets` | [02: 让 shaping 结果回流](02-engineering-workflow.md#shaping-feedback) |
| 讨论已经清楚了，我想把它变成正式可构建说明 | `/to-spec` | [02: 用 `/to-spec` 合成正式规格](02-engineering-workflow.md#to-spec) |
| 已经有 spec，需要拆成可以逐个交给 agent 的工作 | `/to-tickets` | [02: 用 `/to-tickets` 拆垂直切片](02-engineering-workflow.md#to-tickets) |
| 我想 review tickets 是否能执行、验证和并行推进 | `/to-tickets` 后人工检查 | [02: review tickets 的六个问题](02-engineering-workflow.md#ticket-review-checklist) |
| 我有一个明确 ticket，希望 Codex 自己实现、验证、review | `/implement` | [02: 用 `/implement` 执行一个 ticket](02-engineering-workflow.md#implement) |
| 我正在实现，需要先写失败测试再让代码通过 | `/tdd` | [02: `/tdd` 是实现内部的红绿循环](02-engineering-workflow.md#tdd) |
| 代码写完了，想同时检查仓库标准和原始 spec | `/code-review` | [02: 用 `/code-review` 关闭反馈环](02-engineering-workflow.md#code-review) |
| QA 发现当前 ticket 没满足验收标准 | 当前 ticket 继续修复 | [02: Ticket 生命周期与 QA 失败处理](02-engineering-workflow.md#ticket-lifecycle) |
| QA 发现的是相关但独立的新需求、bug 或优化 | 新建 ticket | [02: Ticket 生命周期与 QA 失败处理](02-engineering-workflow.md#ticket-lifecycle) |
| 上下文太长、ticket 太大、agent 开始丢细节 | `/handoff` 或拆 ticket | [02: 别把所有事情塞进同一个上下文](02-engineering-workflow.md#smart-zone) |
| 外部来了一个原始 issue，需要判断是否 ready | `/triage` | [02: 用 `/triage` 处理原始输入](02-engineering-workflow.md#triage) |
| 程序坏了或测试失败了，我不想靠猜修 bug | `/diagnosing-bugs` | [02: 用 `/diagnosing-bugs` 建立红色反馈](02-engineering-workflow.md#diagnosing-bugs) |
| 我想改善代码结构，但还没有明确改哪个模块 | `/improve-codebase-architecture` | [02: 用 `/improve-codebase-architecture` 找架构改进点](02-engineering-workflow.md#improve-codebase-architecture) |
| 我正在讨论模块边界、接口深浅、测试接缝 | `/codebase-design` | [02: 用 `/codebase-design` 讨论模块设计](02-engineering-workflow.md#codebase-design) |
| 合并或 rebase 时出现冲突，需要保留双方意图 | `/resolving-merge-conflicts` | [02: 用 `/resolving-merge-conflicts` 解决冲突](02-engineering-workflow.md#resolving-merge-conflicts) |
| 我以后想写自己的 Skill | `/writing-great-skills` | [02: 用 `/writing-great-skills` 学写 Skill](02-engineering-workflow.md#writing-great-skills) |

## 可复制调用模板

### `/grill-me`

```text
/grill-me

我有一个模糊想法：做一个个人 Todo MVP。
请先连续追问我，不要写方案或代码。
最后请输出：已确定范围、明确不做的范围、剩余问题、建议下一步。
```

### `/grill-with-docs`

```text
/grill-with-docs

我在当前仓库里想给 Todo 应用加入标签、筛选和归档。
请先读取 AGENTS.md、issue tracker 说明和 domain docs，再追问我。
domain docs 包括 CONTEXT.md、CONTEXT-MAP.md 和相关 ADR。
目标是澄清术语、行为边界和需要沉淀的决策，不要直接实现。
```

如果讨论里已经稳定了领域语言，可以紧接着用：

```text
/domain-modeling

请把刚才已经确定的 Todo 领域语言沉淀下来。
术语定义写入 CONTEXT.md；只有难逆转、反直觉、有真实权衡的决定才写 ADR。
```

### `/to-spec`

```text
/to-spec

请根据刚才关于 Todo 标签、筛选和归档的讨论，以及仓库中的 CONTEXT.md 和 ADR，
合成一份可构建 spec。
请包含背景、目标、非目标、用户故事、实现决策和验收标准。
```

### `/to-tickets`

```text
/to-tickets

请把 Todo 标签、筛选和归档 spec 拆成本地 Markdown tickets。
每个 ticket 都要是可独立验证的 tracer-bullet vertical slice。
请标出 blocking 关系，并让每个 ticket 都能在 fresh context 中完成。
```

### `/implement`

```text
/implement

请实现：
.scratch/todo-tags/issues/03-filter-active-tasks-by-tag.md

参考总 spec：
.scratch/todo-tags/spec.md
```

### `/code-review`

```text
/code-review main

请 review 当前分支相对 main 的 diff。
Spec 来源是 .scratch/todo-tags/spec.md 和当前 ticket。
请分别报告 Standards 与 Spec 两个轴的发现。
```

### `/handoff`

```text
/handoff

请把当前 Todo 标签功能的上下文整理成 handoff。
引用已有 spec、ADR、ticket、diff 或验证结果；不要复制已经沉淀在文件里的细节。
下一位 agent 应该能直接继续当前 ticket 或选择下一张 ticket。
```

### `/research`

```text
/research

请调研主流任务管理工具中 archive、complete、label/filter 的交互区别。
把来源、观察和对本 Todo App 的建议写成仓库内 Markdown。
研究结论只作为后续 grill/spec/design 的输入，不要直接实现。
```

### `/prototype`

```text
/prototype

我不确定标签筛选应该放在顶部横向 chip，还是侧边栏。
请做一个可丢弃原型，只回答“活跃任务列表中怎样切换标签筛选最顺手”。
完成后请说明哪些结论应该回流到 spec。
```

### `/wayfinder`

```text
/wayfinder

Todo 应用可能要从个人工具升级成轻量团队任务管理。
请不要直接写 spec 或 tickets。
请先创建未知地图，把必须先回答的问题拆成 research、prototype、grilling 或 task 类型的 tickets，并标出阻塞关系。
```

## 推荐读法

如果你是第一次接触，按第一篇从头读到尾，然后回到上面的查询表，把自己的真实处境对应到一个 Skill。不要急着把所有 Skills 都用一遍；先学会在正确时机让 AI 慢下来、问清楚、留下可复用上下文。

如果你已经在仓库里工作，可以直接从第二篇开始。重点看主链路：setup 建立约定，grilling 澄清方向，spec 固化意图，tickets 拆小执行，implement 负责交付，code-review 对照标准和 spec 收尾。这个链路才是 Matt Pocock Skills 最有价值的地方。
