import os
import sys
import base64

# Add current directory to path so we can import core
sys.path.append(os.getcwd())

from core.crypto import encrypt_data, decrypt_data

def test_file_flow():
    print("Testing File Encryption/Decryption Flow...")
    
    # 1. Simulate File Data
    original_data = b"This is a secret file content." * 100
    password = "strongpassword"
    
    # 2. Encrypt (Logic from app.py: api_encrypt_file)
    print("Encrypting...")
    result = encrypt_data(original_data, password)
    
    salt = base64.b64decode(result['salt'])
    ciphertext = base64.b64decode(result['ciphertext'])
    
    header = b'CRYPTARIS'
    final_file_data = header + salt + ciphertext
    
    print(f"Encrypted file size: {len(final_file_data)} bytes")
    
    # 3. Decrypt (Logic from app.py: api_decrypt_file)
    print("Decrypting...")
    
    # Simulate reading from file
    read_data = final_file_data
    
    if not read_data.startswith(b'CRYPTARIS'):
        print("ERROR: Magic Header missing")
        return False
        
    payload = read_data[9:]
    extract_salt = payload[:16]
    extract_ciphertext = payload[16:]
    
    # Verify extraction
    if extract_salt != salt:
        print("ERROR: Salt mismatch")
        return False
    
    if extract_ciphertext != ciphertext:
        print("ERROR: Ciphertext mismatch")
        return False
        
    salt_str = base64.b64encode(extract_salt).decode('utf-8')
    ciphertext_str = base64.b64encode(extract_ciphertext).decode('utf-8')
    
    try:
        plaintext = decrypt_data(ciphertext_str, password, salt_str, "")
        
        if plaintext == original_data:
            print("SUCCESS: Decryption matched original data!")
            return True
        else:
            print("FAILURE: Decrypted data does not match original.")
            return False
            
    except Exception as e:
        print(f"EXCEPTION during decrypt_data: {e}")
        return False

if __name__ == "__main__":
    if test_file_flow():
        print("Test Passed")
        sys.exit(0)
    else:
        print("Test Failed")
        sys.exit(1)
