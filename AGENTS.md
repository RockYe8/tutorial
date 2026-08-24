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

For public tutorial chapters, write as finished tutorial prose, not as coaching, planning, or learning-process commentary. Transform the underlying learning method into the chapter's structure and examples; do not expose method labels such as "design problem", "load-bearing node", "core contradiction", "主次分层", or "检索练习" unless the chapter is explicitly about the method itself. Prefer direct conceptual exposition over second-person advice, motivational comparison, or meta-teaching phrases. Avoid formulations like "比直接背语法更稳", "本章会解释", "你会看到", "我们先不讨论"; state the concept, boundary, and consequence directly.

### Teaching method

When the user invokes `/teach` or asks to learn a complex technical topic in this repo, use the Design Intent Tree learning method by default: a problem-oriented method that starts from the system's design problem, teaches load-bearing intent nodes, and back-links practice details to that tree.

For Python and Java learning, use this default strategy unless the user explicitly redirects it: build foundational load-bearing nodes first, while keeping AI customer-service and large-model application development as a later guiding scenario. Do not start by chasing AI frameworks or isolated syntax. Teach the language and engineering foundations deeply enough that later AI application details can be back-linked to the same intent tree.

When designing a Python/Java teaching path, use `docs/research/python-java-design-intent-tree-tutorials-2026-08-19.md` for the official tutorial/source baseline, `docs/research/python-java-foundational-load-bearing-nodes-2026-08-19.md` for the foundational load-bearing node map, and `docs/research/python-java-ai-app-load-bearing-nodes-2026-08-19.md` as the later AI application back-link map.

When the user asks for source-backed "why" explanations about Python language design, object model, runtime model, interpreter layers, or Python/Java/C++ comparisons, use `docs/research/python-language-design-why-learning-resources-2026-08-22.md` as the resource-stack map. Treat it as local research guidance, not public tutorial prose; cite the original sources it points to in published chapters.

For the full methodology, evidence, boundaries, and lesson-shaping guidance, read `.scratch/design-intent-tree-learning-methodology.md` before designing the teaching path.

For Python Design Intent Tree chapters, use `docs/tutorials/python-design-intent-tree/01-running-model-code-blocks-namespaces.md` as the style and structure anchor: start from historical pressure and competing routes, derive Python's mechanism from goal and constraint, then attach examples, implementation details, failure modes, and migration comparison to that argument. Before writing full body prose for a new chapter, draft the complete `## 本章推理总览` first and get user review; after approval, expand each body section from that overview's logic chain. Every knowledge point, example, comparison, source citation, and implementation detail must attach to a specific link in that logic chain; content that cannot attach is moved to a later chapter, rewritten into the overview, or removed. Public chapters live as `docs/tutorials/python-design-intent-tree/NN-*.md`; local teaching state stays in that tutorial's ignored `lessons/`, `reference/`, `assets/`, `NOTES.md`, and `learning-records/`.

Do not teach complex topics as a flat checklist of concepts. Start from the system's design intent: what problem it solves, what constraints it faces, what tradeoffs shaped it, and why each mechanism exists. Teach load-bearing intent nodes first, then connect later details back to those nodes as practice exposes them.

For foundational language tutorials, dig below capabilities into design causality. A mechanism is not sufficiently explained when the chapter only says what it enables. Explain why the language needed that mechanism in its original problem setting, what competing designs could have handled the same pressure, what those alternatives would have optimized for, why this language chose differently, and what costs came with the choice. Keep asking the underlying design questions until the tutorial can connect goal, constraint, mechanism, consequence, and tradeoff in one continuous argument.

When comparing Python, Java, C++, frameworks, databases, or other systems, do not imply that one system uniquely faces a universal problem. State the shared problem first, then distinguish each system by what it makes central and what it pushes to another layer: runtime model, static type system, compiler, linker, VM, object model, package system, storage model, or operational tooling. Treat differences as design choices under constraints, not as isolated feature differences.

For each lesson, prefer this shape: load-bearing intent node, design problem, original motivation, constraints, mechanism, tradeoffs, failure mode, detail back-links, migration comparison, retrieval practice. Keep the Matt Pocock `/teach` workflow intact: mission, trusted resources, short lessons, references, learning records, spacing, interleaving, and feedback loops.
