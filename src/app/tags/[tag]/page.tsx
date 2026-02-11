import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/post";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.tag }));
}

export default function TagDetailPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">#{tag}</h1>

      <ul className="mt-8 space-y-4">
        {posts.map((p) => (
          <li key={p.url} className="rounded-xl border p-4 hover:bg-muted/40">
            <Link href={p.url} className="block">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <span className="text-xs text-muted-foreground">{p.date}</span>
              </div>
              {p.description ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {p.description}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
