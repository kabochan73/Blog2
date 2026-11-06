"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import AdminHeader from "@/components/admin/AdminHeader";
import Providers from "@/components/Providers";
import { getToken } from "@/lib/auth";

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Providers>
      <div className="min-h-screen">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </Providers>
  );
}
