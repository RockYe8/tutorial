const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_SOURCE_DIR = path.join(
  process.cwd(),
  "docs",
  "tutorials",
  "matt-pocock-skills",
);
const DEFAULT_OUTPUT_DIR = path.join(
  process.cwd(),
  "dist",
  "matt-pocock-skills-html",
);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function markdownFileToHtmlFile(fileName) {
  return fileName.toLowerCase() === "readme.md"
    ? "index.html"
    : fileName.replace(/\.md$/i, ".html");
}

function isManualPage(fileName) {
  return fileName.toLowerCase() === "readme.md" || /^\d{2}-.+\.md$/i.test(fileName);
}

function isPublishableTutorialPage(fileName) {
  return isManualPage(fileName);
}

function rewriteMarkdownLinks(markdown, { exportedMarkdownFiles } = {}) {
  const exportedFiles = exportedMarkdownFiles
    ? new Set([...exportedMarkdownFiles].map((fileName) => fileName.toLowerCase()))
    : null;

  return markdown.replace(
    /(\[[^\]]+\]\()((?![a-z][a-z0-9+.-]*:|#)([^)\s#]+\.md))(#[^)]+)?(\))/gi,
    (_match, before, target, file, anchor = "", after) => {
      const isSameFolderLink = !/[\\/]/.test(file);
      const isExportedFile =
        !exportedFiles || exportedFiles.has(file.toLowerCase());

      if (!isSameFolderLink || !isExportedFile) {
        return `${before}${target}${anchor}${after}`;
      }

      return `${before}${markdownFileToHtmlFile(target)}${anchor}${after}`;
    },
  );
}

function renderInline(markdown) {
  return escapeHtml(markdown)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
      return `<a href="${escapeHtml(href)}">${text}</a>`;
    });
}

function renderTable(rows) {
  const renderedRows = rows.map((row, rowIndex) => {
    const cells = row
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim());
    const tag = rowIndex === 0 ? "th" : "td";
    return `<tr>${cells.map((cell) => `<${tag}>${renderInline(cell)}</${tag}>`).join("")}</tr>`;
  });

  return `<table>\n${renderedRows.join("\n")}\n</table>`;
}

function renderMarkdown(markdown, options = {}) {
  const lines = rewriteMarkdownLinks(markdown, options).split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = [];
  let table = [];
  let inCodeFence = false;
  let codeFenceLanguage = "";
  let codeLines = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length === 0) return;
    html.push(`<ul>\n${list.map((item) => `<li>${renderInline(item)}</li>`).join("\n")}\n</ul>`);
    list = [];
  };
  const flushTable = () => {
    if (table.length === 0) return;
    html.push(renderTable(table));
    table = [];
  };
  const flushBlocks = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (const line of lines) {
    const codeFence = line.match(/^```(\S*)/);
    if (codeFence) {
      if (inCodeFence) {
        html.push(
          `<pre><code${codeFenceLanguage ? ` class="language-${escapeHtml(codeFenceLanguage)}"` : ""}>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
        );
        inCodeFence = false;
        codeFenceLanguage = "";
        codeLines = [];
      } else {
        flushBlocks();
        inCodeFence = true;
        codeFenceLanguage = codeFence[1] || "";
      }
      continue;
    }

    if (inCodeFence) {
      codeLines.push(line);
      continue;
    }

    const rawAnchor = line.match(/^<a\s+id="([^"]+)"><\/a>\s*$/i);
    if (rawAnchor) {
      flushBlocks();
      html.push(`<span id="${escapeHtml(rawAnchor[1])}"></span>`);
      continue;
    }

    if (!line.trim()) {
      flushBlocks();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushBlocks();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text);
      html.push(`<h${level} id="${escapeHtml(id)}">${renderInline(text)}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^\s*[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      flushTable();
      list.push(listItem[1]);
      continue;
    }

    if (/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)) {
      continue;
    }

    if (/^\s*\|.+\|\s*$/.test(line)) {
      flushParagraph();
      flushList();
      table.push(line);
      continue;
    }

    flushList();
    flushTable();
    paragraph.push(line.trim());
  }

  flushBlocks();
  return html.join("\n");
}

function pageHtml({ title, body }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main>
${body}
  </main>
</body>
</html>
`;
}

async function exportTutorialHtml({
  sourceDir = DEFAULT_SOURCE_DIR,
  outputDir = DEFAULT_OUTPUT_DIR,
  manualPagesOnly = false,
} = {}) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .filter((fileName) => !manualPagesOnly || isManualPage(fileName))
    .sort((a, b) => {
      if (a.toLowerCase() === "readme.md") return -1;
      if (b.toLowerCase() === "readme.md") return 1;
      return a.localeCompare(b);
    });

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  for (const fileName of markdownFiles) {
    const markdown = await fs.readFile(path.join(sourceDir, fileName), "utf8");
    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fileName;
    const html = pageHtml({
      title,
      body: renderMarkdown(markdown, { exportedMarkdownFiles: markdownFiles }),
    });
    await fs.writeFile(
      path.join(outputDir, markdownFileToHtmlFile(fileName)),
      html,
      "utf8",
    );
  }

  await fs.writeFile(path.join(outputDir, "styles.css"), stylesheet(), "utf8");
  return { outputDir, files: markdownFiles.map(markdownFileToHtmlFile) };
}

async function readMarkdownTitle(filePath, fallback) {
  const markdown = await fs.readFile(filePath, "utf8");
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback;
}

function tutorialSlugsFromRootReadme(readme) {
  return tutorialEntriesFromRootReadme(readme).map((entry) => entry.slug);
}

