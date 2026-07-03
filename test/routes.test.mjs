import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("non-post browsing pages are not exposed as routes", () => {
  assert.equal(existsSync("src/pages/tags"), false);
  assert.equal(existsSync("src/pages/archive.astro"), false);
});

test("post pages render tags as text only", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(postPage.includes("/tags/"), false);
  assert.equal(postPage.includes('class="tag"'), true);
});

test("post pages expose a bottom shell with vim-style navigation", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(postPage.includes("data-post-command-form"), true);
  assert.equal(postPage.includes("data-post-command-input"), true);
  assert.equal(postPage.includes("data-post-prompt"), true);
  assert.equal(postPage.includes("~/blog/posts/{post.id}.md >"), true);
  assert.equal(postPage.includes("post-command"), true);
  assert.equal(postPage.includes(":q to shell"), true);
  assert.equal(postPage.includes('command === ":q"'), true);
  assert.equal(postPage.includes('event.key === "j"'), true);
  assert.equal(postPage.includes('event.key === "k"'), true);
  assert.equal(postPage.includes('event.key === "g"'), true);
  assert.equal(postPage.includes('event.key === "G"'), true);
});

test("home shell supports normal and insert keyboard modes", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");

  assert.equal(homePage.includes("setInputMode"), true);
  assert.equal(
    homePage.includes("Run recent, search, or tag first to choose a numbered result."),
    true,
  );
  assert.equal(homePage.includes('event.key === "Escape"'), true);
  assert.equal(homePage.includes('event.key === "i"'), true);
  assert.equal(homePage.includes('event.key === "a"'), true);
  assert.equal(homePage.includes('event.key === "h"'), true);
  assert.equal(homePage.includes('event.key === "l"'), true);
  assert.equal(homePage.includes('event.ctrlKey && event.key === "j"'), true);
  assert.equal(homePage.includes('event.ctrlKey && event.key === "k"'), true);
});

test("home page starts with centered pixel mark and shell hint above input", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(homePage.includes('data-home-stage'), true);
  assert.equal(homePage.includes('aria-label="Hungerbar"'), true);
  assert.equal(homePage.includes('data-help-hint'), true);
  assert.equal(homePage.includes("type `help` to list commands"), true);
  assert.equal(homePage.includes('<div class="terminal-output" data-output tabindex="0"></div>'), true);
  assert.equal(homePage.includes("█"), true);
  assert.equal(homePage.includes("#   #"), false);
  assert.equal(styles.includes(".home-stage"), true);
  assert.equal(styles.includes(".pixel-logo"), true);
  assert.equal(styles.includes(".help-hint"), true);
  assert.equal(styles.includes("grid-template-rows: auto minmax(0, 1fr) auto auto"), true);
  assert.equal(styles.includes("transform: translateY(144px) rotate(-4deg)"), true);
  assert.equal(styles.includes("font-size: clamp(0.72rem, 1.8vw, 1.35rem)"), true);
});

test("home pixel mark collapses after commands and returns on clear", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");

  assert.equal(homePage.includes("dismissHomeStage"), true);
  assert.equal(homePage.includes("restoreHomeStage"), true);
  assert.equal(homePage.includes("homeStage.hidden = true"), true);
  assert.equal(homePage.includes("homeStage.hidden = false"), true);
});

test("home post links and open command share navigation while preserving shell state", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");

  assert.equal(homePage.includes("SHELL_STATE_KEY"), true);
  assert.equal(homePage.includes("sessionStorage.setItem"), true);
  assert.equal(homePage.includes("sessionStorage.getItem"), true);
  assert.equal(homePage.includes("saveShellState"), true);
  assert.equal(homePage.includes("restoreShellState"), true);
  assert.equal(homePage.includes("navigateToPost"), true);
  assert.equal(homePage.includes("handlePostLinkClick"), true);
  assert.equal(homePage.includes('output.addEventListener("click", handlePostLinkClick)'), true);
  assert.equal(homePage.includes("window.location.href = post.url"), true);
  assert.equal(homePage.includes("latestResults = state.resultSlugs"), true);
});

