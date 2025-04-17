import os  # Import the operating system module for environment variables and file operations
import google.generativeai as genai  # Import Google's Generative AI library for direct API access
from typing import List, Dict, Any, Optional  # Import type hints for better code documentation and IDE support
from llama_index.core.llms import ChatMessage, MessageRole  # Import classes for structured chat messages and role definitions
from llama_index.llms.gemini import Gemini  # Import the Gemini model wrapper from LlamaIndex

class NotesGeneratorAgent:
    """
    An agent that generates structured notes for NEET exam aspirants based on specific topics.
    Uses Google's Gemini model to generate high-quality, concise, and well-organized notes.
    """

    def __init__(self, api_key: str, model_name: str = "models/gemini-1.5-flash-8b"):
        """
        Initialize the NotesGeneratorAgent with the given API key and model.
        
        Args:
            api_key (str): Google API key for accessing the Gemini model
            model_name (str): Name of the Gemini model to use
        """
        # Configure the Gemini API with the provided API key
        genai.configure(api_key=api_key)
        
        # Initialize the Gemini model with specific parameters for note generation
        self.llm = Gemini(
            model_name=model_name,  # Specify which Gemini model to use
            api_key=api_key,  # Pass the API key for authentication
            temperature=0.3,  # Lower temperature for more focused and structured content
            top_p=0.9,  # Control diversity while maintaining coherence
            max_tokens=4096,  # Allow for longer responses for comprehensive notes
        )
        
        # Initialize an empty list to store the conversation history
        self.conversation_history = []
        
        # Define the system prompt that guides the AI to generate well-structured notes
        self.system_prompt = """
        You are an AI assistant that generates high-quality, structured notes for NEET exam aspirants in India. 
        Your notes should be concise, well-organized, and aligned with the NEET syllabus and NCERT books of classes 11 and 12.

        Instructions:

        Understand the Topic
        - Identify the core concepts of the given topic.
        - Break down complex ideas into simpler explanations.
        - Use relevant formulas, rules, and shortcut techniques where applicable.

        Structure the Notes
        - Title: Clearly mention the topic name.
        - Introduction: A brief overview of the topic and its importance in the NEET exam.
        - Key Concepts: Define key terms and concepts concisely.
        - Formulas & Shortcuts: List important formulas and shortcut techniques.
        - Step-by-Step Approaches: Provide structured methods to solve related problems.
        - Examples: Include at least 2-3 solved examples with step-by-step solutions.
        - Common Mistakes & Tips: Highlight pitfalls students should avoid.
        - Practice Questions: Suggest 3-5 practice questions with varying difficulty levels.

        Language & Tone
        - Keep the language simple, clear, and student-friendly.
        - Use bullet points, tables, and diagrams where necessary for better comprehension.
        - Maintain a neutral and encouraging tone.

        Additional Features
        - Mnemonics & Memory Aids: Provide memory techniques to recall concepts easily.
        
        When a user asks for notes on a specific topic, first identify the subject area (Physics, Chemistry, Biology) 
        and then generate comprehensive notes following the structure above. If the topic is too broad, ask for 
        clarification to narrow it down.
        
        Format your response using markdown for better readability.
        """
        
        # Add the system prompt to the conversation history as a system message
        self.conversation_history.append(
            ChatMessage(role=MessageRole.SYSTEM, content=self.system_prompt)
        )

    def chat(self, message: str) -> str:
        """
        Process the user message and generate a response.
        
        Args:
            message (str): The user's message requesting notes on a specific topic
            
        Returns:
            str: The generated notes or clarification question
        """
        # Add the user message to the conversation history with the USER role
        self.conversation_history.append(
            ChatMessage(role=MessageRole.USER, content=message)
        )
        
        # Generate a response using the Gemini model based on the full conversation history
        response = self.llm.chat(self.conversation_history)
        
        # Add the assistant's response to the conversation history with the ASSISTANT role
        self.conversation_history.append(
            ChatMessage(role=MessageRole.ASSISTANT, content=response.message.content)
        )
        
        # Return the text content of the response
        return response.message.content

    def reset(self) -> None:
        """
        Reset the conversation history, keeping only the system prompt.
        """
        # Reset the conversation history to only contain the system prompt
        self.conversation_history = [
            ChatMessage(role=MessageRole.SYSTEM, content=self.system_prompt)
        ]
