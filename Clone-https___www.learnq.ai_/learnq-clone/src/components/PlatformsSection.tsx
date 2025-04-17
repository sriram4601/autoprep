import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  "Plug & Play",
  "Analyze Performance",
  "AI Recommendations",
  "Custom Branding",
  "Grow Business",
  "Publish Your Mock",
  "Schedule Tests"
];

const PlatformsSection = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="learnq-container">
        <div className="mb-12">
          <h3 className="text-base uppercase font-medium text-primary mb-2 text-center">Platform For Educators</h3>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Powerful Tools for Teachers & Administrators
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center">
            Empowering teachers and admins with AI-driven real-time actionable insights to make learning data-driven.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature) => (
            <div key={feature} className="bg-white shadow-sm border border-gray-100 rounded-full px-4 py-2 text-gray-700">
              {feature}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
          <div>
            <h3 className="text-gray-700 text-lg mb-4">
              With real-time insights, learning becomes data-driven
            </h3>
            <p className="text-gray-600 mb-6">
              Our analytics platform equips educators with instant visibility into student progress, facilitating prompt and effective assistance where needed.
            </p>
            <Button className="bg-primary text-white hover:bg-primary/90" asChild>
              <Link href="/Institutes/digital-sat">
                Learn More
              </Link>
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Analytics Dashboard Preview</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
