Status: ready-for-agent

# Spec: Matt Pocock Skills Tutorial Series

## Problem Statement

The user wants to create a practical Chinese tutorial series that helps developers understand and use Matt Pocock's Codex Skills as a real AI programming workflow, not as a disconnected list of commands.

The target reader may not understand Codex Skills yet. They need a tutorial that starts from a simple, familiar example and gradually shows how Skills change the way an agent works: clarifying ideas, preserving context, creating specs, splitting tickets, implementing with tests, and reviewing against both repository standards and the original spec.

The tutorial should also serve the user personally as reusable learning notes while being clear enough to share with others.

## Solution

Create a three-file Markdown tutorial series under `docs/tutorials/matt-pocock-skills/`:

1. A README navigation page.
2. An introductory tutorial for readers new to Codex Skills.
3. An engineering workflow tutorial for readers ready to use Matt Pocock Skills as a structured development process.

The tutorial will use a Todo application as the running example because it is simple, familiar, and lets readers focus on the workflow rather than the business domain. The first article will use a personal Todo MVP. The second article will continue from an existing Todo app and add tags, filtering, and archiving.

The writing should be scenario-driven. Each Skill should be introduced through a concrete situation:

- What problem the reader is facing.
- Which Skill fits that situation.
- A realistic invocation example.
- A short dialogue or action snippet showing how the Skill feels in use.
- What artifact or decision the Skill produces.
- Which step comes next.

The series should cover the main Matt Pocock workflow in depth while using short supporting scenarios for the other installed Skills.

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

## Implementation Decisions

- The tutorial series will be written as Markdown files in `docs/tutorials/matt-pocock-skills/`.
- The series will contain exactly three top-level tutorial files for this spec:
  - `README.md`
  - `01-codex-skills-basics.md`
  - `02-engineering-workflow.md`
- `README.md` will act as the navigation page and contain a "I am facing X; which Skill should I use?" table with links to the corresponding sections in the two articles.
- The first article will focus on entry-level understanding and use a personal Todo MVP as the example.
- The second article will focus on engineering workflow and use an existing Todo app gaining tags, filtering, and archiving as the example.
- The tutorial will use short dialogue snippets rather than long transcripts.
- Dialogue snippets will be realistic enough to imitate, but concise enough to keep the article readable.
- The tutorial will distinguish user-invoked Skills from lower-level supporting disciplines.
- The tutorial will explain that `/implement` is the outer execution Skill and `/tdd` is normally used inside implementation where possible.
- The tutorial will cover all installed Matt Pocock Skills either in the main Todo workflow or in short supplemental scenarios.
- Main workflow Skills will receive deeper treatment: `/setup-matt-pocock-skills`, `/grill-me`, `/grill-with-docs`, `/wayfinder`, `/to-spec`, `/to-tickets`, `/implement`, `/tdd`, `/code-review`, and `/handoff`.
- Supporting Skills will receive shorter scene-based explanations: `/ask-matt`, `/triage`, `/diagnosing-bugs`, `/prototype`, `/research`, `/teach`, `/improve-codebase-architecture`, `/codebase-design`, `/resolving-merge-conflicts`, `/writing-great-skills`, `/grilling`, and `/domain-modeling`.
- The tutorial will not create a standalone "common mistakes" section. Misunderstandings will be corrected inside the relevant usage scenes.
- The tutorial should mention `AGENTS.md`, `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and `docs/agents/triage-labels.md` when explaining setup.
- The tutorial should frame `CONTEXT.md` as shared domain vocabulary and ADRs as records for hard-to-reverse, surprising, trade-off decisions.
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
- Creating a website or rendered documentation site.
- Exhaustively reproducing Matt Pocock's videos.
- Providing a complete reference manual for every line of every `SKILL.md`.

## Further Notes

The tutorial should be useful both as the user's personal learning material and as a shareable guide for other developers.

The writing should prioritize imitation and practice. Each Skill should be explained through "when you are in this situation, say this, expect this output, then go here next."

The tutorial should remain faithful to the installed local Skills and to the public framing from AI Hero and `mattpocock/skills`.
