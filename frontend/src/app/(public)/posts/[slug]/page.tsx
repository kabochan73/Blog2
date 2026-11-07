import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { ApiError, publicApiFetch, resolveImageUrl } from "@/lib/api";
import type { ApiCollection, ApiResource, PublicPost } from "@/lib/types";
import { extractHeadings } from "@/lib/markdown";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TableOfContents } from "@/components/TableOfContents";

export async function generateStaticParams() {
  const { data: posts } = await publicApiFetch<ApiCollection<PublicPost>>("/api/posts?per_page=9999");

  return posts.map((post) => ({ slug: post.slug }));
}

async function getPost(slug: string): Promise<PublicPost | null> {
  "use cache";
  cacheLife("max");

  try {
    const { data: post } = await publicApiFetch<ApiResource<PublicPost>>(`/api/posts/${slug}`);
    return post;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-6">
      {post.thumbnail && (
        <img
          src={resolveImageUrl(post.thumbnail)}
          alt=""
          className="aspect-[2/1] w-full rounded-lg object-cover"
        />
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString("ja-JP")}</time>
          {post.tags.length > 0 && (
            <ul className="flex gap-2">
              {post.tags.map((tag) => <li key={tag}>#{tag}</li>)}
            </ul>
          )}
        </div>
      </div>
      <TableOfContents headings={extractHeadings(post.content ?? "")} />
      <MarkdownRenderer content={post.content ?? ""} />
    </article>
  );
}
