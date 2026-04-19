"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  FileText,
  Image as ImageIcon,
  Video,
  CalendarDays,
  BookOpen,
  House,
  Users,
  LogOut,
} from "lucide-react";
import { getUser, removeAuth } from "@/lib/auth";

const baseMenus = [
  { title: "ข้อมูลเว็บ", href: "/admin/site-content", icon: FileText },
  { title: "วิดีโอ", href: "/admin/video", icon: Video },
  { title: "รูปภาพ", href: "/admin/gallery", icon: ImageIcon },
  { title: "กิจกรรม", href: "/admin/activity", icon: CalendarDays },
  { title: "ธรรมเทศนา", href: "/admin/sermon", icon: BookOpen },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const adminMenus = useMemo(() => {
    const menus = [...baseMenus];

    if (user?.role === "SUPER_ADMIN") {
      menus.push({
        title: "ผู้ใช้งาน",
        href: "/admin/users",
        icon: Users,
      });
    }

    return menus;
  }, [user?.role]);

  function handleLogout() {
    removeAuth();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#ead7b0] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 py-3 md:px-5 xl:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* LEFT BRAND */}
          <Link
            href="/admin"
            className="flex min-w-0 items-center gap-3 pr-2"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#d9c39a] bg-white shadow-[0_6px_16px_rgba(166,124,46,0.10)] md:h-14 md:w-14">
              <Image
                src="/logo.jpg"
                alt="Wat Pa Kaew Maneenoppakao Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88a2a] md:text-[11px] xl:text-xs">
                {user?.role === "SUPER_ADMIN"
                  ? "Super Admin Panel"
                  : "Admin Panel"}
              </p>

              <h1 className="truncate text-base font-bold text-[#4a3b22] md:text-lg xl:text-[19px]">
                วัดป่าแก้วมณีนพเก้า
              </h1>

              <p className="truncate text-xs text-[#8a7a5d] md:text-sm">
                {user?.role === "SUPER_ADMIN"
                  ? "ผู้ดูแลสูงสุด"
                  : user?.name || user?.email || "Admin"}
              </p>
            </div>
          </Link>

          {/* CENTER MENUS */}
          <nav className="min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max items-center justify-center gap-2">
              {adminMenus.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 xl:px-4 ${
                      isActive
                        ? "border border-[#d8bf86] bg-[#fff4dc] text-[#8d6720] shadow-[0_4px_12px_rgba(166,124,46,0.06)]"
                        : "border border-[#ead7b0] bg-white text-[#6b5b3e] hover:border-[#d9c39a] hover:bg-[#fff8eb] hover:text-[#8d6720]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex shrink-0 items-center gap-1.5 pl-2">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#d9c39a] bg-white px-3 py-2 text-sm font-semibold text-[#8d6720] shadow-[0_4px_12px_rgba(166,124,46,0.05)] transition hover:bg-[#fff7e8] xl:px-4"
              title="หน้าเว็บไซต์"
            >
              <House className="h-4 w-4 shrink-0" />
              <span className="hidden whitespace-nowrap 2xl:inline">
                หน้าเว็บไซต์
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-[0_4px_12px_rgba(220,38,38,0.05)] transition hover:bg-red-50 xl:px-4"
              title="ออกจากระบบ"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="hidden whitespace-nowrap 2xl:inline">
                ออกจากระบบ
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}