import Link from "next/link";
import { pageHref } from "@/lib/pagination";

export function Pagination({ currentPage, lastPage }: { currentPage: number; lastPage: number }) {
  if (lastPage <= 1) {
    return null;
  }

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < lastPage ? currentPage + 1 : null;

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 pt-6">
      {prevPage ? (
        <Link href={pageHref(prevPage)} className="hover:underline">
          ← 前のページ
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-gray-500">
        {currentPage} / {lastPage}
      </span>
      {nextPage ? (
        <Link href={pageHref(nextPage)} className="hover:underline">
          次のページ →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
