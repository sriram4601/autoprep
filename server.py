import os
from flask import Flask, request, jsonify, render_template
from student_agent import StudentAgent
from exam_practice_agent import ExamPracticeAgent
from notes_generator_agent import NotesGeneratorAgent
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")

# Initialize Flask app
app = Flask(__name__, template_folder=".", static_folder=".")

# Initialize agents
student_agent = None
exam_practice_agent = None
notes_generator_agent = None

# Initialize agents if API key is available
if api_key:
    student_agent = StudentAgent(api_key)
    exam_practice_agent = ExamPracticeAgent(api_key)
    notes_generator_agent = NotesGeneratorAgent(api_key)
else:
    print("Warning: GOOGLE_API_KEY not found in environment variables. Using default API key.")
    # Use the provided API key as fallback
    default_api_key = "AIzaSyCFt_r1o5sujLuioR-jrHpPwJLzeu5m518"
    student_agent = StudentAgent(default_api_key)
    exam_practice_agent = ExamPracticeAgent(default_api_key)
    notes_generator_agent = NotesGeneratorAgent(default_api_key)

# Routes for the main application
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/exam_practice')
def exam_practice():
    return render_template('exam_practice.html')

@app.route('/notes_generator')
def notes_generator():
    return render_template('notes_generator.html')

# API routes for the Student Agent
@app.route('/api/student/chat', methods=['POST'])
def student_chat():
    if not student_agent:
        return jsonify({"error": "Student agent not initialized. API key missing."}), 500
    
    data = request.json
    message = data.get('message', '')
    
    response = student_agent.chat(message)
    return jsonify({"response": response})

@app.route('/api/student/reset', methods=['POST'])
def student_reset():
    if not student_agent:
        return jsonify({"error": "Student agent not initialized. API key missing."}), 500
    
    student_agent.reset_conversation()
    return jsonify({"status": "success", "message": "Conversation reset"})

# API routes for the Exam Practice Agent
@app.route('/api/exam/generate_question', methods=['POST'])
def generate_question():
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500
    
    data = request.json
    subject = data.get('subject', '')
    topic = data.get('topic', '')
    difficulty = data.get('difficulty', None)
    
    if difficulty is not None:
        difficulty = int(difficulty)
    
    question = exam_practice_agent.generate_question(subject, topic, difficulty)
    return jsonify({"question": question})

@app.route('/api/exam/evaluate_answer', methods=['POST'])
def evaluate_answer():
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500
    
    data = request.json
    question = data.get('question', '')
    answer = data.get('answer', '')
    topic = data.get('topic', '')
    response_time = data.get('response_time', None)
    
    if response_time is not None:
        response_time = float(response_time)
    
    feedback = exam_practice_agent.evaluate_answer(question, answer, topic, response_time)
    return jsonify({"feedback": feedback})

@app.route('/api/exam/performance', methods=['GET'])
def get_performance():
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500
    
    analysis = exam_practice_agent.get_performance_analysis()
    return jsonify({"analysis": analysis})

@app.route('/api/exam/reset_performance', methods=['POST'])
def reset_performance():
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500
    
    exam_practice_agent.reset_performance()
    return jsonify({"status": "success", "message": "Performance data reset"})

@app.route('/api/exam/reset', methods=['POST'])
def exam_reset():
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500
    
    exam_practice_agent.reset_conversation()
    return jsonify({"status": "success", "message": "Conversation reset"})

# API routes for the Notes Generator Agent
@app.route('/api/notes/chat', methods=['POST'])
def notes_chat():
    if not notes_generator_agent:
        return jsonify({"error": "Notes generator agent not initialized. API key missing."}), 500
    
    data = request.json
    message = data.get('message', '')
    
    response = notes_generator_agent.chat(message)
    return jsonify({"response": response})

@app.route('/api/notes/generate', methods=['POST'])
def generate_notes():
    if not notes_generator_agent:
        return jsonify({"error": "Notes generator agent not initialized. API key missing."}), 500
    
    data = request.json
    topic = data.get('topic', '')
    subject = data.get('subject', None)
    
    notes = notes_generator_agent.generate_notes(topic, subject)
    return jsonify({"notes": notes})

@app.route('/api/notes/reset', methods=['POST'])
def notes_reset():
    if not notes_generator_agent:
        return jsonify({"error": "Notes generator agent not initialized. API key missing."}), 500
    
    notes_generator_agent.reset_conversation()
    return jsonify({"status": "success", "message": "Conversation reset"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
