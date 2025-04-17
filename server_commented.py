# --- Bringing in the Toolkits ---
# Imagine we're setting up different workstations in an office.
# These lines bring in the necessary tools and blueprints for each station.
import os  # Tools for interacting with the computer's operating system (like checking file locations or environment settings).
from dotenv import load_dotenv  # Tool to load environment variables from .env file
from flask import Flask, request, jsonify, make_response # The 'Flask' toolkit helps build the main communication hub (the web server).
                                        # request: handles incoming messages/requests.
                                        # jsonify: formats outgoing messages properly.
                                        # make_response: creates a response object that can be modified
from flask_cors import CORS  # Import CORS to allow cross-origin requests
from supabase import create_client, Client  # Import Supabase client for database operations
from student_agent import StudentAgent # Blueprint for the 'Curious Student' AI.
from exam_practice_agent import ExamPracticeAgent # Blueprint for the 'Exam Practice Tutor' AI.
from notes_generator_agent import NotesGeneratorAgent # Blueprint for the 'Notes Generator' AI.
from datetime import datetime, timezone
import pytz

# --- Loading Environment Variables ---
# This loads API keys and other configuration from the .env file
load_dotenv()  # Load environment variables from .env file

# --- Setting up the Main Office (Flask App) ---
# This creates the central hub or 'main office' for our application.
app = Flask(__name__) # '__name__' just gives the office a standard internal name.
# Enable CORS for all routes with support for credentials
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})  # Updated to support credentials for cookie-based auth

# Frontend URL for redirects
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# --- Getting the Secret Keys (API Keys) ---
# Think of API keys like special passwords needed to use powerful online services (like the AI's brain).
# We try to find these keys, which might be stored securely in the computer's environment settings.
google_api_key = os.environ.get('GOOGLE_API_KEY') # Looks for the key needed for Google's AI services (loaded by dotenv).
# Add other API key retrievals here if needed, e.g.:
# openai_api_key = os.environ.get('OPENAI_API_KEY')

# --- Setting up Supabase Client ---
# Initialize the Supabase client for database operations
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_ANON_KEY')
supabase = None

if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
    print("Supabase client initialized successfully.")
else:
    print("Supabase credentials not found. Database operations will not work.")

# --- Supabase Database Functions ---
# Functions to interact with the Supabase database

def add_message_to_db(user_id, sender_type, message_content, agent_type=None):
    """
    Add a message to the database.
    
    Args:
        user_id (str): The ID of the user (can be a session ID if not authenticated)
        sender_type (str): Either 'user' or 'ai'
        message_content (str): The content of the message
        agent_type (str, optional): The type of agent ('student', 'exam', 'notes')
    
    Returns:
        dict: The inserted data or None if there was an error
    """
    if not supabase:
        print("Supabase client not initialized. Cannot add message to database.")
        return None
    
    try:
        data, count = supabase.table('messages').insert({
            "user_id": user_id,
            "sender": sender_type,
            "content": message_content,
            "agent_type": agent_type
        }).execute()
        
        print(f"Message added to database: {data}")
        return data
    except Exception as e:
        print(f"Error adding message to database: {e}")
        return None

def get_chat_history(user_id, agent_type=None, limit=50):
    """
    Get chat history for a specific user and optionally filter by agent type.
    
    Args:
        user_id (str): The ID of the user
        agent_type (str, optional): Filter by agent type ('student', 'exam', 'notes')
        limit (int, optional): Maximum number of messages to retrieve
    
    Returns:
        list: List of messages or empty list if there was an error
    """
    if not supabase:
        print("Supabase client not initialized. Cannot retrieve messages from database.")
        return []
    
    try:
        query = supabase.table('messages') \
                        .select('*') \
                        .eq('user_id', user_id)
        
        if agent_type:
            query = query.eq('agent_type', agent_type)
        
        data, count = query.order('created_at') \
                          .limit(limit) \
                          .execute()
        
        messages = data[0] if data and data[0] else []
        print(f"Retrieved {len(messages)} messages from database")
        return messages
    except Exception as e:
        print(f"Error retrieving messages from database: {e}")
        return []

