import os
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from core.crypto import encrypt_data, decrypt_data
from core.stega import hide_message_in_image, reveal_message_from_image
from core.ai_module import analyze_password, generate_decoy
import uuid
import tempfile
import shutil
import base64
import json
import uuid
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from core.secure_links import link_manager
from core.contact_manager import contact_manager

app = Flask(__name__)
# Load config from environment
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# Security: Limit maximum upload size to 16MB to prevent memory exhaustion DoS attacks
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# CORS Configuration
# Split by comma if present, otherwise default to ["*"]
cors_origins_env = os.getenv('CORS_ALLOWED_ORIGINS', '*')
if cors_origins_env == '*':
    allowed_origins = "*"
else:
    allowed_origins = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip()]

# Initialize CORS with support for credentials and content-type headers
CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

# Initialize Rate Limiting for Brute Force Protection
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

UPLOAD_FOLDER = tempfile.gettempdir()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        
        # Connect to local Ollama instance
        ollama_url = "http://localhost:11434/api/chat"
        # Try llama3.2 as primary, fallback logic could be added but let's stick to what user has
        model_name = "llama3.2" 
        
        # Load system context
        context_file_path = os.path.join(os.path.dirname(__file__), 'cryptaris_context.txt')
        system_context = ""
        if os.path.exists(context_file_path):
            with open(context_file_path, 'r', encoding='utf-8') as f:
                system_context = f.read()
        
        messages = []
        if system_context:
            messages.append({"role": "system", "content": system_context})
        
        messages.append({"role": "user", "content": user_message})

        payload = {
            "model": model_name,
            "messages": messages,
            "stream": False
        }
        
        print(f"Sending request to Ollama: {model_name} with context length {len(system_context)}") # Debug log
        response = requests.post(ollama_url, json=payload)
        
        if response.status_code == 200:
            ai_response = response.json().get('message', {}).get('content', '')
            return jsonify({'response': ai_response})
        else:
            print(f"Ollama Error: {response.text}") # Debug log
            return jsonify({'error': f'Ollama Error: {response.text}'}), response.status_code
            
    except requests.exceptions.ConnectionError:
        print("Connection Error: Could not connect to Ollama") # Debug log
        return jsonify({'error': 'Could not connect to Ollama. Is it running?'}), 503
    except Exception as e:
        print(f"Server Error: {str(e)}") # Debug log
        return jsonify({'error': str(e)}), 500



@app.route('/api/encrypt/text', methods=['POST'])
def encrypt_text():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data['text']
        password = data.get('password', 'default-key') # In a real app, force password or generate one
        
        # Encrypt
        encrypted = encrypt_data(text.encode('utf-8'), password)
        return jsonify(encrypted)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/decrypt/text', methods=['POST'])
def decrypt_text():
    try:
        data = request.json
        required = ['ciphertext', 'salt', 'nonce']
        if not all(k in data for k in required):
            return jsonify({'error': 'Missing decryption parameters'}), 400
            
        password = data.get('password', 'default-key')
        
        # Decrypt
        decrypted_bytes = decrypt_data(data['ciphertext'], password, data['salt'], data['nonce'])
        return jsonify({'text': decrypted_bytes.decode('utf-8')})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/encrypt/file', methods=['POST'])
def encrypt_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        password = request.form.get('password', 'default-key')
        
        # Save temp with UUID
        unique_prefix = uuid.uuid4().hex
        filename = secure_filename(file.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_prefix}_{filename}")
        file.save(temp_path)
        
        with open(temp_path, 'rb') as f:
            file_data = f.read()
            
        # Encrypt
        encrypted = encrypt_data(file_data, password)
        
        # Create output file
        # Format: SALT(16) + LAYER2_BLOB
        salt = base64.b64decode(encrypted['salt'])
        layer2_blob = base64.b64decode(encrypted['ciphertext'])
        final_data = salt + layer2_blob
        
        output_filename = f"{unique_prefix}_{filename}.enc"
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
        
        with open(output_path, 'wb') as f:
            f.write(final_data)
            
        # Cleanup input
        os.remove(temp_path)
        
        return send_file(output_path, as_attachment=True, download_name=output_filename)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/decrypt/file', methods=['POST'])
