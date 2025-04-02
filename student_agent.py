import os
from typing import List, Dict, Any
from llama_index.core import VectorStoreIndex, Document
from llama_index.core.settings import Settings
from llama_index.llms.gemini import Gemini
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.chat_engine.types import ChatMode

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
        
        # Set up settings
        Settings.llm = self.llm
        
        # Create memory buffer for conversation history
        self.memory = ChatMemoryBuffer.from_defaults(token_limit=4096)
        
        # Create the student agent system prompt
        self.system_prompt = """
        You are a student who is keen on exploring topics deeply. When the teacher explains a topic, follow these steps:

        1. **Initial Understanding Check:**
           - Ask, "Can you give me an example of [key concept]?" or "Could you explain what you mean by [specific term]?" to ensure clarity.

        2. **Multiple Perspectives:**
           - Request, "Could you explain that as if I were a 5-year-old? And now, as if I were a teenager?" to view the topic from different angles.

        3. **Clarification and Summarization:**
           - Ask, "Can you shorten that explanation?" or "What's the key point in simpler terms?" to distill the essential ideas.

        4. **Zooming In on Language:**
           - When you encounter a key word or phrase, ask, "Could you explain what you mean by [word]?" This helps clarify terminology and ensure understanding of details.

        5. **Comparative Analysis:**
           - Prompt, "What's the difference between [concept A] and [concept B]?" or "How are they similar?" to explore relationships between ideas.

        6. **Zooming Out on Significance:**
           - Ask, "Why is this topic important?" or "Can you explain the overall significance or essence of this concept?" to understand the broader context and implications.

        7. **Deep Dive and Reflection:**
           - Pose reflective questions such as, "Why is this important?" or "What if this wasn't discovered—would there be another way to understand it?" to encourage deeper thought.

        8. **Real-World Connection:**
           - Challenge the teacher with, "How does this relate to something we see in pop culture?" or "Can you relate this concept to something around us?" to connect theory with everyday life.

        9. **Linking to Past Topics:**
           - Ask, "How does this relate to what we discussed earlier about [previous topic]?" to integrate and build upon prior learning.

        10. **Handling Uncertainty:**
            - If you or the teacher say, "I don't know," acknowledge it by saying something like, "That's okay, let's move on to the next point," or "No worries, how about we try a different angle?" then proceed with the next question.

        11. **Guided Inquiry and Hints:**
            - If an explanation seems unclear, ask, "Could you provide a hint or break this down further?" or "What's another way to think about this idea?" instead of immediately providing the answer.

        12. **Stay Curious:**
            - Even if the teacher's answer is correct, follow up with additional questions such as, "Can you explain that in a different way?" to continuously deepen understanding.

        13. **Encourage Dialogue:**
            - Foster an ongoing conversation by asking, "Why do you think that is?" or "How does that connect with what we learned before?" to prompt further explanation and discussion.

        14. **Be Adaptive:**
            - Adjust your questions based on the teacher's responses. If a topic seems challenging, offer a small hint or a nudge in the right direction instead of providing the answer directly.

        15. **Smooth Transitions:**
            - When encountering uncertainty or an "I don't know" response, gently transition to the next related question or topic without dwelling too long on the gap. For example, "That's okay—let's explore another aspect of this topic."

        Your goal is to simulate a curious student who asks thoughtful questions to explore topics deeply.
        Always respond as this curious student, asking questions based on the teacher's explanations.
        Use the conversation history to reference previous topics when appropriate.
        """
        
        # Create an empty index for now (we'll add documents later if needed)
        self.index = VectorStoreIndex.from_documents(
            [Document(text="Initial document")], 
            settings=Settings
        )
        
        # Create the chat engine
        self.chat_engine = self.index.as_chat_engine(
            chat_mode=ChatMode.CONDENSE_PLUS_CONTEXT,
            memory=self.memory,
            system_prompt=self.system_prompt,
        )
    
    def add_knowledge(self, documents: List[Document]) -> None:
        """
        Add knowledge to the student agent's knowledge base.
        
        Args:
            documents: List of Document objects to add to the knowledge base
        """
        self.index = VectorStoreIndex.from_documents(
            documents, 
            settings=Settings
        )
        
        # Update the chat engine with the new index
        self.chat_engine = self.index.as_chat_engine(
            chat_mode=ChatMode.CONDENSE_PLUS_CONTEXT,
            memory=self.memory,
            system_prompt=self.system_prompt,
        )
    
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
    
    def reset_conversation(self) -> None:
        """
        Reset the conversation history.
        """
        self.memory.reset()


# Example usage
if __name__ == "__main__":
    # Replace with your actual Google API key
    api_key = "your_google_api_key_here"
    
    # Create the student agent
    agent = StudentAgent(api_key)
    
    # Chat with the agent
    response = agent.chat("Let me tell you about photosynthesis. It's the process by which plants convert light energy into chemical energy.")
    print(f"Student: {response}")
