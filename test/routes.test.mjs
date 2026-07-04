import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("non-post browsing pages are not exposed as routes", () => {
  assert.equal(existsSync("src/pages/tags"), false);
  assert.equal(existsSync("src/pages/archive.astro"), false);
});

test("home page exposes a small resume button", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(homePage.includes('class="resume-link"'), true);
  assert.equal(homePage.includes('href="/resume/"'), true);
  assert.equal(homePage.includes("resume"), true);
  assert.equal(homePage.includes('class="shell-hints"'), false);
  assert.equal(homePage.includes('</p>\n\n    <p class="help-hint"'), true);
  assert.equal(homePage.indexOf('class="terminal-output"') < homePage.indexOf('class="resume-link"'), true);
  assert.equal(homePage.indexOf('class="resume-link"') < homePage.indexOf("type `help` to list commands"), true);
  assert.equal(styles.includes(".shell-hints"), false);
  assert.equal(styles.includes("grid-template-rows: auto minmax(0, 1fr) auto auto auto"), true);
  assert.equal(styles.includes(".resume-link"), true);
  assert.equal(styles.includes("color: var(--accent)"), true);
  assert.equal(styles.includes("font-size: 1.1rem"), true);
  assert.equal(styles.includes("font-weight: 700"), true);
  assert.equal(styles.includes("text-align: center"), true);
  assert.equal(styles.includes("margin: 0 0 48px"), true);
  assert.equal(styles.includes("transform: translateY(-48px)"), false);
  assert.equal(styles.includes("transform: translateY(-6px)"), false);
});

test("home shell opens resume by command", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");

  assert.equal(homePage.includes('["resume", "open the resume page"]'), true);
  assert.equal(homePage.includes('name.toLowerCase() === "open" && arg.toLowerCase() === "resume"'), true);
  assert.equal(homePage.includes('window.location.href = "/resume/"'), true);
});

test("resume page has a blog return button and shell quit command", () => {
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(resumePage.includes('class="resume-link resume-return"'), true);
  assert.equal(resumePage.includes('href="/"'), true);
  assert.equal(resumePage.includes("← blog"), true);
  assert.equal(resumePage.includes("~/blog $ open resume"), false);
  assert.equal(resumePage.includes("~/blog/resume.md $"), true);
  assert.equal(resumePage.includes("~/blog/resume.md >"), false);
  assert.equal(resumePage.includes("<h2>教育经历</h2>"), true);
  assert.equal(resumePage.includes("<h2>项目</h2>"), true);
  assert.equal(resumePage.includes('data-resume-command-form'), true);
  assert.equal(resumePage.includes('data-resume-command-input'), true);
  assert.equal(resumePage.includes('setInputMode("insert")'), true);
  assert.equal(resumePage.includes("updateCursorView();\n    resumeFrame.focus();"), false);
  assert.equal(resumePage.includes('command === ":q"'), true);
  assert.equal(resumePage.includes("window.location.href = \"/\""), true);
  assert.equal(styles.includes(".resume-return"), true);
});

test("post pages render tags as text only", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(postPage.includes("/tags/"), false);
  assert.equal(postPage.includes('class="tag"'), true);
});

test("post pages expose a bottom shell with vim-style navigation", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(postPage.includes('class="reader-layout"'), true);
  assert.equal(postPage.includes('class="reader-frame"'), true);
  assert.equal(postPage.includes("data-reader-frame"), true);
  assert.equal(postPage.includes("data-post-command-form"), true);
  assert.equal(postPage.includes("data-post-command-input"), true);
  assert.equal(postPage.includes("data-post-prompt"), true);
  assert.equal(postPage.includes("~/blog/posts/{post.id}.md $"), true);
  assert.equal(postPage.includes("~/blog/posts/{post.id}.md >"), false);
  assert.equal(postPage.includes("post-command"), true);
  assert.equal(postPage.includes("reader-hint"), false);
  assert.equal(postPage.includes('command === ":q"'), true);
  assert.equal(postPage.includes('event.key === "j"'), true);
  assert.equal(postPage.includes('event.key === "k"'), true);
  assert.equal(postPage.includes('event.key === "g"'), true);
  assert.equal(postPage.includes('event.key === "G"'), true);
});

test("post reader keeps content in an independent block above the shell", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(postPage.includes("readerFrame"), true);
  assert.equal(postPage.includes("readerFrame.scrollBy"), true);
  assert.equal(postPage.includes("readerFrame.scrollTo"), true);
  assert.equal(styles.includes(".reader-layout"), true);
  assert.equal(styles.includes(".reader-frame"), true);
  assert.equal(styles.includes("grid-template-rows: minmax(0, 1fr) auto"), true);
  assert.equal(styles.includes(".post-command"), true);
  assert.equal(styles.includes("position: fixed"), false);
}
);

