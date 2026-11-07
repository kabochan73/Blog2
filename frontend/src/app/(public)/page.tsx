import { cacheLife } from "next/cache";
import { publicApiFetch } from "@/lib/api";
import type { ApiCollection, PublicPost } from "@/lib/types";
import { PostCard } from "@/components/PostCard";

export default async function HomePage() {
  "use cache";
  cacheLife("max");

  const { data: posts } = await publicApiFetch<ApiCollection<PublicPost>>("/api/posts");

  return (
    <div className="flex flex-col gap-10">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
