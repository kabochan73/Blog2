import PostList from "@/components/admin/PostList";

export default function AdminPostsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-lg font-semibold">公開記事</h1>
      <PostList status="published" />
    </div>
  );
}
