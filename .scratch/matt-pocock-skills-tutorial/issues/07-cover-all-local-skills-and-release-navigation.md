# 07 - 覆盖本地有效 Matt Pocock Skills 并改进教程导航发布方式

**What to build:** Upgrade the Matt Pocock Skills tutorial series so it covers every locally installed, currently effective Matt Pocock Skill with accurate scenario-based guidance, while keeping Markdown as the source of truth and README as a navigation surface.

**Blocked by:** 06 - 补充 Matt Pocock / AI Hero 工作流使用心得.

**Status:** resolved

## Context

The tutorial currently has a strong main workflow, but the README and article structure need another pass after review.

The user wants to stay aligned with Matt Pocock's current effective Skills, not the stale or historical names listed by some public installer pages. The authoritative local baseline for this tutorial is the set of Matt Pocock Skills currently installed under:

```text
C:\Users\YHong\.codex\skills
```

The current local effective Skill list is:

- `/ask-matt`
- `/code-review`
- `/codebase-design`
- `/diagnosing-bugs`
- `/domain-modeling`
- `/grill-me`
- `/grill-with-docs`
- `/grilling`
- `/handoff`
- `/implement`
- `/improve-codebase-architecture`
- `/prototype`
- `/research`
- `/resolving-merge-conflicts`
- `/setup-matt-pocock-skills`
- `/tdd`
- `/teach`
- `/to-spec`
- `/to-tickets`
- `/triage`
- `/wayfinder`
- `/writing-great-skills`

This ticket supersedes any earlier README decisions that treated the README as a place for many copyable invocation templates. README should become a clean navigation and lookup page, not a prompt-template dump.

## Decisions From Review

- README should explicitly say this is not official Matt Pocock documentation or an official translation; it is a Chinese learning note and practice tutorial.
- README should primarily serve as navigation and routing.
- README should not keep a "copyable invocation templates" section.
- README should route readers to contextual examples inside the tutorial articles instead of encouraging context-free copy/paste.
- README should include a full Skill quick index based on the local effective Skill list above.
- Every local effective Skill should have at least one accurate usage scenario somewhere in the tutorial series.
- Do not force every Skill into the Todo mainline if the scenario becomes artificial.
- It is acceptable to add a new article or topic page if some Skills fit better as advanced or supporting scenarios.
- The scenario table should use "建议下一步" rather than "优先使用的 Skill", because some entries are process actions rather than direct Skill calls.
- The long "我遇到 X，该用哪个 Skill？" table should be split into four groups:
  - 新手入门
  - 主链路
  - Shaping 与回流
  - 维护与异常
- Do not combine `/research`, `/prototype`, and `/wayfinder` into one vague "回主线" row.
- Their回流 paths should be separate:
  - `/research` findings may return to `/grill-with-docs`, `/to-spec`, or `/to-tickets`, depending on whether they change understanding, requirements, or ticket decomposition.
  - `/prototype` conclusions usually return to `/to-spec` or ticket acceptance criteria; if they expose a new decision, they may return to `/grill-with-docs`.
  - `/wayfinder` conclusions should normally return to `/to-spec` or `/to-tickets`, not default to `/grill-with-docs`.
- README links should prioritize GitHub/web Markdown compatibility. Link text should include clear article and section names because some local previews only open the target file without scrolling to the anchor.
- Offline release should prefer a static HTML package. PDF is only a secondary format for archive or sequential reading.
- Markdown files remain the single source of truth.
- Generated HTML is a release artifact and must not be hand-edited.
- Local Markdown plus git commit/tag should be the release source. GitHub or Gitee can be used for distribution, but should not be a build prerequisite.
- The tutorial series is reasonable to publish on GitHub for public reading, feedback, and release downloads.

## Scope

- Update `docs/tutorials/matt-pocock-skills/README.md`.
- Update existing tutorial articles where the relevant Skill scenario naturally belongs.
- Add a new tutorial article only if needed to cover local effective Skills without bloating README or breaking the Todo workflow.
- Optionally add documentation for future offline HTML release workflow, but do not implement a full static-site build unless this ticket is explicitly expanded during implementation.

