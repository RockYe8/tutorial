# Matt Pocock Skills 教程导航

这组教程是我的个人学习笔记，也面向正在学习 Matt Pocock Skills 的开发者。它不把 Skills 当成一串要背的命令，而是把它们放进真实 AI 编程流程里：什么时候该先被追问，什么时候该沉淀领域语言，什么时候该写 spec，什么时候该拆 tickets，什么时候才轮到实现和 review。

这不是 Matt Pocock 官方文档，也不是官方中文翻译；它是一份基于本地已安装 Skills、AI Hero 和 `mattpocock/skills` 公开资料整理出的中文实践导航。遇到安装方式、Skill 细节或上游行为变化时，请以官方来源和你本地的 `SKILL.md` 为准。

整组教程使用 Todo 应用作为贯穿示例。Todo 足够熟悉，读者不用先学习复杂业务，就能把注意力放在工作流本身。第一篇从一个个人 Todo MVP 开始，帮助新手理解 Codex Skills 为什么不是普通 prompt；第二篇接着一个已有 Todo 应用，演示如何把标签、筛选和归档功能从模糊想法推进到可实现、可验证的工程工作。

## 学习路径

0. [01 - 从 Todo MVP 理解 Codex Skills：开始前先安装整套 Skills](01-codex-skills-basics.md#before-you-start)

   如果你还没有安装 Matt Pocock Skills，先看第一篇的安装部分。教程建议直接安装整套 Skills，因为后续章节会把它们作为一组可组合工作流使用，而不是只挑几个命令背下来。

1. [01 - 从 Todo MVP 理解 Codex Skills：新手基础篇](01-codex-skills-basics.md)（已完成）

   适合第一次接触 Codex Skills 的读者。你会看到普通 prompt 为什么容易让 AI 过早动手，以及 `/grill-me`、`/handoff`、`/ask-matt`、`/teach` 这类 Skills 如何把一次聊天变成更稳定的学习和澄清流程。

2. [02 - 从 Setup 到 Code Review 的工程主链路：仓库实践篇](02-engineering-workflow.md)（已完成）

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

README 只负责帮你找路。可模仿的调用文本放在对应教程场景里，因为同一个 Skill 在不同上下文里该读的文件、产出的 artifact 和下一步都不一样；不要脱离场景复制一段模板就期待 agent 自动理解你的项目。

### 新手入门

| 我现在的处境 | 建议下一步 | 跳转到教程场景 |
| --- | --- | --- |
| 我只有一个模糊想法，比如“想做个 Todo App”，但还不知道范围 | 先用 `/grill-me` 缩小范围 | [01 - 从 Todo MVP 理解 Codex Skills：用 `/grill-me` 把模糊想法问清楚](01-codex-skills-basics.md#grill-me) |
| 我想理解 agent 为什么要先追问，而不是立刻写方案 | 读 `/grilling` 的追问纪律 | [01 - 从 Todo MVP 理解 Codex Skills：`/grilling` 是追问背后的工作纪律](01-codex-skills-basics.md#grilling) |
| 我想理解 Skills 和普通 prompt 到底有什么不同 | 先建立 workflow 心智模型 | [01 - 从 Todo MVP 理解 Codex Skills：Skills 是可复用工作流，不是魔法 prompt](01-codex-skills-basics.md#skills-as-workflows) |
| 我不知道该用哪个 Skill 或流程 | 用 `/ask-matt` 选择下一步 | [01 - 从 Todo MVP 理解 Codex Skills：用 `/ask-matt` 选择下一步](01-codex-skills-basics.md#ask-matt) |
| 会话变长了，我想保留上下文，之后继续做 | 用 `/handoff` 保存可执行上下文 | [01 - 从 Todo MVP 理解 Codex Skills：用 `/handoff` 保存上下文](01-codex-skills-basics.md#handoff) |
| 我想边做边学，把仓库当成长期学习环境 | 用 `/teach` 分步练习 | [01 - 从 Todo MVP 理解 Codex Skills：用 `/teach` 学会工作流](01-codex-skills-basics.md#teach) |

### 主链路

| 我现在的处境 | 建议下一步 | 跳转到教程场景 |
| --- | --- | --- |
| 我在真实仓库里开始用这些 Skills，不确定本地约定是否齐全 | 先跑 `/setup-matt-pocock-skills` 检查协作约定 | [02 - 从 Setup 到 Code Review 的工程主链路：先做仓库约定设置](02-engineering-workflow.md#setup-matt-pocock-skills) |
| 我在已有 Todo App 里想加标签、筛选和归档，但需求还不稳 | 用 `/grill-with-docs` 带着仓库文档澄清 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/grill-with-docs` 做带文档的澄清](02-engineering-workflow.md#grill-with-docs) |
| 讨论里出现了“任务”“标签”“归档”等术语，需要统一语言 | 用 `/domain-modeling` 沉淀稳定领域语言 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/domain-modeling` 保存领域语言](02-engineering-workflow.md#domain-modeling) |
| 讨论已经清楚了，我想把它变成正式可构建说明 | 用 `/to-spec` 合成正式规格 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/to-spec` 合成正式规格](02-engineering-workflow.md#to-spec) |
| 已经有 spec，需要拆成可以逐个交给 agent 的工作 | 用 `/to-tickets` 拆垂直切片 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/to-tickets` 拆垂直切片](02-engineering-workflow.md#to-tickets) |
| 我想 review tickets 是否能执行、验证和并行推进 | 在 `/to-tickets` 后做人工检查 | [02 - 从 Setup 到 Code Review 的工程主链路：Review tickets 的六个问题](02-engineering-workflow.md#ticket-review-checklist) |
| 我有一个明确 ticket，希望 Codex 自己实现、验证、review | 用 `/implement` 执行单个 ticket | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/implement` 执行一个 ticket](02-engineering-workflow.md#implement) |
| 我正在实现，需要先写失败测试再让代码通过 | 在 `/implement` 内部使用 `/tdd` | [02 - 从 Setup 到 Code Review 的工程主链路：`/tdd` 是实现内部的红绿循环](02-engineering-workflow.md#tdd) |
| 代码写完了，想同时检查仓库标准和原始 spec | 用 `/code-review` 关闭反馈环 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/code-review` 关闭反馈环](02-engineering-workflow.md#code-review) |

### Shaping 与回流

| 我现在的处境 | 建议下一步 | 跳转到教程场景 |
| --- | --- | --- |
| 目标太大，未知点很多，不适合直接写 spec | 用 `/wayfinder` 先画未知地图 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/wayfinder` 先画出未知地图](02-engineering-workflow.md#wayfinder) |
| `/wayfinder` 的未知问题已经得到答案 | 通常回到 `/to-spec` 或 `/to-tickets`，必要时补 `/domain-modeling` | [02 - 从 Setup 到 Code Review 的工程主链路：让 shaping 结果回流](02-engineering-workflow.md#shaping-feedback) |
| 资料不足，想先调研并留下来源 | 用 `/research` 写可追溯研究记录 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/research` 做可追溯调研](02-engineering-workflow.md#research) |
| `/research` 的结论改变了理解、需求或拆票方式 | 视影响回到 `/grill-with-docs`、`/to-spec` 或 `/to-tickets` | [02 - 从 Setup 到 Code Review 的工程主链路：让 shaping 结果回流](02-engineering-workflow.md#shaping-feedback) |
| UI、状态模型或交互手感不确定 | 用 `/prototype` 回答一个设计问题 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/prototype` 回答一个设计问题](02-engineering-workflow.md#prototype) |
| `/prototype` 已经回答了设计问题 | 把结论写回 spec 或 ticket 验收；若暴露新决策，再回 `/grill-with-docs` | [02 - 从 Setup 到 Code Review 的工程主链路：让 shaping 结果回流](02-engineering-workflow.md#shaping-feedback) |

### 维护与异常

| 我现在的处境 | 建议下一步 | 跳转到教程场景 |
| --- | --- | --- |
| QA 发现当前 ticket 没满足验收标准 | 继续修当前 ticket，并把失败证据写回 comment | [02 - 从 Setup 到 Code Review 的工程主链路：Ticket 生命周期与 QA 失败处理](02-engineering-workflow.md#ticket-lifecycle) |
| QA 发现的是相关但独立的新需求、bug 或优化 | 新建 ticket，不塞进当前 ticket | [02 - 从 Setup 到 Code Review 的工程主链路：Ticket 生命周期与 QA 失败处理](02-engineering-workflow.md#ticket-lifecycle) |
| 上下文太长、ticket 太大、agent 开始丢细节 | 用 `/handoff` 或回到 `/to-tickets` 拆小 | [02 - 从 Setup 到 Code Review 的工程主链路：别把所有事情塞进同一个上下文](02-engineering-workflow.md#smart-zone) |
| 外部来了一个原始 issue，需要判断是否 ready | 用 `/triage` 处理入口质量 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/triage` 处理原始输入](02-engineering-workflow.md#triage) |
| 程序坏了或测试失败了，我不想靠猜修 bug | 用 `/diagnosing-bugs` 建立红色反馈 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/diagnosing-bugs` 建立红色反馈](02-engineering-workflow.md#diagnosing-bugs) |
| 我想改善代码结构，但还没有明确改哪个模块 | 用 `/improve-codebase-architecture` 找改进 tickets | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/improve-codebase-architecture` 找架构改进点](02-engineering-workflow.md#improve-codebase-architecture) |
| 我正在讨论模块边界、接口深浅、测试接缝 | 用 `/codebase-design` 收窄模块设计 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/codebase-design` 讨论模块设计](02-engineering-workflow.md#codebase-design) |
| 合并或 rebase 时出现冲突，需要保留双方意图 | 用 `/resolving-merge-conflicts` 解决冲突 | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/resolving-merge-conflicts` 解决冲突](02-engineering-workflow.md#resolving-merge-conflicts) |
| 我以后想写自己的 Skill | 用 `/writing-great-skills` 学写可重复 workflow | [02 - 从 Setup 到 Code Review 的工程主链路：用 `/writing-great-skills` 学写 Skill](02-engineering-workflow.md#writing-great-skills) |

## 阅读与发布方式

在线可访问仓库时，优先用 GitHub、Gitee 或其他仓库 Web UI 阅读，因为它们通常能稳定处理 Markdown、目录和跨文件链接。但 GitHub 对一些读者可能不够可靠，所以它不是唯一入口；本地阅读和离线包都应该同样成立。

本地写作和维护时，建议用 VS Code 或 Cursor 直接编辑这些 Markdown 文件。Markdown 是这组教程唯一需要手工维护的 source of truth；生成出来的 HTML 只作为 release artifact 发布，不要手动修改 HTML 后再反向同步。需要离线分发时，推荐发布一个由当前 git commit 或 tag 生成的静态 HTML 包，方便读者在网络不稳定时完整浏览教程，而不要求他们能访问 GitHub 或 Gitee。

PDF 更适合归档、打印或从头到尾顺序阅读，不是首选的导航格式。使用本地 Markdown 预览时也要注意：跨文件链接通常能打开目标文件，但不一定总能滚动到精确锚点；所以 README 的链接文字会同时写出文章名和目标小节，方便你快速定位。

## 推荐读法

如果你是第一次接触，按第一篇从头读到尾，然后回到上面的查询表，把自己的真实处境对应到一个 Skill。不要急着把所有 Skills 都用一遍；先学会在正确时机让 AI 慢下来、问清楚、留下可复用上下文。

如果你已经在仓库里工作，可以直接从第二篇开始。重点看主链路：setup 建立约定，grilling 澄清方向，spec 固化意图，tickets 拆小执行，implement 负责交付，code-review 对照标准和 spec 收尾。这个链路才是 Matt Pocock Skills 最有价值的地方。
