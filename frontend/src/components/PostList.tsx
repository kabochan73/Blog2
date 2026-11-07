import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { publicApiFetch } from "@/lib/api";
import type { PaginatedCollection, PublicPost } from "@/lib/types";
import { PostCard } from "./PostCard";
import { Pagination } from "./Pagination";

export async function PostList({ page }: { page: number }) {
  "use cache";
  cacheLife("max");

  const { data: posts, meta } = await publicApiFetch<PaginatedCollection<PublicPost>>(`/api/posts?page=${page}`);

  if (page > meta.last_page) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      <Pagination currentPage={meta.current_page} lastPage={meta.last_page} />
    </div>
  );
}
