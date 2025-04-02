import os
import google.generativeai as genai
from typing import List, Dict, Any, Optional
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.llms.gemini import Gemini

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
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        
        # Initialize the Gemini model
        self.llm = Gemini(
            model_name=model_name,
            api_key=api_key,
            temperature=0.3,  # Lower temperature for more focused and structured content
            top_p=0.9,
            max_tokens=4096,  # Allow for longer responses for comprehensive notes
        )
        
        # Initialize conversation history
        self.conversation_history = []
        self.current_subject = None
        
        # Define the system prompt for the notes generator
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
        
        # Add the system prompt to the conversation history
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
        # Add the user message to the conversation history
        self.conversation_history.append(
            ChatMessage(role=MessageRole.USER, content=message)
        )
        
        # Generate a response using the Gemini model
        response = self.llm.chat(self.conversation_history)
        
        # Add the assistant's response to the conversation history
        self.conversation_history.append(
            ChatMessage(role=MessageRole.ASSISTANT, content=response.message.content)
        )
        
        return response.message.content

    def generate_notes(self, topic: str, subject: Optional[str] = None) -> str:
        """
        Generate structured notes for a specific NEET topic.
        
        Args:
            topic (str): The specific topic to generate notes for
            subject (Optional[str]): The subject area (Physics, Chemistry, Biology)
            
        Returns:
            str: The generated notes
        """
        # Store the current subject
        self.current_subject = subject
        
        # Construct a prompt for generating notes
        prompt = f"Generate comprehensive notes for NEET aspirants on the topic: {topic}"
        if subject:
            prompt += f" in {subject}"
        
        # Use the chat method to generate notes
        return self.chat(prompt)

    def reset_conversation(self) -> None:
        """
        Reset the conversation history, keeping only the system prompt.
        """
        self.conversation_history = [
            ChatMessage(role=MessageRole.SYSTEM, content=self.system_prompt)
        ]
        self.current_subject = None