function tutorialEntriesFromRootReadme(readme) {
  const slugs = [];
  const seen = new Set();
  let currentHeading = "";

  for (const line of readme.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      currentHeading = heading[1].trim();
      continue;
    }

    const link = line.match(/\]\(docs\/tutorials\/([^/)]+)\/README\.md(?:#[^)]+)?\)/i);
    if (link) {
      const slug = link[1];
      if (!seen.has(slug)) {
        seen.add(slug);
        slugs.push({ slug, title: currentHeading || slug });
      }
    }
  }

  return slugs;
}

async function tutorialDirectories(tutorialsRoot) {
  const entries = await fs.readdir(tutorialsRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function publishablePagesForTutorial(tutorialDir) {
  const entries = await fs.readdir(tutorialDir, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .filter(isPublishableTutorialPage)
    .sort((a, b) => {
      if (a.toLowerCase() === "readme.md") return -1;
      if (b.toLowerCase() === "readme.md") return 1;
      return a.localeCompare(b);
    });

  const pages = [];
  for (const fileName of markdownFiles) {
    pages.push({
      markdownFile: fileName,
      htmlFile: markdownFileToHtmlFile(fileName),
      title: await readMarkdownTitle(path.join(tutorialDir, fileName), fileName),
    });
  }

  return pages;
}

async function exportAllTutorialsHtml({
  repoRoot = process.cwd(),
  tutorialsRoot = path.join(repoRoot, "docs", "tutorials"),
  outputDir = path.join(repoRoot, "dist", "tutorials-html"),
} = {}) {
  const rootReadmePath = path.join(repoRoot, "README.md");
  const rootReadme = await fs.readFile(rootReadmePath, "utf8").catch(() => "");
  const readmeEntries = tutorialEntriesFromRootReadme(rootReadme);
  const readmeOrder = readmeEntries.map((entry) => entry.slug);
  const readmeTitlesBySlug = new Map(
    readmeEntries.map((entry) => [entry.slug, entry.title]),
  );
  const directorySlugs = await tutorialDirectories(tutorialsRoot);
  const directorySet = new Set(directorySlugs);
  const orderedSlugs = [
    ...readmeOrder.filter((slug) => directorySet.has(slug)),
    ...directorySlugs.filter((slug) => !readmeOrder.includes(slug)),
  ];

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  const tutorials = [];
  for (const slug of orderedSlugs) {
    const sourceDir = path.join(tutorialsRoot, slug);
    const tutorialOutputDir = path.join(outputDir, slug);
    const pages = await publishablePagesForTutorial(sourceDir);
    if (pages.length === 0) continue;

    await exportTutorialHtml({
      sourceDir,
      outputDir: tutorialOutputDir,
      manualPagesOnly: true,
    });

    tutorials.push({
      slug,
      title: readmeTitlesBySlug.get(slug) ?? pages[0].title,
      pages,
    });
  }

  const body = [
    '<h1 id="tutorial">Tutorial</h1>',
    ...tutorials.flatMap((tutorial) => [
      `<h2 id="${escapeHtml(slugify(tutorial.title))}">${renderInline(tutorial.title)}</h2>`,
      "<ul>",
      ...tutorial.pages.map((page) => {
        const label =
          page.htmlFile === "index.html" ? "教程首页" : page.title;
        return `<li><a href="${escapeHtml(`${tutorial.slug}/${page.htmlFile}`)}">${renderInline(label)}</a></li>`;
      }),
      "</ul>",
    ]),
  ].join("\n");

  await fs.writeFile(
    path.join(outputDir, "index.html"),
    pageHtml({ title: "Tutorial", body }),
    "utf8",
  );
  await fs.writeFile(path.join(outputDir, "styles.css"), stylesheet(), "utf8");

  return { outputDir, tutorials };
}

function stylesheet() {
  return `:root {
  color-scheme: light;
  font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.65;
  color: #232323;
  background: #f7f7f4;
}

body {
  margin: 0;
}

main {
  box-sizing: border-box;
  width: min(920px, 100%);
  margin: 0 auto;
  padding: 40px 24px 72px;
  background: #ffffff;
  min-height: 100vh;
}

a {
  color: #0f5e8c;
}

pre {
  overflow-x: auto;
  padding: 16px;
  background: #202124;
  color: #f4f4f4;
}

code {
  font-family: Consolas, "SFMono-Regular", monospace;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th,
td {
  border: 1px solid #d8d8d2;
  padding: 8px 10px;
  vertical-align: top;
}

blockquote {
  margin-left: 0;
  padding-left: 16px;
  border-left: 4px solid #d8d8d2;
  color: #555;
}
`;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--source-dir") {
      options.sourceDir = path.resolve(args[index + 1]);
      index += 1;
    } else if (arg === "--output-dir") {
      options.outputDir = path.resolve(args[index + 1]);
      index += 1;
    } else if (arg === "--manual-pages-only") {
      options.manualPagesOnly = true;
    }
  }

  exportTutorialHtml(options)
    .then(({ outputDir, files }) => {
      console.log(`Exported ${files.length} tutorial pages to ${outputDir}`);
      console.log(`Open ${path.join(outputDir, "index.html")} in a browser.`);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = {
  exportAllTutorialsHtml,
  exportTutorialHtml,
  isPublishableTutorialPage,
  rewriteMarkdownLinks,
  renderMarkdown,
  isManualPage,
  tutorialEntriesFromRootReadme,
  tutorialSlugsFromRootReadme,
};
