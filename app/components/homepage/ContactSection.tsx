"use client";

import { useSiteContent } from "@/app/hooks/useSiteContent";

export default function ContactSection() {
  const { data } = useSiteContent();

  const contactTitle = data?.contactTitle || "ติดต่อวัดและการเดินทาง";
  const address = data?.address || "กรุณาเพิ่มที่อยู่ของวัด";
  const phone = data?.phone || "กรุณาเพิ่มเบอร์โทร";
  const openingHours =
    data?.openingHours || "เปิดทุกวัน เวลา 06:00 - 18:00 น.";
  const googleMapUrl = data?.googleMapUrl || "https://maps.google.com";
  const mapEmbedUrl =
    data?.mapEmbedUrl ||
    "https://www.google.com/maps?q=Bangkok&output=embed";

  return (
    <section id="contact" className="scroll-mt-24 bg-white px-4 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 text-center md:mb-8">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
            {contactTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
            สำหรับผู้ที่ต้องการเดินทางมาทำบุญ ปฏิบัติธรรม
            หรือเข้าร่วมกิจกรรมต่างๆ ของวัด
            สามารถดูข้อมูลการติดต่อและเส้นทางได้จากส่วนนี้
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <div className="rounded-[32px] border border-[#ead7b0] bg-[#fffaf0] p-6 shadow-[0_12px_30px_rgba(166,124,46,0.08)] md:p-7">
            <h3 className="text-2xl font-bold text-[#4a3b22]">
              ข้อมูลการติดต่อ
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                  ชื่อวัด
                </p>
                <p className="mt-2 text-base leading-7 text-[#4a3b22]">
                  {data?.templeName || "วัดป่าแก้วมณีนพเก้า"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                  ที่อยู่
                </p>
                <p className="mt-2 text-base leading-7 text-[#4a3b22]">
                  {address}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                  โทรศัพท์
                </p>
                <p className="mt-2 text-base leading-7 text-[#4a3b22]">
                  {phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                  เวลาเปิด
                </p>
                <p className="mt-2 text-base leading-7 text-[#4a3b22]">
                  {openingHours}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-[#c9a34e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e]"
              >
                เปิด Google Maps
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] bg-white px-6 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
              >
                โทรติดต่อวัด
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-[#ead7b0] bg-white shadow-[0_12px_30px_rgba(166,124,46,0.08)]">
            <div className="h-full min-h-[360px] w-full md:min-h-[400px]">
              <iframe
                title="Temple Map"
                src={mapEmbedUrl}
                className="h-full min-h-[360px] w-full border-0 md:min-h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}