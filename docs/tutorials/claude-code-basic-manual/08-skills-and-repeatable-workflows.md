# 08 - Skills 与可复用工作流

[上一章：Planning mode 与任务拆分](07-planning-and-task-splitting.md) | [返回目录](README.md) | [下一章：MCP、subagents、hooks 等进阶工具边界](09-advanced-tooling-mcp-subagents-hooks.md)

上一章讲的是 planning mode、spec 和 tickets：当任务变大时，先把共识和执行单元整理清楚。

这一章继续往后走一步：如果某类任务反复出现，比如代码审查、发布检查、研究总结、迁移步骤、PR 描述、教程写作验证，你不应该每次都复制一段越来越长的 prompt。更好的做法，是把它沉淀成 skill 或 slash command，让 Claude Code 在需要时加载一套 focused, repeatable workflow。

Skill 不是魔法，也不是“更长的提示词”。它的价值在于把一类任务的触发条件、输入材料、执行步骤、输出格式、工具边界和验证方式写清楚。这样下一次任务开始时，你不用重新解释整套流程，只需要给出这一次的目标和输入。

一个健康的沉淀路径大致是：

```text
一次性任务
  -> 多次重复后发现稳定步骤
  -> 把稳定事实放进 CLAUDE.md
  -> 把按需流程写成 skill
  -> 用验证和 review 检查 skill 是否真的有效
```

## 先区分 prompt、CLAUDE.md 和 skill

很多人第一次写 skill 时，会把它写成一篇长 prompt。这样做通常会失败，因为它没有解决“什么时候用、用什么输入、产出什么、怎样验证”的问题。

可以先用这张表判断：

| 载体 | 适合内容 | 不适合内容 |
| --- | --- | --- |
| 普通 prompt | 当前这一次任务的目标、限制、输入材料和临时偏好。 | 每次都要重复的长流程。 |
| `CLAUDE.md` | 每次会话都需要的稳定项目事实、团队规则、常用命令。 | 当前任务状态、按需流程、个人偏好冒充团队规则。 |
| Skill | 某类可重复任务的步骤、输入、输出、工具边界和验证方式。 | 一个包办整个软件生命周期的大而全流程。 |

判断问题很简单：

- 如果它只对这一次任务有效，写在当前 prompt。
- 如果它对每次进入项目都有效，写进 `CLAUDE.md` 或 rules。
- 如果它只在某类任务被触发时有效，写成 skill。

例如，“本项目文档用中文，章节要包含场景、判断标准和校验清单”可以放进文档路径规则或项目 `CLAUDE.md`。但“为一张 tutorial ticket 读取 spec、任务资料、相邻章节，写对应 Markdown，并验证 README 链接”更像一个 skill，因为它是一套按需执行的文档工作流。

## 内置 slash commands 与自定义 skills

Slash command 这个名字容易让人混淆。你可以把它分成两类理解。

| 类型 | 主要用途 | 例子 |
| --- | --- | --- |
| 内置 slash commands | 控制 Claude Code 会话、工具、上下文和开发界面。 | 初始化项目记忆、查看 diff、管理权限、恢复会话、使用 review 等。 |
| 自定义 slash commands | 保存轻量、明确、通常由人手动触发的项目命令。 | 生成固定格式的 PR 摘要、按团队模板整理 release note。 |
| 自定义或项目 skills | 把更完整的重复任务封装成可复用流程。 | 发布前检查、迁移步骤、研究总结、PR 描述、文档章节写作。 |

内置命令更像 Claude Code 提供的工作台按钮。它们帮你操作会话、权限、上下文和常见开发动作。

自定义 slash command 更适合“短、固定、手动触发”的动作：它可以像一个命令模板，帮你省掉重复输入，但不一定需要完整的触发规则、工具边界和验证流程。

自定义 skills 更像你为项目或个人工作流写的操作规程。它们可以被手动调用，也可以通过描述让 Claude 判断何时加载。项目级 skill 适合纳入版本控制，让团队和 CI 共享；个人 skill 适合放在用户层，只表达你的个人工作方式。

边界要守住：不要把个人偏好流程混进团队项目配置。比如“最终总结用我喜欢的语气”是个人偏好；“发布前必须检查 changelog、版本号、迁移说明和回滚步骤”才是团队流程。

## 哪些任务适合封装成 skill

Skill 适合稳定、重复、可验证的任务。它不要求每次输入完全一样，但要求流程骨架相对稳定。

常见候选包括：

| 任务类型 | 为什么适合 skill |
| --- | --- |
| 代码审查 | 输入通常是 diff、spec、仓库标准；输出通常是 findings、风险和测试缺口。 |
| 发布检查 | 步骤固定：版本、changelog、迁移、测试、回滚、发布说明。 |
| 数据或框架迁移 | 需要固定顺序、范围控制、验证命令和失败处理。 |
| 测试生成 | 需要先找行为接缝、写失败测试、运行相关测试、避免只测实现细节。 |
| PR/MR 描述 | 需要总结变更、验证证据、风险、截图或迁移说明。 |
| 研究总结 | 需要限定来源、记录引用、沉淀为 Markdown，而不是只在聊天里回答。 |
| 文档章节写作 | 需要读取 spec、相邻章节、写作决策，并验证导航链接。 |

