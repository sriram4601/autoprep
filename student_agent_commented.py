# Imagine you're gathering tools for a project. These lines bring in different toolkits.
import os  # This toolkit helps interact with the computer's operating system, like finding files or environment settings.
from typing import List, Dict, Any  # This toolkit helps define the 'shape' of data, like specifying you need a list of names, not just any text.
from llama_index.core import VectorStoreIndex, Document  # LlamaIndex is a big toolbox for building applications that understand information. VectorStoreIndex is like a super-smart filing cabinet, and Document is like a single page you put in it.
from llama_index.core.service_context import ServiceContext  # Think of this as the main workbench where you assemble your AI tools.
from llama_index.llms.gemini import Gemini  # This brings in the specific 'brain' we'll use – Google's Gemini AI model.
from llama_index.core.memory import ChatMemoryBuffer  # This is like a short-term notepad for the AI to remember the recent conversation.
from llama_index.core.chat_engine.types import ChatMode  # This provides different styles or modes for how the AI should chat.

# --- Blueprint for our AI Student ---
# We are defining a blueprint for creating an 'AI Student'. Any 'Student Agent' we create will follow this design.
class StudentAgent:
    """
    An AI agent that simulates a curious student who asks thoughtful questions
    to explore topics deeply. This is like the description on the blueprint box.
    """
    
    # --- Assembling the AI Student ---
    # This is the instruction manual for building a new Student Agent robot when you order one.
    def __init__(self, api_key: str, model_name: str = "models/gemini-1.5-flash-8b"):
        """
        Initialize the student agent with the necessary components.
        Think of this as the assembly process.
        
        Args:
            api_key (str): Like a secret key or password needed to use the Gemini 'brain' service.
            model_name (str): Specifies which version of the Gemini 'brain' to use (e.g., a specific model known for speed or power).
        """
        # --- Setting up the Brain's Access Key ---
        # We need to tell the computer system where to find the secret key for the Gemini service.
        # It's like putting the key in a designated safe spot.
        os.environ["GOOGLE_API_KEY"] = api_key
        
        # --- Installing the Brain ---
        # Create the actual AI 'brain' (the LLM - Large Language Model) using Gemini.
        # 'temperature' is like a creativity dial: 0 is very factual, 1 is very creative. 0.7 is balanced.
        self.llm = Gemini(model_name=model_name, temperature=0.7)
        
        # --- Preparing the Workbench ---
        # Set up the main workspace (ServiceContext) and place our 'brain' (llm) onto it.
        self.service_context = ServiceContext.from_defaults(llm=self.llm)
        
        # --- Giving the AI a Notepad (Memory) ---
        # Create the short-term memory (ChatMemoryBuffer). It remembers the last '4096' units (tokens) of conversation.
        # Like a notepad that automatically erases the oldest lines when it gets full.
        self.memory = ChatMemoryBuffer.from_defaults(token_limit=4096)
        
        # --- Writing the AI's Script (System Prompt) ---
        # This long text is the core instruction manual or personality script for the AI.
        # It tells the AI exactly *how* to behave like a curious student, step-by-step.
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
        
        # --- Setting up the Filing Cabinet (Index) ---
        # Create the smart filing cabinet (VectorStoreIndex). Initially, we just put a blank placeholder page ('Document') in it.
        # We tell it to use the tools on our workbench ('service_context').
        # This cabinet is where the AI can store and quickly retrieve information it learns.
        self.index = VectorStoreIndex.from_documents(
            [Document(text="Initial document")], 
            service_context=self.service_context
        )
        
        # --- Building the Conversation Engine ---
        # This connects all the main parts: the filing cabinet (index), the notepad (memory),
        # the brain (implicitly via service_context), and the script (system_prompt).
        # 'ChatMode.CONDENSE_QUESTION' tells it to smartly rephrase the user's latest question using the conversation history from the notepad, before thinking of an answer.
        # 'verbose=True' is like asking the engine to occasionally mumble its internal thought process (useful for developers).
        self.chat_engine = self.index.as_chat_engine(
            chat_mode=ChatMode.CONDENSE_QUESTION,
            memory=self.memory,
            system_prompt=self.system_prompt,
            verbose=True
        )
    
    # --- Adding Books to the Filing Cabinet ---
    # This defines a way to add new information (like textbook chapters or articles) to the AI's knowledge base.
    def add_knowledge(self, documents: List[Document]) -> None:
        """
        Add knowledge to the agent's index. Like adding new documents to the filing cabinet.
        
        Args:
            documents: A list of pages ('Document' objects) to add.
        """
        # Create a *new* filing cabinet filled with the provided documents.
        # (Note: This replaces the old index. For adding incrementally, other methods exist).
        self.index = VectorStoreIndex.from_documents(
            documents, 
            service_context=self.service_context
        )
        
        # --- Reconnecting the Engine to the Updated Cabinet ---
        # Since we potentially updated the filing cabinet (index), we need to make sure the conversation engine is using the latest version.
        self.chat_engine = self.index.as_chat_engine(
            chat_mode=ChatMode.CONDENSE_QUESTION,
            memory=self.memory,
            system_prompt=self.system_prompt,
            verbose=True
        )
    
    # --- The 'Talk' Function ---
    # This is how you interact with the AI Student. You give it a message, it gives you a response.
    def chat(self, message: str) -> str:
        """
        Process a message from the teacher (user) and generate the student's response.
        
        Args:
            message: The text message from the user (acting as the teacher).
            
        Returns:
            The AI student's reply as text.
        """
        # Use the conversation engine to process the message and get a response.
        response = self.chat_engine.chat(message)
        # Return just the text part of the response.
        return response.response
    
    # --- The 'Forget Conversation' Function ---
    # This allows you to wipe the AI's short-term memory (the notepad).
    def reset_conversation(self) -> None:
        """
        Reset the conversation history. Clears the notepad.
        """
        self.memory.reset()


# --- Example Section: A Test Drive ---
# This part only runs if you execute *this* specific Python file directly.
# It's like a built-in test track for our Student Agent blueprint.
if __name__ == "__main__":
    # IMPORTANT: You need to replace this placeholder with your actual Google API Key!
    # It's the secret key needed to use the Gemini 'brain'.
    api_key = "your_google_api_key_here" 
    
    # --- Build an AI Student ---
    # Create an instance of our Student Agent using the blueprint and the API key.
    agent = StudentAgent(api_key)
    
    # --- Start a Conversation ---
    # Send a first message (as the teacher) to the agent.
    teacher_message = "Let me tell you about photosynthesis. It's the process by which plants convert light energy into chemical energy."
    student_response = agent.chat(teacher_message)
    
    # --- Print the Response ---
    # Show what the AI student said in reply.
    print(f"Teacher: {teacher_message}")
    print(f"Student: {student_response}")

    # You could continue the chat here, for example:
    # teacher_message_2 = "Photosynthesis happens in chloroplasts using chlorophyll."
    # student_response_2 = agent.chat(teacher_message_2)
    # print(f"Teacher: {teacher_message_2}")
    # print(f"Student: {student_response_2}")
