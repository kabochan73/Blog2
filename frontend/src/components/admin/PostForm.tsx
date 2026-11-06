"use client";

import dynamic from "next/dynamic";
import { type FormEvent, useState } from "react";

import TagPicker from "@/components/admin/TagPicker";
import type { PostStatus } from "@/lib/types";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export type PostFormValues = {
  title: string;
  slug: string;
  status: PostStatus;
  tags: string[];
  excerpt: string;
  thumbnail: string;
  content: string;
};

const EMPTY_VALUES: PostFormValues = {
  title: "",
  slug: "",
  status: "draft",
  tags: [],
  excerpt: "",
  thumbnail: "",
  content: "",
};

function normalizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[\s_]+/g, "-");
}

type PostFormProps = {
  initialValues?: PostFormValues;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => void;
  isSubmitting?: boolean;
  error?: string | null;
};

export default function PostForm({ initialValues, submitLabel, onSubmit, isSubmitting, error }: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>(initialValues ?? EMPTY_VALUES);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          required
          value={values.title}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="slug" className="block text-sm font-medium">
          スラッグ
        </label>
        <input
          id="slug"
          type="text"
          required
          pattern="^[a-z0-9-]+$"
          value={values.slug}
          onChange={(event) => setValues({ ...values, slug: normalizeSlug(event.target.value) })}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="block text-sm font-medium">ステータス</span>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="status"
              checked={values.status === "draft"}
              onChange={() => setValues({ ...values, status: "draft" })}
            />
            下書き
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="status"
              checked={values.status === "published"}
              onChange={() => setValues({ ...values, status: "published" })}
            />
            公開
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-sm font-medium">タグ</span>
        <TagPicker value={values.tags} onChange={(tags) => setValues({ ...values, tags })} />
      </div>

      <div className="space-y-1">
        <label htmlFor="thumbnail" className="block text-sm font-medium">
          サムネイル画像URL（任意）
        </label>
        <input
          id="thumbnail"
          type="text"
          value={values.thumbnail}
          onChange={(event) => setValues({ ...values, thumbnail: event.target.value })}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="excerpt" className="block text-sm font-medium">
          概要（任意）
        </label>
        <textarea
          id="excerpt"
          rows={2}
          value={values.excerpt}
          onChange={(event) => setValues({ ...values, excerpt: event.target.value })}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1" data-color-mode="light">
        <span className="block text-sm font-medium">本文</span>
        <MDEditor
          value={values.content}
          onChange={(value) => setValues({ ...values, content: value ?? "" })}
          height={400}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
