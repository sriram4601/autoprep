import React from "react"; // Import React for JSX functionality
import {
  Accordion,
  AccordionItem,
} from "@/app/components/ui/accordion"; // Import Accordion components for FAQ section - Updated to match actual implementation

// Array of FAQ items with questions and answers
const faqItems = [
  {
    id: "faq-1", // Unique identifier for the FAQ item
    question: "What payment methods do you accept?", // Question text
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. Payment information is securely processed and stored." // Answer text
  },
  {
    id: "faq-2", // Unique identifier for the FAQ item
    question: "Can I switch between plans?", // Question text
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference immediately. When downgrading, the new rate will apply at the start of your next billing cycle." // Answer text
  },
  {
    id: "faq-3", // Unique identifier for the FAQ item
    question: "Do you offer refunds?", // Question text
    answer: "We offer a 14-day money-back guarantee for all our plans. If you're not satisfied with our service, you can request a full refund within 14 days of your initial purchase." // Answer text
  },
  {
    id: "faq-4", // Unique identifier for the FAQ item
    question: "Is there a free trial available?", // Question text
    answer: "Yes, we offer a 7-day free trial for our Basic and Premium plans. No credit card is required to start your trial. You can upgrade to a paid plan at any time during or after your trial period." // Answer text
  },
  {
    id: "faq-5", // Unique identifier for the FAQ item
    question: "How does billing work for team plans?", // Question text
    answer: "Team plans are billed monthly or annually based on the number of active users. You can add or remove users at any time, and your billing will be adjusted accordingly at the start of the next billing cycle." // Answer text
  },
  {
    id: "faq-6", // Unique identifier for the FAQ item
    question: "Do you offer discounts for educational institutions?", // Question text
    answer: "Yes, we offer special pricing for educational institutions, non-profits, and students. Please contact our sales team for more information about our educational discounts." // Answer text
  },
  {
    id: "faq-7", // Unique identifier for the FAQ item
    question: "Can I cancel my subscription at any time?", // Question text
    answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged again after that." // Answer text
  }
];

// PricingFAQ component that displays frequently asked questions
export default function PricingFAQ() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      {/* Container for the FAQ section */}
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        
        {/* FAQ content container with maximum width and centered */}
        <div className="max-w-3xl mx-auto">
          {/* Accordion component for expandable FAQ items */}
          <Accordion className="w-full">
            {/* Map through the faqItems array to create accordion items */}
            {faqItems.map((item) => (
              <AccordionItem 
                key={item.id} 
                title={item.question}
                className="mb-4"
              >
                <p className="text-gray-600">{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