# --- Supabase Authentication Functions ---
# Functions to handle user authentication with Supabase

def signup_user(email, password, metadata=None):
    """
    Register a new user with Supabase authentication.
    
    Args:
        email (str): User's email address
        password (str): User's password
        metadata (dict, optional): Additional user metadata
    
    Returns:
        dict: The user data or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot sign up user.")
        return {"error": "Supabase client not initialized"}
    
    try:
        # Sign up the user with Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": metadata or {}
            }
        })
        
        print(f"User signed up: {email}")
        
        # Convert User object to a serializable dictionary
        user_data = None
        if response.user:
            # Extract only the serializable properties from the User object
            user_data = {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": str(response.user.created_at) if response.user.created_at else None,
                "updated_at": str(response.user.updated_at) if response.user.updated_at else None,
                "email_confirmed_at": str(response.user.email_confirmed_at) if response.user.email_confirmed_at else None,
                "last_sign_in_at": str(response.user.last_sign_in_at) if response.user.last_sign_in_at else None,
                "role": response.user.role,
                "app_metadata": response.user.app_metadata,
                "user_metadata": response.user.user_metadata
            }
        
        # Convert Session object to a serializable dictionary
        session_data = None
        if response.session:
            session_data = {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "expires_at": response.session.expires_at,
                "token_type": response.session.token_type,
                "user": user_data  # Use the already serialized user data
            }
        
        return {
            "success": True,
            "user": user_data,
            "session": session_data
        }
    except Exception as e:
        print(f"Error signing up user: {e}")
        return {"error": str(e)}

def login_user(email, password):
    """
    Log in an existing user with Supabase authentication.
    
    Args:
        email (str): User's email address
        password (str): User's password
    
    Returns:
        dict: The user data and session or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot log in user.")
        return {"error": "Supabase client not initialized"}
    
    try:
        # Sign in the user with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        print(f"User logged in: {email}")
        
        # Convert User object to a serializable dictionary
        user_data = None
        if response.user:
            # Extract only the serializable properties from the User object
            user_data = {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": str(response.user.created_at) if response.user.created_at else None,
                "updated_at": str(response.user.updated_at) if response.user.updated_at else None,
                "email_confirmed_at": str(response.user.email_confirmed_at) if response.user.email_confirmed_at else None,
                "last_sign_in_at": str(response.user.last_sign_in_at) if response.user.last_sign_in_at else None,
                "role": response.user.role,
                "app_metadata": response.user.app_metadata,
                "user_metadata": response.user.user_metadata
            }
        
        # Convert Session object to a serializable dictionary
        session_data = None
        if response.session:
            session_data = {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "expires_at": response.session.expires_at,
                "token_type": response.session.token_type,
                "user": user_data  # Use the already serialized user data
            }
        
        return {
            "success": True,
            "user": user_data,
            "session": session_data
        }
    except Exception as e:
        print(f"Error logging in user: {e}")
        return {"error": str(e)}

def logout_user(jwt_token):
    """
    Log out a user with Supabase authentication.
    
    Args:
        jwt_token (str): The JWT token of the user's session
    
    Returns:
        dict: Success message or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot log out user.")
        return {"error": "Supabase client not initialized"}
    
    try:
        # Sign out the user with Supabase Auth
        supabase.auth.sign_out()
        
        print("User logged out")
        return {
            "success": True,
            "message": "User logged out successfully"
        }
    except Exception as e:
        print(f"Error logging out user: {e}")
        return {"error": str(e)}

def reset_password(email):
    """
    Send a password reset email to the user.
    
    Args:
        email (str): User's email address
    
    Returns:
        dict: Success message or error
    """
    if not supabase:
        print("Supabase client not initialized. Cannot reset password.")
        return {"error": "Supabase client not initialized"}
    
    try:
        # Send password reset email
        supabase.auth.reset_password_email(email)
        
        print(f"Password reset email sent to: {email}")
        return {"success": True, "message": "Password reset email sent"}
    except Exception as e:
        print(f"Error sending password reset email: {e}")
        return {"error": str(e)}

def get_user(jwt_token):
    """
    Get the current user's data using their JWT token.
    
    Args:
        jwt_token (str): The JWT token from the user's session
    
    Returns:
        dict: The user data or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot get user data.")
        return {"error": "Supabase client not initialized"}
    
    try:
        # Set the auth token for the client
        supabase.auth.set_session(jwt_token)
        
        # Get the user data
        user = supabase.auth.get_user()
        
        return {"success": True, "user": user.user}
    except Exception as e:
        print(f"Error getting user data: {e}")
        return {"error": str(e)}

