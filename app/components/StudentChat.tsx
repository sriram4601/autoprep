// This tells the code: "You'll run in the visitor's web browser, not on our server" - like saying "this meal is to-go, not for dining in"
'use client';

// Bringing in the tools we need - like gathering ingredients before cooking a meal
import { useState, useRef, useEffect } from 'react'; // These are special tools that help manage the chat's memory and behavior
import Image from 'next/image'; // This is a tool that helps display pictures efficiently - like a special photo frame
import styles from './StudentChat.module.css'; // This imports our design styles - like bringing in a decorating guide for the room

// Define what a message looks like - similar to creating a template for postcards
// Think of this as describing what information needs to be on each message card
type Message = {
  id: string; // A unique identifier - like giving each postcard a serial number
  text: string; // The actual message content - like what you write on the postcard
  sender: 'user' | 'bot'; // Who sent it - like marking whether the postcard is from you or your friend
  timestamp: Date; // When it was sent - like putting a date stamp on the postcard
};

// This is the main function that creates our chat interface
// Like building a house, we start with the foundation and add rooms and features
export default function StudentChat() {
  // This is like a bulletin board where we pin all our messages
  // useState is like a special board that remembers what's pinned to it, even when you look away
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1', // The first message's ID - like "postcard #1"
      text: "Hello! I'm your Student AI. I'm curious about any topic you'd like to teach me. What would you like to discuss today?", // The welcome message - like the greeting on the first postcard
      sender: 'bot', // This message is from the AI - like saying "this postcard is from your friend"
      timestamp: new Date(), // Current time - like stamping today's date on the postcard
    },
  ]);
  
  // This is like a notepad where we write our message before sending it
  // useState for input is like a magical notepad that remembers what you've written
  const [input, setInput] = useState('');
  
  // This is like a "busy" sign we can flip on and off
  // When true, it shows the AI is thinking - like a "please wait" sign at a reception desk
  const [isLoading, setIsLoading] = useState(false);
  
  // This is like a bookmark that helps us find the bottom of our chat
  // useRef is like a sticky note that helps us quickly find a specific page in a book
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // This function automatically scrolls to the bottom of the chat
  // Like having an assistant who always makes sure the newest postcards are visible
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Smoothly scroll to the bookmark - like gently turning pages to the bookmark
  };
  
  // This makes sure we scroll down whenever new messages arrive
  // Like telling the assistant "whenever new postcards arrive, make sure they're visible"
  useEffect(() => {
    scrollToBottom(); // Call the scrolling function - like saying "please show me the newest postcards"
  }, [messages]); // Only do this when messages change - like saying "only when new postcards arrive"
  
  // This formats the time to look nice - like having a pretty date stamp
  // Instead of "2:05:33 PM" it shows "2:05 PM" - like simplifying a long address
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time to show only hours and minutes
  };
  
  // This function sends our message to the AI and gets a response
  // Like mailing a letter and waiting for a reply
  const sendMessage = async () => {
    if (!input.trim()) return; // If the message is empty, do nothing - like not sending an empty envelope
    
    // Create a new message from what the user typed
    // Like preparing a new postcard with what you've written
   const newMessage: Message = {
      id: Date.now().toString(), // Generate a unique ID based on current time - like numbering your postcard
      text: input, // The message text - like what you wrote on the postcard
      sender: 'user', // This message is from the user - like marking the postcard as "from me"
      timestamp: new Date(), // Current time - like stamping today's date
    };
    
    // Add the user's message to the chat
    // Like pinning your postcard to the bulletin board
    setMessages((prev) => [...prev, newMessage]); // Add new message to existing ones - like adding a new postcard to the collection
    
    // Clear the input field after sending
    // Like wiping the notepad clean after writing a letter
    setInput('');
    
    // Turn on the "busy" sign to show we're waiting for the AI
    // Like flipping the sign from "open" to "busy"
    setIsLoading(true);
    
    try {
      // Send the message to our AI service
      // Like dropping your letter in a mailbox and waiting for delivery
      const response = await fetch('/api/student/chat', { // Send to this address - like addressing an envelope
        method: 'POST', // Use POST method - like specifying "priority mail"
        headers: {
          'Content-Type': 'application/json', // Specify the format - like saying "this is a text letter, not a package"
        },
        body: JSON.stringify({ message: input }), // Convert the message to the right format - like putting your letter in the proper envelope
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok'); // If something goes wrong, report it - like the mail carrier saying "delivery failed"
      }
      
      const data = await response.json(); // Get the AI's response - like opening the reply letter
      
      // Create a message from the AI's response
      // Like creating a new postcard with the reply you received
      const botResponse: Message = {
        id: (Date.now() + 1).toString(), // Generate a unique ID - like numbering the reply postcard
        text: data.response, // The AI's response text - like what your friend wrote back
        sender: 'bot', // This message is from the AI - like marking the postcard as "from your friend"
        timestamp: new Date(), // Current time - like stamping today's date
      };
      
      // Add the AI's response to the chat
      // Like pinning the reply postcard to the bulletin board
      setMessages((prev) => [...prev, botResponse]); // Add bot message to existing ones - like adding the reply to your collection
    } catch (error) {
      console.error('Error:', error); // Log any errors - like making a note of delivery problems
      
      // If something goes wrong, show an error message
      // Like getting a "delivery failed" notice instead of a reply
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(), // Generate a unique ID - like numbering the error notice
        text: 'Sorry, there was an error processing your request.', // Error message - like what the error notice says
        sender: 'bot', // This message is from the system - like the notice coming from the post office
        timestamp: new Date(), // Current time - like today's date on the notice
      };
      
      // Add the error message to the chat
      // Like pinning the error notice to the bulletin board
      setMessages((prev) => [...prev, errorMessage]); // Add error message to existing ones
    } finally {
      // Turn off the "busy" sign, we're done waiting
      // Like flipping the sign back from "busy" to "open"
      setIsLoading(false); // Reset loading state - like saying "we're ready for the next message"
    }
  };
  
  // This handles when someone presses Enter in the input field
  // Like setting up a shortcut - "pressing Enter = clicking Send"
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // If the Enter key was pressed - like checking "did they press the shortcut button?"
      sendMessage(); // Send the message - like activating the "mail this letter" process
    }
  };
  
  // This function resets the entire conversation
  // Like taking down all postcards and starting fresh with just a welcome card
  const resetConversation = async () => {
    try {
      // Tell the server to reset the conversation
      // Like asking the post office to clear your mailbox
      const response = await fetch('/api/student/reset', { // Send to this address - like addressing a "reset request" envelope
        method: 'POST', // Use POST method - like specifying "priority mail"
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset conversation'); // If something goes wrong, report it - like the mail carrier saying "reset failed"
      }
      
      // Reset the messages to just the welcome message
      // Like taking down all postcards and putting up just a new welcome card
      setMessages([
        {
          id: Date.now().toString(), // Generate a unique ID - like numbering the new welcome postcard
          text: "Hello! I'm your Student AI. I'm curious about any topic you'd like to teach me. What would you like to discuss today?", // Welcome message - like what's written on the welcome card
          sender: 'bot', // This message is from the AI - like marking the card as "from your friend"
          timestamp: new Date(), // Current time - like stamping today's date
        },
      ]);
    } catch (error) {
      console.error('Error resetting conversation:', error); // Log any errors - like making a note of reset problems
    }
  };

  // This is the visual layout of our chat interface
  // Like the blueprint for how our chat room looks
  return (
    <div className={styles.chatContainer} style={{
      maxWidth: 'none', // Remove max-width constraint to fill available space
      margin: '0', // Remove margin to use full available space
      height: '100%', // Use full height
      display: 'flex', // Use flexbox for layout
      flexDirection: 'column', // Stack children vertically
      borderRadius: '0', // Remove border radius since it's now part of the dashboard
      boxShadow: 'none' // Remove box shadow since it's contained in the dashboard
    }}>
      {/* The main chat area - header removed since dashboard already has one */}
      <div className={styles.chatBody} style={{ 
        height: 'calc(100vh - 180px)', // Adjust height to fill available space minus header and footer
        maxHeight: 'none', // Remove any max height restriction
        overflowY: 'auto' // Enable vertical scrolling
      }}>
        {/* For each message, create a message bubble - like creating a visual card for each message */}
        {messages.map((message) => (
          <div
            key={message.id} // Unique identifier - like numbering each card so React knows which is which
            className={`${styles.message} ${
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            }`} // Apply styling based on sender - like using green cards for your messages and white for replies
          >
            {message.text} {/* The message content - like what's written on the card */}
            <div className={styles.messageTime}>{formatTime(message.timestamp)}</div> {/* The time stamp - like the date on the card */}
          </div>
        ))}
        
        {/* Show loading animation when waiting for a response - like a "thinking..." indicator */}
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}> {/* Style it like a bot message - like using the same card style */}
            <div className={styles.loadingDots}> {/* Container for the dots - like a small box for the animation */}
              <div className={styles.dot}></div> {/* First dot - like the first bouncing ball */}
              <div className={styles.dot}></div> {/* Second dot - like the second bouncing ball */}
              <div className={styles.dot}></div> {/* Third dot - like the third bouncing ball */}
            </div>
          </div>
        )}
        
        {/* Invisible marker at the bottom - like the bookmark we use to find the newest messages */}
        <div ref={messagesEndRef} /> {/* This is where we scroll to - like the target for our auto-scroll */}
      </div>
      
      {/* The input area at the bottom - like the desk where you write new messages */}
      <div className={styles.chatFooter}>
        <input
          type="text" // Input type - like specifying "this is for text, not numbers"
          value={input} // Current text - like what's currently written on the notepad
          onChange={(e) => {
            console.log('Input changed:', e.target.value); // DEBUG: Log input changes
            setInput(e.target.value);
          }} // Update when typing - like recording each letter as it's written
          onKeyPress={handleKeyPress} // Check for Enter key - like watching for the shortcut key
          placeholder="Type a message..." // Hint text - like faint guide text on the notepad
          className={styles.inputField} // Apply styling - like choosing a nice notepad design
        />
        <button
          onClick={sendMessage} // What happens when clicked - like connecting the button to the "send" action
          disabled={isLoading || !input.trim()} // Disable when loading or empty - like graying out the button when it shouldn't be used
          className={`${styles.sendButton} ${
            isLoading || !input.trim() ? styles.sendButtonDisabled : ''
          }`} // Apply styling - like choosing how the button looks, and making it look disabled when it is
        >
          {/* This is an SVG icon of a paper airplane - like a small picture of a "send" symbol */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/> {/* The shape of the paper airplane - like the drawing instructions */}
          </svg>
        </button>
      </div>
    </div>
  );
}
