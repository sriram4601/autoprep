"use client";

// Features data for AutoPrep AI Agents
const featuresData = [
  {
    id: "student-ai",
    title: "Interactive Student AI",
    description: "Engage with our AI agent that simulates student-like conversations to help you explore topics, ask questions, and deepen your understanding through interactive dialogue.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-600">
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
        <path d="M17.5 8a2.5 2.5 0 0 0 -2.5 -2.5"></path>
        <path d="M19.5 10a4.5 4.5 0 0 0 -4.5 -4.5"></path>
        <path d="M21.5 12a6.5 6.5 0 0 0 -6.5 -6.5"></path>
        <path d="M12 7l0 5l3 3"></path>
      </svg>
    )
  },
  {
    id: "notes-generator",
    title: "Smart Notes Generator",
    description: "Transform complex topics into well-structured study notes with our AI-powered notes generator. Save time and focus on learning rather than note-taking.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-600">
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M18 18v-7h-7"></path>
        <path d="M18 18v2a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-15a2 2 0 0 1 2 -2h7l6 6z"></path>
        <path d="M9 15l-1 -1l1 -1"></path>
        <path d="M12 13l1 1l-1 1"></path>
      </svg>
    )
  },
  {
    id: "personalized-learning",
    title: "Personalized Learning Path",
    description: "Receive customized learning recommendations based on your interactions with our AI agents. Our system adapts to your knowledge level and learning style.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-600">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0 -3 -3h-7z"></path>
        <path d="M22 3h-6a4 4 0 0 0 -4 4v14a3 3 0 0 1 3 -3h7z"></path>
      </svg>
    )
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powered by LlamaIndex AI
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our intelligent agents leverage advanced LlamaIndex technology to provide personalized, 
            interactive learning experiences that adapt to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {featuresData.map((feature) => (
            <div key={feature.id} className="bg-gray-50 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              <button className="mt-6 text-blue-600 font-medium hover:text-blue-800">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
