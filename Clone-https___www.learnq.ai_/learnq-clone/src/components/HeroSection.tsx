import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="hero-gradient py-16 md:py-24 relative overflow-hidden">
      <div className="learnq-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Learn Smarter,
              <br />
              <span className="text-primary">with Personalization</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Understand your learning journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90" asChild>
                <Link href="https://app.learnq.ai/">
                  Try It Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary" asChild>
                <Link href="https://discord.gg/5p3GwGEa2M">
                  Join our Discord
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10">
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src="https://ext.same-assets.com/2634247107/1752529039.webp"
                alt="LearnQ AI Dashboard"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="mt-20">
          <p className="text-center text-gray-600 mb-8">
            Loved by teachers and students in 190+ countries, endorsed by top SAT prep institutes
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="w-32 h-12 relative">
              <Image
                src="https://ext.same-assets.com/2634247107/3578297894.webp"
                alt="Institute Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-50 opacity-50 blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full bg-yellow-50 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-green-50 opacity-50 blur-3xl" />
    </section>
  );
};

export default HeroSection;
