"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useSiteContent } from "@/app/hooks/useSiteContent";

function AboutReadMoreModal({
  open,
  title,
  description,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#ead7b0] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#f0e2c1] px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#ead7b0] text-[#8d6720] transition hover:bg-[#fff7e8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-96px)] overflow-y-auto px-6 py-5">
          <p className="whitespace-pre-line text-base leading-8 text-[#6b5b3e]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutTempleSection() {
  const { data } = useSiteContent();
  const [openModal, setOpenModal] = useState(false);

  const aboutTitle = data?.aboutTitle || "ประวัติความเป็นมาของวัด";
  const aboutDescription =
    data?.aboutDescription ||
    "วัดป่าแก้วมณีนพเก้าเป็นสถานที่แห่งศรัทธาและความสงบ ที่เปิดโอกาสให้พุทธศาสนิกชนได้เข้ามาทำบุญ ปฏิบัติธรรม และร่วมกิจกรรมทางพระพุทธศาสนาในบรรยากาศที่ร่มรื่นและเรียบง่าย";

  const aboutImage =
    data?.aboutImageUrl ||
    "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop";

  const shouldShowReadMore = useMemo(() => {
    return aboutDescription.trim().length > 260;
  }, [aboutDescription]);

  return (
    <>
      <AboutReadMoreModal
        open={openModal}
        title={aboutTitle}
        description={aboutDescription}
        onClose={() => setOpenModal(false)}
      />

      <section id="about" className="scroll-mt-24 bg-white px-4 py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div className="relative self-start">
            <div className="absolute -left-4 top-8 hidden h-32 w-32 rounded-full bg-[#f3dfae]/40 blur-2xl md:block" />
            <div className="overflow-hidden rounded-[32px] border border-[#ead7b0] bg-[#fffaf0] p-3 shadow-[0_16px_40px_rgba(166,124,46,0.10)]">
              <img
                src={aboutImage}
                alt={aboutTitle}
                className="h-[260px] w-full rounded-[24px] object-cover md:h-[360px] lg:h-[420px]"
              />
            </div>
          </div>

          <div className="self-start">
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
              {aboutTitle}
            </h2>

            <div className="mt-5">
              <p
                className="text-base leading-8 text-[#6b5b3e]"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {aboutDescription}
              </p>

              {shouldShowReadMore && (
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-[#d9c39a] bg-white px-4 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
                >
                  อ่านต่อ
                </button>
              )}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#ead7b0] bg-[#fffaf0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                  จุดเด่น
                </p>
                <p className="mt-2 text-sm leading-7 text-[#4a3b22]">
                  สถานที่สงบ ร่มเย็น เหมาะกับการทำบุญและปฏิบัติธรรม
                </p>
              </div>

              <div className="rounded-2xl border border-[#ead7b0] bg-[#fffaf0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                  เป้าหมาย
                </p>
                <p className="mt-2 text-sm leading-7 text-[#4a3b22]">
                  เป็นศูนย์รวมแห่งศรัทธา การเรียนรู้ธรรมะ และกิจกรรมของชุมชน
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}