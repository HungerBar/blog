export function normalizeTagPath(tag) {
  return String(tag ?? "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/");
}

export function expandTagPath(tag) {
  const parts = normalizeTagPath(tag).split("/").filter(Boolean);

  return parts.map((_, index) => parts.slice(0, index + 1).join("/"));
}

export function sortPostsNewest(posts) {
  return [...posts].sort((a, b) => getTime(b.date) - getTime(a.date));
}

export function getRecentPosts(posts, count = 10) {
  const limit = Number.isFinite(Number(count)) ? Number(count) : 10;
  return sortPostsNewest(posts).slice(0, Math.max(1, limit));
}

export function getPostsForTag(posts, tagPath) {
  const target = normalizeTagPath(tagPath);

  return sortPostsNewest(
    posts.filter((post) =>
      (post.tags ?? []).some((tag) => expandTagPath(tag).includes(target)),
    ),
  );
}

export function buildTagTree(posts) {
  const root = new Map();
  const countsByPath = new Map();

  for (const post of posts) {
    const pathsForPost = new Set((post.tags ?? []).flatMap(expandTagPath));

    for (const path of pathsForPost) {
      countsByPath.set(path, (countsByPath.get(path) ?? 0) + 1);
      addPath(root, path);
    }
  }

  return mapToNodes(root, countsByPath);
}

export function flattenTagTree(nodes, depth = 0) {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flattenTagTree(node.children, depth + 1),
  ]);
}

export function groupPostsByMonth(posts) {
  const groups = new Map();

  for (const post of sortPostsNewest(posts)) {
    const date = toDate(post.date);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        year,
        month,
        label: `${year}-${month}`,
        posts: [],
      });
    }

    groups.get(key).posts.push(post);
  }

  return [...groups.values()];
}

export function searchPosts(posts, query) {
  const tokens = String(query ?? "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return sortPostsNewest(posts);
  }

  return posts
    .map((post) => ({ post, score: scorePost(post, tokens) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return getTime(b.post.date) - getTime(a.post.date);
    })
    .map((result) => result.post);
}

export function filterPostsByTime(posts, query) {
  const range = parseTimeQuery(posts, query);

  if (!range) {
    return [];
  }

  return sortPostsNewest(
    posts.filter((post) => {
      const date = formatDate(post.date);
      if (range.day) {
        return date === `${range.year}-${range.month}-${range.day}`;
      }
      if (range.month) {
        return date.startsWith(`${range.year}-${range.month}`);
      }
      return date.startsWith(range.year);
    }),
  );
}

export function formatDate(date) {
  return toDate(date).toISOString().slice(0, 10);
}

export function parseTimeQuery(posts, query) {
  const value = String(query ?? "").trim().toLowerCase();
  if (!value) {
    return null;
  }

  const latest = sortPostsNewest(posts)[0];
  if (!latest) {
    return null;
  }

  const [latestYear, latestMonth] = formatDate(latest.date).split("-");
  const normalized = value
    .replace(/[./]/g, "-")
    .replace(/年/g, "-")
    .replace(/月/g, "月")
    .replace(/日/g, "日");

  const monthMatch = normalized.match(/^(\d{1,2})月$/);
  if (monthMatch) {
    return {
      year: latestYear,
      month: pad2(monthMatch[1]),
    };
  }

  const dayMatch = normalized.match(/^(\d{1,2})日$/);
  if (dayMatch) {
    return {
      year: latestYear,
      month: latestMonth,
      day: pad2(dayMatch[1]),
    };
  }

  if (/^\d{4}$/.test(normalized)) {
    return { year: normalized };
  }

  if (/^\d{1,2}$/.test(normalized)) {
    return {
      year: latestYear,
      month: latestMonth,
      day: pad2(normalized),
    };
  }

  const parts = normalized.split("-").filter(Boolean);

  if (parts.length === 2 && parts[0].length === 4) {
    return {
      year: parts[0],
      month: pad2(parts[1]),
    };
  }

  if (parts.length === 2) {
    return {
      year: latestYear,
      month: pad2(parts[0]),
      day: pad2(parts[1]),
    };
  }

  if (parts.length === 3) {
    return {
      year: parts[0],
      month: pad2(parts[1]),
      day: pad2(parts[2]),
    };
  }

  return null;
}

function addPath(root, path) {
  const parts = path.split("/");
  let current = root;

  for (let index = 0; index < parts.length; index += 1) {
    const name = parts[index];
    const currentPath = parts.slice(0, index + 1).join("/");

    if (!current.has(name)) {
      current.set(name, { name, path: currentPath, children: new Map() });
    }

    current = current.get(name).children;
  }
}

function mapToNodes(map, countsByPath) {
  return [...map.values()]
    .sort((a, b) => a.path.localeCompare(b.path, "zh-Hans-CN"))
    .map((node) => ({
      name: node.name,
      path: node.path,
      count: countsByPath.get(node.path) ?? 0,
      children: mapToNodes(node.children, countsByPath),
    }));
}

function getTime(value) {
  return toDate(value).getTime();
}

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function scorePost(post, tokens) {
  const fields = [
    post.title,
    post.excerpt,
    formatDate(post.date),
    ...(post.tags ?? []),
  ].map((field) => String(field ?? "").toLowerCase());

  let score = 0;

  for (const token of tokens) {
    const tokenScore = Math.max(
      ...fields.map((field) => scoreField(field, token)),
    );

    if (tokenScore === 0) {
      return 0;
    }

    score += tokenScore;
  }

  return score;
}

function scoreField(value, query) {
  if (value.includes(query)) {
    return 100 + query.length;
  }

  if (query.length < 3) {
    return 0;
  }

  let queryIndex = 0;
  let firstMatch = -1;
  let lastMatch = -1;

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === query[queryIndex]) {
      if (firstMatch === -1) {
        firstMatch = index;
      }
      lastMatch = index;
      queryIndex += 1;
    }

    if (queryIndex === query.length) {
      const span = lastMatch - firstMatch + 1;
      return Math.max(1, 80 - span + query.length);
    }
  }

  return 0;
}
