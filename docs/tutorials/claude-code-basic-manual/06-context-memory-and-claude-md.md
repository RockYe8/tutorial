# 06 - 上下文、memory 与 CLAUDE.md

上一章建立了调试、测试和验证闭环：Claude Code 不是只要改出代码，还要能用证据证明改动有效。

这一章往前看一层：为什么同一个项目里，有些会话很顺，有些会话却反复解释、越改越偏？很多时候问题不在模型“聪不聪明”，而在上下文管理。Claude 需要知道当前项目的稳定事实、团队规则、文件边界、验证方式和任务状态；但它不应该被临时想法、过期计划和无关日志塞满。

一个健康的上下文管理体系应该像这样：

```text
稳定项目事实
  -> 项目规则和路径规则
  -> 当前任务输入
  -> 执行中的验证证据
  -> 交接摘要和后续问题
```

`CLAUDE.md`、memory、rules、imports 和 handoff 都服务于同一件事：让 Claude 在正确上下文里工作。它们不是越多越好，也不是安全万能钥匙。好的上下文像地基，平时不显眼，但一旦混乱，后面的 planning、修改、验证和 review 都会跟着晃。

## 先区分三类信息

在写 `CLAUDE.md` 前，先判断你手里的信息属于哪一类：

| 信息类型 | 适合放哪里 | 例子 |
| --- | --- | --- |
| 每次会话都需要的稳定事实 | 项目级 `CLAUDE.md` | 架构边界、常用验证命令、代码风格、重要目录说明。 |
| 只在某类路径或文件生效的规则 | `.claude/rules/` 或子目录 `CLAUDE.md` | 前端组件规则、数据库迁移规则、文档写作规则。 |
| 当前任务的临时状态 | 当前对话、ticket、handoff | 本轮调查结论、失败日志、待确认问题、未完成步骤。 |

新手最常见的错误，是把第三类临时状态写进第一类长期记忆。例如：

```text
今天正在修登录页错误提示，已经怀疑问题在 auth service。
```

这不适合放进 `CLAUDE.md`。它可能明天就过期，也可能只对当前 bug 有意义。更合适的位置是当前 ticket、会话总结或 handoff。

`CLAUDE.md` 应该回答的是：

```text
这个项目长期希望 Claude 知道什么？
```

而不是：

```text
这一次聊天还没做完什么？
```

## CLAUDE.md 适合写什么

`CLAUDE.md` 是 Claude Code 启动项目时会读取的项目记忆文件。它适合放稳定、短小、每次都可能用到的规则和事实。

可以写这些内容：

| 内容 | 写法建议 |
| --- | --- |
| 项目定位 | 一两句话说明项目是什么，核心用户或核心业务是什么。 |
| 目录地图 | 列出最重要目录，不要把全仓文件树复制进去。 |
| 架构边界 | 哪些模块负责什么，哪些依赖方向不能反过来。 |
| 常用命令 | 测试、lint、typecheck、构建、文档检查的最小命令。 |
| 编码约定 | 命名、错误处理、状态管理、测试风格等稳定规范。 |
| 验证要求 | 改动后通常需要哪些验证，什么情况下要扩大范围。 |
| 团队流程 | 提交前总结、PR 描述、review criteria、ticket 边界。 |
| 安全提示 | 哪些文件敏感，哪些命令高风险，但只作为行为引导。 |

一个简短片段可能长这样：

```markdown
# Project Context

This is a React + Node.js app for internal support workflows.

## Common Commands

- `npm test -- <file>`: run focused tests.
- `npm run typecheck`: check TypeScript contracts.
- `npm run lint`: run project lint rules.

## Working Rules

- Prefer small, reviewable changes.
- Before editing shared auth or billing code, explain the affected paths and validation plan.
- Do not treat generated files as source of truth.
- When a bug fix reveals a nearby issue outside the ticket, record it as a follow-up instead of expanding scope.
```

这段内容不是为了让 Claude 背诵项目百科，而是为了让每次任务默认从正确的工作习惯开始。

## CLAUDE.md 不适合写什么

`CLAUDE.md` 不是 scratchpad，也不是把所有流程都塞进去的地方。

不建议写这些内容：

