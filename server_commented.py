# --- Bringing in the Toolkits ---
# Imagine we're setting up different workstations in an office.
# These lines bring in the necessary tools and blueprints for each station.
import os  # Tools for interacting with the computer's operating system (like checking file locations or environment settings).
from flask import Flask, request, jsonify, render_template # The 'Flask' toolkit helps build the main communication hub (the web server).
                                                        # request: handles incoming messages/requests.
                                                        # jsonify: formats outgoing messages properly.
                                                        # render_template: helps display the web pages (like showing different office forms).

# --- Importing the Blueprints for our AI Assistants ---
# These lines import the specific instructions (blueprints) for each AI agent we've designed.
from student_agent import StudentAgent # Blueprint for the 'Curious Student' AI.
from exam_practice_agent import ExamPracticeAgent # Blueprint for the 'Exam Practice Tutor' AI.
from notes_generator_agent import NotesGeneratorAgent # Blueprint for the 'Notes Generator' AI.

# --- Setting up the Main Office (Flask App) ---
# This creates the central hub or 'main office' for our application.
app = Flask(__name__) # '__name__' just gives the office a standard internal name.

# --- Getting the Secret Keys (API Keys) ---
# Think of API keys like special passwords needed to use powerful online services (like the AI's brain).
# We try to find these keys, which might be stored securely in the computer's environment settings.
google_api_key = os.environ.get('GOOGLE_API_KEY') # Looks for the key needed for Google's AI services.
# Add other API key retrievals here if needed, e.g.:
# openai_api_key = os.environ.get('OPENAI_API_KEY')

# --- Hiring the AI Assistants (Initializing Agents) ---
# Now we create our actual AI assistants based on their blueprints, but only if we have the necessary 'keys'.
# If a key is missing, the corresponding assistant can't be 'hired' yet.
student_agent = None
exam_practice_agent = None
notes_generator_agent = None

# Hire the Student Agent if we have the Google key.
if google_api_key:
    # It's like giving the key to the hiring manager (StudentAgent blueprint) to build the assistant.
    student_agent = StudentAgent(api_key=google_api_key)
    print("Student Agent initialized successfully.") # Log message: like announcing the student assistant is ready.
else:
    # If no key, we can't hire this assistant.
    print("Google API Key not found. Student Agent not initialized.") # Log message: Announcement that the student is unavailable.

# Hire the Exam Practice Agent if we have the Google key.
if google_api_key:
    # Similar hiring process for the Exam Practice Tutor.
    exam_practice_agent = ExamPracticeAgent(api_key=google_api_key)
    print("Exam Practice Agent initialized successfully.") # Log message: Exam tutor ready.
else:
    print("Google API Key not found. Exam Practice Agent not initialized.") # Log message: Exam tutor unavailable.

# Hire the Notes Generator Agent if we have the Google key.
if google_api_key:
    # Similar hiring process for the Notes Generator.
    notes_generator_agent = NotesGeneratorAgent(api_key=google_api_key)
    print("Notes Generator Agent initialized successfully.") # Log message: Notes generator ready.
else:
    print("Google API Key not found. Notes Generator Agent not initialized.") # Log message: Notes generator unavailable.

# --- Defining the Public-Facing Rooms (Website Pages) ---
# These functions define what happens when someone visits the main web addresses (URLs) of our office.

# The 'Lobby' or main entrance page.
@app.route('/')
def index():
    # This simply shows the main welcome page ('index.html').
    # Like directing visitors to the main lobby area.
    return render_template('index.html')

# The 'Exam Practice Room' page.
@app.route('/exam')
def exam_practice():
    # Shows the specific page ('exam_practice.html') for the exam practice tool.
    # Like directing visitors to the room with the practice tests.
    return render_template('exam_practice.html')

# The 'Notes Generation Room' page.
@app.route('/notes')
def notes_generator():
    # Shows the specific page ('notes_generator.html') for the notes tool.
    # Like directing visitors to the room where notes are created.
    return render_template('notes_generator.html')

