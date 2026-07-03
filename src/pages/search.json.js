import { formatDate } from "../lib/content.mjs";
import { getPublishedPosts } from "../lib/posts.mjs";

export async function GET() {
  const posts = await getPublishedPosts();

  return new Response(
    JSON.stringify(
      posts.map((post) => ({
        title: post.title,
        date: formatDate(post.date),
        tags: post.tags,
        excerpt: post.excerpt,
        url: post.url,
      })),
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    },
  );
}