## Suggested Structure

README should contain:

- A short disclaimer that the tutorial is not official documentation or an official translation.
- A concise learning path.
- Recommended reading/distribution modes:
  - GitHub or repository web UI when online.
  - Offline static HTML package for release distribution.
  - VS Code/Cursor for local Markdown authoring, with a note that cross-file anchor scrolling may be unreliable in local preview.
- A grouped scenario routing table with "建议下一步".
- A full Skill quick index covering all 22 local effective Skills.
- No standalone copyable-template section.

Tutorial body should ensure:

- Mainline engineering Skills remain explained through the Todo workflow.
- Supporting Skills receive credible scenarios that explain when they are useful.
- Scenarios are concrete enough to prevent misuse, but not so project-specific that readers copy them blindly.

## Acceptance Criteria

- [x] README says the tutorial is not Matt Pocock official documentation or an official translation.
- [x] README has no "可复制调用模板" section.
- [x] README directs readers to contextual tutorial sections for example invocation text.
- [x] README second column in scenario routing uses "建议下一步" or equivalent wording, not "优先使用的 Skill".
- [x] README scenario routing is split into four groups: 新手入门, 主链路, Shaping 与回流, 维护与异常.
- [x] `/research`, `/prototype`, and `/wayfinder`回流 are represented as separate rows or clearly separate guidance.
- [x] README includes a full quick index for all 22 local effective Skills listed in this ticket.
- [x] Each of the 22 local effective Skills links to a tutorial section or is explicitly marked as newly added coverage.
- [x] Every local effective Skill has at least one accurate usage scenario in the tutorial series.
- [x] No scenario claims that `/wayfinder` normally returns to `/grill-with-docs`.
- [x] README includes recommended reading/distribution guidance that does not depend on GitHub being reachable.
- [x] README states or implies Markdown is the source of truth and generated HTML is a release artifact.
- [x] The tutorial does not use skills.sh's 55-item list as the full effective Skill list.
- [x] Obsolete or historical names are not added as primary tutorial entries.
- [x] README links are checked for relative path correctness.
- [x] Existing article anchors used from README still exist.

## Non-goals

- Do not edit generated HTML by hand.
- Do not build a full docs website unless a separate implementation decision expands the ticket.
- Do not teach stale skills from skills.sh merely because they appear in the public installer list.
- Do not turn README into a complete reference manual.
- Do not force every Skill into the same Todo feature if the fit is artificial.
- Do not modify the installed Skill files under `.codex/skills`.

## References

- `docs/tutorials/matt-pocock-skills/README.md`
- `docs/tutorials/matt-pocock-skills/01-codex-skills-basics.md`
- `docs/tutorials/matt-pocock-skills/02-engineering-workflow.md`
- `docs/tutorials/matt-pocock-skills/research-matt-pocock-workflow-usage-insights.md`
- `.scratch/matt-pocock-skills-tutorial/spec.md`
- `.scratch/matt-pocock-skills-tutorial/issues/06-add-workflow-usage-insights.md`
- Local Skill baseline: `C:\Users\YHong\.codex\skills`

## Comments

- 2026-07-22: Marked resolved as the parent summary ticket after confirming its acceptance criteria are covered by completed child work 08-12.
- Coverage summary: `81720d9` merged the README navigation restructure for ticket 08; `e451642` merged the supplemental 22-Skill scenario article for ticket 09; `34c4b30` added the README quick index for ticket 10; `af8bffd` added online/local/offline reading and release guidance for ticket 11; `657f6a3` completed ticket 12 verification for links, anchors, navigation wording, 22-Skill coverage, and source-of-truth/release-artifact guidance.
- Verification basis: current README has the official-docs disclaimer, no standalone `可复制调用模板` section, contextual links, four grouped routing tables with `建议下一步`, separated `/research`, `/prototype`, and `/wayfinder`回流 guidance, a complete 22-Skill quick index, and reading/distribution guidance that does not require GitHub. Current tutorial scenarios cover all 22 local effective Skills, avoid obsolete skills.sh-only primary entries, and do not route `/wayfinder` normally back to `/grill-with-docs`.
