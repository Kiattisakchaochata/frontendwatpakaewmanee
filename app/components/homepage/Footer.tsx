export default function Footer() {
  return (
    <footer className="border-t border-[#ead7b0] bg-[#fffaf0] px-4 py-6 md:py-8">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3 md:gap-8">
        {/* Brand */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
            Wat Pa Kaew
          </p>
          <h3 className="mt-2 text-xl font-bold text-[#8d6720] md:text-2xl">
            วัดป่าแก้วมณีนพเก้า
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#6b5b3e]">
            ศูนย์รวมแห่งศรัทธา ความสงบ และการปฏิบัติธรรม
            พร้อมกิจกรรมทางพระพุทธศาสนา ข่าวสารของวัด
            และเนื้อหาธรรมะสำหรับญาติโยมและผู้สนใจ
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-base font-bold text-[#4a3b22] md:text-lg">ลิงก์ด่วน</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[#6b5b3e]">
            <a href="#about" className="transition hover:text-[#8d6720]">
              ประวัติวัด
            </a>
            <a href="#activities" className="transition hover:text-[#8d6720]">
              กิจกรรมของวัด
            </a>
            <a href="#gallery" className="transition hover:text-[#8d6720]">
              แกลเลอรีบรรยากาศวัด
            </a>
            <a href="#sermons" className="transition hover:text-[#8d6720]">
              ธรรมเทศนา
            </a>
            <a href="#contact" className="transition hover:text-[#8d6720]">
              ติดต่อวัด
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-base font-bold text-[#4a3b22] md:text-lg">ข้อมูลติดต่อ</h4>
          <div className="mt-3 space-y-2 text-sm leading-6 text-[#6b5b3e]">
            <p>วัดป่าแก้วมณีนพเก้า</p>
            <p>123 หมู่ 1 ตำบลตัวอย่าง อำเภอตัวอย่าง จังหวัดตัวอย่าง 10200</p>
            <p>โทร: 08X-XXX-XXXX</p>
            <p>เปิดทุกวัน เวลา 06:00 - 18:00 น.</p>
          </div>

          <div className="mt-4">
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-[#c9a34e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e]"
            >
              เปิดแผนที่วัด
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-6xl border-t border-[#ead7b0] pt-4 text-center text-sm text-[#8a7a5d]">
        © {new Date().getFullYear()} วัดป่าแก้วมณีนพเก้า. สงวนลิขสิทธิ์
      </div>
    </footer>
  );
}