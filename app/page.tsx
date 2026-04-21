import type { Metadata } from "next";
import Navbar from "@/app/components/homepage/Navbar";
import HeroSection from "@/app/components/homepage/HeroSection";
import AboutTempleSection from "@/app/components/homepage/AboutTempleSection";
import ActivitiesSection from "@/app/components/homepage/ActivitiesSection";
import GallerySection from "@/app/components/homepage/GallerySection";
import SermonSection from "@/app/components/homepage/SermonSection";
import TiktokSection from "@/app/components/homepage/TiktokSection";
import ContactSection from "@/app/components/homepage/ContactSection";
import Footer from "@/app/components/homepage/Footer";

export const metadata: Metadata = {
  title: "หน้าแรก",
  description:
    "วัดป่าแก้วมณีนพเก้า ศูนย์รวมแห่งศรัทธา ความสงบ และการปฏิบัติธรรม พร้อมข้อมูลกิจกรรม ธรรมเทศนา แกลเลอรี และการติดต่อวัด",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "วัดป่าแก้วมณีนพเก้า",
    description:
      "ศูนย์รวมแห่งศรัทธา ความสงบ และการปฏิบัติธรรม พร้อมข้อมูลกิจกรรม ธรรมเทศนา แกลเลอรี และการติดต่อวัด",
    url: "https://watpakaewmanee.com",
    siteName: "วัดป่าแก้วมณีนพเก้า",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 1200,
        alt: "วัดป่าแก้วมณีนพเก้า",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "วัดป่าแก้วมณีนพเก้า",
    description:
      "ศูนย์รวมแห่งศรัทธา ความสงบ และการปฏิบัติธรรม พร้อมข้อมูลกิจกรรม ธรรมเทศนา แกลเลอรี และการติดต่อวัด",
    images: ["/logo.jpg"],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutTempleSection />
      <ActivitiesSection />
      <GallerySection />
      <SermonSection />
      <TiktokSection />
      <ContactSection />
      <Footer />
    </main>
  );
}