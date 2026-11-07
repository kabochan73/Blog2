"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import TagPicker from "@/components/admin/TagPicker";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const postFormSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  slug: z
    .string()
    .min(1, "スラッグを入力してください")
    .regex(/^[a-z0-9-]+$/, "半角英数字とハイフンのみ使用できます"),
  status: z.enum(["draft", "published"]),
  tags: z.array(z.string()),
  excerpt: z.string(),
  thumbnail: z.string(),
  content: z.string().min(1, "本文を入力してください"),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

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
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PostFormValues>({
    defaultValues: initialValues ?? EMPTY_VALUES,
    resolver: zodResolver(postFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="slug" className="block text-sm font-medium">
          スラッグ
        </label>
        <input
          id="slug"
          type="text"
          {...register("slug")}
          onChange={(event) => setValue("slug", normalizeSlug(event.target.value), { shouldValidate: true })}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
      </div>

      <div className="space-y-1">
        <span className="block text-sm font-medium">ステータス</span>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" value="draft" {...register("status")} />
            下書き
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" value="published" {...register("status")} />
            公開
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-sm font-medium">タグ</span>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => <TagPicker value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="thumbnail" className="block text-sm font-medium">
          サムネイル画像URL（任意）
        </label>
        <input
          id="thumbnail"
          type="text"
          {...register("thumbnail")}
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
          {...register("excerpt")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1" data-color-mode="light">
        <span className="block text-sm font-medium">本文</span>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={(value) => field.onChange(value ?? "")} height={400} />
          )}
        />
        {errors.content && <p className="text-xs text-red-600">{errors.content.message}</p>}
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