test("post shell supports normal and insert keyboard modes", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(postPage.includes("setInputMode"), true);
  assert.equal(postPage.includes('event.key === "Escape"'), true);
  assert.equal(postPage.includes('event.key === "i"'), true);
  assert.equal(postPage.includes('event.key === "a"'), true);
  assert.equal(postPage.includes('event.key === "h"'), true);
  assert.equal(postPage.includes('event.key === "l"'), true);
  assert.equal(postPage.includes('event.ctrlKey && event.key === "j"'), true);
  assert.equal(postPage.includes('event.ctrlKey && event.key === "k"'), true);
});

test("styles expose block cursor in normal mode and wider reading surface", () => {
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(styles.includes("--content-width"), true);
  assert.equal(styles.includes(".cursor-cell"), true);
  assert.equal(styles.includes('body[data-input-mode="normal"] .normal-command-view'), true);
  assert.equal(styles.includes("min-width: 0.72em"), true);
  assert.equal(styles.includes("width: auto"), true);
  assert.equal(styles.includes("outline-offset: 8px"), true);
  assert.equal(styles.includes("padding-bottom: 24px"), true);
});

test("styles use monochrome differentiation only", () => {
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(styles.includes("#007acc"), false);
  assert.equal(styles.includes("#49d6b5"), false);
  assert.equal(styles.includes("#8bdc7c"), false);
  assert.equal(styles.includes("font-style: italic"), true);
  assert.equal(styles.includes("font-weight: 700"), true);
});

test("normal mode keeps command inputs focusable for cursor movement", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(homePage.includes("input.readOnly"), false);
  assert.equal(postPage.includes("input.readOnly"), false);
  assert.equal(homePage.includes("input.blur()"), false);
  assert.equal(postPage.includes("input.blur()"), false);
  assert.equal(homePage.includes("updateCursorView"), true);
  assert.equal(postPage.includes("updateCursorView"), true);
});

test("focus ring is transient on output and shell focus changes", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(homePage.includes("flashFocusRing"), true);
  assert.equal(postPage.includes("flashFocusRing"), true);
  assert.equal(homePage.includes("setTimeout"), true);
  assert.equal(postPage.includes("setTimeout"), true);
  assert.equal(styles.includes(".focus-ring"), true);
  assert.equal(styles.includes(".article.focus-ring"), true);
  assert.equal(homePage.includes("function focusInput(options = {})"), true);
  assert.equal(postPage.includes("function focusInput(options = {})"), true);
  assert.equal(homePage.includes('setInputMode("insert", options)'), true);
  assert.equal(postPage.includes('setInputMode("insert", options)'), true);
  assert.equal(homePage.includes('focusInput({ append: false })'), true);
  assert.equal(homePage.includes('focusInput({ append: true })'), true);
  assert.equal(postPage.includes('focusInput({ append: false })'), true);
  assert.equal(postPage.includes('focusInput({ append: true })'), true);
});

test("upper content keeps a block cursor when focused in normal mode", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(homePage.includes("focusPane"), true);
  assert.equal(postPage.includes("focusPane"), true);
  assert.equal(homePage.includes("setOutputCursor"), true);
  assert.equal(postPage.includes("setOutputCursor"), true);
  assert.equal(homePage.includes("moveOutputCursor"), true);
  assert.equal(postPage.includes("moveOutputCursor"), true);
  assert.equal(homePage.includes("moveOutputCursorColumn"), true);
  assert.equal(postPage.includes("moveOutputCursorColumn"), true);
  assert.equal(homePage.includes("renderTextNodeCursor"), true);
  assert.equal(postPage.includes("renderTextNodeCursor"), true);
  assert.equal(homePage.includes("createTreeWalker"), true);
  assert.equal(postPage.includes("createTreeWalker"), true);
  assert.equal(homePage.includes("renderCommandCursor"), true);
  assert.equal(postPage.includes("renderCommandCursor"), true);
  assert.equal(styles.includes(".view-cursor-cell"), true);
  assert.equal(styles.includes('body[data-focus-pane="output"] .normal-command-view'), true);
}
);
