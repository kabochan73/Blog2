"use client";

import { use } from "react";

import PostForm, { type PostFormValues } from "@/components/admin/PostForm";
import { useDeletePost } from "@/hooks/admin/useDeletePost";
import { usePostAdmin } from "@/hooks/admin/usePostAdmin";
import { useUpdatePost } from "@/hooks/admin/useUpdatePost";
import { extractErrorMessage } from "@/lib/api";

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const postQuery = usePostAdmin(slug);
  const updatePost = useUpdatePost(slug);
  const deletePost = useDeletePost();

  function handleSubmit(values: PostFormValues) {
    updatePost.mutate(values);
  }

  function handleDelete() {
    if (!window.confirm("この記事を削除しますか？")) {
      return;
    }
    deletePost.mutate(slug);
  }

  if (postQuery.isLoading) {
    return <p className="text-sm text-gray-500">読み込み中...</p>;
  }

  if (postQuery.isError || !postQuery.data) {
    return <p className="text-sm text-red-600">記事の取得に失敗しました</p>;
  }

  const post = postQuery.data.data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">記事の編集</h1>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deletePost.isPending}
          className="text-sm text-red-600"
        >
          削除
        </button>
      </div>
      <PostForm
        initialValues={{
          title: post.title,
          slug: post.slug,
          status: post.status,
          tags: post.tags,
          excerpt: post.excerpt ?? "",
          thumbnail: post.thumbnail ?? "",
          content: post.content,
        }}
        submitLabel="保存"
        onSubmit={handleSubmit}
        isSubmitting={updatePost.isPending}
        error={updatePost.isError ? extractErrorMessage(updatePost.error) : null}
      />
    </div>
  );
}
