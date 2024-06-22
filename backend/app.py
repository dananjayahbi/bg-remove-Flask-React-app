# app.py

from flask import Flask, send_from_directory
from app.upload_images import upload_images_bp
from app.background_remover import ensure_directories

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