def decrypt_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        password = request.form.get('password', 'default-key')
        
        # Save temp with UUID to prevent race conditions
        unique_prefix = uuid.uuid4().hex
        filename = secure_filename(file.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_prefix}_{filename}")
        file.save(temp_path)
        
        with open(temp_path, 'rb') as f:
            file_data = f.read()
            
        # Parse Format: SALT(16) + LAYER2_BLOB
        if len(file_data) < 28:
            return jsonify({'error': 'Invalid file format'}), 400
            
        salt = file_data[:16]
        layer2_blob = file_data[16:]
        
        salt_b64 = base64.b64encode(salt).decode('utf-8')
        ciphertext_b64 = base64.b64encode(layer2_blob).decode('utf-8')
        
        decrypted_bytes = decrypt_data(ciphertext_b64, password, salt_b64, "")
        
        original_filename = filename.replace('.enc', '')
        if original_filename == filename:
             original_filename = f"decrypted_{filename}"
             
        output_filename = f"{unique_prefix}_{original_filename}"
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
        
        with open(output_path, 'wb') as f:
            f.write(decrypted_bytes)
            
        # Cleanup input
        os.remove(temp_path)
        
        return send_file(output_path, as_attachment=True, download_name=original_filename)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/steganography/hide', methods=['POST'])
def hide_message():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Image is required'}), 400
        image = request.files['image']
        message = request.form.get('message', '')
        password = request.form.get('password', '')
        
        if not message:
             return jsonify({'error': 'Message is required'}), 400

        if password:
             encrypted = encrypt_data(message.encode('utf-8'), password)
             message_content = json.dumps(encrypted)
             message_to_hide = "ENC::" + message_content
        else:
             message_to_hide = message
             
        unique_prefix = uuid.uuid4().hex
        filename = secure_filename(image.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_prefix}_{filename}")
        image.save(temp_path)
        
        output_filename = f"stego_{unique_prefix}_{filename.split('.')[0]}.png"
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
        
        hide_message_in_image(temp_path, message_to_hide, output_path)
        
        os.remove(temp_path)
        return send_file(output_path, as_attachment=True, download_name=output_filename)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/steganography/reveal', methods=['POST'])
def reveal_message():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Image is required'}), 400
        image = request.files['image']
        unique_prefix = uuid.uuid4().hex
        filename = secure_filename(image.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"reveal_{unique_prefix}_{filename}")
        image.save(temp_path)
        
        revealed_text = reveal_message_from_image(temp_path)
        os.remove(temp_path)
        
        return jsonify({'message': revealed_text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
@app.route('/api/links/create', methods=['POST'])
def create_link():
    try:
        # Check if it's form data (has file) or json
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form
            file = request.files.get('file')
            file_data = file.read() if file else None
            file_name = secure_filename(file.filename) if file and file.filename else None
        else:
            data = request.json or {}
            file_data = None
            file_name = None

        url = data.get('url', '')
        if not url and not file_data:
            return jsonify({'error': 'URL or File is required'}), 400
            
        expires_seconds = int(data.get('expires', 3600))
            
        result = link_manager.create_link(
            url=url,
            password=data.get('password'),
            expires_seconds=expires_seconds,
            file_data=file_data,
            file_name=file_name
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/links/access/<link_id>', methods=['POST'])
@limiter.limit("5 per minute", error_message="Too many access attempts. Please wait a minute.")
def access_link(link_id):
    try:
        data = request.json
        password = data.get('password') if data else None
        
        result = link_manager.access_link(link_id, password)
        
        if result.get('file_data'):
            # It's a file
            file_name = result.get('file_name') or 'secure_file.dat'
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
            
            with open(temp_path, 'wb') as f:
                f.write(result['file_data'])
                
            response = send_file(temp_path, as_attachment=True, download_name=file_name)
            
            # Note: We can't easily clean up the temp_path synchronously here after send_file,
            # but since it's in the OS temp directory it will be cleaned up eventually.
            return response
            
        else:
            # It's just a URL
            return jsonify({'url': result['url']})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/ai/analyze-password', methods=['POST'])
def api_analyze_password():
    try:
        data = request.json
        password = data.get('password', '')
        result = analyze_password(password)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/generate-decoy', methods=['POST'])
def api_generate_decoy():
    try:
        data = request.json
        doc_type = data.get('type', 'personal')
        result = generate_decoy(doc_type)
        
        filename = result['filename']
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        with open(temp_path, 'wb') as f:
            f.write(result['content'])
            
        return send_file(temp_path, as_attachment=True, download_name=filename, mimetype=result['mimetype'])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/contact', methods=['POST'])
def contact_form():
    try:
        data = request.json
        if not data or not all(k in data for k in ('name', 'email', 'message')):
            return jsonify({'error': 'Missing required fields'}), 400
            
        result = contact_manager.save_message(
            name=data['name'],
            email=data['email'],
            message=data['message']
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    app.run(debug=debug_mode, port=port, host='0.0.0.0')
