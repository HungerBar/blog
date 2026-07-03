import assert from "node:assert/strict";
import test from "node:test";

import {
  buildTagTree,
  expandTagPath,
  filterPostsByTime,
  flattenTagTree,
  getPostsForTag,
  getRecentPosts,
  groupPostsByMonth,
  searchPosts,
} from "../src/lib/content.mjs";

const posts = [
  {
    slug: "agent-notes",
    title: "Agent Notes",
    date: new Date("2026-07-02T00:00:00.000Z"),
    tags: ["tech/ai/agent", "writing/blog"],
    excerpt: "Notes about building a tiny blog with agents.",
  },
  {
    slug: "astro-setup",
    title: "Astro Setup",
    date: new Date("2026-06-20T00:00:00.000Z"),
    tags: ["tech/web/astro"],
    excerpt: "Static site setup notes.",
  },
  {
    slug: "reading",
    title: "Reading Log",
    date: new Date("2026-07-01T00:00:00.000Z"),
    tags: ["life/reading"],
    excerpt: "A quiet reading note.",
  },
];

test("expandTagPath returns every nested parent path", () => {
  assert.deepEqual(expandTagPath(" tech / ai / agent "), [
    "tech",
    "tech/ai",
    "tech/ai/agent",
  ]);
});

test("getPostsForTag includes descendant tags and sorts newest first", () => {
  assert.deepEqual(
    getPostsForTag(posts, "tech").map((post) => post.slug),
    ["agent-notes", "astro-setup"],
  );

  assert.deepEqual(
    getPostsForTag(posts, "tech/ai").map((post) => post.slug),
    ["agent-notes"],
  );
});

test("buildTagTree creates nested nodes with descendant counts", () => {
  const tree = buildTagTree(posts);
  const tech = tree.find((node) => node.path === "tech");

  assert.equal(tech.count, 2);
  assert.deepEqual(
    tech.children.map((node) => [node.path, node.count]),
    [
      ["tech/ai", 1],
      ["tech/web", 1],
    ],
  );
});

test("flattenTagTree keeps nested order and exposes depth", () => {
  assert.deepEqual(
    flattenTagTree(buildTagTree(posts)).map((node) => [
      node.path,
      node.depth,
    ]),
    [
      ["life", 0],
      ["life/reading", 1],
      ["tech", 0],
      ["tech/ai", 1],
      ["tech/ai/agent", 2],
      ["tech/web", 1],
      ["tech/web/astro", 2],
      ["writing", 0],
      ["writing/blog", 1],
    ],
  );
});

test("groupPostsByMonth groups posts by month newest first", () => {
  assert.deepEqual(
    groupPostsByMonth(posts).map((group) => ({
      key: group.key,
      slugs: group.posts.map((post) => post.slug),
    })),
    [
      { key: "2026-07", slugs: ["agent-notes", "reading"] },
      { key: "2026-06", slugs: ["astro-setup"] },
    ],
  );
});

test("searchPosts matches title, excerpt, tags, and date tokens", () => {
  assert.deepEqual(searchPosts(posts, "agent").map((post) => post.slug), [
    "agent-notes",
  ]);
  assert.deepEqual(searchPosts(posts, "reading").map((post) => post.slug), [
    "reading",
  ]);
  assert.deepEqual(searchPosts(posts, "2026-06").map((post) => post.slug), [
    "astro-setup",
  ]);
});

test("searchPosts supports fuzzy subsequence matching", () => {
  assert.deepEqual(searchPosts(posts, "agt nts").map((post) => post.slug), [
    "agent-notes",
  ]);
  assert.deepEqual(searchPosts(posts, "tch ai").map((post) => post.slug), [
    "agent-notes",
  ]);
});

test("getRecentPosts returns the latest N posts", () => {
  assert.deepEqual(getRecentPosts(posts, 2).map((post) => post.slug), [
    "agent-notes",
    "reading",
  ]);
});

test("filterPostsByTime supports compact date queries with latest year and month defaults", () => {
  assert.deepEqual(filterPostsByTime(posts, "2026").map((post) => post.slug), [
    "agent-notes",
    "reading",
    "astro-setup",
  ]);
  assert.deepEqual(filterPostsByTime(posts, "2026-07").map((post) => post.slug), [
    "agent-notes",
    "reading",
  ]);
  assert.deepEqual(filterPostsByTime(posts, "07-01").map((post) => post.slug), [
    "reading",
  ]);
  assert.deepEqual(filterPostsByTime(posts, "02").map((post) => post.slug), [
    "agent-notes",
  ]);
  assert.deepEqual(filterPostsByTime(posts, "06月").map((post) => post.slug), [
    "astro-setup",
  ]);
});
