import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  description: "เข้าสู่ระบบสำหรับผู้ดูแลระบบวัดป่าแก้วมณีนพเก้า",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}