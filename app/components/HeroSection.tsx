"use client";

import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Study Smarter with
              <br />
              <span className="text-blue-600">AI-Powered Agents</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Personalized learning experiences with LlamaIndex-powered AI agents that help you master concepts faster and generate comprehensive study notes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-medium">
                Try Student AI
              </button>
              <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-lg font-medium">
                Generate Notes
              </button>
            </div>
          </div>
          <div className="relative z-10">
            <div className="relative w-full h-[400px] md:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 w-full h-full flex flex-col">
                  <div className="bg-blue-600 text-white p-3 rounded-t-lg">
                    <h3 className="font-medium">AutoPrep Student AI</h3>
                  </div>
                  <div className="flex-grow bg-white p-4 flex flex-col">
                    <div className="bg-gray-100 p-3 rounded-lg mb-3 max-w-[80%]">
                      <p>Can you help me understand quantum mechanics?</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg mb-3 max-w-[80%] self-end">
                      <p>Of course! Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles.</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg mb-3 max-w-[80%] self-end">
                      <p>Let's start with the key concepts: wave-particle duality, uncertainty principle, and quantum superposition...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-50 opacity-50 blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full bg-indigo-50 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-cyan-50 opacity-50 blur-3xl" />
    </section>
  );
};

export default HeroSection;