- 当前任务的临时猜测、日志、失败输出。
- 一次性计划、过期 TODO、某个分支上的中间状态。
- 大段官方文档、长 prompt、完整流程手册。
- 每个文件的细节说明和全量目录树。
- 个人偏好冒充团队规则。
- 你希望“强制禁止”的安全边界。

例如，这类内容应该避免：

```markdown
## Current Task

We are debugging login failures. The model should inspect auth-service.ts,
then rewrite the login flow if needed.
```

这会污染未来会话。下一次 Claude 进入项目时，可能仍然以为当前任务是修登录。

如果你发现 `CLAUDE.md` 里经常出现“今天”“本轮”“这次”“暂时”“等后续确认”，基本就是信号：这些内容应该移到 ticket、issue、handoff 或任务笔记里。

## CLAUDE.md 的层级

Claude Code 的记忆不是只有一个文件。你可以按共享边界理解不同层级：

| 层级 | 典型位置 | 适合内容 |
| --- | --- | --- |
| 组织/托管层 | 由公司或 IT 管理 | 公司级安全、合规、语言版本、基础工程政策。 |
| 用户层 | `~/.claude/CLAUDE.md` | 个人偏好、个人常用工具、个人输出习惯。 |
| 项目层 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 团队共享项目规则，应纳入版本控制。 |
| 本地层 | `./CLAUDE.local.md` | 个人在当前项目里的本地 URL、测试账号、私有路径，应忽略提交。 |
| 子目录层 | 子目录中的 `CLAUDE.md` | 只对某个子树重要的规则，例如 `packages/api/` 或 `docs/`。 |

这个层级的关键问题是“谁需要共享”。

如果一条规则会影响团队里每个人和 CI，放项目层。比如：

```text
数据库迁移必须同时包含 rollback 说明。
```

如果只是你的个人输出偏好，放用户层。比如：

```text
最终总结优先用中文。
```

如果是你本机环境，放本地层，并确保不会提交。比如：

```text
Local dev server usually runs at http://localhost:5174.
```

不要用个人配置替代团队共享规则。否则你本地 Claude 做得很顺，队友、CI 或另一个 agent 却完全不知道这些约定。

## Auto memory 和手写项目规则不同

Claude Code 的 memory 可以来自两类来源：

- 你手写的 `CLAUDE.md`、rules 或相关配置。
- Claude 根据纠正和偏好自动沉淀的 auto memory。

它们的作用不同。

手写项目规则适合团队明确认可的稳定约定，例如测试命令、架构边界、review 标准。它应该可读、可审查、可版本控制。

Auto memory 更像 Claude 从使用中记住的经验：你多次纠正它“不要自动提交”“回答用中文”“这个项目先运行 focused tests”，它可能把这些偏好记下来。它能减少重复解释，但不应替代项目规则。

判断标准可以很简单：

| 问题 | 如果答案是 yes |
| --- | --- |
| 这条规则是否需要团队所有人共享？ | 写进项目层 `CLAUDE.md` 或项目 rules。 |
| 这条规则是否只代表我的个人偏好？ | 放用户层 memory 或用户层配置。 |
| 这条信息是否只是当前任务的中间状态？ | 放 ticket、当前会话或 handoff。 |
| 这条规则是否必须被强制执行？ | 用 permissions 或 hooks。 |

Auto memory 能帮你少说几遍，但它不是团队契约。团队契约应该在仓库里，让人和 agent 都能 review。

## 用 rules 管理路径规则

有些规则不适合全局加载，因为它们只对某个目录、文件类型或主题生效。

例如：

- `docs/` 下的写作风格。
- `migrations/` 下的数据库变更要求。
- `src/components/` 下的组件约定。
- `packages/api/` 下的错误处理和鉴权边界。

这类规则适合放到 `.claude/rules/`，或放在相关子目录的 `CLAUDE.md` 中。目标是让 Claude 在处理对应路径时获得更具体的指导，而不是让所有会话都背着全部细节。

一个文档路径规则可以写得很短：

```markdown
# Docs Writing Rules

Apply when editing files under `docs/tutorials/`.

- Write in Chinese unless the surrounding file uses English.
- Prefer tutorial structure: scenario, decision, action, verification.
- Do not turn a tutorial chapter into an API reference.
- Keep links relative when pointing to sibling tutorial files.
```

