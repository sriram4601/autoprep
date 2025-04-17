import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const featuresData = [
  {
    id: "ai-powered",
    title: "Smart Learning: Fun, Engaging, Personalized and Driven by Data",
    description: "Equipping teachers and students with AI tools to make the learning and teaching processes personalized, smarter, and more efficient.",
    image: "https://framerusercontent.com/images/oaORlPetQFdx4ZoIT40Ejglsp28.gif",
    imageAlt: "LearnQ's Play & Practice feature video to gamified the learning with AI precision."
  },
  {
    id: "gamification",
    title: "Learn by Playing Games",
    description: "Game-based tests and quick quizzes with LearnQ make mastering topics fun and interactive. Plus, our smart AI plots your learning graph on the fly, showing you real-time learning insights.",
    image: "https://ext.same-assets.com/2634247107/147601433.svg",
    imageAlt: "Gamification icon",
    buttonText: "Start Playing",
    buttonLink: "/digital-sat/play-and-practice"
  },
  {
    id: "data-driven",
    title: "Master Concepts in Data-driven Way",
    description: "LearnQ's data-driven approach personalized your learning journey by using real-time scores for mastery, time-efficiency, accuracy, and potential score boosts helping you master concepts smarter and faster.",
    image: "https://ext.same-assets.com/2634247107/147601433.svg",
    imageAlt: "Data-driven icon",
    buttonText: "Explore Now",
    buttonLink: "/digital-sat"
  },
  {
    id: "doubts",
    title: "Resolve Your Doubts with Ask Mia",
    description: "Dive into each question solution, understand your errors, and level up with similar practice questions. Plus, get instant tips and tricks with Mia - AI Tutor",
    image: "https://ext.same-assets.com/2634247107/147601433.svg",
    imageAlt: "Ask Mia icon",
    buttonText: "Ask Mia Now",
    buttonLink: "/ai-tutor/digital-sat"
  },
  {
    id: "personalization",
    title: "Understand Concepts in Fun and Engaging way with Mia",
    description: "Learn topics in detail, grasp complex concepts in an exciting, adventure-filled way with Mia - Your AI Tutor.",
    image: "https://ext.same-assets.com/2634247107/147601433.svg",
    imageAlt: "Personalization icon",
    buttonText: "Try Mia Now",
    buttonLink: "/ai-tutor/digital-sat"
  },
  {
    id: "smart-learning",
    title: "Start with a Free Diagnostic Test to Craft your Study Plan!",
    description: "Take our super accurate Diagnostic test to gauge your SAT score and receive a personalized study plan tailored to your needs.",
    image: "https://ext.same-assets.com/2634247107/147601433.svg",
    imageAlt: "Smart Learning icon",
    buttonText: "Create Your Study Plan",
    buttonLink: "/digital-sat/diagnostic-test"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="learnq-container">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-powered Solution
          </h2>
          <h3 className="section-title">
            {featuresData[0].title}
          </h3>
          <p className="section-subtitle mx-auto">
            {featuresData[0].description}
          </p>
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="relative w-full h-[400px]">
              <Image
                src={featuresData[0].image}
                alt={featuresData[0].imageAlt}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
          {featuresData.slice(1).map((feature, index) => (
            <div key={feature.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className={`order-1 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                <h3 className="text-sm font-medium text-primary uppercase mb-2">
                  {feature.id.split("-").join(" ")}
                </h3>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                {feature.buttonText && (
                  <Button variant="outline" className="border-primary text-primary" asChild>
                    <Link href={feature.buttonLink}>
                      {feature.buttonText}
                    </Link>
                  </Button>
                )}
              </div>
              <div className={`order-2 ${index % 2 === 0 ? "md:order-2" : "md:order-1"} flex-shrink-0`}>
                <div className="relative w-[100px] h-[100px] md:w-[150px] md:h-[150px]">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
