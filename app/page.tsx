"use client";

import Header from './components/Header'; 
import HeroSection from './components/HeroSection'; 
import FeaturesSection from './components/FeaturesSection'; 
import dynamic from 'next/dynamic'; 

// Dynamic imports for StudentChat and NotesChat removed as they're no longer used on the homepage

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* Chat Interfaces Section removed as requested */}
        
        {/* Testimonials Section */}
        
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">AutoPrep<span className="text-sm">.ai</span></h3>
              <p className="text-gray-400 mt-2">AI-powered educational platform</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-medium mb-3">Navigation</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/" className="hover:text-white">Home</a></li>
                  <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                  <li><a href="/blog" className="hover:text-white">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p> 2025 AutoPrep - AI Educational Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
