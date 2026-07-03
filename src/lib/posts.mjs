import { getCollection } from "astro:content";

import { sortPostsNewest } from "./content.mjs";

export async function getPublishedEntries() {
  return await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
}

export function entryToPost(entry) {
  return {
    slug: entry.id,
    title: entry.data.title,
    date: entry.data.date,
    tags: entry.data.tags ?? [],
    excerpt: entry.data.excerpt ?? "",
    body: entry.body ?? "",
    url: `/posts/${entry.id}/`,
  };
}

export async function getPublishedPosts() {
  const entries = await getPublishedEntries();
  return sortPostsNewest(entries.map(entryToPost));
}