不适合封装的任务也很常见：

- 一次性讨论，比如“这个设计是不是合理”。
- 尚未稳定的流程，比如团队还没同意 review 标准。
- 纯项目信息，比如“测试命令是什么”，更适合 `CLAUDE.md`。
- 大而全自动化，比如“从想法到上线全都由这个 skill 接管”。

一个好的 skill 通常应该让 agent 更有边界，而不是更放飞。

## Skill 的基本组成

一个 skill 至少需要说明“什么时候用”和“怎么做”。更实用的结构可以按六块写：

| 组成 | 要回答的问题 |
| --- | --- |
| 触发说明 | 什么场景应该使用这个 skill，什么场景不应该使用。 |
| 输入 | 需要哪些路径、ticket、spec、diff、截图、错误日志或用户决策。 |
| 步骤 | 先读什么、先问什么、何时修改、何时停下来。 |
| 输出 | 产出文件、评论、报告、PR 描述、验证摘要或后续 ticket。 |
| 工具边界 | 允许读写哪些文件、能否运行命令、能否调用外部工具。 |
| 验证 | 怎样证明完成：测试、lint、链接检查、人工 review、截图或 diff 检查。 |

一个很小的 skill 骨架可以这样理解：

```markdown
---
name: write-tutorial-section
description: Use when implementing a ready tutorial writing ticket for this repo.
---

## When to use

Use this for one ready-for-agent tutorial ticket with a specified output Markdown path.
Do not use it to rewrite unrelated chapters or generate the whole manual.

## Inputs

- Ticket path.
- Optional spec path.
- Optional research notes.
- Adjacent chapters for tone and structure.

## Process

1. Read the ticket and acceptance criteria.
2. Read only the listed source materials needed for this chapter.
3. Draft the target Markdown file.
4. Check that README links to the chapter.
5. Summarize files changed, acceptance status, and follow-ups.

## Verification

- Target file exists.
- Title matches the chapter.
- README has a relative link to the target file.
- The chapter stays inside ticket scope.
```

这个骨架没有神秘内容。真正重要的是它让边界变明确：只做一张 ticket，只读必要材料，只产出目标文件，只验证相关链接。

## 一个场景：把发布检查沉淀成 skill

假设一个团队每次发布前都要做同一组检查：

- 版本号是否更新。
- changelog 是否覆盖用户可见变化。
- 数据库迁移是否有回滚说明。
- 是否跑过测试、lint 和 typecheck。
- 是否有高风险变更需要人工审批。
- 发布说明是否包含验证证据和残余风险。

如果每次都在聊天里写：

```text
请帮我检查这次 release。看看版本、changelog、迁移、测试和风险。
```

Claude 很可能每次理解都不一样。有时它只看 changelog，有时忘记迁移，有时把“没跑测试”写成“看起来没问题”。

更好的 skill 会把流程固定下来：

```text
输入：
- release 分支或 diff 范围。
- changelog 路径。
- 版本文件路径。
- 迁移目录。
- 项目验证命令。

步骤：
1. 读取 diff 和 release 相关文件。
2. 检查版本号、changelog 和迁移说明是否一致。
3. 运行或要求运行最小验证命令。
4. 列出阻塞发布的问题、非阻塞风险和需要人工确认的事项。
5. 生成发布前摘要。

输出：
- Release readiness report。
- 已运行验证和结果。
- 未验证范围。
- 是否建议继续发布。
```

这就是 skill 和普通 prompt 的差别。普通 prompt 只表达愿望；skill 把愿望拆成可重复执行、可检查失败的工作流。

## context: fork、工具授权和失败处理

写 skill 时，还要考虑它会怎样影响主上下文和工具权限。

有些任务会读取大量资料，例如全仓审查、长研究、依赖升级影响分析。它们可能把主会话塞满。这类 skill 可以使用类似 `context: fork` 的思路：让工作在隔离上下文里展开，只把结构化摘要、结论和必要引用带回主会话。你可以把它理解成“让 agent 去旁边读厚资料，回来只交付结果”。

工具授权也要按任务收窄：

| 场景 | 工具边界建议 |
| --- | --- |
| 只做研究总结 | 允许读文件和必要搜索；不允许改源码或提交。 |
| 只做代码审查 | 允许读 diff、spec、测试输出；不允许改文件。 |
| 实现 ticket | 允许编辑相关文件和运行验证；不允许顺手改无关模块。 |
| 发布或部署 | 高风险动作应要求人工审批，并保留回滚和验证要求。 |

失败处理也应该写进 skill。比如：

- 输入材料缺失时，先报告缺什么，不要猜。
- 验证命令失败时，说明失败命令、失败原因和是否属于当前范围。
- 发现相邻问题时，记录 follow-up，不并入当前任务。
- 工具权限不足时，说明需要什么权限和为什么，不绕过边界。
- 任务范围超过 skill 设计时，停下来要求重新拆分或改用 planning。

