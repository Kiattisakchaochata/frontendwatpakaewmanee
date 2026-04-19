import Navbar from "@/app/components/homepage/Navbar";
import HeroSection from "@/app/components/homepage/HeroSection";
import AboutTempleSection from "@/app/components/homepage/AboutTempleSection";
import ActivitiesSection from "@/app/components/homepage/ActivitiesSection";
import GallerySection from "@/app/components/homepage/GallerySection";
import SermonSection from "@/app/components/homepage/SermonSection";
import TiktokSection from "@/app/components/homepage/TiktokSection";
import ContactSection from "@/app/components/homepage/ContactSection";
import Footer from "@/app/components/homepage/Footer";

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