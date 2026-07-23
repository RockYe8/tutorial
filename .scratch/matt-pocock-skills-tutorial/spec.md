Status: ready-for-agent

# Spec: Matt Pocock Skills Tutorial Series

## Problem Statement

The user wants to create a practical Chinese tutorial series that helps developers understand and use Matt Pocock's Codex Skills as a real AI programming workflow, not as a disconnected list of commands.

The target reader may not understand Codex Skills yet. They need a tutorial that starts from a simple, familiar example and gradually shows how Skills change the way an agent works: clarifying ideas, preserving context, creating specs, splitting tickets, implementing with tests, and reviewing against both repository standards and the original spec.

The tutorial should also serve the user personally as reusable learning notes while being clear enough to share with others. The tutorial now needs a clearer export strategy: Markdown remains the single source of truth, while generated HTML is a local offline artifact that can be opened directly in a browser.

## Solution

Create and maintain a Markdown tutorial series under `docs/tutorials/matt-pocock-skills/`:

1. A README navigation and lookup page.
2. An introductory tutorial for readers new to Codex Skills.
3. An engineering workflow tutorial for readers ready to use Matt Pocock Skills as a structured development process.
4. Additional tutorial pages when a Skill does not fit naturally into the README, the beginner article, or the engineering mainline.

The tutorial will use a Todo application as the running example because it is simple, familiar, and lets readers focus on the workflow rather than the business domain. The first article will use a personal Todo MVP. The second article will continue from an existing Todo app and add tags, filtering, and archiving.

The writing should be scenario-driven. Each Skill should be introduced through a concrete situation:

- What problem the reader is facing.
- Which Skill fits that situation.
- A realistic invocation example.
- A short dialogue or action snippet showing how the Skill feels in use.
- What artifact or decision the Skill produces.
- Which step comes next.

The series should cover every locally installed, currently effective Matt Pocock Skill with at least one accurate scenario. Main workflow Skills should receive deeper treatment; supporting Skills may receive shorter but still concrete scenarios.

Add a lightweight local HTML export workflow for the tutorial. The workflow should let the maintainer run a single command to generate a folder of static HTML files from the Markdown source. The generated files are for local offline reading: readers should be able to open `index.html` directly from the filesystem without running a server, installing Node, or accessing GitHub.

The export workflow should stay intentionally small. It should use a lightweight Node script rather than Pandoc or a full documentation framework such as VitePress, MkDocs, Docusaurus, or GitHub Pages. The goal is not to build a public documentation website; it is to make the Markdown tutorial easy to export into a browsable local HTML package when needed.

## User Stories

