"use client";

import { useEffect } from "react"; // Import React hooks for side effects
import { useRouter } from "next/navigation"; // Import Next.js router for navigation
import { useAuth } from "../../contexts/AuthContext"; // Import auth context for user authentication
import dynamic from "next/dynamic"; // Import dynamic for lazy loading components
import Link from "next/link"; // Import Link component for navigation

// Dynamically import the StudentChat component with loading state
const StudentChat = dynamic(() => import('../../components/StudentChat'), {
  ssr: false, // Disable server-side rendering
  loading: () => <p className="text-center p-4">Loading student chat interface...</p> // Loading state while component loads
});

// Dashboard header component with navigation - reused across dashboard pages
const DashboardHeader = () => {
  const { user, signOut } = useAuth(); // Get user and signOut function from auth context
  const router = useRouter(); // Initialize router for navigation

  // Handle sign out
  const handleSignOut = async () => {
    await signOut(); // Sign out user
    router.push("/"); // Redirect to home page
  };

  return (
    <header className="py-4 border-b border-gray-100 bg-white z-50 sticky top-0">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            AutoPrep<span className="text-sm">.ai</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/dashboard/student" className="text-blue-600 font-medium">
            Student AI
          </Link>
          <Link href="/dashboard/notes" className="text-gray-600 hover:text-blue-600">
            Notes Generator
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <span className="text-gray-600">
            {user?.email}
          </span>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile menu button - simplified for this example */}
        <div className="md:hidden">
          <Link href="/dashboard" className="p-2 text-gray-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
};

// Student AI chat page component
export default function StudentChatPage() {
  const { user, isLoading } = useAuth(); // Get user and loading state from auth context
  const router = useRouter(); // Initialize router for navigation

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // If not authenticated and not loading, don't render the content
  if (!user) {
    return null;
  }

  // Render student chat interface for authenticated users
  return (
    <>
      <DashboardHeader /> {/* Custom header for authenticated users */}
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Student AI Assistant
            </h1>
            <p className="text-gray-600">
              Ask questions about any topic and get detailed explanations tailored to your learning style.
            </p>
          </div>
          
          {/* Chat interface */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-semibold">Chat with Student AI</h2>
              <p className="text-sm opacity-80">Your personal AI tutor is ready to help</p>
            </div>
            <div className="h-[600px]"> {/* Fixed height container for chat */}
              <StudentChat /> {/* The actual chat component */}
            </div>
          </div>
          
          {/* Tips section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Tips for effective learning
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Ask specific questions for more detailed answers</li>
              <li>• Request examples to better understand concepts</li>
              <li>• Ask for simpler explanations if something is unclear</li>
              <li>• Try to rephrase concepts in your own words to test understanding</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