# === Subscription Management Functions ===

def create_subscription(user_id, plan_type, is_active=True, expires_at=None):
    """
    Create or update a subscription for a user.
    
    Args:
        user_id (str): The user's ID
        plan_type (str): The subscription plan type (e.g., 'basic', 'premium')
        is_active (bool): Whether the subscription is active
        expires_at (str): When the subscription expires (ISO format date string)
    
    Returns:
        dict: The subscription data or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot create subscription.")
        return {"error": "Supabase client not initialized"}
    
    try:
        # Check if a subscription already exists for this user
        existing = supabase.table('subscriptions').select('*').eq('user_id', user_id).execute()
        
        subscription_data = {
            'user_id': user_id,
            'plan_type': plan_type,
            'is_active': is_active,
            'expires_at': expires_at,
            'updated_at': datetime.now().isoformat()
        }
        
        if existing.data and len(existing.data) > 0:
            # Update existing subscription
            result = supabase.table('subscriptions').update(subscription_data).eq('user_id', user_id).execute()
            print(f"Updated subscription for user {user_id}")
        else:
            # Create new subscription
            subscription_data['created_at'] = datetime.now().isoformat()
            result = supabase.table('subscriptions').insert(subscription_data).execute()
            print(f"Created subscription for user {user_id}")
        
        return {
            "success": True,
            "subscription": result.data[0] if result.data else None
        }
    except Exception as e:
        print(f"Error creating subscription: {e}")
        return {"error": str(e)}

def get_user_subscription(user_id):
    """
    Get the subscription for a user.
    
    Args:
        user_id (str): The user's ID
    
    Returns:
        dict: The subscription data or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot get subscription.")
        return {"error": "Supabase client not initialized"}
    
    try:
        result = supabase.table('subscriptions').select('*').eq('user_id', user_id).execute()
        
        if result.data and len(result.data) > 0:
            subscription = result.data[0]
            # Check if subscription is expired
            if subscription.get('expires_at'):
                expires_at = datetime.fromisoformat(subscription['expires_at'].replace('Z', '+00:00'))
                if expires_at < datetime.now(timezone.utc):
                    subscription['is_active'] = False
                    # Update the subscription to mark it as inactive
                    supabase.table('subscriptions').update({'is_active': False}).eq('id', subscription['id']).execute()
            
            return {
                "success": True,
                "subscription": subscription
            }
        else:
            return {
                "success": True,
                "subscription": None
            }
    except Exception as e:
        print(f"Error getting subscription: {e}")
        return {"error": str(e)}

# === Conversation Storage Functions ===

