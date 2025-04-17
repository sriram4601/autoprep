import React from "react"; // Import React for JSX functionality

// Define the props interface for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "link" | "outline"; // Different button variants from daisyUI
  size?: "xs" | "sm" | "md" | "lg"; // Different button sizes from daisyUI
  children: React.ReactNode; // Content inside the button
  className?: string; // Additional custom classes
}

// Button component that utilizes daisyUI button classes
export function Button({
  children,
  className = "",
  variant = "primary", // Default to primary variant
  size = "md", // Default to medium size
  ...props
}: ButtonProps) {
  // Combine all the classes based on props
  const buttonClasses = [
    "btn", // Base daisyUI button class
    variant && `btn-${variant}`, // Add variant class if provided
    size && `btn-${size}`, // Add size class if provided
    className, // Add any custom classes
  ]
    .filter(Boolean) // Remove falsy values
    .join(" "); // Join all classes with a space

  // Return the button element with all props and classes
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
