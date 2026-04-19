"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  publicId?: string | null;
  orderNumber: number;
  isActive: boolean;
  showInHome?: boolean;
  showInAbout?: boolean;
  showInGallery?: boolean;
  showInHero?: boolean;
  createdAt: string;
  updatedAt: string;
};

const ITEMS_PER_PAGE = 12;

export default function GallerySection() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [sliderHeight, setSliderHeight] = useState<number>(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/gallery/public?section=gallery`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message || "โหลด gallery ไม่สำเร็จ");
          setImages([]);
          return;
        }

        setImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("เชื่อมต่อ backend gallery ไม่สำเร็จ:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, [API_URL]);

  const pagedImages = useMemo(() => {
    const chunks: GalleryItem[][] = [];

    for (let i = 0; i < images.length; i += ITEMS_PER_PAGE) {
      chunks.push(images.slice(i, i + ITEMS_PER_PAGE));
    }

    return chunks;
  }, [images]);

  const totalPages = pagedImages.length;

  function updateCurrentPageHeight() {
    const activePage = pageRefs.current[currentPage];
    if (!activePage) return;

    const nextHeight = activePage.offsetHeight;
    setSliderHeight(nextHeight);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      updateCurrentPageHeight();
    }, 50);

    function handleResize() {
      updateCurrentPageHeight();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentPage, pagedImages]);

  function scrollToGalleryTop() {
    if (!sectionRef.current) return;

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function goToPage(pageIndex: number) {
    if (pageIndex < 0 || pageIndex >= totalPages || pageIndex === currentPage) {
      return;
    }

    setCurrentPage(pageIndex);
    scrollToGalleryTop();
  }

  function goPrev() {
    goToPage(currentPage - 1);
  }

  function goNext() {
    goToPage(currentPage + 1);
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEndX(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goNext();
    } else if (distance < -minSwipeDistance) {
      goPrev();
    }
  }

  return (
    <section
  id="gallery"
  ref={sectionRef}
  className="scroll-mt-24 bg-[#f3ede0] px-4 py-7 md:px-6 md:py-8"
>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 text-center md:mb-8">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
            ภาพบรรยากาศภายในวัด
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
            รวมภาพกิจกรรม บรรยากาศวัด และช่วงเวลาสำคัญต่าง ๆ
            เพื่อให้ผู้ที่สนใจได้สัมผัสความสงบ ร่มเย็น และความงดงามของวัด
          </p>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-[#ead7b0] bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-[#6b5b3e]">กำลังโหลดรูปภาพ...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-8 text-center shadow-sm">
            <div className="flex flex-col items-center gap-3 text-[#6b5b3e]">
              <ImageIcon className="h-8 w-8" />
              <p className="text-sm">ยังไม่มีรูปภาพในแกลเลอรี</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              className="overflow-hidden transition-[height] duration-500 ease-out"
              style={{ height: sliderHeight ? `${sliderHeight}px` : "auto" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex items-start transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentPage * 100}%)`,
                }}
              >
                {pagedImages.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    ref={(el) => {
                      pageRefs.current[pageIndex] = el;
                    }}
                    className="w-full shrink-0"
                  >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {page.map((item) => (
                        <div
                          key={item.id}
                          className="group overflow-hidden rounded-[24px] border border-[#ead7b0] bg-white shadow-[0_8px_24px_rgba(166,124,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(166,124,46,0.14)]"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-[#f6efe2]">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                            />
                          </div>

                          <div className="p-3.5">
                            <h3 className="line-clamp-2 text-base font-bold leading-6 text-[#4a3b22]">
                              {item.title}
                            </h3>

                            {item.description && (
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b5b3e]">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={currentPage === 0}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c39a] bg-white text-[#8d6720] transition hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="หน้าก่อนหน้า"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2 px-2">
                    {pagedImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => goToPage(index)}
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
                    onClick={goNext}
                    disabled={currentPage === totalPages - 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c39a] bg-white text-[#8d6720] transition hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="หน้าถัดไป"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-sm text-[#6b5b3e]">
                  หน้า {currentPage + 1} / {totalPages}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}