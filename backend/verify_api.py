
import requests
import json
import os
import time

BASE_URL = "http://127.0.0.1:5000/api"

def print_result(name, success, details=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {name}")
    if details:
        print(f"   {details}")

def test_text_encryption():
    print("\n--- Testing Text Encryption ---")
    
    # Encrypt
    payload = {"text": "Hello World This Is Secret", "password": "supersecretkey"}
    try:
        r = requests.post(f"{BASE_URL}/encrypt/text", json=payload)
        if r.status_code != 200:
            print_result("Encrypt Text", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
            
        enc_data = r.json()
        if 'ciphertext' not in enc_data:
             print_result("Encrypt Text", False, "Missing ciphertext in response")
             return False
        
        print_result("Encrypt Text", True)
        
        # Decrypt
        dec_payload = {
            "ciphertext": enc_data['ciphertext'],
            "salt": enc_data['salt'],
            "nonce": enc_data['nonce'],
            "password": "supersecretkey"
        }
        
        r2 = requests.post(f"{BASE_URL}/decrypt/text", json=dec_payload)
        if r2.status_code != 200:
            print_result("Decrypt Text", False, f"Status: {r2.status_code}, Body: {r2.text}")
            return False
            
        dec_data = r2.json()
        if dec_data.get('text') == "Hello World This Is Secret":
            print_result("Decrypt Text", True)
            return True
        else:
            print_result("Decrypt Text", False, f"Decrypted text mismatch: {dec_data}")
            return False
            
    except Exception as e:
        print_result("Text Encryption Flow", False, str(e))
        return False

def test_file_encryption():
    print("\n--- Testing File Encryption ---")
    
    # Create dummy file
    filename = "test_file.txt"
    content = b"This is a test file content for encryption."
    with open(filename, "wb") as f:
        f.write(content)
        
    try:
        # Encrypt
        with open(filename, 'rb') as f:
            files = {'file': f}
            data = {'password': 'filepassword'}
            r = requests.post(f"{BASE_URL}/encrypt/file", files=files, data=data)

        if r.status_code != 200:
            print_result("Encrypt File", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
            
        enc_content = r.content
        print_result("Encrypt File", True, f"Received {len(enc_content)} bytes")
        
        # Save enc file
        enc_filename = "test_file.txt.enc"
        with open(enc_filename, "wb") as f:
            f.write(enc_content)
            
        # Decrypt
        with open(enc_filename, 'rb') as f:
            files_dec = {'file': f}
            data_dec = {'password': 'filepassword'}
            r2 = requests.post(f"{BASE_URL}/decrypt/file", files=files_dec, data=data_dec)

        if r2.status_code != 200:
            print_result("Decrypt File", False, f"Status: {r2.status_code}, Body: {r2.text}")
            return False
            
        dec_content = r2.content
        if dec_content == content:
            print_result("Decrypt File", True)
        else:
             print_result("Decrypt File", False, "Content mismatch")
             
    except Exception as e:
        print_result("File Encryption Flow", False, str(e))
    finally:
        try:
            if os.path.exists(filename): os.remove(filename)
            if os.path.exists("test_file.txt.enc"): os.remove("test_file.txt.enc")
            if os.path.exists("decrypted_test_file.txt"): os.remove("decrypted_test_file.txt")
        except Exception as e:
            print(f"Cleanup failed: {e}")

def test_secure_links():
    print("\n--- Testing Secure Links ---")
    
    # Create
    payload = {"url": "https://google.com", "password": "linkpass", "expires": 1}
    try:
        r = requests.post(f"{BASE_URL}/links/create", json=payload)
        if r.status_code != 200:
            print_result("Create Link", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
            
        link_data = r.json()
        link_id = link_data.get("link_id")
        if not link_id:
            print_result("Create Link", False, "No link_id returned")
            return False
            
        print_result("Create Link", True, f"ID: {link_id}")
        
        # Access
        access_payload = {"password": "linkpass"}
        r2 = requests.post(f"{BASE_URL}/links/access/{link_id}", json=access_payload)
        
        if r2.status_code != 200:
            print_result("Access Link", False, f"Status: {r2.status_code}, Body: {r2.text}")
            return False
            
        access_data = r2.json()
        if access_data.get("url") == "https://google.com":
            print_result("Access Link", True)
        else:
            print_result("Access Link", False, f"URL mismatch: {access_data}")
            
    except Exception as e:
        print_result("Secure Links Flow", False, str(e))

def test_ai_password():
    print("\n--- Testing AI Password Analysis ---")
    payload = {"password": "password123"}
    try:
        r = requests.post(f"{BASE_URL}/ai/analyze-password", json=payload)
        if r.status_code == 200:
            data = r.json()
            score = data.get('score')
            print_result("Analyze Password", True, f"Score: {score}")
        else:
            print_result("Analyze Password", False, f"Status: {r.status_code}")
    except Exception as e:
        print_result("Analyze Password", False, str(e))

if __name__ == "__main__":
    print("Starting API Verification...")
    try:
        test_text_encryption()
        test_file_encryption()
        test_secure_links()
        test_ai_password()
        # Steganography skipped for simple script as it requires valid image file structure
    except requests.exceptions.ConnectionError:
        print("❌ CRITICAL: Could not connect to server. Is it running on port 5000?")
