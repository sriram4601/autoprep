// Imagine you're getting a special label maker (Metadata) from a toolbox called "next".
// This is like telling the website, "I need a way to add information labels to my website."
import type { Metadata } from "next";

// This is like bringing in a style guide that applies to the entire website.
// Imagine importing a rulebook that says, "All pages should follow these design rules."
import "./globals.css";

// This is like getting a specific font (Inter) from Google's font collection.
// Think of it as ordering a specific style of handwriting from Google's handwriting store.
import { Inter } from "next/font/google";

// This creates a variable called inter that holds our main font.
// It's like setting up a special pen with the Inter handwriting style that anyone can use.
const inter = Inter({
  // This specifies we only need the Latin alphabet characters.
  // Imagine saying, "I only need the English letters, not Chinese or Arabic characters."
  subsets: ["latin"],
});

// This creates information that search engines and browsers can read about your website.
// It's like creating the cover page for a book, with the title and a brief description.
export const metadata: Metadata = {
  // This sets the title that appears in the browser tab.
  // Think of it as the title printed on the spine of a book.
  title: "AutoPrep AI - Educational Platform",
  // This is a short description of what the website is about.
  // Like the blurb on the back cover of a book that summarizes what it's about.
  description: "AI-powered educational platform with interactive agents for students",
};

// This imports the AuthProvider from the AuthContext.
// It's like bringing in a special security system for the house.
import { AuthProvider } from './contexts/AuthContext';

// This creates the main blueprint for how every page in your website should be structured.
// Think of it as designing the basic frame of a house that all rooms must fit within.
export default function RootLayout({
  // "children" represents whatever page content needs to go inside this layout.
  // Imagine this as a placeholder saying, "The specific room details will be added here later."
  children,
}: Readonly<{
  // This line defines what type of content "children" can be (React components).
  // It's like specifying, "This space can hold any standard room design that follows our building code."
  children: React.ReactNode;
}>) {
  // This returns the actual HTML structure that will wrap around every page.
  // Think of this as saying, "Here's how we'll build the frame of the house."
  return (
    // This creates the outermost HTML element and sets the language to English.
    // Like saying, "The house will have these outer walls, and the people inside speak English."
    <html lang="en">
      {/* This creates the body element where all visible content goes.
          Think of this as the interior space of the house where people actually live. */}
      <body
        // This applies our font and makes text smoother.
        // It's like saying, "Paint the interior walls with this specific paint, and make sure the finish is smooth."
        className={inter.className}
      >
        {/* This is where the actual page content (children) gets inserted, wrapped in the AuthProvider.
            Imagine this as saying, "And here's where the furniture and decorations for each specific room will go, with the security system in place." */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
