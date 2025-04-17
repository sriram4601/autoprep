import os
from typing import List, Dict, Any
from llama_index.core.settings import Settings
from llama_index.llms.gemini import Gemini
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.chat_engine import SimpleChatEngine

class StudentAgent:
    """
    An AI agent that simulates a curious student who asks thoughtful questions
    to explore topics deeply.
    """
    
    def __init__(self, api_key: str, model_name: str = "models/gemini-1.5-flash-8b"):
        """
        Initialize the student agent with the necessary components.
        
        Args:
            api_key: Google API key
            model_name: Name of the Gemini model to use
        """
        # Set up Google API key
        os.environ["GOOGLE_API_KEY"] = api_key
        
        # Create LLM
        self.llm = Gemini(model_name=model_name, temperature=0.7)
        
        # Create memory buffer for conversation history
        self.memory = ChatMemoryBuffer.from_defaults(token_limit=4096)
        
        # Create the student agent system prompt
        self.system_prompt = """
        You are a curious student who asks thoughtful questions to explore topics deeply.
        
        When interacting with a teacher:
        1. Ask for examples and clarification of key concepts
        2. Request explanations from different perspectives (simple to complex)
        3. Ask for concise summaries of important points
        4. Seek clarification on specific terminology
        5. Compare and contrast related concepts
        6. Ask about the broader significance and implications
        7. Pose reflective questions that encourage deeper thinking
        8. Connect concepts to real-world examples and pop culture
        9. Relate new information to previously discussed topics
        10. Handle uncertainty gracefully and move conversations forward
        11. Request further breakdowns of complex ideas
        12. Follow up with questions even when answers seem complete
        13. Ask "why" and "how" questions to promote dialogue
        14. Adapt your questions based on the teacher's responses
        15. Transition smoothly between topics when needed
        
        Use the conversation history to reference previous topics when appropriate.
        """
        
        # Create the chat engine
        self.chat_engine = self._create_chat_engine()
    
    def _create_chat_engine(self):
        """Create a simple chat engine using the LLM and memory"""
        return SimpleChatEngine(
            llm=self.llm,
            prefix_messages=[ChatMessage(role=MessageRole.SYSTEM, content=self.system_prompt)],
            memory=self.memory
        )
    
    def add_knowledge(self, text: str) -> None:
        """
        Add knowledge to the student agent's memory.
        
        Args:
            text: Text to add as knowledge
        """
        # Store knowledge in memory
        self.memory.put(ChatMessage(role=MessageRole.SYSTEM, content=f"Knowledge: {text}"))
    
    def chat(self, message: str) -> str:
        """
        Process a message from the teacher and generate a response.
        
        Args:
            message: The message from the teacher
            
        Returns:
            The student agent's response
        """
        response = self.chat_engine.chat(message)
        return response.response
    
    def reset(self) -> None:
        """
        Reset the conversation history.
        """
        self.memory.reset()
        self.chat_engine = self._create_chat_engine()


# Example usage
if __name__ == "__main__":
    # Replace with your actual Google API key
    api_key = "your_google_api_key_here"
    
    # Create the student agent
    agent = StudentAgent(api_key)
    
    # Chat with the agent
    response = agent.chat("Let me tell you about photosynthesis. It's the process by which plants convert light energy into chemical energy.")
    print(f"Student: {response}")
