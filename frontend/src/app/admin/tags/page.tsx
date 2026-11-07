"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useTagsAdmin } from "@/hooks/admin/tags/useTagsAdmin";
import { extractErrorMessage } from "@/lib/api";
import type { Tag } from "@/lib/types";

type TagNameFormValues = {
  name: string;
};

function TagEditForm({
  tag,
  onSave,
  onCancel,
  isPending,
  error,
}: {
  tag: Tag;
  onSave: (name: string) => void;
  onCancel: () => void;
  isPending: boolean;
  error: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagNameFormValues>({ defaultValues: { name: tag.name } });

  function onSubmit(values: TagNameFormValues) {
    onSave(values.name.trim());
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 items-center gap-2">
      <input
        type="text"
        {...register("name", { required: "タグ名を入力してください" })}
        className="flex-1 rounded border border-gray-300 px-2 py-1"
      />
      <button type="submit" disabled={isPending} className="text-gray-900">
        保存
      </button>
      <button type="button" onClick={onCancel} className="text-gray-500">
        キャンセル
      </button>
      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}

export default function AdminTagsPage() {
  const { tagsQuery, createTag, updateTag, deleteTag } = useTagsAdmin();
  const [editingId, setEditingId] = useState<number | null>(null);
  const createForm = useForm<TagNameFormValues>();

  function onCreate(values: TagNameFormValues) {
    createTag.mutate(values.name.trim(), { onSuccess: () => createForm.reset() });
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">タグ管理</h1>

      <form onSubmit={createForm.handleSubmit(onCreate)} className="flex gap-2">
        <input
          type="text"
          {...createForm.register("name", { required: "タグ名を入力してください" })}
          placeholder="新しいタグ名"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={createTag.isPending}
          className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          追加
        </button>
      </form>
      {createForm.formState.errors.name && (
        <p className="text-sm text-red-600">{createForm.formState.errors.name.message}</p>
      )}
      {createTag.isError && <p className="text-sm text-red-600">{extractErrorMessage(createTag.error)}</p>}

      {tagsQuery.isLoading && <p className="text-sm text-gray-500">読み込み中...</p>}
      {tagsQuery.isError && <p className="text-sm text-red-600">タグの取得に失敗しました</p>}

      <ul className="divide-y divide-gray-200">
        {tagsQuery.data?.data.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between py-2 text-sm">
            {editingId === tag.id ? (
              <TagEditForm
                tag={tag}
                onCancel={() => setEditingId(null)}
                isPending={updateTag.isPending}
                error={updateTag.isError ? extractErrorMessage(updateTag.error) : null}
                onSave={(name) => updateTag.mutate({ id: tag.id, name }, { onSuccess: () => setEditingId(null) })}
              />
            ) : (
              <>
                <span>
                  {tag.name} <span className="text-gray-400">({tag.count})</span>
                </span>
                <span className="flex gap-3">
                  <button type="button" onClick={() => setEditingId(tag.id)} className="text-gray-500">
                    編集
                  </button>
                  <button type="button" onClick={() => deleteTag.mutate(tag.id)} className="text-red-600">
                    削除
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
