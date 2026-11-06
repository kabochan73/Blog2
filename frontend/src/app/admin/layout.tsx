"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import AdminNav from "@/components/admin/AdminNav";
import Providers from "@/components/Providers";
import { getToken } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Providers>
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </Providers>
  );
}
