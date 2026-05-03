import { ClientsSection } from "@/components/home/ClientsSection";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { FleetTransportCards } from "@/components/home/FleetTransportCards";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { HeroSection } from "@/components/home/HeroSection";
import { ScalePrecisionSection } from "@/components/home/ScalePrecisionSection";
import { ScheduleDeliveryCta } from "@/components/home/ScheduleDeliveryCta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <ScalePrecisionSection />
      <FleetTransportCards />
      <ScheduleDeliveryCta />
      <ClientsSection />
      <GoogleReviews />
    </>
  );
}