def save_conversation(user_id, agent_type, messages):
    """
    Save a conversation with an agent to Supabase.
    
    Args:
        user_id (str): The user's ID
        agent_type (str): The type of agent ('student', 'exam', 'notes')
        messages (list): The conversation messages
    
    Returns:
        dict: The saved conversation data or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot save conversation.")
        return {"error": "Supabase client not initialized"}
    
    try:
        conversation_data = {
            'user_id': user_id,
            'agent_type': agent_type,
            'messages': messages,
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('conversations').insert(conversation_data).execute()
        
        print(f"Saved conversation for user {user_id} with {agent_type} agent")
        return {
            "success": True,
            "conversation": result.data[0] if result.data else None
        }
    except Exception as e:
        print(f"Error saving conversation: {e}")
        return {"error": str(e)}

def get_user_conversations(user_id, agent_type=None):
    """
    Get conversations for a user, optionally filtered by agent type.
    
    Args:
        user_id (str): The user's ID
        agent_type (str, optional): The type of agent to filter by
    
    Returns:
        dict: The conversation data or error message
    """
    if not supabase:
        print("Supabase client not initialized. Cannot get conversations.")
        return {"error": "Supabase client not initialized"}
    
    try:
        query = supabase.table('conversations').select('*').eq('user_id', user_id)
        
        if agent_type:
            query = query.eq('agent_type', agent_type)
        
        result = query.order('created_at', desc=True).execute()
        
        return {
            "success": True,
            "conversations": result.data
        }
    except Exception as e:
        print(f"Error getting conversations: {e}")
        return {"error": str(e)}

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

# --- Defining the Service Counters (API Endpoints) ---
# These are like specific service counters or phone extensions where the website's front-end (the part users see and interact with)
# can send requests to the back-end (our AI assistants) to get work done.

# === Student Agent Service Counters ===

# Counter for chatting with the Student Agent.
@app.route('/api/student/chat', methods=['POST'])
def student_chat():
    """Endpoint for chatting with the Student Agent"""
    # Get the request data
    data = request.json
    message = data.get('message', '')
    user_id = data.get('user_id')
    conversation_id = data.get('conversation_id')

    # Get previous messages if conversation_id is provided
    previous_messages = []
    if conversation_id:
        conversation_result = supabase.table('conversations').select('*').eq('id', conversation_id).execute()
        if conversation_result.data and len(conversation_result.data) > 0:
            previous_messages = conversation_result.data[0].get('messages', [])
    
    # Add the new user message
    messages = previous_messages + [{"role": "user", "content": message}]
    
    if not student_agent:
        return jsonify({"error": "Student Agent not initialized"}), 500
    
    try:
        # Get response from the Student Agent
        response = student_agent.chat(message)
        
        # Add the agent's response to messages
        messages.append({"role": "assistant", "content": response})
        
        # Save the conversation if user is authenticated
        if user_id:
            if conversation_id:
                # Update existing conversation
                supabase.table('conversations').update({'messages': messages}).eq('id', conversation_id).execute()
            else:
                # Create new conversation
                save_result = save_conversation(user_id, 'student', messages)
                conversation_id = save_result.get('conversation', {}).get('id') if save_result.get('success') else None
        
        return jsonify({
            "message": response,
            "conversation_id": conversation_id
        })
    except Exception as e:
        print(f"Error in student chat: {e}")
        return jsonify({"error": str(e)}), 500

# Counter to reset the Student Agent's conversation memory.
@app.route('/api/student/reset', methods=['POST'])
def student_reset():
    # Check if the Student assistant is available.
    if not student_agent:
        return jsonify({"error": "Student agent not initialized. API key missing."}), 500

    # Tell the Student Agent to clear its short-term memory (reset the chat).
    # Like telling the assistant to put away the current conversation notes and start fresh.
    student_agent.reset()

    # Send back a confirmation message.
    # Like saying 'Okay, ready for a new conversation!'.
    return jsonify({"status": "success", "message": "Conversation reset"})

# === Exam Practice Agent Service Counters ===

# Counter for chatting with the Exam Practice Agent.
@app.route('/api/exam/chat', methods=['POST'])
def exam_practice_chat():
    """Endpoint for chatting with the Exam Practice Agent"""
    # Get the request data from the frontend
    data = request.json
    message = data.get('message', '')  # Get the user's message or empty string if not provided
    user_id = data.get('user_id')  # Get the user's ID for authentication and conversation tracking
    conversation_id = data.get('conversation_id')  # Get conversation ID if continuing an existing conversation
    
    # Get previous messages if conversation_id is provided to maintain conversation context
    previous_messages = []
    if conversation_id:
        # Query the database for the existing conversation
        conversation_result = supabase.table('conversations').select('*').eq('id', conversation_id).execute()
        if conversation_result.data and len(conversation_result.data) > 0:
            # Extract the messages from the conversation
            previous_messages = conversation_result.data[0].get('messages', [])
    
    # Add the new user message to the conversation history
    messages = previous_messages + [{"role": "user", "content": message}]
    
    # Check if the exam practice agent is initialized
    if not exam_practice_agent:
        return jsonify({"error": "Exam Practice Agent not initialized"}), 500
    
    try:
        # Get response from the Exam Practice Agent
        response = exam_practice_agent.chat(message)
        
        # Add the agent's response to the conversation history
        messages.append({"role": "assistant", "content": response})
        
        # Save the conversation if user is authenticated
        if user_id:
            if conversation_id:
                # Update existing conversation with new messages
                supabase.table('conversations').update({'messages': messages}).eq('id', conversation_id).execute()
            else:
                # Create new conversation and save it
                save_result = save_conversation(user_id, 'exam', messages)
                conversation_id = save_result.get('conversation', {}).get('id') if save_result.get('success') else None
        
        # Return the agent's response and conversation ID to the frontend
        return jsonify({
            "message": response,
            "conversation_id": conversation_id
        })
    except Exception as e:
        # Log and return any errors that occur
        print(f"Error in exam practice chat: {e}")
        return jsonify({"error": str(e)}), 500

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
    exam_practice_agent.reset()
    return jsonify({"status": "success", "message": "Exam conversation reset"})

# === Notes Generator Agent Service Counters ===

# Counter for chatting with the Notes Generator Agent.
@app.route('/api/notes/chat', methods=['POST'])
def notes_generator_chat():
    """Endpoint for chatting with the Notes Generator Agent"""
    # Get the request data from the frontend
    data = request.json
    message = data.get('message', '')  # Get the user's message or empty string if not provided
    user_id = data.get('user_id')  # Get the user's ID for authentication and conversation tracking
    conversation_id = data.get('conversation_id')  # Get conversation ID if continuing an existing conversation
    
    # Get previous messages if conversation_id is provided to maintain conversation context
    previous_messages = []
    if conversation_id:
        # Query the database for the existing conversation
        conversation_result = supabase.table('conversations').select('*').eq('id', conversation_id).execute()
        if conversation_result.data and len(conversation_result.data) > 0:
            # Extract the messages from the conversation
            previous_messages = conversation_result.data[0].get('messages', [])
    
    # Add the new user message to the conversation history
    messages = previous_messages + [{"role": "user", "content": message}]
    
    # Check if the notes generator agent is initialized
    if not notes_generator_agent:
        return jsonify({"error": "Notes Generator Agent not initialized"}), 500
    
    try:
        # Get response from the Notes Generator Agent
        response = notes_generator_agent.chat(message)
        
        # Add the agent's response to the conversation history
        messages.append({"role": "assistant", "content": response})
        
        # Save the conversation if user is authenticated
        if user_id:
            if conversation_id:
                # Update existing conversation with new messages
                supabase.table('conversations').update({'messages': messages}).eq('id', conversation_id).execute()
            else:
                # Create new conversation and save it
                save_result = save_conversation(user_id, 'notes', messages)
                conversation_id = save_result.get('conversation', {}).get('id') if save_result.get('success') else None
        
        # Return the agent's response and conversation ID to the frontend
        return jsonify({
            "message": response,
            "conversation_id": conversation_id
        })
    except Exception as e:
        # Log and return any errors that occur
        print(f"Error in notes generator chat: {e}")
        return jsonify({"error": str(e)}), 500

# Counter to reset the Notes Generator's conversation memory.
@app.route('/api/notes/reset', methods=['POST'])
def notes_reset():
    # Check if the Notes Generator assistant is available.
    if not notes_generator_agent:
        return jsonify({"error": "Notes generator agent not initialized. API key missing."}), 500

    # Tell the Notes Generator to clear its memory.
    # Like telling the assistant to put away previous note requests.
    notes_generator_agent.reset()
    return jsonify({"status": "success", "message": "Conversation reset"})

# Add a new endpoint to get chat history
@app.route('/api/chat/history', methods=['GET'])
def get_chat_history_endpoint():
    user_id = request.args.get('user_id', 'anonymous')
    agent_type = request.args.get('agent_type')
    limit = int(request.args.get('limit', 50))
    
    messages = get_chat_history(user_id, agent_type, limit)
    
    return jsonify({"messages": messages})

# === Authentication Endpoints ===

@app.route('/api/auth/signup', methods=['POST'])
def auth_signup():
    """Endpoint to register a new user"""
    # Log that the endpoint was called
    print("=== /api/auth/signup endpoint called ===") # Debug log to show the endpoint was reached
    
    # Log request headers and method
    print(f"Request method: {request.method}") # Debug log to show the HTTP method used
    print(f"Request headers: {dict(request.headers)}") # Debug log to show all headers sent with the request
    
    # Get the request data
    data = request.json
    print(f"Request data: {data}") # Debug log to show the JSON data received
    
    email = data.get('email')
    password = data.get('password')
    metadata = data.get('metadata', {})
    
    print(f"Email: {email}, Metadata: {metadata}") # Debug log to show parsed values
    
    if not email or not password:
        print("Error: Email and password are required") # Debug log for validation error
        return jsonify({"error": "Email and password are required"}), 400
    
    # Log that we're calling the signup_user function
    print("Calling signup_user function...") # Debug log before calling the signup function
    result = signup_user(email, password, metadata)
    print(f"signup_user result: {result}") # Debug log to show the result from signup_user
    
    if "error" in result:
        print(f"Error in result: {result['error']}") # Debug log for error in result
        return jsonify(result), 400
    
    print("Signup successful, returning result") # Debug log for successful signup
    return jsonify(result)

@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    """Endpoint to log in a user"""
    # Log that the endpoint was called
    print("=== /api/auth/login endpoint called ===") # Debug log to show the endpoint was reached
    
    # Log request headers and method
    print(f"Request method: {request.method}") # Debug log to show the HTTP method used
    print(f"Request headers: {dict(request.headers)}") # Debug log to show all headers sent with the request
    
    # Get the request data
    data = request.json
    print(f"Request data: {data}") # Debug log to show the JSON data received
    
    email = data.get('email')
    password = data.get('password')
    
    print(f"Email: {email}") # Debug log to show parsed email
    
    if not email or not password:
        print("Error: Email and password are required") # Debug log for validation error
        return jsonify({"error": "Email and password are required"}), 400
    
    # Log that we're calling the login_user function
    print("Calling login_user function...") # Debug log before calling the login function
    result = login_user(email, password)
    print(f"login_user result: {result}") # Debug log to show the result from login_user
    
    if "error" in result:
        print(f"Error in result: {result['error']}") # Debug log for error in result
        return jsonify(result), 401
    
    # Create a response with the result data
    response = make_response(jsonify(result))
    
    # If login was successful and we have session data, set cookies
    if result.get("success") and result.get("session"):
        # Set the access token in a cookie
        # httponly=True means JavaScript can't access this cookie (more secure)
        # secure=True means only sent over HTTPS (uncomment in production)
        # samesite='Lax' provides CSRF protection while allowing redirects from same site
        response.set_cookie(
            'sb-access-token',
            result["session"]["access_token"],
            httponly=True,
            # secure=True,  # Uncomment in production with HTTPS
            samesite='Lax',
            max_age=result["session"]["expires_at"]  # Set expiration based on token expiry
        )
        
        # Set the refresh token in a cookie
        response.set_cookie(
            'sb-refresh-token',
            result["session"]["refresh_token"],
            httponly=True,
            # secure=True,  # Uncomment in production with HTTPS
            samesite='Lax',
            max_age=30 * 24 * 60 * 60  # 30 days in seconds
        )
        
        print("Set authentication cookies in response") # Debug log for cookie setting
    
    print("Login successful, returning result") # Debug log for successful login
    return response

@app.route('/api/auth/logout', methods=['POST'])
def auth_logout():
    """Endpoint to log out a user"""
    # Get JWT token from cookies first, then from request body as fallback
    # This supports both cookie-based auth and the previous implementation
    jwt_token = request.cookies.get('sb-access-token')
    
    # If not in cookies, try to get from request body (backward compatibility)
    if not jwt_token:
        data = request.json
        jwt_token = data.get('jwt_token') if data else None
    
    if not jwt_token:
        return jsonify({"error": "Authentication token is required"}), 400
    
    # Call the logout function
    result = logout_user(jwt_token)
    
    # Create a response object
    response = make_response(jsonify(result))
    
    # Clear the authentication cookies regardless of logout result
    # This ensures cookies are cleared even if there was an issue with the server-side logout
    response.delete_cookie('sb-access-token')
    response.delete_cookie('sb-refresh-token')
    
    # Log cookie clearing
    print("Cleared authentication cookies") # Debug log for cookie clearing
    
    if "error" in result:
        return response, 400
    
    return response

@app.route('/api/auth/reset-password', methods=['POST'])
def auth_reset_password():
    """Endpoint to send a password reset email"""
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    result = reset_password(email)
    
    if "error" in result:
        return jsonify(result), 400
    
    return jsonify(result)

@app.route('/api/auth/user', methods=['GET'])
def auth_get_user():
    """Endpoint to get the current user's data"""
    # First try to get the token from cookies (cookie-based auth)
    jwt_token = request.cookies.get('sb-access-token')
    
    # If not in cookies, try to get from Authorization header (backward compatibility)
    if not jwt_token:
        auth_header = request.headers.get('Authorization')
        if auth_header:
            # Remove 'Bearer ' prefix if present
            if auth_header.startswith('Bearer '):
                jwt_token = auth_header[7:]
            else:
                jwt_token = auth_header
    
    # If no token found in either place, return error
    if not jwt_token:
        return jsonify({"error": "Authentication token is required"}), 401
    
    # Get user data with the token
    result = get_user(jwt_token)
    
    if "error" in result:
        return jsonify(result), 401
    
    return jsonify(result)

