"use client";

import { type FormEvent, useState } from "react";

import { ApiError } from "@/lib/api";
import type { Tag } from "@/lib/types";

import { useTagsAdmin } from "./useTagsAdmin";

function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.body && typeof err.body === "object" && "message" in err.body) {
    return String((err.body as { message: unknown }).message);
  }
  return "エラーが発生しました";
}

export default function AdminTagsPage() {
  const { tagsQuery, createTag, updateTag, deleteTag } = useTagsAdmin();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newName.trim()) return;
    createTag.mutate(newName.trim(), { onSuccess: () => setNewName("") });
  }

  function startEditing(tag: Tag) {
    setEditingId(tag.id);
    setEditingName(tag.name);
  }

  function handleUpdate(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    if (!editingName.trim()) return;
    updateTag.mutate({ id, name: editingName.trim() }, { onSuccess: () => setEditingId(null) });
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">タグ管理</h1>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
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
      {createTag.isError && <p className="text-sm text-red-600">{extractErrorMessage(createTag.error)}</p>}

      {tagsQuery.isLoading && <p className="text-sm text-gray-500">読み込み中...</p>}
      {tagsQuery.isError && <p className="text-sm text-red-600">タグの取得に失敗しました</p>}

      <ul className="divide-y divide-gray-200">
        {tagsQuery.data?.data.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between py-2 text-sm">
            {editingId === tag.id ? (
              <form onSubmit={(event) => handleUpdate(event, tag.id)} className="flex flex-1 items-center gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  className="flex-1 rounded border border-gray-300 px-2 py-1"
                />
                <button type="submit" disabled={updateTag.isPending} className="text-gray-900">
                  保存
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="text-gray-500">
                  キャンセル
                </button>
                {updateTag.isError && (
                  <p className="text-xs text-red-600">{extractErrorMessage(updateTag.error)}</p>
                )}
              </form>
            ) : (
              <>
                <span>
                  {tag.name} <span className="text-gray-400">({tag.count})</span>
                </span>
                <span className="flex gap-3">
                  <button type="button" onClick={() => startEditing(tag)} className="text-gray-500">
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTag.mutate(tag.id)}
                    className="text-red-600"
                  >
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
