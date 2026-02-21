import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidTag
from dotenv import load_dotenv

load_dotenv()

SYSTEM_MASTER_KEY = os.getenv("SYSTEM_MASTER_KEY")
if not SYSTEM_MASTER_KEY:
    import logging
    logging.warning("CRITICAL SECURITY WARNING: 'SYSTEM_MASTER_KEY' ENV VAR IS NOT SET.")
    logging.warning("Using a randomly generated volatile key. ANY PREVIOUSLY ENCRYPTED FILES OR DB LINKS WILL NOT BE DECRYPTABLE UNLESS THE ORIGINAL KEY IS RESTORED.")
    SYSTEM_MASTER_KEY = base64.b64encode(os.urandom(32)).decode('utf-8')

def derive_key(password: str, salt: bytes) -> bytes:
    """Derive a 256-bit key from the password using PBKDF2."""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return kdf.derive(password.encode())

def _encrypt_layer(data: bytes, key: bytes) -> bytes:
    """Helper for AES-GCM encryption."""
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, data, None)
    return nonce + ciphertext

def _decrypt_layer(data: bytes, key: bytes) -> bytes:
    """Helper for AES-GCM decryption."""
    nonce = data[:12]
    ciphertext = data[12:]
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, None)

def encrypt_data(data: bytes, password: str) -> dict:
    """
    System-Bound Encryption:
    1. Layer 1: Encrypt with User Password
    2. Layer 2: Encrypt with System Master Key
    3. Format: [SALT(16)][LAYER2_CIPHERTEXT]
    """
    salt = os.urandom(16)
    user_key = derive_key(password, salt)
    
    # Layer 1: User Encryption
    layer1_cipher = _encrypt_layer(data, user_key)
    
    # Layer 2: System Encryption
    system_key = derive_key(SYSTEM_MASTER_KEY, salt) # Use same salt for simplicity/binding
    layer2_cipher = _encrypt_layer(layer1_cipher, system_key)
    
    # Construct final payload
    # We return components for JSON, or raw bytes for files
    # For JSON compatibility with existing frontend, we encode layer2
    
    return {
        'ciphertext': base64.b64encode(layer2_cipher).decode('utf-8'),
        'salt': base64.b64encode(salt).decode('utf-8'),
        'nonce': "", # Nonce is embedded in ciphertext in this new schema
        'mode': 'SYSTEM_BOUND'
    }

def decrypt_data(encrypted_data: str, password: str, salt: str, nonce: str) -> bytes:
    """
    System-Bound Decryption.
    """
    try:
        salt_bytes = base64.b64decode(salt)
        ciphertext_bytes = base64.b64decode(encrypted_data)
        
        # Layer 2: System Decryption
        system_key = derive_key(SYSTEM_MASTER_KEY, salt_bytes)
        try:
            layer1_cipher = _decrypt_layer(ciphertext_bytes, system_key)
        except InvalidTag:
             raise ValueError("System Integrity Check Failed: This file was not encrypted by this Cryptaris instance or has been tampered with.")

        # Layer 1: User Decryption
        user_key = derive_key(password, salt_bytes)
        try:
             plaintext = _decrypt_layer(layer1_cipher, user_key)
        except InvalidTag:
             raise ValueError("User Authentication Failed: Incorrect password.")

        return plaintext
    except Exception as e:
        raise ValueError(str(e))

