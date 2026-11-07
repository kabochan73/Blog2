import { publicApiFetch } from "@/lib/api";
import type { ApiCollection, PublicTag } from "@/lib/types";
import { PostList } from "@/components/PostList";

export async function generateStaticParams() {
  const { data: tags } = await publicApiFetch<ApiCollection<PublicTag>>("/api/tags");

  return tags.map((tag) => ({ tag: tag.name }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;

  return <PostList page={1} tag={tag} />;
}
