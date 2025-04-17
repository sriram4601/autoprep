import Link from "next/link";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="learnq-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Start Practising Now
          </h2>
          <p className="text-gray-600 mb-8">
            Take the first step towards improving your Digital SAT score today. Try our platform for FREE and start experiencing the benefits of our platform.
          </p>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90" asChild>
            <Link href="https://app.learnq.ai/">
              SIGNUP NOW
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
