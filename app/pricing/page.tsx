import React from "react"; // Import React for JSX functionality
import PricingSection from "@/app/components/PricingSection"; // Fixed import path using absolute path with @/app prefix
import PricingFAQ from "@/app/components/PricingFAQ"; // Fixed import path using absolute path with @/app prefix

export default function PricingPage() {
  // Main component for the pricing page
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Container for the entire pricing page */}
      <div className="w-full">
        {/* Title section for the pricing page */}
        <div className="py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Pricing Plans
          </h1>
          {/* Subtitle explaining the pricing structure */}
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. We offer flexible options to help you succeed.
          </p>
        </div>
        
        {/* Render the PricingSection component that contains the pricing cards */}
        <PricingSection />
        
        {/* Render the PricingFAQ component that contains frequently asked questions */}
        <PricingFAQ />
      </div>
    </main>
  );
}
