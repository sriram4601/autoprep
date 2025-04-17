import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    id: "faq-1",
    question: "How Does LearnQ Utilize AI to Enhance Learning?",
    answer: "LearnQ uses AI to personalize the learning experience by analyzing student performance data and adapting content to individual needs. The platform employs machine learning algorithms to track progress, identify strengths and weaknesses, and provide tailored recommendations for improvement."
  },
  {
    id: "faq-2",
    question: "How Does LearnQ's Diagnostic Test Utilize AI?",
    answer: "LearnQ's AI-powered diagnostic test assesses a student's current knowledge and skill level by analyzing their responses to strategically chosen questions. The system then generates a personalized study plan that targets areas needing improvement while focusing on the student's learning style and pace."
  },
  {
    id: "faq-3",
    question: "What Are LearnQ's Play and Practice Tests?",
    answer: "LearnQ's Play and Practice tests are interactive, gamified learning modules designed to make test preparation engaging. These modules use game mechanics to motivate students while gathering performance data, which is then analyzed by our AI to track mastery and progress."
  },
  {
    id: "faq-4",
    question: "How Does Mia, the AI Tutor, Utilize AI to Guide Students?",
    answer: "Mia, our AI tutor, provides personalized learning support by answering questions, explaining concepts, and guiding students through problems. Using natural language processing and machine learning, Mia adapts her teaching style to match each student's needs and learning preferences."
  },
  {
    id: "faq-5",
    question: "What's Included in LearnQ's Premium Mock Test Package for the College Board Digital SAT?",
    answer: "LearnQ's Premium Mock Test Package includes full-length practice tests that mirror the format and difficulty of the actual Digital SAT, detailed performance analytics, personalized feedback on areas for improvement, and access to Mia for question-specific guidance and explanations."
  }
];

const FAQSection = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="learnq-container">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
          FAQs
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left text-gray-900 font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
