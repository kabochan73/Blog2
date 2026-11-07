import { notFound } from "next/navigation";
import { publicApiFetch } from "@/lib/api";
import type { PaginatedCollection, PublicPost } from "@/lib/types";
import { PostList } from "@/components/PostList";

export async function generateStaticParams() {
  const { meta } = await publicApiFetch<PaginatedCollection<PublicPost>>("/api/posts");

  return Array.from({ length: meta.last_page }, (_, i) => ({ n: String(i + 1) }));
}

export default async function PostsPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const page = Number(n);

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  return <PostList page={page} />;
}