test("home shell supports normal and insert keyboard modes", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

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
  assert.equal(homePage.includes('event.key === "0"'), true);
  assert.equal(homePage.includes('event.key === "$"'), true);
  assert.equal(homePage.includes('event.ctrlKey && event.key === "j"'), true);
  assert.equal(homePage.includes('event.ctrlKey && event.key === "k"'), true);
  assert.equal(homePage.includes("vim keys:"), true);
  assert.equal(homePage.includes("i/a              enter insert mode"), true);
  assert.equal(homePage.includes("Esc              return to normal mode"), true);
  assert.equal(homePage.includes("0/$              move to line start or end"), true);
  assert.equal(homePage.includes("v                start visual selection"), true);
  assert.equal(homePage.includes("y/c/d            copy, change, or delete selection"), true);
  assert.equal(homePage.includes('"vim-help"'), true);
  assert.equal(homePage.includes('"vim-help vim-help-title"'), true);
  assert.equal(styles.includes(".terminal-line.vim-help"), true);
  assert.equal(styles.includes("font-size: 0.82rem"), true);
  assert.equal(styles.includes("margin-bottom: 1px"), true);
});

test("home shell no longer exposes archive command", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");

  assert.equal(homePage.includes('groupPostsByMonth'), false);
  assert.equal(homePage.includes('["archive", "show posts grouped by month"]'), false);
  assert.equal(homePage.includes('case "archive"'), false);
  assert.equal(homePage.includes("function printArchive()"), false);
});

test("home page starts with centered pixel mark and shell hint above input", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(homePage.includes('data-home-stage'), true);
  assert.equal(homePage.includes('aria-label="Hungerbar"'), true);
  assert.equal(homePage.includes('data-help-hint'), true);
  assert.equal(homePage.includes("type `help` to list commands"), true);
  assert.equal(homePage.includes("use `a` or `i` to enter insert mode"), true);
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

test("home terminal output scrolls without pushing the bottom shell", () => {
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(styles.includes(".terminal {\n  position: relative;\n  display: grid;"), true);
  assert.equal(styles.includes("overflow: hidden;"), true);
  assert.equal(styles.includes(".terminal-output {\n  min-height: 0;\n  height: 100%;\n  max-height: 100%;"), true);
  assert.equal(styles.includes("padding: 10px 18px 30px"), true);
  assert.equal(styles.includes("overflow-y: auto"), true);
  assert.equal(styles.includes("overscroll-behavior: contain"), true);
  assert.equal(styles.includes("scrollbar-gutter: stable"), true);
}
);

test("home default affordances collapse after commands and return on clear", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");

  assert.equal(homePage.includes("dismissHomeStage"), true);
  assert.equal(homePage.includes("restoreHomeStage"), true);
  assert.equal(homePage.includes("data-home-actions"), true);
  assert.equal(homePage.includes('const homeActions = document.querySelector("[data-home-actions]")'), true);
  assert.equal(homePage.includes("homeStage.hidden = true"), true);
  assert.equal(homePage.includes("homeStage.hidden = false"), true);
  assert.equal(homePage.includes("homeActions.hidden = true"), true);
  assert.equal(homePage.includes("homeActions.hidden = false"), true);
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

test("upper content links can be opened with Enter in normal mode", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(homePage.includes("activateFocusedLink"), true);
  assert.equal(postPage.includes("activateFocusedLink"), true);
  assert.equal(homePage.includes('event.key === "Enter"'), true);
  assert.equal(postPage.includes('event.key === "Enter"'), true);
  assert.equal(homePage.includes('focusPane !== "output"'), true);
  assert.equal(postPage.includes('focusPane !== "output"'), true);
  assert.equal(homePage.includes('querySelector("a[href]")'), true);
  assert.equal(postPage.includes('querySelector("a[href]")'), true);
  assert.equal(homePage.includes("saveShellState()"), true);
  assert.equal(postPage.includes("window.location.href = link.href"), true);
});

test("home shell supports visual selection, copy, change, and delete commands", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(homePage.includes("startVisualSelection"), true);
  assert.equal(homePage.includes("clearVisualSelection"), true);
  assert.equal(homePage.includes("copyVisualSelection"), true);
  assert.equal(homePage.includes("changeVisualSelection"), true);
  assert.equal(homePage.includes("deleteVisualSelection"), true);
  assert.equal(homePage.includes("extendVisualSelection"), true);
  assert.equal(homePage.includes('event.key === "v"'), true);
  assert.equal(homePage.includes('event.key === "y"'), true);
  assert.equal(homePage.includes('event.key === "c"'), true);
  assert.equal(homePage.includes('event.key === "d"'), true);
  assert.equal(homePage.includes('["h", "j", "k", "l", "0", "$"].includes(event.key)'), true);
  assert.equal(homePage.includes("navigator.clipboard.writeText"), true);
  assert.equal(homePage.includes("document.createRange"), true);
  assert.equal(homePage.includes("window.getSelection"), true);
  assert.equal(styles.includes(".visual-selection"), true);
  assert.equal(styles.includes('body[data-input-mode="visual"]'), true);
});

