'use client';
import React from "react"; // Import React for JSX functionality

// Define the props interface for the Card component
interface CardProps {
  children: React.ReactNode; // Content inside the card
  className?: string; // Additional custom classes
}

// Define the props interface for the CardHeader component
interface CardHeaderProps {
  children: React.ReactNode; // Content inside the card header
  className?: string; // Additional custom classes
}

// Define the props interface for the CardTitle component
interface CardTitleProps {
  children: React.ReactNode; // Content inside the card title
  className?: string; // Additional custom classes
}

// Define the props interface for the CardDescription component
interface CardDescriptionProps {
  children: React.ReactNode; // Content inside the card description
  className?: string; // Additional custom classes
}

// Define the props interface for the CardContent component
interface CardContentProps {
  children: React.ReactNode; // Content inside the card content
  className?: string; // Additional custom classes
}

// Define the props interface for the CardFooter component
interface CardFooterProps {
  children: React.ReactNode; // Content inside the card footer
  className?: string; // Additional custom classes
}

// Card component that utilizes daisyUI card classes
export function Card({ children, className = "" }: CardProps) {
  // Combine all the classes
  const cardClasses = [
    "card", // Base daisyUI card class
    "bg-base-100", // Background color
    "shadow-xl", // Shadow effect
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the card element with all props and classes
  return <div className={cardClasses}>{children}</div>;
}

// CardHeader component for the top section of the card
export function CardHeader({ children, className = "" }: CardHeaderProps) {
  // Combine all the classes
  const headerClasses = [
    "card-header", // DaisyUI card header class
    "p-6", // Padding
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the card header element
  return <div className={headerClasses}>{children}</div>;
}

// CardTitle component for the card title
export function CardTitle({ children, className = "" }: CardTitleProps) {
  // Combine all the classes
  const titleClasses = [
    "card-title", // DaisyUI card title class
    "text-2xl", // Text size
    "font-bold", // Font weight
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the card title element
  return <h3 className={titleClasses}>{children}</h3>;
}

// CardDescription component for the card description
export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  // Combine all the classes
  const descriptionClasses = [
    "mt-2", // Margin top
    "text-gray-500", // Text color
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the card description element
  return <p className={descriptionClasses}>{children}</p>;
}

// CardContent component for the main content area of the card
export function CardContent({ children, className = "" }: CardContentProps) {
  // Combine all the classes
  const contentClasses = [
    "card-body", // DaisyUI card body class
    "p-6", // Padding
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the card content element
  return <div className={contentClasses}>{children}</div>;
}

// CardFooter component for the bottom section of the card
export function CardFooter({ children, className = "" }: CardFooterProps) {
  // Combine all the classes
  const footerClasses = [
    "card-actions", // DaisyUI card actions class
    "p-6", // Padding
    "pt-0", // No padding on top
    "justify-end", // Align items to the end
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the card footer element
  return <div className={footerClasses}>{children}</div>;
}
