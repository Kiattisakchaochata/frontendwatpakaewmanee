"use client";

import { useEffect, useMemo, useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  tiktokUrl?: string | null;
  thumbnailUrl?: string | null;
  orderNumber: number;
  isActive: boolean;
};

export default function TiktokSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8899/api";

        const res = await fetch(`${apiUrl}/video/public/videos`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("โหลดวิดีโอไม่สำเร็จ:", data.message);
          setVideos([]);
          return;
        }

        if (Array.isArray(data)) {
          setVideos(data);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("เชื่อมต่อ backend ไม่สำเร็จ:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  const displayedVideos = useMemo(() => {
    return videos.slice(0, visibleCount);
  }, [videos, visibleCount]);

  function handleLoadMore() {
    setVisibleCount((prev) => prev + 10);
  }

  return (
    <section className="bg-[#f3ede0] px-4 py-5 md:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 text-center md:mb-4">
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
            วิดีโอ TikTok
          </h2>

          <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-6 text-[#6b5b3e] md:text-base">
            รวมวิดีโอที่เผยแพร่จากระบบหลังบ้าน
          </p>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-[#ddc79d] bg-[#fffaf0] p-7 text-center text-[#6b5b3e] shadow-sm">
            กำลังโหลดวิดีโอ...
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d9c39a] bg-[#fffaf0] p-7 text-center text-[#6b5b3e] shadow-sm">
            ยังไม่มีวิดีโอที่เปิดใช้งาน
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {displayedVideos.map((video) => {
                const hasLink = !!video.tiktokUrl?.trim();

                const cardContent = (
                  <>
                    <div className="aspect-square overflow-hidden bg-[#efe4cf]">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-[#6b5b3e]">
                          ไม่มีรูปปก
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#ead7b0] bg-[#fffaf2] p-3.5">
                      <p className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-6 text-[#4a3b22]">
                        {video.title}
                      </p>
                    </div>
                  </>
                );

                if (!hasLink) {
                  return (
                    <div
                      key={video.id}
                      className="group overflow-hidden rounded-[22px] border border-[#d8c49f] bg-[#fffaf2] shadow-[0_6px_18px_rgba(166,124,46,0.08)]"
                    >
                      {cardContent}
                    </div>
                  );
                }

                return (
                  <a
                    key={video.id}
                    href={video.tiktokUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-[22px] border border-[#d8c49f] bg-[#fffaf2] shadow-[0_6px_18px_rgba(166,124,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(166,124,46,0.14)]"
                  >
                    {cardContent}
                  </a>
                );
              })}
            </div>

            {visibleCount < videos.length && (
              <div className="mt-6 flex justify-center md:mt-7">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span className="text-[22px] font-bold tracking-[0.01em] text-[#8d6720] transition duration-300 group-hover:text-[#a67c2e] md:text-[26px]">
                    โหลดเพิ่มเติม
                  </span>

                  <div className="flex flex-col items-center leading-none transition duration-300 group-hover:translate-y-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-[18px] w-[120px] text-[#8d6720] transition duration-300 group-hover:w-[128px] group-hover:text-[#a67c2e]"
                    >
                      <path
                        d="M4 8l8 8 8-8"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="-mt-1 h-[16px] w-[96px] text-[#c9a34e] opacity-85 transition duration-300 group-hover:w-[104px] group-hover:opacity-100"
                    >
                      <path
                        d="M4 8l8 8 8-8"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="-mt-1 h-[14px] w-[74px] text-[#e3d0a4] opacity-90 transition duration-300 group-hover:w-[82px]"
                    >
                      <path
                        d="M4 8l8 8 8-8"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}