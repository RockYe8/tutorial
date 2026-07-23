const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const HOOKS_PATH = ".githooks";
const POST_COMMIT_HOOK = path.join(HOOKS_PATH, "post-commit");
const EXECUTABLE_MODE_BITS = 0o111;

function hookExecutableWarning(hookPath = POST_COMMIT_HOOK) {
  return `If the post-commit reminder does not run on your system, run: chmod +x ${hookPath.replaceAll("\\", "/")}`;
}

function ensureHookExecutable(hookPath = POST_COMMIT_HOOK) {
  const currentMode = fs.statSync(hookPath).mode;
  fs.chmodSync(hookPath, currentMode | EXECUTABLE_MODE_BITS);
}

function installTutorialHtmlReminder({
  hooksPath = HOOKS_PATH,
  hookPath = POST_COMMIT_HOOK,
  stdout = console.log,
  stderr = console.warn,
} = {}) {
  execFileSync("git", ["config", "core.hooksPath", hooksPath], {
    stdio: "inherit",
  });

  try {
    ensureHookExecutable(hookPath);
    stdout(`Configured Git hooks path: ${hooksPath}`);
    stdout(`Ensured executable hook: ${hookPath}`);
  } catch (error) {
    stderr(`Configured Git hooks path: ${hooksPath}`);
    stderr(`Could not update executable bit for ${hookPath}: ${error.message}`);
    stderr(hookExecutableWarning(hookPath));
  }
}

if (require.main === module) {
  installTutorialHtmlReminder();
}

module.exports = {
  ensureHookExecutable,
  hookExecutableWarning,
  installTutorialHtmlReminder,
};