路径规则解决的是“局部上下文”。它让主 `CLAUDE.md` 保持轻量，也减少 Claude 在无关任务中被不相关规则干扰。

## 用 @path imports 控制复用

如果项目已经有 README、架构文档、贡献指南或团队规范，不一定要复制进 `CLAUDE.md`。可以用 `@path` import 引入。

例如：

```markdown
# Project Context

@README.md
@docs/architecture.md
@docs/testing.md
```

这样做的好处是减少重复维护：README 改了，不需要再同步一份复制内容。

但 import 也会占用上下文。不要因为能导入，就把所有文档都导入。更好的做法是：

- 只导入每次任务都常用的短文档。
- 对长文档只导入索引、摘要或稳定章节。
- 对很少使用的资料，在任务提示里按需让 Claude 读取。
- 定期检查导入文件是否仍然准确。

一个经验是：`CLAUDE.md` 应该像门厅，不应该像仓库。它告诉 Claude 去哪里、守什么边界、常用命令是什么；不需要把所有资料都堆在门口。

## 控制长度和维护周期

过长的 `CLAUDE.md` 会带来两个问题：

- 占用上下文窗口，挤掉当前任务更重要的信息。
- 规则太多太杂，Claude 更难判断哪些是当前任务真正相关的约束。

可以按这个节奏维护：

| 时机 | 动作 |
| --- | --- |
| 新项目初始化 | 用 `/init` 或人工整理生成第一版项目记忆。 |
| 连续几次重复纠正后 | 把稳定纠正沉淀成一条短规则。 |
| 架构、命令或流程变化后 | 更新对应条目，删除过期说明。 |
| 章节或模块规则变多后 | 从主 `CLAUDE.md` 拆到 rules 或子目录文件。 |
| 每次大版本或团队流程调整后 | 做一次记忆 review，确认仍然短、准、可执行。 |

写法上可以遵守三条原则：

- 每条规则尽量能被行动验证。
- 不写“尽量写好代码”这类空泛句子。
- 删除比追加更重要。

例如，不要写：

```text
请保持高质量。
```

更有用的是：

```text
改动共享 TypeScript 类型后，优先运行 `npm run typecheck`，并在总结中说明是否有下游调用受影响。
```

好的记忆不是多，而是稳定、具体、可维护。

## Handoff：把当前任务交给未来上下文

`CLAUDE.md` 解决的是长期背景，handoff 解决的是“这个任务进行到哪里了”。

当会话很长、上下文快满、你要切换设备、或准备把任务交给另一个 agent 时，应该让 Claude 生成 handoff。handoff 的目标不是复述全聊天，而是让下一轮可以接着做。

一个可用的 handoff 应包含：

| 内容 | 说明 |
| --- | --- |
| 当前目标 | 这轮任务到底要完成什么。 |
| 已读材料 | 读过哪些文件、文档、issue 或日志。 |
| 已完成工作 | 修改了什么，哪些验证已经通过。 |
| 当前状态 | 还剩什么，卡在哪里，下一步建议是什么。 |
| 重要约束 | 不能改什么、哪些范围不属于当前 ticket。 |
| 验证证据 | 已运行命令、结果、失败原因、未验证范围。 |
| 后续问题 | 发现但不属于当前范围的事项。 |

你可以这样要求：

```text
请生成 handoff，供下一次 fresh context 继续。

要求：
- 不复述整段聊天。
- 只保留完成当前 ticket 必需的信息。
- 明确已修改文件、未完成步骤、验证结果和范围边界。
- 把相关但独立的新问题列为 follow-up，不并入当前任务。
```

如果任务已经完成，handoff 可以变成提交前总结或 PR 描述。如果任务未完成，它应该让下一轮一眼知道从哪里继续，而不是重新做一遍调查。

## 避免上下文污染

上下文污染不是“内容太多”这么简单，而是错误、过期或无关的信息混进了当前判断。

常见污染来源包括：

- 把旧任务计划留在 `CLAUDE.md`。
- 一次性粘贴巨大日志，却没有指出关键错误。
- 在同一会话里混做多个互不相关任务。
- 把临时 workaround 写成长期项目规则。
- 让 subagent 或 MCP 返回大量原始资料，但没有摘要和筛选。
- 导入过长文档，导致当前 ticket 的输入被挤出上下文。

