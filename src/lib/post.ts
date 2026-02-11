import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description?: string;
  date: string; // "YYYY-MM-DD" 권장
  tags?: string[];
  thumbnail?: string;
};

export type PostIndexItem = PostFrontmatter & {
  slug: string[]; // ["cs", "what-is-http"]
  url: string; // "/cs/what-is-http"
};

const POSTS_DIR = path.join(process.cwd(), "src", "posts");

function walkMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkMdxFiles(full));
    else if (e.isFile() && full.endsWith(".mdx")) files.push(full);
  }
  return files;
}

function filePathToSlugParts(filePath: string): string[] {
  const rel = path.relative(POSTS_DIR, filePath); // e.g. "cs/what-is-http.mdx"
  return rel
    .replace(/\.mdx$/, "")
    .split(path.sep)
    .filter(Boolean);
}

function toTime(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function getAllPostsIndex(): PostIndexItem[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = walkMdxFiles(POSTS_DIR);

  const items = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);
    const fm = data as Partial<PostFrontmatter>;

    const slug = filePathToSlugParts(file);
    return {
      title: fm.title ?? slug[slug.length - 1] ?? "Untitled",
      description: fm.description ?? "",
      date: fm.date ?? "1970-01-01",
      tags: fm.tags ?? [],
      thumbnail: fm.thumbnail,
      slug,
      url: `/${slug.join("/")}`,
    };
  });

  items.sort((a, b) => toTime(b.date) - toTime(a.date));
  return items;
}

export function getAllPostSlugs(): string[][] {
  return getAllPostsIndex().map((p) => p.slug);
}

export function getPostSourceBySlug(slugParts: string[]) {
  const filePath = path.join(POSTS_DIR, ...slugParts) + ".mdx";
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPostsIndex()) {
    for (const t of p.tags ?? []) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): PostIndexItem[] {
  return getAllPostsIndex().filter((p) => (p.tags ?? []).includes(tag));
}
