import { NavigationBar } from "@/features/home/components/navigation-bar";
import { Hero } from "@/features/home/components/hero";
import { Features } from "@/features/home/components/features";
import { Preview } from "@/features/home/components/preview";
import { Steps } from "@/features/home/components/steps";
import { CallToAction } from "@/features/home/components/call-to-action";
import { Footer } from "@/features/home/components/footer";

/**
 * Root landing page view composing individual presentation sections in sequential order.
 */
const LandingPage = () => {
  return (
    <main className="min-h-dvh bg-white">
      <NavigationBar />
      <Hero />
      <Features />
      <Preview />
      <Steps />
      <CallToAction />
      <Footer />
    </main>
  );
};

export default LandingPage;
