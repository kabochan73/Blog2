import { cacheLife } from "next/cache";
import Link from "next/link";
import { publicApiFetch } from "@/lib/api";
import type { ApiCollection, PublicTag } from "@/lib/types";

export async function TagList() {
  "use cache";
  cacheLife("max");

  const { data: tags } = await publicApiFetch<ApiCollection<PublicTag>>("/api/tags");

  if (tags.length === 0) {
    return null;
  }

  return (
    <nav className="flex flex-wrap gap-x-4 gap-y-1 border-b border-gray-200 py-4 text-sm">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/tags/${tag.name}`}
          prefetch
          className="text-gray-600 hover:text-gray-950 hover:underline"
        >
          #{tag.name}（{tag.count}）
        </Link>
      ))}
    </nav>
  );
}
