'use client';
import React, { useState } from "react"; // Import React and useState hook for managing accordion state

// Define the props interface for the Accordion component
interface AccordionProps {
  children: React.ReactNode; // Content inside the accordion (AccordionItem components)
  className?: string; // Additional custom classes
}

// Define the props interface for the AccordionItem component
interface AccordionItemProps {
  title: string; // Title of the accordion item
  children: React.ReactNode; // Content inside the accordion item
  className?: string; // Additional custom classes
  defaultOpen?: boolean; // Whether the accordion item is open by default
}

// Accordion component that contains multiple accordion items
export function Accordion({ children, className = "" }: AccordionProps) {
  // Combine all the classes
  const accordionClasses = [
    "join", // DaisyUI join class for grouping items
    "join-vertical", // Stack items vertically
    "w-full", // Full width
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the accordion container with all its children
  return <div className={accordionClasses}>{children}</div>;
}

// AccordionItem component for individual collapsible sections
export function AccordionItem({ 
  title, 
  children, 
  className = "", 
  defaultOpen = false 
}: AccordionItemProps) {
  // State to track whether this accordion item is open
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Toggle the open state when clicked
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // Combine all the classes for the container
  const itemClasses = [
    "collapse", // DaisyUI collapse class
    "collapse-arrow", // Add arrow indicator
    "border", // Add border
    "border-base-300", // Border color
    "rounded-box", // Rounded corners
    isOpen ? "collapse-open" : "collapse-close", // Apply open or closed state
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the accordion item with title and collapsible content
  return (
    <div className={itemClasses}>
      {/* Title bar that can be clicked to toggle */}
      <div 
        className="collapse-title text-xl font-medium" 
        onClick={toggleAccordion}
      >
        {title}
      </div>
      {/* Content area that shows/hides based on state */}
      <div className="collapse-content">
        {children}
      </div>
    </div>
  );
}