1. As a developer new to Codex Skills, I want to understand what a Skill is, so that I can see how it differs from an ordinary prompt.
2. As a developer new to AI coding workflows, I want a simple Todo example, so that I can follow the process without learning a complex domain first.
3. As a reader with only a vague app idea, I want to see `/grill-me` in action, so that I understand why being questioned before implementation improves the result.
4. As a reader, I want short realistic dialogue snippets, so that I can feel how Skills change the agent's behavior.
5. As a reader, I want the tutorial to use realistic Skill invocation text, so that I can imitate the examples in my own Codex sessions.
6. As a reader, I want to know when to use `/ask-matt`, so that I can find the right flow when I am unsure which Skill applies.
7. As a reader, I want to understand `/handoff`, so that I can preserve context when a session gets long or must move to another task.
8. As a reader, I want to understand when `/grill-me` is enough, so that I do not overcomplicate early idea exploration.
9. As a reader, I want to understand when to upgrade from `/grill-me` to `/grill-with-docs`, so that repo-backed work can preserve shared vocabulary and decisions.
10. As a developer starting in a repository, I want to understand why `/setup-matt-pocock-skills` comes first, so that later Skills know where issues, labels, and domain docs live.
11. As a developer, I want to see the concrete files produced by setup, so that repository conventions feel tangible rather than abstract.
12. As a developer, I want to understand issue tracker choices, so that I know whether work is tracked in GitHub, GitLab, local Markdown, or another system.
13. As a developer, I want to understand triage labels, so that I know how raw work becomes agent-ready.
14. As a developer, I want to understand domain docs, so that I know how `CONTEXT.md` and ADRs reduce repeated explanation.
15. As a developer designing a Todo feature, I want to see `/grill-with-docs` clarify tags, filters, and archives, so that I understand repo-grounded questioning.
16. As a developer, I want to understand `/domain-modeling`, so that I know why glossary terms and ADRs are updated during design.
17. As a developer, I want to understand `/grilling`, so that I recognize it as the underlying questioning discipline behind `/grill-me` and `/grill-with-docs`.
18. As a developer facing a large vague idea, I want to understand `/wayfinder`, so that I can map unknowns before writing a spec.
19. As a developer, I want to understand Map Issues and Decision Tickets, so that I can distinguish decision work from implementation work.
20. As a developer with a clarified discussion, I want to understand `/to-spec`, so that I can turn conversation into a formal buildable spec.
21. As a developer with a spec, I want to understand `/to-tickets`, so that I can split work into independently implementable vertical slices.
22. As a developer implementing a ticket, I want to understand `/implement`, so that I can use a ticket as the outer execution unit.
23. As a developer, I want to understand that `/tdd` is usually an internal method used by `/implement`, so that I do not treat it as a disconnected step after implementation.
24. As a developer, I want to understand `/code-review`, so that I can close the loop by reviewing against both repository standards and the spec.
25. As a developer handling external raw work, I want to understand `/triage`, so that I know it is for incoming issues rather than tickets already produced by `/to-tickets`.
26. As a developer debugging a hard failure, I want to understand `/diagnosing-bugs`, so that I can start with a red feedback loop instead of guessing.
27. As a developer unsure about a design, I want to understand `/prototype`, so that I can answer one question with throwaway code.
28. As a developer needing facts from external sources, I want to understand `/research`, so that reading work can be captured as cited Markdown.
29. As a developer improving a codebase, I want to understand `/improve-codebase-architecture`, so that code health work can be discovered and prioritized.
30. As a developer discussing module shape, I want to understand `/codebase-design`, so that design conversations use stable vocabulary like deep modules and seams.
31. As a developer resolving conflicts, I want to understand `/resolving-merge-conflicts`, so that conflict resolution preserves both sides' intent where possible.
32. As a learner, I want to understand `/teach`, so that I can use the workspace as a stateful learning environment.
33. As a future Skill author, I want to understand `/writing-great-skills`, so that I can learn how predictable Skills are written.
34. As a reader in a hurry, I want a quick lookup table, so that I can jump from my current situation to the relevant tutorial scene.
35. As a reader, I want the lookup table to link to exact sections, so that I do not need to scan the whole tutorial.
36. As a reader, I want the tutorial to avoid a standalone "common mistakes" lecture, so that corrections appear naturally inside usage scenes.
37. As a reader, I want the writing to reference AI Hero and `mattpocock/skills` as source baselines, so that the workflow explanation stays aligned with Matt Pocock's actual framing.
38. As a reader, I want to know that this is not official Matt Pocock documentation or an official translation, so that I understand its authority and intended use.
39. As a reader, I want a complete quick index of the locally effective Matt Pocock Skills, so that I can quickly find the Skill I am thinking about.
40. As a reader, I want every indexed Skill to point to a concrete scenario, so that the index is useful for choosing behavior rather than merely memorizing names.
41. As a reader, I want scenario routing grouped by situation, so that I can scan the README without reading one long table.
42. As a reader, I want `/research`, `/prototype`, and `/wayfinder` return paths distinguished clearly, so that I do not send their outputs to the wrong next step.
43. As a reader, I want README links to name both the article and the target section, so that local preview limitations do not make navigation confusing.
44. As a maintainer, I want Markdown to remain the single source of truth, so that generated HTML exports cannot drift from editable source documents.
45. As a maintainer, I want an offline HTML export option, so that the tutorial can be shared even when GitHub access is unreliable.
46. As a maintainer, I want GitHub or Gitee to be treated as reading and feedback channels rather than build prerequisites, so that local exports remain possible without network access.
47. As a maintainer, I want a lightweight local export command, so that I can regenerate the tutorial HTML package without setting up a full documentation site.
48. As a maintainer, I want the exported HTML to be a local folder of browser-openable files, so that readers can double-click `index.html` and read offline without starting a server.
49. As a maintainer, I want the HTML export output excluded from git, so that generated files do not become a second editable source.
50. As a maintainer, I want a post-commit reminder when tutorial Markdown changes, so that I am prompted to refresh the local export without slowing every commit by automatically building it.
51. As a maintainer, I want GitHub to publish the Markdown source only for now, so that online reading and feedback stay simple while release package hosting is deferred.