减少污染的方法也很朴素：

- 当前任务只给必要文件和必要错误。
- 长日志先摘要，再按需要展开。
- 一个会话尽量围绕一个目标。
- 发现新需求时开新 ticket，不塞进当前任务。
- 大规模阅读用 subagent 或研究产物，只把结论回流。
- 定期清理 `CLAUDE.md`、rules 和 imports。

你可以在会话中直接让 Claude 自查：

```text
请检查当前上下文是否有污染风险：

- 哪些信息对当前任务是必需的？
- 哪些只是历史背景或相邻问题？
- 哪些规则应该沉淀到 CLAUDE.md？
- 哪些临时状态不应该写进长期 memory？
```

这类自查尤其适合长任务、多人协作或连续多个 ticket 之后。

## 强制安全边界不要只靠提示

`CLAUDE.md`、memory 和 rules 属于上下文引导。它们能影响 Claude 的行为倾向，但不是强制执行机制。

如果你必须阻止某些操作，不要只写：

```text
Never edit .env files.
Never run destructive commands.
```

这类提示有帮助，但不足以作为安全边界。真正需要强制的事情，应使用 permissions 或 hooks。

可以这样分工：

| 需求 | 应使用 |
| --- | --- |
| 希望 Claude 默认遵守项目风格 | `CLAUDE.md` 或 rules。 |
| 希望 Claude 知道常用测试命令 | `CLAUDE.md`。 |
| 希望某类文件绝不能被编辑 | permissions deny 或 `PreToolUse` hook。 |
| 希望编辑后自动格式化 | `PostToolUse` hook。 |
| 希望高风险命令必须询问 | permissions ask。 |
| 希望某类流程被重复执行 | skill 或 slash command。 |

这个边界很重要：提示是方向盘，permissions 和 hooks 才是护栏。

本章只需要建立基础心智模型。hooks 的完整写法、permissions 策略和进阶工具边界，会在后续进阶工具章节再展开。

## 一个最小 CLAUDE.md 模板

下面是一个可改写的起点，不要原样塞进所有项目。先删掉不需要的，再补项目真实规则。

```markdown
# Project Context

## What This Project Is

- This project is ...
- The main users are ...

## Important Directories

- `src/`: application source.
- `tests/`: automated tests.
- `docs/`: project documentation.

## Common Commands

- `...`: run focused tests.
- `...`: run lint.
- `...`: run typecheck.

## Working Rules

- Keep changes small and tied to the current task.
- Before editing shared modules, explain affected files and validation plan.
- Do not include unrelated formatting or refactors in feature or bugfix diffs.
- If a related issue is discovered outside the task, record it as a follow-up.

## Verification

- Summaries must include what was changed, what was run, the result, and what remains unverified.
```

这个模板刻意短。真正有价值的不是格式，而是你能持续维护它，让它只保存稳定事实和团队约定。

## 本章校验

读完本章，你应该能做到：

- 判断什么应该写进 `CLAUDE.md`：稳定事实、共享规则、常用命令和验证要求。
- 区分 `CLAUDE.md`、auto memory、`.claude/rules/`、`@path` imports 和 handoff 的作用。
- 知道当前任务临时状态不应写进长期 memory。
- 用路径规则和 imports 控制局部上下文，而不是把所有内容塞进主 `CLAUDE.md`。
- 解释为什么上下文管理是 Claude Code 工作流的地基。
- 知道强制安全边界应交给 permissions / hooks，而不是只靠提示。

下一章会在这个地基上继续推进：当任务变得不确定、高风险或范围较大时，如何使用 planning mode、spec 和 tickets，把模糊需求拆成 fresh context 可以完成的工作单元。

## 参考来源

- Claude Code Memory / CLAUDE.md: https://code.claude.com/docs/en/memory
- Claude Code Permissions: https://code.claude.com/docs/en/permissions
- Claude Code Hooks: https://code.claude.com/docs/en/hooks-guide
- Claude Code Skills / slash commands: https://code.claude.com/docs/en/slash-commands
