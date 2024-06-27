# app.py

from flask import Flask, send_from_directory, jsonify, request, session
from flask_cors import CORS  # Import CORS from flask_cors
from app.upload_images import upload_images_bp
from app.background_remover import ensure_directories
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
from dotenv import load_dotenv
import os

# MongoDB connection string and Flask secret key
MONGO_URI = os.getenv('MONGO_URI')
SECRET_KEY = os.getenv('SECRET_KEY')

client = MongoClient(MONGO_URI)
db = client.get_database('bgremove')

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app)  # Apply CORS to your Flask app

# User collection in MongoDB
users_collection = db.users

# Register the blueprint for /upload route
app.register_blueprint(upload_images_bp)

# Function to ensure directories are created before handling any requests
def initialize():
    ensure_directories()

# Registering the initialize function to run before the first request
@app.before_request
def before_request():
    initialize()

# Route to serve processed images
@app.route('/outputs/<session_id>/<filename>')
def uploaded_file(session_id, filename):
    directory = f"assets/Outputs/{session_id}"
    return send_from_directory(directory, filename)

#user routes
# get all users
@app.route('/users', methods=['GET'])
def get_all_users():
    users = list(users_collection.find())
    for user in users:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        user.pop('password', None)  # Remove password field from response
    return jsonify(users), 200

# get user by id
@app.route('/users/<string:user_id>', methods=['GET'])
def get_user(user_id):
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        user.pop('password', None)  # Remove password field from response
        return jsonify(user), 200
    else:
        return 'User not found', 404
    
# login route
@app.route('/users/login', methods=['POST'])
def login():
    login_data = request.json
    email = login_data.get('email')
    password = login_data.get('password')

    # Check if email and password are provided
    if not email or not password:
        return 'Email and password are required', 400

    # Find user by email
    user = users_collection.find_one({'email': email})

    if user:
        # Verify hashed password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Store user's ObjectId in session
            session['user_id'] = str(user['_id'])
            return jsonify({'user_id': str(user['_id'])}), 200
        else:
            return 'Invalid email or password', 401
    else:
        return 'Invalid email or password', 401

# logout route
@app.route('/users/logout', methods=['GET'])
def logout():
    # Clear the session
    session.clear()
    return 'Logged out successfully', 200

# create user route
@app.route('/users', methods=['POST'])
def create_user():
    new_user_data = request.json
    email = new_user_data.get('email')
    password = new_user_data.get('password')

    # Validate request data
    if not email or not password:
        return 'Email and password are required', 400
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create new user object with hashed password
    new_user = {
        'email': email,
        'password': hashed_password,  # Store hashed password in the database
        'gallery': []
    }

    # Insert new user into MongoDB
    result = users_collection.insert_one(new_user)
    return str(result.inserted_id), 201

# update user route
@app.route('/users/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    update_data = request.json
    password = update_data.get('password')

    # Hash the password if provided in the update
    if password:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        update_data['password'] = hashed_password
    
    result = users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
    if result.modified_count == 1:
        return 'Updated successfully', 200
    else:
        return 'User not found', 404

# delete user route
@app.route('/users/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = users_collection.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count == 1:
        return 'Deleted successfully', 200
    else:
        return 'User not found', 404

if __name__ == '__main__':
    app.run(debug=True)