## Implementation Decisions

- The tutorial series will be written as Markdown files in `docs/tutorials/matt-pocock-skills/`.
- Markdown files are the only editable source of truth.
- Generated HTML is a local export artifact and must not be hand-edited.
- The local HTML export should be generated by a lightweight Node script, not by Pandoc and not by a full documentation-site framework.
- The export command should be named `npm run export:tutorial-html`.
- The export output should be written to `dist/matt-pocock-skills-html/`.
- The export output should not be committed to git.
- The exported package should be usable as local files: opening `index.html` in a browser should be enough to read the tutorial offline.
- The export workflow should rewrite tutorial-relative Markdown links so local HTML navigation works across generated pages.
- A local post-commit hook should remind the maintainer when `docs/tutorials/matt-pocock-skills/` Markdown files changed, but it should not automatically build the HTML export.
- Git commits may be used as source points for generated local HTML exports.
- GitHub and Gitee may be used for public reading and feedback, but local Markdown plus git history remains the source. GitHub should publish the Markdown source only for now, not generated HTML release assets.
- The core tutorial files remain:
  - `README.md`
  - `01-codex-skills-basics.md`
  - `02-engineering-workflow.md`
- Additional article files may be added when needed to cover local effective Skills without bloating README or distorting the Todo mainline.
- `README.md` will act as the navigation and lookup page. It should not become a long conceptual article or a prompt-template collection.
- `README.md` should explicitly state that the tutorial is not Matt Pocock official documentation or an official translation.
- `README.md` should contain grouped scenario routing with links to corresponding tutorial sections.
- The scenario routing table's action column should use wording like "建议下一步", not "优先使用的 Skill", because some entries are process actions rather than direct Skill calls.
- The scenario routing should be split into four groups:
  - 新手入门
  - 主链路
  - Shaping 与回流
  - 维护与异常
