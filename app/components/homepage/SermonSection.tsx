"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Sermon = {
  id: string;
  title: string;
  speaker?: string | null;
  description?: string | null;
  content?: string | null;
  coverImage?: string | null;
  coverPublicId?: string | null;
  videoUrl?: string | null;
  tiktokUrl?: string | null;
  isActive?: boolean;
  orderNumber?: number;
};

const ITEMS_PER_PAGE = 6;

export default function SermonSection() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8899/api";

  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const gridTopRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    async function fetchSermons() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/sermon/public`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message || "โหลดข้อมูลธรรมเทศนาไม่สำเร็จ");
          setSermons([]);
          return;
        }

        if (Array.isArray(data)) {
          setSermons(data);
        } else {
          console.error("sermon api ไม่ได้ส่ง array กลับมา:", data);
          setSermons([]);
        }
      } catch (error) {
        console.error("เชื่อมต่อ backend sermon ไม่สำเร็จ:", error);
        setSermons([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSermons();
  }, [API_URL]);

  const totalPages = Math.ceil(sermons.length / ITEMS_PER_PAGE);

  const visibleSermons = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return sermons.slice(start, start + ITEMS_PER_PAGE);
  }, [sermons, currentPage]);

  useEffect(() => {
    if (currentPage > 0 && currentPage >= totalPages) {
      setCurrentPage(Math.max(totalPages - 1, 0));
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!shouldScrollRef.current) return;
    if (!gridTopRef.current) return;

    gridTopRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    shouldScrollRef.current = false;
  }, [currentPage]);

  function changePage(nextPage: number) {
    const safePage = Math.max(0, Math.min(nextPage, totalPages - 1));
    if (safePage === currentPage) return;

    shouldScrollRef.current = true;
    setCurrentPage(safePage);
  }

  return (
    <section id="sermons" className="bg-[#fffaf0] px-4 py-5 md:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center md:mb-5">
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#8d6720] md:mt-2 md:text-4xl">
            ธรรมเทศนาและข้อคิดธรรมะ
          </h2>
          <p className="mx-auto mt-1.5 max-w-3xl text-sm leading-6 text-[#6b5b3e] md:text-base">
            รวบรวมเนื้อหาธรรมเทศนาและข้อคิดทางธรรม
            เพื่อให้ผู้สนใจสามารถศึกษาและนำไปประยุกต์ใช้ในชีวิตประจำวัน
          </p>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-[#ead7b0] bg-white p-7 text-center shadow-sm">
            <p className="text-sm text-[#6b5b3e]">กำลังโหลดธรรมเทศนา...</p>
          </div>
        ) : sermons.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d9c39a] bg-white p-7 text-center shadow-sm">
            <p className="text-sm text-[#6b5b3e]">ยังไม่มีข้อมูลธรรมเทศนา</p>
          </div>
        ) : (
          <>
            <div ref={gridTopRef} className="scroll-mt-28" />

            <div className="grid gap-3 md:grid-cols-3">
              {visibleSermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="overflow-hidden rounded-[24px] border border-[#e4cfaa] bg-white shadow-[0_8px_22px_rgba(166,124,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(166,124,46,0.14)]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        sermon.coverImage ||
                        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={sermon.title}
                      className="h-[220px] w-full object-cover transition duration-500 hover:scale-[1.04]"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-[#c9a34e] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      ธรรมเทศนา
                    </div>
                  </div>

                  <div className="bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                      {sermon.speaker || "พระอาจารย์ประจำวัด"}
                    </p>

                    <h3 className="mt-2 text-lg font-bold leading-7 text-[#4a3b22]">
                      {sermon.title}
                    </h3>

                    <p className="mt-2.5 text-sm leading-6 text-[#6b5b3e]">
                      {sermon.description || sermon.content || "ไม่มีรายละเอียด"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {sermon.tiktokUrl && (
                        <a
                          href={sermon.tiktokUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] bg-[#fffaf0] px-4 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff1d8]"
                        >
                          ดู TikTok
                        </a>
                      )}

                      {sermon.videoUrl && (
                        <a
                          href={sermon.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] bg-[#fffaf0] px-4 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff1d8]"
                        >
                          ดูวิดีโอ
                        </a>
                      )}

                      {!sermon.tiktokUrl && !sermon.videoUrl && (
                        <span className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] bg-[#fffaf0] px-4 py-2 text-sm font-semibold text-[#8d6720]">
                          อ่านเพิ่มเติม
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c39a] bg-white text-[#8d6720] transition hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="หน้าก่อนหน้า"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2 px-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => changePage(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === currentPage
                            ? "w-7 bg-[#c9a34e]"
                            : "w-2.5 bg-[#d9c39a] hover:bg-[#b88a2a]"
                        }`}
                        aria-label={`ไปหน้าที่ ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c39a] bg-white text-[#8d6720] transition hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="หน้าถัดไป"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-sm leading-none text-[#6b5b3e]">
                  หน้า {currentPage + 1} / {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}