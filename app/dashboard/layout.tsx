'use client';

// This is the layout component for the dashboard
// It includes the sidebar, header, and main content area

import { useState, useEffect } from 'react'; // Import React hooks for state and effects
import { useRouter } from 'next/navigation'; // Import router for navigation
import { useAuth } from '../contexts/AuthContext'; // Import auth context
import Link from 'next/link'; // Import Link for navigation

// Define the props for the DashboardLayout component
interface DashboardLayoutProps {
  children: React.ReactNode; // Children components to render inside the layout
}

// Dashboard layout component
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Get user and signOut function from auth context
  const { user, signOut } = useAuth();
  // Get router for navigation
  const router = useRouter();
  // State for mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Effect to redirect if not authenticated
  useEffect(() => {
    // If no user is logged in, redirect to login page
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  // If no user, show loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Render the dashboard layout
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main dashboard layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Mobile overlay */}
        <div 
          className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        {/* Sidebar - Content */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link href="/dashboard" className="font-bold text-xl text-blue-600">
              AutoPrep
            </Link>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sidebar navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/notes" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Notes
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/chat" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Chat
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </li>
            </ul>
            
            {/* Sidebar footer with sign out button */}
            <div className="mt-8 pt-4 border-t">
              <button 
                onClick={signOut}
                className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 w-full"
              >
                <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </nav>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* User info */}
            <div className="flex items-center ml-auto">
              <span className="text-gray-700 mr-2">{user.email}</span>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.email && user.email.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
