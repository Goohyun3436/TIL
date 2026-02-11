import Link from "next/link";
import { getAllTags } from "@/lib/post";

export const dynamic = "error";
export const revalidate = false;

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Tags</h1>

      <ul className="mt-8 flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t.tag}>
            <Link
              className="rounded-full border px-3 py-1 text-sm hover:bg-muted/40"
              href={`/tags/${encodeURIComponent(t.tag)}`}
            >
              #{t.tag}{" "}
              <span className="text-muted-foreground">({t.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
