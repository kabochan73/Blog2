"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

const NAV_LINKS = [
  {
    href: "/admin/posts",
    label: "Articles",
    isActive: (path: string) => path.startsWith("/admin/posts") || path.startsWith("/admin/drafts"),
  },
  {
    href: "/admin/tags",
    label: "Tags",
    isActive: (path: string) => path.startsWith("/admin/tags"),
  },
];

const ARTICLE_TABS = [
  { href: "/admin/posts", label: "公開記事" },
  { href: "/admin/drafts", label: "下書き" },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const showArticleTabs = pathname.startsWith("/admin/posts") || pathname.startsWith("/admin/drafts");

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
    <header className="border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        <nav className="flex gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.isActive(pathname) ? "font-semibold text-gray-900" : "text-gray-500"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="text-sm text-gray-500">
          Logout
        </button>
      </div>

      {showArticleTabs && (
        <div className="flex gap-4 border-t border-gray-100 px-6 py-2 text-sm">
          {ARTICLE_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={pathname === tab.href ? "font-semibold text-gray-900" : "text-gray-500"}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
