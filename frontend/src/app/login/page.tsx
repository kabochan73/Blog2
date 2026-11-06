"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError, apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import type { LoginResponse } from "@/lib/types";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  async function onSubmit(values: LoginFormValues) {
    setError(null);

    try {
      const { token } = await apiFetch<LoginResponse>("/api/login", {
        method: "POST",
        body: values,
      });
      setToken(token);
      router.push("/admin/posts");
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 422)) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        setError("ログインに失敗しました。しばらくしてから再度お試しください");
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 p-6"
      >
        <h1 className="text-lg font-semibold">ログイン</h1>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm">
            メールアドレス
          </label>
          <input
            id="email"
            type="text"
            autoComplete="username"
            {...register("email", {
              required: "メールアドレスを入力してください",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "メールアドレスの形式が正しくありません" },
            })}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "パスワードを入力してください" })}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </main>
  );
}
