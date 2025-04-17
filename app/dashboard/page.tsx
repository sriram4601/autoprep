"use client";

import { useEffect, useState } from "react"; // Import React hooks for state and side effects
import { useRouter } from "next/navigation"; // Import Next.js router for navigation
import Link from "next/link"; // Import Link component for navigation
import { useAuth } from "../contexts/AuthContext"; // Import auth context for user authentication
import dynamic from "next/dynamic"; // Import dynamic for lazy loading components

// Dynamically import the chat components with loading states
const StudentChat = dynamic(() => import('../components/StudentChat'), {
  ssr: false, // Disable server-side rendering
  loading: () => <p className="text-center p-4">Loading student chat interface...</p> // Loading state while component loads
});

const NotesChat = dynamic(() => import('../components/NotesChat'), {
  ssr: false, // Disable server-side rendering
  loading: () => <p className="text-center p-4">Loading notes generator...</p> // Loading state while component loads
});

// Dashboard header component with user info and navigation
const DashboardHeader = () => {
  const { user, signOut } = useAuth(); // Get user and signOut function from auth context
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
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

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600"
          >
            {/* Menu icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 space-y-3">
              <span className="block text-gray-600 py-2">
                {user?.email}
              </span>
              <button 
                onClick={handleSignOut}
                className="block w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-center"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

// Define interface for ChatListItem props to properly type all parameters
interface ChatListItemProps {
  title: string; // Type for the title of the chat item
  description: string; // Type for the description of the chat item
  icon: React.ReactNode; // Type for the icon, which can be any valid React node
  isActive: boolean; // Type for the active state flag
  onClick: () => void; // Type for the onClick handler function that doesn't return anything
}

// Chat list item component with properly typed props
const ChatListItem = ({ title, description, icon, isActive, onClick }: ChatListItemProps) => {
  // Chat list item component that resembles WhatsApp chat list items
  return (
    <div 
      className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-blue-50' : ''}`}
      onClick={onClick}
    >
      {/* Chat icon/avatar */}
      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
        {icon}
      </div>
      
      {/* Chat info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
    </div>
  );
};

// Dashboard page component
export default function DashboardPage() {
  const { user, isLoading } = useAuth(); // Get user and loading state from auth context
  const router = useRouter(); // Initialize router for navigation
  const [activeChat, setActiveChat] = useState('student'); // State to track which chat is active

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

  // If not authenticated and not loading, don't render the dashboard content
  if (!user) {
    return null;
  }

  // List of available chats
  const chats = [
    {
      id: 'student',
      title: 'Student AI',
      description: 'Ask questions about any topic',
      icon: 'S',
    },
    {
      id: 'notes',
      title: 'Notes Generator',
      description: 'Create organized study notes',
      icon: 'N',
    }
  ];

  // Render dashboard content for authenticated users
  return (
    <>
      <DashboardHeader /> {/* Custom header for authenticated users */}
      
      <div className="flex h-[calc(100vh-73px)]"> {/* Full height minus header height */}
        {/* Chat list sidebar (left side) */}
        <div className="w-full md:w-80 border-r bg-white flex-shrink-0 overflow-y-auto">
          {/* User info section */}
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold text-gray-800">Your AI Assistants</h2>
            <p className="text-sm text-gray-500">Select an assistant to chat with</p>
          </div>
          
          {/* Chat list */}
          <div className="divide-y">
            {chats.map(chat => (
              <ChatListItem
                key={chat.id}
                title={chat.title}
                description={chat.description}
                icon={chat.icon}
                isActive={activeChat === chat.id}
                onClick={() => setActiveChat(chat.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Chat content (right side) */}
        <div className="flex-grow flex flex-col bg-gray-100">
          {/* Chat header */}
          <div className="bg-white p-4 border-b flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
              {activeChat === 'student' ? 'S' : 'N'}
            </div>
            <div>
              <h3 className="font-medium">
                {activeChat === 'student' ? 'Student AI' : 'Notes Generator'}
              </h3>
              <p className="text-xs text-gray-500">
                {activeChat === 'student' 
                  ? 'Ask questions about any topic' 
                  : 'Create organized study notes'}
              </p>
            </div>
          </div>
          
          {/* Chat content area */}
          <div className="flex-grow overflow-hidden">
            {activeChat === 'student' ? (
              <StudentChat />
            ) : (
              <NotesChat />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