# --- Defining the Service Counters (API Endpoints) ---
# These are like specific service counters or phone extensions where the website's front-end (the part users see and interact with)
# can send requests to the back-end (our AI assistants) to get work done.

# === Student Agent Service Counters ===

# Counter for chatting with the Student Agent.
@app.route('/api/student/chat', methods=['POST']) # Listens for POST requests (sending data) at this specific address.
def student_chat():
    # First, check if the Student assistant is actually available (hired).
    if not student_agent:
        # If not, send back an error message saying the service is unavailable.
        # Like putting up a 'Counter Closed' sign.
        return jsonify({"error": "Student agent not initialized. API key missing."}), 500 # 500 is an error code.

    # Get the message sent by the user from the website (it arrives in a format called JSON).
    # Like receiving a filled-out request form.
    data = request.json
    message = data.get('message') # Extract the actual message text from the form.

    # Check if the message is empty.
    if not message:
        # If no message was sent, send back an error.
        # Like returning the form because it's blank.
        return jsonify({"error": "No message provided"}), 400 # 400 means 'Bad Request'.

    # Pass the user's message to the Student Agent assistant and get its reply.
    # Like handing the request form to the student assistant.
    response = student_agent.chat(message)

    # Send the student assistant's reply back to the website.
    # Like handing the completed response back to the user.
    return jsonify({"response": response})

# Counter to reset the Student Agent's conversation memory.
@app.route('/api/student/reset', methods=['POST'])
def student_reset():
    # Check if the Student assistant is available.
    if not student_agent:
        return jsonify({"error": "Student agent not initialized. API key missing."}), 500

    # Tell the Student Agent to clear its short-term memory (reset the chat).
    # Like telling the assistant to put away the current conversation notes and start fresh.
    student_agent.reset_conversation()

    # Send back a confirmation message.
    # Like saying 'Okay, ready for a new conversation!'.
    return jsonify({"status": "success", "message": "Conversation reset"})

# === Exam Practice Agent Service Counters ===

# Counter to get a new practice question.
@app.route('/api/exam/question', methods=['POST'])
def generate_question():
    # Check if the Exam Practice tutor is available.
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500

    # Get the request details (subject, topic, difficulty) from the website.
    # Like getting a form specifying what kind of question the user wants.
    data = request.json
    subject = data.get('subject')
    topic = data.get('topic')
    difficulty = data.get('difficulty')

    # Check if all necessary details were provided.
    if not all([subject, topic, difficulty]):
        # If details are missing, send an error.
        # Like returning the form because it's incomplete.
        return jsonify({"error": "Subject, topic, and difficulty are required"}), 400

    # Ask the Exam Practice tutor to generate a question based on the details.
    # Like giving the request form to the tutor.
    question_data = exam_practice_agent.generate_question(subject, topic, difficulty)

    # Send the generated question back to the website.
    # Like giving the user the practice question sheet.
    return jsonify(question_data)

# Counter to submit an answer and get it evaluated.
@app.route('/api/exam/evaluate', methods=['POST'])
def evaluate_answer():
    # Check if the Exam Practice tutor is available.
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500

    # Get the user's answer and the question ID from the website.
    # Like getting the user's completed answer sheet.
    data = request.json
    question_id = data.get('question_id')
    user_answer = data.get('answer')

    # Check if the answer and ID were provided.
    if question_id is None or user_answer is None:
        # Like returning the sheet because it's missing info.
        return jsonify({"error": "Question ID and answer are required"}), 400

    # Ask the Exam Practice tutor to evaluate the answer.
    # Like giving the answer sheet to the tutor for grading.
    evaluation = exam_practice_agent.evaluate_answer(question_id, user_answer)

    # Send the evaluation (feedback, correct answer, etc.) back to the website.
    # Like giving the graded sheet back to the user.
    return jsonify(evaluation)

