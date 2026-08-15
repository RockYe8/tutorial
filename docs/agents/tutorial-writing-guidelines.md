# Tutorial Writing Guidelines

本文定义 `D:\Project\tutorial` 中教程类内容的全局写作规范。后续编写《Agent Skill Engineering Handbook》章节正文、案例章、附录、模板和 checklist 时，应优先遵守本文件，除非用户明确要求调整。

## 1. 写作目标

教程的目标是总结可迁移的方法论，而不是复述某个具体项目的业务经验。

章节应保持教程口吻：清楚解释概念、判断依据、设计取舍和落地步骤。不要把正文写成厂商资料堆叠、论文式综述或项目复盘。

## 2. 标准章节结构

每个正式章节建议采用以下结构：

```markdown
# 第 X 章 标题

## 本章证据底座

简要说明本章主要综合了哪些官方/一手来源，以及这些来源分别支撑什么类型的判断。

## 正文

以教程方式展开概念、原则、流程、边界和实践建议。关键观点后使用可点击引用标注。

## 本章小结

收束本章的方法论结论，说明它如何承接前文、支撑后文。

## Sources

集中列出本章所有来源链接。
```

如果某章是案例章或附录，可以调整标题层级，但仍应保留关键观点引用和章末 Sources。

## 3. 引用格式

正文中的关键观点使用 Markdown reference link：

```markdown
关键观点句。[来源名][source-id]
```

章末集中列出完整链接：

```markdown
## Sources

- [来源名][source-id]

[source-id]: https://example.com
```

同一章内重复引用同一来源时，复用同一个 `source-id`。`source-id` 应使用稳定短名，例如：

```markdown
[agent-skills-spec]
[claude-skills]
[claude-plugins]
[openai-skills]
[openai-plugins]
[ms-agent-skills]
[aws-agentcore]
[apple-app-intents]
```

## 4. 哪些内容必须引用

以下内容必须在关键句后加引用标注：

- 官方定义、官方术语、平台机制。
- Skill 的目录结构、frontmatter、`description`、progressive disclosure 等机制。
- `references/`、`assets/`、`scripts/`、`evals/` 的用途和边界。
- Tool、MCP、connector、plugin、workflow、App Intent 等能力边界。
- 安全、权限、OAuth、sandbox、approval、audit、治理机制。
- 测试、eval、validation、forward testing、regression、observability。
- 发布、版本、marketplace、distribution scope、rollback、deprecation、maintenance。
- 对某个厂商实践的描述。

## 5. 教程归纳如何引用

如果某个观点是本教程对多家官方资料的归纳，而不是某一家厂商的正式说法，应明确写成“本教程归纳”。

示例：

```markdown
本教程把 Skill 的成熟度分为 L0 到 L4，这不是某一家厂商的官方分级，而是综合 Agent Skills spec、Claude Code Skills、OpenAI Plugins 和 Microsoft Agent Framework 后形成的工程化归纳。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-skills][OpenAI Plugins][openai-plugins][Microsoft Agent Framework][ms-agent-skills]
```

不要把教程归纳伪装成所有厂商统一采用的行业标准。

## 6. 不需要逐句引用的内容

以下内容通常不需要每句都加引用：

- 章节过渡句。
- 对前文的承接说明。
- 简短的小结句。
- 教程中的写作安排。
- 不承载关键事实或方法论判断的普通解释。

但如果这些句子支撑核心观点，仍应加引用。

## 7. 来源选择原则

优先使用官方/一手来源：

- 官方文档。
- 官方 spec。
- 官方 API 文档。
- 官方产品说明。
- 官方 marketplace / plugin / skill / agent framework 文档。
- 官方安全、权限、治理、发布、版本说明。

不要用二手博客替代官方来源。若某个平台没有直接 Skill 概念，只能引用其与 tool、connector、plugin、workflow、App Intent 或 capability package 直接相关的部分，不要强行类比为 Skill。

## 8. 教程口吻

正文应保持清楚、克制、可教学：

- 先解释“为什么需要这个概念”。
- 再解释“它解决什么问题”。
- 然后给出“如何落地”。
- 最后说明“什么时候不该过度设计”。

避免为了显得专业而堆叠术语。尤其要反复强调：pro-level Skill 不等于目录最多、脚本最多或结构最重，而是边界清楚、触发稳定、指令可执行、资源按需加载、质量可验证、安全可治理、长期可维护。

## 9. 与前文保持一致

后续章节必须保持以下核心结论一致：

- Skill teaches.
- Resources ground.
- Scripts assist.
- Tools act.
- Workflows govern.
- Platforms operate.

轻量 Skill 和 self-contained bundle 都可以是专业形态；区别在于适用范围、风险、复用规模、权限边界和分发需求，而不是目录数量本身。
