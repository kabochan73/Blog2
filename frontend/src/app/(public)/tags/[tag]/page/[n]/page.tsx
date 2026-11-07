import { notFound } from "next/navigation";
import { publicApiFetch } from "@/lib/api";
import type { ApiCollection, PaginatedCollection, PublicPost, PublicTag } from "@/lib/types";
import { PostList } from "@/components/PostList";

export async function generateStaticParams() {
  const { data: tags } = await publicApiFetch<ApiCollection<PublicTag>>("/api/tags");

  const params = await Promise.all(
    tags.map(async (tag) => {
      const { meta } = await publicApiFetch<PaginatedCollection<PublicPost>>(
        `/api/posts?tag=${encodeURIComponent(tag.name)}`
      );

      return Array.from({ length: meta.last_page }, (_, i) => ({ tag: tag.name, n: String(i + 1) }));
    })
  );

  return params.flat();
}

export default async function TagPostsPage({ params }: { params: Promise<{ tag: string; n: string }> }) {
  const { tag, n } = await params;
  const page = Number(n);

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  return <PostList page={page} tag={tag} />;
}
