// Imagine you're getting a specific tool (like a special wrench) from a toolbox.
// This line imports the "dynamic" tool from the "next/dynamic" toolbox, which helps load components only when they're needed.
import dynamic from 'next/dynamic';

// Think of this as requesting a special helper that will arrive later, only when needed.
// We're asking for the StudentChat component, but telling the system to only load it when the page is actually shown in the browser.
// "ssr: false" means "don't try to prepare this on the server side, wait until we're in the browser"
// The loading message is what shows while we're waiting for the component to arrive.
const StudentChat = dynamic(() => import('./components/StudentChat'), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading chat interface...</p>
});

// Similarly, we're requesting the NotesChat component to load only when needed
const NotesChat = dynamic(() => import('./components/NotesChat'), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading notes generator...</p>
});

// This is like the main blueprint for the homepage of our website.
// "export default" means this is the primary blueprint we're sharing.
// "function Home()" is like naming the blueprint "Homepage Plan".
export default function Home() {
  // This is like saying, "Here's what the homepage will look like."
  return (
    // Think of this as the main container or the room where everything on the page lives.
    // "container mx-auto py-8" means it's a standard-sized container, centered horizontally, with padding at the top and bottom.
    <div className="container mx-auto py-8">
      {/* This is like the sign at the top of the page, telling visitors what they're looking at. */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AutoPrep AI Agents</h1>
        <p className="text-gray-600">
          Chat with our AI agents to explore topics and generate study notes
        </p>
      </header>

      {/* This is the main section of the room, where the primary content goes. */}
      {/* "max-w-4xl mx-auto" means it won't get too wide, and stays centered on the page. */}
      <main className="max-w-4xl mx-auto">
        {/* First chat interface - Student AI */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Student AI</h2>
          <StudentChat />
        </div>
        
        {/* Second chat interface - Notes Generator */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Notes Generator</h2>
          <NotesChat />
        </div>
      </main>

      {/* This is the footer section, like the bottom border or baseboard of the room. */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p> 2025 AutoPrep - AI Educational Platform</p>
      </footer>
    </div>
  );
}
