## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

This repo uses the default five triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain docs layout. See `docs/agents/domain.md`.

### Tutorial writing guidelines

Tutorial content in this repo should follow the global writing guidelines in `docs/agents/tutorial-writing-guidelines.md`.

For the Agent Skill Engineering Handbook and related tutorial artifacts, key claims should use clickable Markdown reference links in the body and collect full source links in a chapter-level `Sources` section. Prefer official or primary sources, and label multi-source methodology as tutorial synthesis rather than vendor-standard terminology.

### Teaching method

When the user invokes `/teach` or asks to learn a complex technical topic in this repo, use the Design Intent Tree learning method by default: a problem-oriented method that starts from the system's design problem, teaches load-bearing intent nodes, and back-links practice details to that tree.

For Python and Java learning, use this default strategy unless the user explicitly redirects it: build foundational load-bearing nodes first, while keeping AI customer-service and large-model application development as a later guiding scenario. Do not start by chasing AI frameworks or isolated syntax. Teach the language and engineering foundations deeply enough that later AI application details can be back-linked to the same intent tree.

When designing a Python/Java teaching path, use `docs/research/python-java-design-intent-tree-tutorials-2026-08-19.md` for the official tutorial/source baseline, `docs/research/python-java-foundational-load-bearing-nodes-2026-08-19.md` for the foundational load-bearing node map, and `docs/research/python-java-ai-app-load-bearing-nodes-2026-08-19.md` as the later AI application back-link map.

For the full methodology, evidence, boundaries, and lesson-shaping guidance, read `.scratch/design-intent-tree-learning-methodology.md` before designing the teaching path.

Do not teach complex topics as a flat checklist of concepts. Start from the system's design intent: what problem it solves, what constraints it faces, what tradeoffs shaped it, and why each mechanism exists. Teach load-bearing intent nodes first, then connect later details back to those nodes as practice exposes them.

For each lesson, prefer this shape: load-bearing intent node, design problem, original motivation, constraints, mechanism, tradeoffs, failure mode, detail back-links, migration comparison, retrieval practice. Keep the Matt Pocock `/teach` workflow intact: mission, trusted resources, short lessons, references, learning records, spacing, interleaving, and feedback loops.