# Counter to get the user's performance summary.
@app.route('/api/exam/performance', methods=['GET']) # GET request because we are just retrieving info.
def get_performance():
    # Check if the Exam Practice tutor is available.
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500

    # Ask the tutor for the current performance report.
    # Like asking the tutor for the student's progress report.
    performance = exam_practice_agent.get_performance_analysis()

    # Send the report back to the website.
    # Like giving the progress report to the user.
    return jsonify(performance)

# Counter to reset the performance statistics.
@app.route('/api/exam/reset_performance', methods=['POST'])
def reset_performance():
    # Check if the Exam Practice tutor is available.
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500

    # Tell the tutor to reset all tracked scores and history.
    # Like telling the tutor to erase the progress report and start tracking anew.
    exam_practice_agent.reset_performance()
    return jsonify({"status": "success", "message": "Performance data reset"})

# Counter to reset the Exam tutor's conversation memory.
@app.route('/api/exam/reset', methods=['POST'])
def exam_reset():
    # Check if the Exam Practice tutor is available.
    if not exam_practice_agent:
        return jsonify({"error": "Exam practice agent not initialized. API key missing."}), 500

    # Tell the tutor to clear its short-term memory.
    exam_practice_agent.reset_conversation()
    return jsonify({"status": "success", "message": "Exam conversation reset"})

# === Notes Generator Agent Service Counters ===

# Counter for chatting with the Notes Generator (if it has chat capabilities).
@app.route('/api/notes/chat', methods=['POST'])
def notes_chat():
    # Check if the Notes Generator assistant is available.
    if not notes_generator_agent:
        return jsonify({"error": "Notes generator agent not initialized. API key missing."}), 500

    # Get the user's message.
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({"error": "No message provided"}), 400

    # Ask the Notes Generator assistant to respond (assuming it has a chat method).
    # Note: The original NotesGeneratorAgent blueprint might not have a 'chat' method,
    # this assumes it might be added or is intended.
    # If it *only* generates notes, this endpoint might need adjustment or removal.
    # It might be calling a general chat capability inherited or added.
    response = notes_generator_agent.chat(message) # Assuming a chat method exists

    # Send the response back.
    return jsonify({"response": response})

# Counter to generate notes on a specific topic.
@app.route('/api/notes/generate', methods=['POST'])
def generate_notes():
    # Check if the Notes Generator assistant is available.
    if not notes_generator_agent:
        return jsonify({"error": "Notes generator agent not initialized. API key missing."}), 500

    # Get the topic and subject from the user's request.
    # Like getting a form asking for notes on a specific subject/topic.
    data = request.json
    topic = data.get('topic')
    subject = data.get('subject')

    # Check if topic and subject were provided.
    if not topic or not subject:
        return jsonify({"error": "Topic and subject are required"}), 400

    # Ask the Notes Generator assistant to create the notes.
    # Like giving the request form to the notes assistant.
    notes = notes_generator_agent.generate_notes(topic, subject)

    # Send the generated notes back to the website.
    # Like giving the completed notes back to the user.
    return jsonify({"notes": notes})

# Counter to reset the Notes Generator's conversation memory.
@app.route('/api/notes/reset', methods=['POST'])
def notes_reset():
    # Check if the Notes Generator assistant is available.
    if not notes_generator_agent:
        return jsonify({"error": "Notes generator agent not initialized. API key missing."}), 500

    # Tell the Notes Generator to clear its memory.
    # Like telling the assistant to put away previous note requests.
    notes_generator_agent.reset_conversation()
    return jsonify({"status": "success", "message": "Conversation reset"})

# --- Starting the Office Operations ---
# This part only runs if you start *this* specific Python file directly.
# It's like the main 'On' switch for the entire office (the web server).
if __name__ == '__main__':
    # Figure out which communication channel (port) to use. Default is 5000.
    # Think of it as choosing a specific phone line number for the office.
    port = int(os.environ.get('PORT', 5000))

    # Turn on the main switchboard (start the Flask server).
    # host='0.0.0.0' means it can receive calls from any computer on the network.
    # port=port uses the chosen phone line number.
    # debug=True is like having a troubleshooter mode active, useful during development.
    app.run(host='0.0.0.0', port=port, debug=True)
