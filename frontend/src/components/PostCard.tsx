import Link from "next/link";
import { resolveImageUrl } from "@/lib/api";
import type { PublicPost } from "@/lib/types";

export function PostCard({ post }: { post: PublicPost }) {
  return (
    <article className="flex flex-col gap-3">
      <Link href={`/posts/${post.slug}`} className="flex flex-col gap-3">
        {post.thumbnail && (
          <img
            src={resolveImageUrl(post.thumbnail)}
            alt=""
            className="aspect-[2/1] w-full rounded-lg object-cover"
          />
        )}
        <h2 className="text-xl font-semibold tracking-tight">{post.title}</h2>
      </Link>
      {post.excerpt && <p className="text-gray-600">{post.excerpt}</p>}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString("ja-JP")}</time>
        {post.tags.length > 0 && (
          <ul className="flex gap-2">
            {post.tags.map((tag) => <li key={tag}>#{tag}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}
