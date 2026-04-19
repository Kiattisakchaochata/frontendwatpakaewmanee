import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Video,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const adminMenus = [
  {
    title: "จัดการข้อมูลเว็บไซต์",
    description:
      "แก้ไขชื่อวัด ข้อความ Hero ประวัติวัด ข้อมูลติดต่อ และแผนที่",
    href: "/admin/site-content",
    icon: FileText,
  },
  {
    title: "จัดการวิดีโอ TikTok",
    description:
      "เพิ่มวิดีโอจาก TikTok จัดลำดับ เปิด/ปิดการแสดงผล และลบรายการ",
    href: "/admin/video",
    icon: Video,
  },
  {
    title: "จัดการแกลเลอรี",
    description:
      "อัปโหลดรูปภาพ จัดการลำดับ แก้ไขรายละเอียด และเลือกใช้งานรูปภาพ",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    title: "จัดการกิจกรรม",
    description:
      "เพิ่ม แก้ไข ลบ จัดลำดับ และเปิด/ปิดการแสดงผลกิจกรรมของวัด",
    href: "/admin/activity",
    icon: CalendarDays,
  },
  {
    title: "จัดการธรรมเทศนา",
    description:
      "เพิ่ม แก้ไข ลบ และอัปโหลดรูปประกอบของธรรมเทศนาได้จากหลังบ้าน",
    href: "/admin/sermon",
    icon: BookOpen,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="px-4 py-8 text-[#4a3b22] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b0] bg-white px-4 py-2 text-sm font-semibold text-[#8d6720] shadow-sm">
            <LayoutDashboard className="h-4 w-4" />
            Admin Dashboard
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
            จัดการหลังบ้านเว็บไซต์วัด
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
            ศูนย์รวมสำหรับจัดการข้อมูลหลักของเว็บไซต์ เช่น ข้อมูลวัด วิดีโอ
            รูปภาพ กิจกรรม และธรรมเทศนา
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {adminMenus.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-[0_10px_30px_rgba(166,124,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(166,124,46,0.14)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff7e8] text-[#b88a2a] transition group-hover:bg-[#c9a34e] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#4a3b22]">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#6b5b3e]">
                  {item.description}
                </p>

                <div className="mt-5 inline-flex items-center rounded-2xl border border-[#d9c39a] px-4 py-2 text-sm font-semibold text-[#8d6720] transition group-hover:bg-[#fff7e8]">
                  เข้าไปจัดการ
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-5 text-sm leading-7 text-[#6b5b3e] shadow-sm">
          ตอนนี้ระบบเริ่มพร้อมสำหรับการจัดการหน้าแรกจากหลังบ้านแล้ว
          และสามารถเข้าแต่ละเมนูได้จากแถบเมนูด้านบนตลอดเวลา
        </div>
      </div>
    </div>
  );
}