test("post shell supports normal and insert keyboard modes", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(postPage.includes("setInputMode"), true);
  assert.equal(postPage.includes('setInputMode("insert")'), true);
  assert.equal(postPage.includes('setInputMode("normal");\n    focusOutput();'), false);
  assert.equal(postPage.includes('event.key === "Escape"'), true);
  assert.equal(postPage.includes('event.key === "i"'), true);
  assert.equal(postPage.includes('event.key === "a"'), true);
  assert.equal(postPage.includes('event.key === "h"'), true);
  assert.equal(postPage.includes('event.key === "l"'), true);
  assert.equal(postPage.includes('event.ctrlKey && event.key === "j"'), true);
  assert.equal(postPage.includes('event.ctrlKey && event.key === "k"'), true);
});

test("shell prompts expose vim mode status", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes('class="mode-indicator"'), true);
    assert.equal(page.includes("data-mode-indicator"), true);
    assert.equal(page.includes("updateModeIndicator"), true);
    assert.equal(page.includes("modeIndicator.textContent"), true);
  }
  assert.equal(homePage.includes("[INSERT]"), true);
  assert.equal(postPage.includes("[INSERT]"), true);
  assert.equal(resumePage.includes("[INSERT]"), true);
  assert.equal(styles.includes(".mode-indicator"), true);
});

test("shell insert mode recovers focus when i is pressed outside input", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes('inputMode === "insert" && document.activeElement !== input'), true);
    assert.equal(page.includes("focusInput({ append: false })"), true);
  }
});

test("typing i or a in input normal mode enters insert without typing the trigger key", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");
  const iBranchPattern =
    /if \(event\.key === "i"\) \{\s+if \(focusPane === "input" && document\.activeElement === input\) \{\s+event\.preventDefault\(\);\s+event\.stopPropagation\(\);\s+focusInput\(\{ append: false \}\);/;
  const aBranchPattern =
    /if \(event\.key === "a"\) \{\s+event\.preventDefault\(\);\s+event\.stopPropagation\(\);\s+moveCursor\(1\);\s+focusInput\(\{ append: false \}\);/;

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes('focusPane === "input" && document.activeElement === input'), true);
    assert.equal(iBranchPattern.test(page), true);
    assert.equal(aBranchPattern.test(page), true);
    assert.equal(page.includes("function insertInputText(text)"), false);
    assert.equal(page.includes("insertInputText(event.key)"), false);
  }
});

test("insert mode preserves command cursor unless append is explicitly requested", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes("const selectionStart = input.selectionStart ?? input.value.length"), true);
    assert.equal(page.includes("const selectionEnd = input.selectionEnd ?? selectionStart"), true);
    assert.equal(page.includes("input.setSelectionRange(selectionStart, selectionEnd)"), true);
  }
});

test("leaving insert mode places the normal command cursor like vim", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes("const previousMode = inputMode"), true);
    assert.equal(page.includes('if (nextMode === "normal" && previousMode === "insert" && input.value.length > 0)'), true);
    assert.equal(page.includes("const normalPosition = Math.max(0, Math.min(input.value.length - 1, selectionStart - 1))"), true);
    assert.equal(page.includes("input.setSelectionRange(normalPosition, normalPosition)"), true);
  }
});

test("post reader supports visual selection and copying from content", () => {
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");

  assert.equal(postPage.includes("startVisualSelection"), true);
  assert.equal(postPage.includes("clearVisualSelection"), true);
  assert.equal(postPage.includes("copyVisualSelection"), true);
  assert.equal(postPage.includes("extendVisualSelection"), true);
  assert.equal(postPage.includes('event.key === "v"'), true);
  assert.equal(postPage.includes('event.key === "y"'), true);
  assert.equal(postPage.includes('event.key === "c"'), true);
  assert.equal(postPage.includes('event.key === "d"'), true);
  assert.equal(postPage.includes('["h", "j", "k", "l", "0", "$"].includes(event.key)'), true);
  assert.equal(postPage.includes("navigator.clipboard.writeText"), true);
  assert.equal(postPage.includes("document.createRange"), true);
  assert.equal(postPage.includes("window.getSelection"), true);
});

