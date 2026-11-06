"use client";

import PostForm, { type PostFormValues } from "@/components/admin/PostForm";
import { useCreatePost } from "@/hooks/admin/useCreatePost";
import { extractErrorMessage } from "@/lib/api";

export default function NewPostPage() {
  const createPost = useCreatePost();

  function handleSubmit(values: PostFormValues) {
    createPost.mutate(values);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">記事の新規作成</h1>
      <PostForm
        submitLabel="作成"
        onSubmit={handleSubmit}
        isSubmitting={createPost.isPending}
        error={createPost.isError ? extractErrorMessage(createPost.error) : null}
      />
    </div>
  );
}
