"use client";

import { useState } from "react"; 
import Link from "next/link"; 
import { useAuth } from "../contexts/AuthContext"; 

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const { user, signOut } = useAuth(); 

  const handleSignOut = async () => {
    await signOut(); 
  };

  return (
    <header className="py-4 border-b border-gray-100 bg-white z-50 sticky top-0">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AutoPrep<span className="text-sm">.ai</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-blue-600">
            Blog
          </Link>
          {user && (
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-600">
                {user.email}
              </span>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-blue-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4 space-y-3">
              {user ? (
                <>
                  <span className="block text-gray-600 py-2">
                    {user.email}
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-center">
                    Login
                  </Link>
                  <Link href="/signup" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