test("normal and visual modes support vim line start and end keys", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes("function moveCursorToColumn(column)"), true);
    assert.equal(page.includes("moveCursorToColumn(0)"), true);
    assert.equal(page.includes("moveCursorToColumn(input.value.length - 1)"), true);
  }

  for (const page of [homePage, postPage]) {
    assert.equal(page.includes("function moveOutputCursorColumnTo(column)"), true);
    assert.equal(page.includes("moveOutputCursorColumnTo(0)"), true);
    assert.equal(page.includes("moveOutputCursorColumnTo(getTextLength(target) - 1)"), true);
    assert.equal(page.includes('if (key === "0" || key === "$")'), true);
    assert.equal(page.includes('visualFocus.column = key === "0"'), true);
  }
});

test("styles expose block cursor in normal mode and wider reading surface", () => {
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(styles.includes("--content-width"), true);
  assert.equal(styles.includes(".cursor-cell"), true);
  assert.equal(styles.includes('body[data-input-mode="normal"] .normal-command-view'), true);
  assert.equal(styles.includes("min-width: 0.72em"), true);
  assert.equal(styles.includes("width: auto"), true);
  assert.equal(styles.includes("outline-offset: 8px"), true);
  assert.equal(styles.includes("padding: 10px 18px 30px"), true);
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
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes("input.readOnly = nextMode !== \"insert\""), true);
    assert.equal(page.includes("input.blur()"), false);
    assert.equal(page.includes("updateCursorView"), true);
  }

  for (const page of [homePage, postPage]) {
    assert.equal(page.includes("input.readOnly = true"), true);
  }
});

test("normal and visual modes suppress unhandled printable input", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const resumePage = readFileSync("src/pages/resume.astro", "utf8");

  for (const page of [homePage, postPage, resumePage]) {
    assert.equal(page.includes("function suppressPrintableNormalInput(event)"), true);
    assert.equal(page.includes("event.key.length === 1"), true);
    assert.equal(page.includes("!event.metaKey && !event.altKey && !event.ctrlKey"), true);
    assert.equal(page.includes("suppressPrintableNormalInput(event);"), true);
    assert.equal(page.includes('input.addEventListener("beforeinput", preventInputEditOutsideInsert)'), true);
    assert.equal(page.includes("function preventInputEditOutsideInsert(event)"), true);
    assert.equal(page.includes('if (inputMode !== "insert")'), true);
  }

  for (const page of [homePage, postPage]) {
    assert.equal(page.includes("if (inputMode === \"visual\")"), true);
    assert.equal(page.includes("suppressPrintableNormalInput(event);\n        return;\n      }\n\n      if (event.key === \"v\")"), true);
  }
});

test("focus ring is transient on output and shell focus changes", () => {
  const homePage = readFileSync("src/pages/index.astro", "utf8");
  const postPage = readFileSync("src/pages/posts/[slug].astro", "utf8");
  const styles = readFileSync("src/styles/global.css", "utf8");

  assert.equal(homePage.includes("flashFocusRing"), true);
  assert.equal(postPage.includes("flashFocusRing"), true);
  assert.equal(homePage.includes("}, 700);"), true);
  assert.equal(postPage.includes("}, 700);"), true);
  assert.equal(styles.includes(".focus-ring"), true);
  assert.equal(styles.includes(".article.focus-ring"), true);
  assert.equal(styles.includes("outline-offset: 14px"), true);
  assert.equal(styles.includes("box-shadow: 0 0 0 6px var(--bg)"), true);
  assert.equal(styles.includes("padding: 22px 18px 14px"), true);
  assert.equal(styles.includes("padding: 34px 18px 64px"), true);
  assert.equal(homePage.includes("function focusInput(options = {})"), true);
  assert.equal(postPage.includes("function focusInput(options = {})"), true);
  assert.equal(homePage.includes('setInputMode("insert", options)'), true);
  assert.equal(postPage.includes('setInputMode("insert", options)'), true);
  assert.equal(homePage.includes('focusInput({ append: false })'), true);
  assert.equal(postPage.includes('focusInput({ append: false })'), true);
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
