"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "หน้าแรก", href: "#top" },
  { label: "ประวัติวัด", href: "#about" },
  { label: "กิจกรรม", href: "#activities" },
  { label: "แกลเลอรี", href: "#gallery" },
  { label: "ธรรมเทศนา", href: "#sermons" },
  { label: "ติดต่อวัด", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#ead7b0] bg-white/95 shadow-[0_10px_30px_rgba(166,124,46,0.08)] backdrop-blur-xl"
          : "border-b border-[#f0e3c3] bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Brand */}
        <a href="#top" className="flex min-w-0 items-center gap-3 md:gap-4">
          <div
            className={`relative shrink-0 overflow-hidden rounded-full border bg-white shadow-[0_6px_16px_rgba(166,124,46,0.10)] transition-all duration-300 ${
              scrolled
                ? "h-14 w-14 border-[#dcc79d] md:h-16 md:w-16"
                : "h-16 w-16 border-[#e7d7b4] md:h-[72px] md:w-[72px]"
            }`}
          >
            <Image
  src="/logo.jpg"
  alt="Wat Pa Kaew Maneenoppakao Logo"
  fill
  sizes="(max-width: 767px) 56px, (max-width: 1023px) 64px, 72px"
  className="object-cover"
  priority
/>
          </div>

          <div className="min-w-0 leading-tight">
            <p className="truncate text-[15px] font-bold text-[#4a3b22] sm:text-lg md:text-[20px] lg:text-[22px]">
              วัดป่าแก้วมณีนพเก้า
            </p>

            <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b88a2a] sm:text-[11px] md:text-xs lg:text-[13px]">
              Wat Pa Kaew Maneenopphakao
            </p>
          </div>
        </a>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-[15px] font-semibold transition ${
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

          <Link
  href="/login"
  className="inline-flex items-center justify-center rounded-full border border-[#d9c39a] bg-white px-6 py-2.5 text-sm font-semibold text-[#8d6720] shadow-[0_4px_12px_rgba(166,124,46,0.08)] transition hover:bg-[#fff7e8]"
>
  เข้าสู่ระบบ
</Link>
        </nav>

        {/* Mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ead7b0] text-[#6b5b3e] transition hover:bg-[#fff7e8] lg:hidden"
          aria-label="Toggle Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#ead7b0] bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 md:px-6">
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

            <Link
  href="/login"
  onClick={() => setOpen(false)}
  className="mt-3 inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
>
  เข้าสู่ระบบ
</Link>
          </div>
        </div>
      )}
    </header>
  );
}