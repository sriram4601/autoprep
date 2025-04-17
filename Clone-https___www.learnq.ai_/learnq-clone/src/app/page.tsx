import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import WallOfLoveSection from "@/components/WallOfLoveSection";
import PlatformsSection from "@/components/PlatformsSection";
import CommunitySection from "@/components/CommunitySection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <WallOfLoveSection />
        <PlatformsSection />
        <CommunitySection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
