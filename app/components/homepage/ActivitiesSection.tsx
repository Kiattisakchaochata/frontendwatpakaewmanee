"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

type ActivityItem = {
  id: string;
  title: string;
  description?: string | null;
  eventDate?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  isUpcoming: boolean;
  isActive: boolean;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
};

const ITEMS_PER_PAGE = 8;

export default function ActivitiesSection() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8899/api";

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [upcomingPage, setUpcomingPage] = useState(0);
  const [pastPage, setPastPage] = useState(0);

  const [scrollTarget, setScrollTarget] = useState<"upcoming" | "past" | null>(
    null
  );

  const upcomingHeaderRef = useRef<HTMLDivElement | null>(null);
  const pastHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/activity/public`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message || "โหลดกิจกรรมไม่สำเร็จ");
          return;
        }

        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("เชื่อมต่อ backend activity ไม่สำเร็จ:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [API_URL]);

  function formatDate(dateString?: string | null) {
    if (!dateString) return "ยังไม่ระบุวันเวลา";
    return new Date(dateString).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function isPastActivity(item: ActivityItem) {
    if (!item.eventDate) {
      return !item.isUpcoming;
    }

    const eventTime = new Date(item.eventDate).getTime();
    const now = Date.now();

    return eventTime < now;
  }

  const upcomingActivities = useMemo(() => {
    return activities
      .filter((item) => !isPastActivity(item))
      .sort((a, b) => {
        const aTime = a.eventDate ? new Date(a.eventDate).getTime() : Infinity;
        const bTime = b.eventDate ? new Date(b.eventDate).getTime() : Infinity;
        return aTime - bTime;
      });
  }, [activities]);

  const pastActivities = useMemo(() => {
    return activities
      .filter((item) => isPastActivity(item))
      .sort((a, b) => {
        const aTime = a.eventDate ? new Date(a.eventDate).getTime() : 0;
        const bTime = b.eventDate ? new Date(b.eventDate).getTime() : 0;
        return bTime - aTime;
      });
  }, [activities]);

  const upcomingTotalPages = Math.ceil(
    upcomingActivities.length / ITEMS_PER_PAGE
  );
  const pastTotalPages = Math.ceil(pastActivities.length / ITEMS_PER_PAGE);

  const upcomingVisibleItems = useMemo(() => {
    const start = upcomingPage * ITEMS_PER_PAGE;
    return upcomingActivities.slice(start, start + ITEMS_PER_PAGE);
  }, [upcomingActivities, upcomingPage]);

  const pastVisibleItems = useMemo(() => {
    const start = pastPage * ITEMS_PER_PAGE;
    return pastActivities.slice(start, start + ITEMS_PER_PAGE);
  }, [pastActivities, pastPage]);

  useEffect(() => {
    if (upcomingPage > 0 && upcomingPage >= upcomingTotalPages) {
      setUpcomingPage(Math.max(upcomingTotalPages - 1, 0));
    }
  }, [upcomingPage, upcomingTotalPages]);

  useEffect(() => {
    if (pastPage > 0 && pastPage >= pastTotalPages) {
      setPastPage(Math.max(pastTotalPages - 1, 0));
    }
  }, [pastPage, pastTotalPages]);

  useEffect(() => {
    if (!scrollTarget) return;

    const target =
      scrollTarget === "upcoming"
        ? upcomingHeaderRef.current
        : pastHeaderRef.current;

    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    setScrollTarget(null);
  }, [upcomingPage, pastPage, scrollTarget]);

  function changeUpcomingPage(nextPage: number) {
    const safePage = Math.max(0, Math.min(nextPage, upcomingTotalPages - 1));
    if (safePage === upcomingPage) return;

    setUpcomingPage(safePage);
    setScrollTarget("upcoming");
  }

  function changePastPage(nextPage: number) {
    const safePage = Math.max(0, Math.min(nextPage, pastTotalPages - 1));
    if (safePage === pastPage) return;

    setPastPage(safePage);
    setScrollTarget("past");
  }

  function ActivityCard({ item }: { item: ActivityItem }) {
    return (
      <div className="group overflow-hidden rounded-[24px] border border-[#ead7b0] bg-white shadow-[0_8px_24px_rgba(166,124,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(166,124,46,0.14)]">
        <div className="relative">
          <div className="aspect-[6/5] overflow-hidden bg-[#f6efe2]">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#6b5b3e]">
                ไม่มีรูปกิจกรรม
              </div>
            )}
          </div>

          <div
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-sm ${
              isPastActivity(item) ? "bg-[#8a7a5d]" : "bg-[#c9a34e]"
            }`}
          >
            {isPastActivity(item) ? "กิจกรรมที่ผ่านมา" : "กำลังจะจัด"}
          </div>
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 text-lg font-bold leading-7 text-[#4a3b22]">
            {item.title}
          </h3>

          <div className="mt-2 space-y-1.5 text-sm text-[#8a7a5d]">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>{formatDate(item.eventDate)}</span>
            </div>

            {item.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{item.location}</span>
              </div>
            )}
          </div>

          {item.description && (
            <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-[#6b5b3e]">
              {item.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  function PaginationControls({
    currentPage,
    totalPages,
    onPrev,
    onNext,
    onGoToPage,
  }: {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    onGoToPage: (page: number) => void;
  }) {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
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
                onClick={() => onGoToPage(index)}
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
            onClick={onNext}
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
    );
  }

  return (
    <section
      id="activities"
      className="scroll-mt-24 bg-gradient-to-b from-[#fffaf0] to-white px-4 py-10 md:px-6 md:py-12"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-7 text-center md:mb-8">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
            กิจกรรมของวัด
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
            ติดตามกิจกรรมที่กำลังจะจัดขึ้นและกิจกรรมที่ผ่านมา
            เพื่อร่วมทำบุญ ปฏิบัติธรรม และเข้าร่วมงานสำคัญของวัด
          </p>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-[#ead7b0] bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-[#6b5b3e]">กำลังโหลดกิจกรรม...</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <div
                ref={upcomingHeaderRef}
                className="mb-4 scroll-mt-28"
              >
                <h3 className="text-2xl font-bold text-[#8d6720]">
                  กิจกรรมที่กำลังจะจัด
                </h3>
                <p className="mt-1 text-sm text-[#6b5b3e]">
                  {upcomingActivities.length} รายการ
                </p>
              </div>

              {upcomingActivities.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-8 text-center text-[#6b5b3e] shadow-sm">
                  ยังไม่มีกิจกรรมที่กำลังจะจัด
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {upcomingVisibleItems.map((item) => (
                      <ActivityCard key={item.id} item={item} />
                    ))}
                  </div>

                  <PaginationControls
                    currentPage={upcomingPage}
                    totalPages={upcomingTotalPages}
                    onPrev={() => changeUpcomingPage(upcomingPage - 1)}
                    onNext={() => changeUpcomingPage(upcomingPage + 1)}
                    onGoToPage={(page) => changeUpcomingPage(page)}
                  />
                </>
              )}
            </div>

            <div>
              <div
                ref={pastHeaderRef}
                className="mb-4 scroll-mt-28"
              >
                <h3 className="text-2xl font-bold text-[#8d6720]">
                  กิจกรรมที่ผ่านมา
                </h3>
                <p className="mt-1 text-sm text-[#6b5b3e]">
                  {pastActivities.length} รายการ
                </p>
              </div>

              {pastActivities.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-8 text-center text-[#6b5b3e] shadow-sm">
                  ยังไม่มีกิจกรรมที่ผ่านมา
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {pastVisibleItems.map((item) => (
                      <ActivityCard key={item.id} item={item} />
                    ))}
                  </div>

                  <PaginationControls
                    currentPage={pastPage}
                    totalPages={pastTotalPages}
                    onPrev={() => changePastPage(pastPage - 1)}
                    onNext={() => changePastPage(pastPage + 1)}
                    onGoToPage={(page) => changePastPage(page)}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}