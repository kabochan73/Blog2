"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

const LINKS = [
  { href: "/admin/posts", label: "記事" },
  { href: "/admin/drafts", label: "下書き" },
  { href: "/admin/tags", label: "タグ" },
];

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    const token = getToken();
    try {
      await apiFetch("/api/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch {
      // token already invalid/expired — clear locally and move on regardless
    }
    clearToken();
    router.push("/login");
  }

  return (
    <nav className="w-48 shrink-0 border-r border-gray-200 p-4">
      <ul className="space-y-2 text-sm">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleLogout} className="mt-6 text-sm text-gray-500">
        ログアウト
      </button>
    </nav>
  );
}
