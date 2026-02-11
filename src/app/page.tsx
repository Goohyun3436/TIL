import Link from "next/link";
import { getAllPostsIndex } from "@/lib/post";

export const dynamic = "error";
export const revalidate = false;

export default function Home() {
  const posts = getAllPostsIndex();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold">GooNote</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          TIL / 회고 / CS 정리
        </p>

        <div className="mt-6 flex gap-3">
          <Link className="underline" href="/tags">
            Tags
          </Link>
        </div>
      </header>

      <ul className="mt-10 space-y-4">
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
              {(p.tags?.length ?? 0) > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags!.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
