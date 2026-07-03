# Minimal Nested Tags Blog

A tiny Astro blog using Markdown posts, date archives, nested tags, and local search.

## Write a Post

Add a Markdown file under `src/content/posts`:

```md
---
title: "Post Title"
date: 2026-07-02
tags:
  - tech/ai/agent
  - writing/blog
excerpt: "One short summary."
---

Post body.
```

`tech/ai/agent` is reachable from `tech`, `tech/ai`, and `tech/ai/agent`.

## Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

For Cloudflare Pages, use:

```text
Build command: pnpm build
Output directory: dist
```
