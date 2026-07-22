# 06 - 补充 Matt Pocock / AI Hero 工作流使用心得

**What to build:** Update the Matt Pocock Skills tutorial series with practical workflow usage insights from the research note, while keeping the tutorial scenario-driven instead of turning it into a source dump.

**Blocked by:** 01 - 创建教程导航; 02 - 写入门篇：从 Todo MVP 理解 Codex Skills; 03 - 写工程化篇主链路：从 Setup 到 Code Review; 04 - 补充特殊场景 Skills 与实践跳转; 05 - 校验教程完整性与链接一致性.

**Status:** resolved

## Context

The research note at `docs/tutorials/matt-pocock-skills/research-matt-pocock-workflow-usage-insights.md` captures useful Matt Pocock / AI Hero workflow guidance, but the tutorial should not become a research summary. The new material should help readers decide what to do in real situations: which Skill to use, what artifact should be produced, what should feed the next step, and when to stop or split the work.

The main editorial decision is to put most new workflow insight into article 02, keep README as a practical entry point, and only lightly strengthen article 01.

## Scope

- Update `docs/tutorials/matt-pocock-skills/README.md`.
- Update `docs/tutorials/matt-pocock-skills/01-codex-skills-basics.md`.
- Update `docs/tutorials/matt-pocock-skills/02-engineering-workflow.md`.
- Use `docs/tutorials/matt-pocock-skills/research-matt-pocock-workflow-usage-insights.md` as the main source note.

## Editorial decisions

- README should act as a scenario index and quick-start surface, not a full explanation page.
- README should include a short workflow map: clarification -> spec -> tracer-bullet tickets -> implement/TDD -> code-review/QA -> architecture upkeep.
- README should include direct, copyable usage templates for:
  - `/grill-me`
  - `/grill-with-docs`
  - `/to-spec`
  - `/to-tickets`
  - `/implement`
  - `/code-review`
  - `/handoff`
  - `/research`
  - `/prototype`
  - `/wayfinder`
- README should include `/domain-modeling` as a follow-up template after `/grill-with-docs`, not as a separate primary quick-start template.
- README should include an install entry that links to article 01, but article 01 should carry the full installation explanation.
- Article 01 should teach directly usable installation steps before the first Skill walkthrough.
- Article 01 should recommend installing all Matt Pocock Skills for the tutorial, rather than maintaining a minimal install list.
- Article 01 should cover both online installation and offline/manual installation examples for Codex and Claude Code on Windows.
- Article 01 should keep installation concrete, using direct Windows examples such as:
  - `C:\Users\<your-username>\.codex\skills\grill-me\SKILL.md`
  - `C:\Users\<your-username>\.claude\skills\grill-me\SKILL.md`
- Article 01 should only lightly strengthen the concepts:
  - Skills are small, composable workflow modules, not magic prompts.
  - `/grill-me` is for lightweight clarification; real repository work should usually move to `/grill-with-docs`.
  - High-fidelity UI, state, or interaction uncertainty should go through `/prototype` instead of being guessed in grilling.
- Article 02 should receive most of the workflow insight, embedded near the relevant existing sections.
- Article 02 should explain insights through short Todo scenarios first, then summarize the principle briefly.
- Article 02 should include or strengthen these scenario-driven topics:
  - spec as shared-understanding contract after `/grill-with-docs`, not a fresh interview
  - ticket review with vertical slices, tracer bullets, blocking edges, fresh context, and independent verification
  - QA/review failure handling: current-ticket failure versus new independent ticket
  - research/prototype/wayfinder results feeding back into the main flow
  - smart zone, handoff, and ticket-too-large signals
- Article 02 should also include concise support material for:
  - `/implement`, `/tdd`, and `/code-review` relationship
  - three feedback layers: low-level tests/typecheck, architecture feedback, and business/spec feedback
  - `CONTEXT.md` as glossary only, not spec or scratchpad
  - ADRs as rare records for hard-to-reverse, surprising, trade-off decisions
  - architecture upkeep after delivery

## Non-goals

- Do not add historical terminology such as `/to-prd` or `/to-issues`; readers only need current usage.
- Do not teach a `/qa` command. Current public sources show `qa` on skills.sh, but the current Matt Pocock README and AI Hero main flow do not present `/qa` as a stable engineering mainline Skill. Teach QA loops, acceptance failures, ticket lifecycle, and `/code-review` instead.
- Do not turn README into a long conceptual article.
- Do not turn article 01 into an advanced engineering workflow article.
- Do not present user-derived workflow conventions as Matt Pocock direct quotes.
- Do not expand installation philosophy beyond what helps readers choose an install path.

## Acceptance criteria

- [ ] README has a clear installation entry linking to article 01.
- [ ] README has a short workflow map.
- [ ] README has expanded scenario entries for new users, including situations around ticket review, QA failure, long context, and research/prototype/wayfinder回流.
- [ ] README has 10 direct copyable usage templates for `/grill-me`, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/code-review`, `/handoff`, `/research`, `/prototype`, and `/wayfinder`.
- [ ] README includes a `/domain-modeling` follow-up template after `/grill-with-docs`.
- [ ] Article 01 has a "before you start" installation section.
- [ ] Article 01 includes online installation using `npx skills@latest add mattpocock/skills` and tells readers to install all Skills for the tutorial.
- [ ] Article 01 includes Windows offline/manual copy examples for both Codex and Claude Code.
- [ ] Article 01 explains that manual offline copying requires placing full Skill folders in the agent's skills directory and starting a new session or restarting the agent.
- [ ] Article 01 only adds lightweight conceptual guidance and does not introduce ticket review, QA lifecycle, or three-layer feedback.
- [ ] Article 02 embeds the main new insights near existing sections instead of collecting them all into one large source-summary section.
- [ ] Article 02 uses short Todo scenarios to teach at least five judgment points: spec contract, ticket review, QA ticket handling, shaping-skill回流, and smart-zone/handoff.
- [ ] Article 02 includes a concise relationship explanation or diagram for `/implement`, `/tdd`, and `/code-review`.
- [ ] Article 02 includes the three feedback layers as a practical model.
- [ ] Article 02 clarifies `CONTEXT.md` and ADR boundaries.
- [ ] Article 02 does not mention obsolete Skill names.
- [ ] Article 02 does not teach `/qa` as a command.
- [ ] Source links are retained where useful, but the prose remains tutorial-first rather than research-note-first.
- [ ] README links and section anchors are verified after editing.

## References

- `docs/tutorials/matt-pocock-skills/research-matt-pocock-workflow-usage-insights.md`
- `docs/tutorials/matt-pocock-skills/README.md`
- `docs/tutorials/matt-pocock-skills/01-codex-skills-basics.md`
- `docs/tutorials/matt-pocock-skills/02-engineering-workflow.md`
- `docs/agents/issue-tracker.md`

## Comments

### 2026-07-22 - Codex implementation

- Updated `docs/tutorials/matt-pocock-skills/README.md` with an installation entry, a short workflow map, expanded scenario routing, and copyable templates for the requested main Skills.
- Updated `docs/tutorials/matt-pocock-skills/01-codex-skills-basics.md` with before-you-start installation guidance for online and offline/manual Windows setups, plus light conceptual guidance about small composable workflow modules and when to use `/prototype`.
- Updated `docs/tutorials/matt-pocock-skills/02-engineering-workflow.md` with scenario-driven guidance for spec contracts, ticket review, shaping result回流, implement/TDD/code-review, feedback layers, QA ticket handling, CONTEXT.md/ADR boundaries, smart-zone handoff, and architecture upkeep.
- Verified local Markdown links and explicit anchors for the tutorial files.
