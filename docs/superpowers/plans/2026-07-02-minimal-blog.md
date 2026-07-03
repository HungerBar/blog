# Minimal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal Astro blog with Markdown posts, local search, date archive, and nested tag navigation.

**Architecture:** Markdown posts live in Astro content collections. Shared content helpers normalize tags, build archives, and produce search data; Astro pages render the minimal UI from those helpers.

**Tech Stack:** Astro, Markdown, Node's built-in test runner, plain CSS, small browser-side JavaScript for search.

## Global Constraints

- Keep the UI extremely simple.
- Classify posts by date and nested tags only.
- A tag such as `技术/AI/Agent` must be reachable from `技术`, `技术/AI`, and `技术/AI/Agent`.
- Search must work without a backend.

---

### Task 1: Content Helpers

**Files:**
- Create: `test/content.test.mjs`
- Create: `src/lib/content.mjs`

**Interfaces:**
- Produces: `expandTagPath(tag: string): string[]`
- Produces: `buildTagTree(posts: Post[]): TagNode[]`
- Produces: `getPostsForTag(posts: Post[], tagPath: string): Post[]`
- Produces: `groupPostsByMonth(posts: Post[]): ArchiveMonth[]`
- Produces: `searchPosts(posts: Post[], query: string): Post[]`

- [x] **Step 1: Write failing tests**
- [x] **Step 2: Run tests and verify they fail because implementation is missing**
- [ ] **Step 3: Implement content helpers**
- [ ] **Step 4: Run tests and verify they pass**

### Task 2: Astro Blog Shell

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `src/content.config.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/global.css`
- Create: `src/content/posts/*.md`

**Interfaces:**
- Consumes: content collection named `posts`
- Produces: shared minimal layout and sample content

- [ ] **Step 1: Add Astro project configuration**
- [ ] **Step 2: Add content schema and sample posts**
- [ ] **Step 3: Add base layout and global styles**

### Task 3: Blog Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/archive.astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[...tag].astro`
- Create: `src/pages/posts/[slug].astro`
- Create: `src/pages/search.json.js`

**Interfaces:**
- Consumes: content helpers from `src/lib/content.mjs`
- Produces: home, archive, nested tags, post detail, and search index pages

- [ ] **Step 1: Add home page with local search**
- [ ] **Step 2: Add archive page**
- [ ] **Step 3: Add tag tree and tag detail pages**
- [ ] **Step 4: Add post detail page and JSON search index**

### Task 4: Verification

**Files:**
- Modify: project as needed

- [ ] **Step 1: Install dependencies**
- [ ] **Step 2: Run `pnpm test`**
- [ ] **Step 3: Run `pnpm build`**
- [ ] **Step 4: Start local dev server**
