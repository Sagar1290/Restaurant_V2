import HeroSection from "../components/home/HeroSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import SignatureDishes from "../components/home/SignatureDishes";
import CustomerTestimonials from "../components/home/CustomerTestimonials";
import CallToAction from "../components/home/CallToAction";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <SignatureDishes />
      <CustomerTestimonials />
      <CallToAction />
    </div>
  );
}
