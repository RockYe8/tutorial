# Tutorial

这是一个个人编程教程仓库，用来沉淀我在 coding、AI 编程工具和工程工作流中学到的知识。当前内容以 Matt Pocock Skills 和 Codex Skills 学习笔记为主，后续会逐步扩展到 Java、Agent、多 Agent、Codex、Claude Code，以及更容易上手的开发者工具实践。

这个仓库不是官方文档翻译，也不是一次性整理完成的课程站点。它更像一个持续演进的学习工作台：每组教程会尽量保留学习路径、实践场景、关键命令、文件说明和可验证的产物。

## 当前已完成

- 建立了 Matt Pocock Skills 中文教程专题。
- 完成了从 Todo MVP 理解 Codex Skills 的新手基础篇。
- 完成了从 setup 到 code review 的工程主链路实践篇。
- 补充了 22 个本地 Skill 的场景速写，帮助判断不同处境下该用哪个 Skill。
- 增加了本地 HTML 导出脚本，可以把 Markdown 教程导出为无需本地服务器即可打开的静态 HTML。
- 增加了测试，覆盖 Markdown 链接重写、HTML 导出、提交后提醒逻辑和 hook 安装提示。
- 建立了 agent 协作约定文档，包括本地 issue tracker、triage labels 和 domain docs 的读取规则。

## 目录结构

```text
.
|-- AGENTS.md
|-- docs/
|   |-- agents/
|   |   |-- domain.md
|   |   |-- issue-tracker.md
|   |   `-- triage-labels.md
|   `-- tutorials/
|       `-- matt-pocock-skills/
|           |-- README.md
|           |-- 01-codex-skills-basics.md
|           |-- 02-engineering-workflow.md
|           |-- 03-local-skill-scenarios.md
|           |-- local-html-export.md
|           `-- research-matt-pocock-workflow-usage-insights.md
|-- scripts/
|   |-- export-tutorial-html.cjs
|   |-- install-tutorial-html-reminder.cjs
|   `-- tutorial-html-export-reminder.cjs
|-- test/
|   `-- tutorial-html-export.test.cjs
`-- package.json
```

## 如何阅读

目前建议从 Matt Pocock Skills 教程导航开始：

[docs/tutorials/matt-pocock-skills/README.md](docs/tutorials/matt-pocock-skills/README.md)

如果你是第一次接触 Codex Skills，可以按这个顺序读：

1. [01 - 从 Todo MVP 理解 Codex Skills](docs/tutorials/matt-pocock-skills/01-codex-skills-basics.md)
2. [02 - 从 Setup 到 Code Review 的工程主链路](docs/tutorials/matt-pocock-skills/02-engineering-workflow.md)
3. [03 - 22 个本地 Skill 的场景速写](docs/tutorials/matt-pocock-skills/03-local-skill-scenarios.md)
4. [Local HTML Export](docs/tutorials/matt-pocock-skills/local-html-export.md)

## 本地命令

运行测试：

```powershell
npm test
```

导出 Matt Pocock Skills 教程为本地 HTML：

```powershell
npm run export:tutorial-html
```

导出的文件会生成到：

```text
dist/matt-pocock-skills-html/
```

安装教程 HTML 导出提醒：

```powershell
npm run install:tutorial-html-reminder
```

安装后，如果提交修改了 `docs/tutorials/matt-pocock-skills/` 下的 Markdown 文件，post-commit hook 会提醒重新运行 HTML 导出命令。

## 计划中的教程方向

- Java 基础、工程实践和常见后端开发模式。
- Agent 的基本概念、工作流设计和实践案例。
- 多 Agent 协作：任务拆分、上下文交接、review 和并行执行。
- Codex 使用教程：如何更快进入工作状态、如何使用 skill、如何管理本地仓库任务。
- Claude Code 使用教程：安装、日常开发、与 Codex 工作方式的差异。
- AI 编程工具工作流：从想法澄清、spec、tickets、TDD、code review 到发布。

## 仓库定位

这个仓库会优先记录“我真的学过、用过、踩过坑”的内容。文章会尽量面向实践，而不是只堆概念：

- 先解释为什么需要这个知识点。
- 再给出可复现的步骤或场景。
- 尽量保留命令、文件路径和验证方式。
- 对仍在变化的工具和生态，标注以官方文档和本地实际版本为准。