# === Subscription Management Endpoints ===

@app.route('/api/subscription/create', methods=['POST'])
def create_subscription_endpoint():
    """Endpoint to create or update a user's subscription"""
    # Get the request data from the frontend
    data = request.json
    user_id = data.get('user_id')  # Get the user ID to associate with the subscription
    plan_type = data.get('plan_type')  # Get the subscription plan type (basic, standard, premium)
    is_active = data.get('is_active', True)  # Default to active subscription
    expires_at = data.get('expires_at')  # When the subscription expires
    
    # Validate required fields
    if not user_id or not plan_type:
        # Return error if missing required fields
        return jsonify({"error": "User ID and plan type are required"}), 400
    
    # Create or update the subscription
    result = create_subscription(user_id, plan_type, is_active, expires_at)
    
    # Check if there was an error
    if "error" in result:
        # Return error message with appropriate status code
        return jsonify(result), 400
    
    # Return success response
    return jsonify(result)

@app.route('/api/subscription/get', methods=['GET'])
def get_subscription_endpoint():
    """Endpoint to get a user's subscription details"""
    # Get the user ID from the query parameters
    user_id = request.args.get('user_id')
    
    # Validate required fields
    if not user_id:
        # Return error if missing user ID
        return jsonify({"error": "User ID is required"}), 400
    
    # Get the subscription details
    result = get_user_subscription(user_id)
    
    # Check if there was an error
    if "error" in result:
        # Return error message with appropriate status code
        return jsonify(result), 400
    
    # Return success response with subscription details
    return jsonify(result)

# === Conversation Management Endpoints ===

@app.route('/api/conversations', methods=['GET'])
def get_conversations_endpoint():
    """Endpoint to get a user's conversation history"""
    # Get the user ID from the query parameters
    user_id = request.args.get('user_id')
    # Optionally filter by agent type
    agent_type = request.args.get('agent_type')
    
    # Validate required fields
    if not user_id:
        # Return error if missing user ID
        return jsonify({"error": "User ID is required"}), 400
    
    # Get the user's conversations
    result = get_user_conversations(user_id, agent_type)
    
    # Check if there was an error
    if "error" in result:
        # Return error message with appropriate status code
        return jsonify(result), 400
    
    # Return success response with conversation history
    return jsonify(result)

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
