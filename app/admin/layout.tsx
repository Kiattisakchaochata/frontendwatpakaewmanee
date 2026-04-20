"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/admin/AdminNavbar";
import { removeAuth, getToken, getUser } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      removeAuth();
      router.replace("/");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f3ea]">
        <div className="rounded-2xl border border-[#ead7b0] bg-white px-6 py-4 text-sm font-medium text-[#6b5b3e] shadow-sm">
          กำลังตรวจสอบสิทธิ์...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3ea]">
      <AdminNavbar />
      {children}
    </div>
  );
}