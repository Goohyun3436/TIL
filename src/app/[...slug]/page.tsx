import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { MdxComponents } from "@/components/mdx";
import { getAllPostSlugs, getPostSourceBySlug } from "@/lib/post";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getPostSourceBySlug(slug);

    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
          <div className="mt-2 text-sm text-muted-foreground">
            <span>{frontmatter.date}</span>
            {(frontmatter.tags?.length ?? 0) > 0 ? (
              <span className="ml-3">
                {frontmatter.tags!.map((t) => (
                  <span key={t} className="mr-2">
                    #{t}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
          {frontmatter.description ? (
            <p className="mt-4 text-muted-foreground">
              {frontmatter.description}
            </p>
          ) : null}
        </header>

        <article className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:underline">
          <MDXRemote
            source={content}
            components={MdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkBreaks],
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: {
                        dark: "github-dark-dimmed",
                        light: "github-light",
                      },
                    },
                  ],
                  rehypeSlug,
                ],
              },
            }}
          />
        </article>
      </main>
    );
  } catch {
    return notFound();
  }
}
