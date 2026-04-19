"use client";

import { useSiteContent } from "@/app/hooks/useSiteContent";

export default function HeroSection() {
  const { data } = useSiteContent();

  const heroTitle = data?.heroTitle || "วัดป่าแก้วมณีนพเก้า";
  const heroDescription =
    data?.heroDescription ||
    "ศูนย์รวมแห่งศรัทธา ความสงบ และการปฏิบัติธรรม พร้อมกิจกรรมงานบุญ ธรรมเทศนา และบรรยากาศร่มรื่นภายในวัด เพื่อเชิญชวนพุทธศาสนิกชนและผู้มีจิตศรัทธาเข้ามาเยี่ยมชมและร่วมกิจกรรม";

  const heroImage1 =
    data?.heroImageUrl ||
    "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop";

  const heroImage2 =
    data?.heroImageUrl2 ||
    data?.heroImageUrl ||
    "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop";

  const heroImage3 =
    data?.heroImageUrl3 ||
    data?.heroImageUrl ||
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200&auto=format&fit=crop";

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#fffaf0] via-white to-[#f8f3ea] px-4 pb-10 pt-3 md:pb-12 md:pt-4"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:gap-8">
        {/* LEFT CONTENT */}
        <div className="order-2 lg:order-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#8d6720] md:text-5xl lg:text-[56px]">
            {heroTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6b5b3e] md:text-base md:leading-8">
            {heroDescription}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#activities"
              className="inline-flex items-center justify-center rounded-2xl bg-[#c9a34e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e]"
            >
              ดูกิจกรรมของวัด
            </a>

            <a
              href="#sermons"
              className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] bg-white px-6 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
            >
              ฟังธรรมเทศนา
            </a>
          </div>

          <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ead7b0] bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                บรรยากาศ
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-[#4a3b22]">
                สงบ ร่มรื่น เหมาะแก่การปฏิบัติธรรม
              </p>
            </div>

            <div className="rounded-2xl border border-[#ead7b0] bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                กิจกรรม
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-[#4a3b22]">
                ข่าวสารและงานบุญอัปเดตอย่างต่อเนื่อง
              </p>
            </div>

            <div className="rounded-2xl border border-[#ead7b0] bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                ธรรมเทศนา
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-[#4a3b22]">
                รวมธรรมะและวิดีโอเพื่อการเรียนรู้
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="order-1 lg:order-2">
          <div className="grid gap-4 md:grid-cols-[1.35fr_0.95fr]">
            {/* HERO MAIN IMAGE */}
            <div className="group relative">
              <div className="absolute -left-3 -top-3 h-24 w-24 rounded-full bg-[#f3dfae]/50 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-[#e8c97a]/30 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-[#e8d4aa] bg-gradient-to-br from-[#fffdf8] via-white to-[#f8f1e3] p-3 shadow-[0_20px_50px_rgba(166,124,46,0.14)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(166,124,46,0.18)]">
                <div className="relative overflow-hidden rounded-[26px] border border-[#f2e3bf] bg-[#f6efe2]">
                  <img
                    src={heroImage1}
                    alt={`${heroTitle} รูปหลัก`}
                    className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-[390px] lg:h-[420px]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                </div>
              </div>
            </div>

            {/* RIGHT SMALL IMAGES */}
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-[26px] border border-[#ead7b0] bg-white p-2.5 shadow-[0_12px_28px_rgba(166,124,46,0.09)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(166,124,46,0.12)]">
                <div className="overflow-hidden rounded-[20px] bg-[#f6efe2]">
                  <img
                    src={heroImage2}
                    alt={`${heroTitle} รูปที่ 2`}
                    className="h-[150px] w-full object-cover transition duration-500 hover:scale-[1.03] md:h-[186px] lg:h-[202px]"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-[#ead7b0] bg-white p-2.5 shadow-[0_12px_28px_rgba(166,124,46,0.09)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(166,124,46,0.12)]">
                <div className="overflow-hidden rounded-[20px] bg-[#f6efe2]">
                  <img
                    src={heroImage3}
                    alt={`${heroTitle} รูปที่ 3`}
                    className="h-[150px] w-full object-cover transition duration-500 hover:scale-[1.03] md:h-[186px] lg:h-[202px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}