import Link from "next/link";
import type { ReactNode } from "react";
import { TagList } from "@/components/TagList";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col px-4">
      <header className="border-b border-gray-200 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          LOGBOOK.
        </Link>
      </header>
      <TagList />
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