- `README.md` should contain a full quick index of the locally installed effective Matt Pocock Skills.
- `README.md` should not contain a standalone "可复制调用模板" section. Example invocation text should live inside contextual tutorial sections.
- The first article will focus on entry-level understanding and use a personal Todo MVP as the example.
- The second article will focus on engineering workflow and use an existing Todo app gaining tags, filtering, and archiving as the example.
- The tutorial will use short dialogue snippets rather than long transcripts.
- Dialogue snippets will be realistic enough to imitate, but concise enough to keep the article readable.
- The tutorial will distinguish user-invoked Skills from lower-level supporting disciplines.
- The tutorial will explain that `/implement` is the outer execution Skill and `/tdd` is normally used inside implementation where possible.
- The tutorial will cover all locally installed effective Matt Pocock Skills either in the main Todo workflow or in short supplemental scenarios.
- The local effective Skill baseline for this spec is:
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
- This spec should not use stale, obsolete, or historical skills.sh entries as the effective Skill list.
- Main workflow Skills will receive deeper treatment: `/setup-matt-pocock-skills`, `/grill-me`, `/grill-with-docs`, `/wayfinder`, `/to-spec`, `/to-tickets`, `/implement`, `/tdd`, `/code-review`, and `/handoff`.
- Supporting Skills will receive shorter scene-based explanations: `/ask-matt`, `/triage`, `/diagnosing-bugs`, `/prototype`, `/research`, `/teach`, `/improve-codebase-architecture`, `/codebase-design`, `/resolving-merge-conflicts`, `/writing-great-skills`, `/grilling`, and `/domain-modeling`.
- The tutorial will not create a standalone "common mistakes" section. Misunderstandings will be corrected inside the relevant usage scenes.
- The tutorial should mention `AGENTS.md`, `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and `docs/agents/triage-labels.md` when explaining setup.
- The tutorial should frame `CONTEXT.md` as shared domain vocabulary and ADRs as records for hard-to-reverse, surprising, trade-off decisions.
- The tutorial should distinguish the回流 paths from shaping Skills:
  - `/research` findings may return to `/grill-with-docs`, `/to-spec`, or `/to-tickets`, depending on whether they change understanding, requirements, or ticket decomposition.
  - `/prototype` conclusions usually return to `/to-spec` or ticket acceptance criteria; if they expose a new decision, they may return to `/grill-with-docs`.
  - `/wayfinder` conclusions normally return to `/to-spec` or `/to-tickets`; they should not be described as normally returning to `/grill-with-docs`.
- The tutorial should include recommended reading and distribution guidance:
  - GitHub or repository web UI when online access is available.
  - Offline static HTML export for local sharing when needed.
  - VS Code or Cursor for local Markdown authoring, with a note that local preview may not always scroll to cross-file anchors.
- The tutorial should treat issue tracker concepts consistently:
  - Issue means a tracked work item, not only a bug.
  - Spec describes what to build, why, and how to accept it.
  - Ticket is an independently implementable and verifiable work unit.
  - Comments record execution facts and handoff information.
  - Parent-child relationships are decomposition relationships.
  - Blocking relationships describe dependency order.
- The tutorial should use plain Chinese explanations with execution-oriented framing.
- The tutorial should include source references to AI Hero and the `mattpocock/skills` repository where appropriate.

## Testing Decisions

- The primary test seam is the produced Markdown tutorial set.
- Verify that all three expected files exist under `docs/tutorials/matt-pocock-skills/`.
- Verify that `README.md` links to the corresponding sections in both article files.
- Verify that the two article files contain stable section headings for every linked scene.
- Verify that every installed Matt Pocock Skill is covered at least once either in a main workflow scene or a supplemental scenario.
- Verify that the README quick index includes all 22 local effective Skills listed in this spec.
- Verify that every indexed Skill links to a tutorial scenario or section.
- Verify that README does not contain a standalone copyable invocation template section.
- Verify that README scenario routing is grouped and uses "建议下一步" or equivalent wording.
- Verify that `/research`, `/prototype`, and `/wayfinder`回流 guidance is not collapsed into one ambiguous row.
- Verify that `/wayfinder` is not described as normally returning to `/grill-with-docs`.
- Verify that README states the tutorial is not official Matt Pocock documentation or an official translation.
- Verify that Markdown is identified as source of truth and generated HTML as a local export artifact.
- Verify that the local HTML export command generates browser-openable files under `dist/matt-pocock-skills-html/`.
- Verify that exported HTML is not required to be committed to git.
- Verify that exported links between tutorial pages navigate to generated `.html` files rather than source `.md` files.
- Verify that opening the generated `index.html` from the filesystem does not require a local server.
- Verify that the post-commit reminder detects tutorial Markdown changes and prints a reminder without running the export command.
- Verify that the main Todo workflow appears consistently across the README and both articles.
- Verify that the tutorial distinguishes user-invoked Skills from supporting disciplines.
- Verify that setup is explained as repository convention configuration, not Skill installation.
- Verify that `/grill-with-docs` is explained as clarification plus domain documentation, not automatic full spec generation.
- Verify that `/to-spec` is explained as synthesis of existing discussion into a formal spec.
- Verify that `/to-tickets` is explained as splitting work into vertical implementation tickets with blocking edges.
- Verify that `/implement` and `/tdd` are described with the correct outer/inner relationship.
- Verify that `/triage` is described as processing raw incoming issues, not tickets already generated by `/to-tickets`.
- Verify that the Markdown is readable as standalone tutorial content, not merely an outline.
- Verify that no links use broken relative paths inside the tutorial set.

## Out of Scope

- Building the actual Todo application.
- Creating implementation tickets for the Todo app itself.
- Installing or modifying Matt Pocock Skills.
- Changing the local issue tracker configuration.
- Writing a new custom Skill.
- Uploading generated HTML to GitHub Release.
- Adding GitHub Actions automation for HTML export.
- Publishing the tutorial through GitHub Pages or another hosted documentation site.
- Introducing a full documentation framework such as VitePress, MkDocs, or Docusaurus.
- Automatically generating PDF output.
- Exhaustively reproducing Matt Pocock's videos.
- Providing a complete reference manual for every line of every `SKILL.md`.
- Maintaining a second editable truth in generated HTML.
- Adding obsolete or historical Skill names as primary tutorial entries.

## Further Notes

The tutorial should be useful both as the user's personal learning material and as a shareable guide for other developers.

The writing should prioritize imitation and practice. Each Skill should be explained through "when you are in this situation, say this, expect this output, then go here next."

The tutorial should remain faithful to the installed local Skills and to the public framing from AI Hero and `mattpocock/skills`.

This spec supersedes earlier tutorial decisions that required README to keep many direct copyable usage templates or limited the series to exactly three top-level tutorial files.
