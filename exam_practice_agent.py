import os
from typing import List, Dict, Any, Optional
from llama_index.core.settings import Settings
from llama_index.llms.gemini import Gemini
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.chat_engine import SimpleChatEngine

class ExamPracticeAgent:
    """
    An AI agent that generates practice questions for CAT aspirants,
    dynamically adjusts test difficulty, and provides performance analysis.
    """
    
    def __init__(self, api_key: str, model_name: str = "models/gemini-1.5-flash-8b"):
        """
        Initialize the exam practice agent with the necessary components.
        
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
        
        # User performance tracking
        self.user_performance = {
            "questions_asked": 0,
            "correct_answers": 0,
            "topic_performance": {},
            "difficulty_levels": [],
            "response_times": []
        }
        
        # Current difficulty level (1=Easy, 2=Medium, 3=Hard)
        self.current_difficulty = 1
        
        # Create the exam practice agent system prompt
        self.system_prompt = """
        You are an intelligent exam-preparation assistant for CAT aspirants in India. Your primary tasks include generating practice questions, dynamically adjusting test difficulty, and providing detailed performance analysis. Please follow these instructions carefully:

        1. **Question Generation:**
           - Create practice questions for CAT exam subjects: Quantitative Aptitude, Verbal Ability & Reading Comprehension, Data Interpretation & Logical Reasoning.
           - Ensure questions match the CAT exam style and format.
           - Include a mix of multiple-choice and subjective questions.
           - Provide clear, concise questions with appropriate context.
           - For each question, include the correct answer and a detailed explanation.

        2. **Difficulty Adjustment:**
           - Dynamically adjust question difficulty based on user performance.
           - If a user consistently answers correctly, gradually increase difficulty.
           - If a user struggles, provide slightly easier questions to build confidence.
           - Maintain a balance that challenges the user without causing frustration.
           - Use a scale of 1-3 for difficulty levels (1=Easy, 2=Medium, 3=Hard).

        3. **Performance Analysis:**
           - Track user performance across different topics and difficulty levels.
           - Provide actionable feedback on strengths and areas for improvement.
           - Suggest specific strategies to improve in weak areas.
           - Highlight patterns in mistakes and offer targeted advice.
           - Summarize performance statistics when requested.

        4. **Response Quality:**
           - When providing feedback:
             * Explain why the answer is correct/incorrect
             * Provide the correct solution method
             * Offer tips for similar questions in the future
           - When analyzing performance:
             * Present statistics on accuracy by topic and difficulty
             * Identify strengths and areas for improvement
             * Suggest specific study strategies
             * Recommend resources or practice areas

        Remember to maintain a professional, supportive tone and focus on helping the user improve their CAT exam preparation.
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
    
    def generate_question(self, subject: str, topic: str, difficulty: int = None) -> str:
        """
        Generate a practice question based on the specified subject, topic, and difficulty.
        
        Args:
            subject: The subject area (Quantitative Aptitude, Verbal Ability, etc.)
            topic: The specific topic within the subject
            difficulty: The difficulty level (1=Easy, 2=Medium, 3=Hard)
            
        Returns:
            The generated question with answer and explanation
        """
        # Use the current difficulty if none is specified
        if difficulty is None:
            difficulty = self.current_difficulty
        
        # Map difficulty level to text
        difficulty_text = {1: "Easy", 2: "Medium", 3: "Hard"}[difficulty]
        
        # Construct the prompt for generating a question
        prompt = f"Generate a {difficulty_text} level CAT exam practice question on {topic} in {subject}. Include the question, options (if applicable), correct answer, and detailed explanation."
        
        # Generate the question
        response = self.chat_engine.chat(prompt)
        
        # Update performance tracking
        self.user_performance["questions_asked"] += 1
        self.user_performance["difficulty_levels"].append(difficulty)
        
        # Update topic performance if not already in the dictionary
        if topic not in self.user_performance["topic_performance"]:
            self.user_performance["topic_performance"][topic] = {
                "questions_asked": 0,
                "correct_answers": 0
            }
        
        self.user_performance["topic_performance"][topic]["questions_asked"] += 1
        
        return response.response
    
    def evaluate_answer(self, question: str, user_answer: str, topic: str, response_time: float = None) -> str:
        """
        Evaluate the user's answer to a question and provide feedback.
        
        Args:
            question: The question that was asked
            user_answer: The user's answer to the question
            topic: The topic of the question
            response_time: The time taken by the user to answer (in seconds)
            
        Returns:
            Feedback on the user's answer
        """
        # Construct the prompt for evaluating the answer
        prompt = f"Question: {question}\n\nUser's Answer: {user_answer}\n\nEvaluate whether this answer is correct. Provide detailed feedback and explanation."
        
        # Generate the evaluation
        response = self.chat_engine.chat(prompt)
        
        # Check if the answer was correct (simple heuristic)
        is_correct = "correct" in response.response.lower() and "incorrect" not in response.response.lower()
        
        # Update performance tracking
        if is_correct:
            self.user_performance["correct_answers"] += 1
            self.user_performance["topic_performance"][topic]["correct_answers"] += 1
        
        # Store response time if provided
        if response_time is not None:
            self.user_performance["response_times"].append(response_time)
        
        # Adjust difficulty based on performance
        self._adjust_difficulty()
        
        return response.response
    
    def get_performance_analysis(self) -> str:
        """
        Generate a detailed analysis of the user's performance.
        
        Returns:
            A performance analysis with statistics and recommendations
        """
        # Calculate overall accuracy
        total_questions = self.user_performance["questions_asked"]
        correct_answers = self.user_performance["correct_answers"]
        
        if total_questions == 0:
            return "You haven't answered any questions yet. Start practicing to see your performance analysis."
        
        overall_accuracy = (correct_answers / total_questions) * 100
        
        # Prepare topic-wise performance data
        topic_performance = []
        for topic, data in self.user_performance["topic_performance"].items():
            topic_questions = data["questions_asked"]
            topic_correct = data["correct_answers"]
            topic_accuracy = (topic_correct / topic_questions) * 100 if topic_questions > 0 else 0
            topic_performance.append(f"- {topic}: {topic_accuracy:.1f}% accuracy ({topic_correct}/{topic_questions})")
        
        # Calculate average response time if available
        avg_response_time = ""
        if self.user_performance["response_times"]:
            avg_time = sum(self.user_performance["response_times"]) / len(self.user_performance["response_times"])
            avg_response_time = f"\nAverage response time: {avg_time:.1f} seconds"
        
        # Construct the prompt for generating the analysis
        prompt = f"""
        Generate a detailed performance analysis based on the following data:
        
        Overall Statistics:
        - Total questions: {total_questions}
        - Correct answers: {correct_answers}
        - Overall accuracy: {overall_accuracy:.1f}%
        - Current difficulty level: {self.current_difficulty} ({['Easy', 'Medium', 'Hard'][self.current_difficulty-1]})
        {avg_response_time}
        
        Topic Performance:
        {chr(10).join(topic_performance)}
        
        Please provide:
        1. A summary of strengths and weaknesses
        2. Specific recommendations for improvement
        3. Suggested study strategies
        4. Next steps for effective preparation
        """
        
        # Generate the analysis
        response = self.chat_engine.chat(prompt)
        return response.response
    
    def _adjust_difficulty(self) -> None:
        """
        Adjust the difficulty level based on recent performance.
        """
        # Only adjust difficulty after a minimum number of questions
        min_questions = 3
        if self.user_performance["questions_asked"] < min_questions:
            return
        
        # Calculate recent accuracy (last 5 questions or all if fewer)
        recent_count = min(5, self.user_performance["questions_asked"])
        recent_correct = sum(1 for i in range(recent_count) if i < len(self.user_performance["topic_performance"].values()) and list(self.user_performance["topic_performance"].values())[i]["correct_answers"] > 0)
        recent_accuracy = recent_correct / recent_count
        
        # Adjust difficulty based on recent accuracy
        if recent_accuracy > 0.8 and self.current_difficulty < 3:
            self.current_difficulty += 1
        elif recent_accuracy < 0.4 and self.current_difficulty > 1:
            self.current_difficulty -= 1
    
    def reset_performance(self) -> None:
        """
        Reset the user's performance tracking data.
        """
        self.user_performance = {
            "questions_asked": 0,
            "correct_answers": 0,
            "topic_performance": {},
            "difficulty_levels": [],
            "response_times": []
        }
        self.current_difficulty = 1
    
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
    
    # Create the exam practice agent
    agent = ExamPracticeAgent(api_key)
    
    # Generate a practice question
    question = agent.generate_question("Quantitative Aptitude", "Percentages", difficulty=1)
    print(f"Question: {question}")
    
    # Simulate user answer
    user_answer = "75%"
    
    # Evaluate the answer
    feedback = agent.evaluate_answer(question, user_answer, "Percentages", response_time=30)
    print(f"Feedback: {feedback}")
    
    # Get performance analysis
    analysis = agent.get_performance_analysis()
    print(f"Analysis: {analysis}")
