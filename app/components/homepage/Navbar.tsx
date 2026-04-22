"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Settings2,
  CircleUserRound,
  LogOut,
} from "lucide-react";

import { getUser, removeAuth } from "@/lib/auth";

const navItems = [
  { label: "หน้าแรก", href: "#top" },
  { label: "ประวัติวัด", href: "#about" },
  { label: "กิจกรรม", href: "#activities" },
  { label: "แกลเลอรี", href: "#gallery" },
  { label: "ธรรมเทศนา", href: "#sermons" },
  { label: "ติดต่อวัด", href: "#contact" },
];
function AdminPanelIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <CircleUserRound className="absolute inset-0 h-full w-full stroke-[2.1]" />
      <Settings2 className="absolute -bottom-[2px] -right-[2px] h-[58%] w-[58%] bg-white stroke-[2.1]" />
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());

    const handleScroll = () => {
      let current = "top";

      setScrolled(window.scrollY > 20);

      navItems.forEach((item) => {
        const section = document.querySelector(item.href);
        if (section) {
          const top = section.getBoundingClientRect().top;
          if (top <= 140) {
            current = item.href.replace("#", "");
          }
        }
      });

      setActive(current);
    };

    const handleStorageChange = () => {
      setUser(getUser());
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", handleStorageChange);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function handleLogout() {
    removeAuth();
    setUser(null);
    setOpen(false);
    window.location.href = "/";
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#ead7b0] bg-white/95 shadow-[0_10px_30px_rgba(166,124,46,0.08)] backdrop-blur-xl"
          : "border-b border-[#f0e3c3] bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 py-2 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <a
  href="#top"
  className="flex min-w-0 flex-1 items-center gap-2 pr-2 md:gap-4"
>
  <div
    className={`relative shrink-0 overflow-hidden rounded-full border bg-white shadow-sm ${
      scrolled
        ? "h-12 w-12 border-[#dcc79d]"
        : "h-14 w-14 border-[#e7d7b4]"
    }`}
  >
    <Image
  src="/logo.jpg"
  alt="logo"
  fill
  sizes="120px"
  className="object-cover"
/>
  </div>

  <div className="min-w-0 leading-tight">
    <p className="truncate text-[13px] font-bold text-[#4a3b22] sm:text-[15px]">
      วัดป่าแก้วมณีนพเก้า
    </p>

    <p className="truncate text-[8px] font-semibold tracking-[0.18em] text-[#b88a2a] sm:text-[10px]">
      WAT PA KAEW MANEENOPPHAKAO
    </p>
  </div>
</a>

          {/* Desktop */}
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 lg:flex">
            <nav className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max items-center justify-center gap-4 xl:gap-6">
                {navItems.map((item) => {
                  const id = item.href.replace("#", "");

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`relative whitespace-nowrap text-[15px] font-semibold transition ${
                        active === id
                          ? "text-[#c39a3d]"
                          : "text-[#6b5b3e] hover:text-[#8d6720]"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute left-0 -bottom-2 h-[2.5px] w-full origin-left rounded-full bg-[#c9a34e] transition-transform duration-300 ${
                          active === id ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {user ? (
                <>
                  <Link
                    href="/admin"
                    title="ไปหลังบ้าน"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9c39a] bg-white text-[#8d6720] shadow-[0_4px_12px_rgba(166,124,46,0.08)] transition hover:bg-[#fff7e8]"
                  >
                    <AdminPanelIcon className="h-5 w-5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="ออกจากระบบ"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 shadow-[0_4px_12px_rgba(220,38,38,0.05)] transition hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-[#d9c39a] bg-white px-6 py-2.5 text-sm font-semibold text-[#8d6720] shadow-[0_4px_12px_rgba(166,124,46,0.08)] transition hover:bg-[#fff7e8]"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>

          {/* Mobile button */}
          <button
  onClick={() => setOpen(!open)}
  className="ml-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ead7b0] bg-white text-[#8d6720] shadow-sm transition hover:bg-[#fff7e8] lg:hidden"
  aria-label="Toggle Menu"
>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#ead7b0] bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-3 py-3 md:px-6">
            {navItems.map((item) => {
              const id = item.href.replace("#", "");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active === id
                      ? "bg-[#fff7e8] text-[#c9a34e]"
                      : "text-[#6b5b3e] hover:bg-[#fff7e8] hover:text-[#8d6720]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {user ? (
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
                >
                  <AdminPanelIcon className="h-4 w-4" />
                  ไปหลังบ้าน
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}