'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './StudentChat.module.css'; // Reusing the same styles

// Define types for our messages
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function NotesChat() {
  // State for storing messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Notes Generator. What topic would you like me to create notes on?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  // State for the input field
  const [input, setInput] = useState('');
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for auto-scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Function to format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Function to send message to API
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Create a new message object
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages((prev) => [...prev, newMessage]);
    
    // Clear input field
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Send to API
      const response = await fetch('/api/notes/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your request.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  // Function to reset conversation
  const resetConversation = async () => {
    try {
      const response = await fetch('/api/notes/reset', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset conversation');
      }
      
      // Reset messages to initial state
      setMessages([
        {
          id: Date.now().toString(),
          text: "Hello! I'm your Notes Generator. What topic would you like me to create notes on?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error resetting conversation:', error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.avatarContainer}>
          <Image
            src="https://ui-avatars.com/api/?name=Notes+Generator&background=128C7E&color=fff"
            alt="Notes Generator"
            width={40}
            height={40}
            className={styles.avatar}
          />
          <span>Notes Generator</span>
        </div>
        <button 
          onClick={resetConversation}
          className={styles.resetButton}
          title="Reset Conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
          </svg>
        </button>
      </div>
      
      {/* Chat Body */}
      <div className={styles.chatBody}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            }`}
          >
            {message.text}
            <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            <div className={styles.loadingDots}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        )}
        
        {/* Invisible element for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Footer */}
      <div className={styles.chatFooter}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a topic..."
          className={styles.inputField}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className={`${styles.sendButton} ${
            isLoading || !input.trim() ? styles.sendButtonDisabled : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