一个没有失败处理的 skill，很容易在现实项目里变成“顺着感觉继续做”。而 skill 的目的，正是减少这种不受控的继续。

## 如何验证一个 skill 是否有效

看到 skill 被触发，不等于它有效。你需要像验证代码一样验证 workflow。

可以从两件事开始：

| 验证点 | 判断问题 |
| --- | --- |
| 触发是否准确 | 它是否在该用时加载，不该用时保持安静。 |
| 输出是否稳定 | 它是否每次都读取正确输入、遵守边界、产出可检查结果。 |

一个简单验证方法是准备两三个真实任务：

- 一个正例：确实应该使用这个 skill。
- 一个边界例：看起来相似，但应该先问清楚或改用另一个流程。
- 一个反例：不应该触发这个 skill。

然后在 fresh session 里比较启用 skill 前后的结果。好的 skill 应该让 Claude 更少猜、更少漏步骤、更容易说明验证证据；如果它只是让回答变长，说明还需要收窄。

## Skill 不替代人的 steering

Skill 能保存流程，但不能替代工程判断。你仍然要决定：

- 这次任务是否真的属于这个 skill。
- 输入材料是否足够。
- 验收标准是否完整。
- 是否允许它修改文件、运行命令或调用外部工具。
- 发现 scope creep 时是否继续、拆票或停下。

尤其在团队里，不要期待一个 skill 接管整个软件生命周期。更健康的方式，是让多个小 skill 分别处理澄清、研究、写 spec、拆 tickets、实现、TDD、review、发布检查等阶段；人负责 steering，决定什么时候进入下一步。

如果一个 skill 开始包含“读需求、决定方案、拆任务、实现、测试、review、发布、写总结”的全部内容，它大概率已经太大。把它拆开，让每个 skill 只承担一个清晰职责。

## Advanced：Matt Pocock workflow 的启发

Matt Pocock Skills workflow 很适合作为进阶参考，因为它反复强调一件事：skills 是小而可组合的 workflow modules，不是一个接管一切的自动流水线。

在前一章里，我们已经看过：

```text
grill-with-docs -> to-spec -> to-tickets
```

这一章可以从 skill 设计角度再看一次。`grill-with-docs` 负责澄清和形成 shared understanding；`to-spec` 负责把已经稳定的理解写成共识契约；`to-tickets` 负责把契约拆成可执行反馈单元。每个 skill 都很小，但组合起来能支撑复杂工作。

Matt Pocock workflow 里还有一些 shaping skills，例如 `wayfinder`、`research`、`prototype`。它们的共同点是：不直接替你进入实现，而是先回答“我们缺什么输入”。它们的产物应该回流到 spec、tickets、领域文档或设计决策，而不是绕过主流程。

只读调查 prompt 可以理解成 `research` 思想的轻量版：它主要回答代码库内的未知，例如入口在哪里、数据从哪里来、现有测试覆盖什么；`research` 则更适合需要来源、沉淀和较大阅读量的任务。

`CONTEXT.md` 和 ADR 也体现了同一个原则：稳定语言和少量关键决策应该沉淀为共享 artifact，减少每次会话的重复解释。但它们不替代 skill。`CONTEXT.md` 说明术语是什么，skill 说明遇到某类任务时怎么做。

这套 workflow 对成熟团队很有启发，但不应该成为基础读者的入门门槛。小任务仍然可以直接执行；中等任务可以只做短计划；只有当流程真的重复、风险真的需要控制、产物真的要交接时，才值得写 skill。

## 本章校验

读完本章，你应该能做到：

- 判断什么放 skill，什么放 `CLAUDE.md`，什么只放当前 prompt。
- 解释 skill 是 focused, repeatable workflow，不是长 prompt。
- 区分内置 slash commands、自定义 slash commands 和自定义或项目 skills 的用途。
- 为一个高频任务列出触发说明、输入、步骤、输出、工具边界和验证方式。
- 知道 `context: fork` 适合隔离大规模阅读或研究，工具授权应按任务收窄。
- 在 skill 里写明失败处理，而不是让 agent 顺着不确定性继续做。
- 理解 Matt Pocock workflow 的 advanced 启发：skills 小而可组合，用户仍然需要 steering。

下一章会介绍 MCP、subagents、hooks 和 permissions 的边界：当重复流程之外还需要外部系统、上下文隔离或强制安全控制时，应该如何判断该用哪种工具。

## 参考来源

- Claude Code Commands: https://code.claude.com/docs/en/commands
- Claude Code Skills / slash commands: https://code.claude.com/docs/en/slash-commands
- Claude Code Memory / CLAUDE.md: https://code.claude.com/docs/en/memory
- Claude Code Permissions: https://code.claude.com/docs/en/permissions
- Matt Pocock Skills tutorial: ../matt-pocock-skills/README.md
- Matt Pocock engineering workflow tutorial: ../matt-pocock-skills/02-engineering-workflow.md
