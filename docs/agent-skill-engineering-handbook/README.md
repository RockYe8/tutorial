# Agent Skill Engineering Handbook

这套手册的目标，是沉淀一套可迁移的 Skill 开发方法论：如何理解 Skill，如何决定边界，如何写 `SKILL.md`，如何组织 supporting resources，如何判断 scripts / tools / MCP / workflow / plugin 的分工，如何测试、治理、发布和维护。

它不是某个具体项目的复盘，也不是厂商资料堆叠。每一章都优先使用官方或一手资料作为证据底座，并在关键观点后加入可点击引用标注。

## 阅读路线

如果你是第一次系统学习 Skill，建议按顺序阅读：

1. [第一章：重新理解 Skill](D:/Project/tutorial/docs/agent-skill-engineering-handbook/01-understanding-skill.md)
2. [第二章：Activation 先于 Instructions](D:/Project/tutorial/docs/agent-skill-engineering-handbook/02-activation-before-instructions.md)
3. [第三章：写好 Skill Body](D:/Project/tutorial/docs/agent-skill-engineering-handbook/03-writing-the-skill-body.md)
4. [第四章：设计 Supporting Resources](D:/Project/tutorial/docs/agent-skill-engineering-handbook/04-designing-supporting-resources.md)
5. [第五章：从 Scripts 到 Tools](D:/Project/tutorial/docs/agent-skill-engineering-handbook/05-from-scripts-to-tools.md)
6. [第六章：先评估，再信任](D:/Project/tutorial/docs/agent-skill-engineering-handbook/06-evaluation-before-trust.md)
7. [第七章：安全与治理](D:/Project/tutorial/docs/agent-skill-engineering-handbook/07-security-and-governance.md)
8. [第八章：生命周期与维护](D:/Project/tutorial/docs/agent-skill-engineering-handbook/08-lifecycle-and-maintenance.md)
9. [第九章：从零构建一个 Pro-Level Skill](D:/Project/tutorial/docs/agent-skill-engineering-handbook/09-building-a-pro-level-skill.md)

如果你已经理解基本概念，可以这样读：

- 想判断一个能力是否应该做成 Skill：读第一章、第五章、第九章。
- 想写出稳定触发的 Skill：读第二章和附录 A。
- 想把长知识拆成资源文件：读第三章、第四章和附录 A。
- 想让 Skill 具备工程质量：读第六章、第七章、第八章。
- 想做企业级分发：读第五章、第七章、第八章、第九章。

## 核心结论

本手册反复使用一个边界句：

> Skill teaches; resources ground; scripts assist; tools act; workflows govern; platforms operate.

这句话不是某个厂商的官方口号，而是本手册对 Agent Skills spec、OpenAI、Anthropic、Microsoft、MCP、AWS、xAI、Apple 等资料的工程化归纳。它用来防止把所有 agent 能力都塞进 Skill 一个概念里。

## 附录

- [附录 A：SKILL.md 模板与填写指南](D:/Project/tutorial/docs/agent-skill-engineering-handbook/appendix-a-skill-md-template.md)
- [附录 B：Skill 目录结构与 Bundle 形态决策指南](D:/Project/tutorial/docs/agent-skill-engineering-handbook/appendix-b-directory-patterns.md)
- [附录 C：Activation 与 Description 测试夹具](D:/Project/tutorial/docs/agent-skill-engineering-handbook/appendix-c-activation-description-fixtures.md)
- [附录 D：Evaluation 与 Forward Testing Checklist](D:/Project/tutorial/docs/agent-skill-engineering-handbook/appendix-d-evaluation-forward-testing-checklist.md)
- [附录 E：Security / Release Checklist](D:/Project/tutorial/docs/agent-skill-engineering-handbook/appendix-e-security-release-checklist.md)
- [v1.0 Readiness Checklist](D:/Project/tutorial/docs/agent-skill-engineering-handbook/v1.0-readiness-checklist.md)
