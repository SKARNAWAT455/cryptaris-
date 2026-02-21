
import sqlite3
import os
import uuid
import time
import base64
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Database Path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cryptaris.db')

class SecureLinkManager:
    def __init__(self):
        # Initialize DB
        self._init_db()
        
        # Master key for encrypting the data at rest in DB
        # In a real scenario, this should be an ENV VAR or KMS key.
        # For this file-based persistence, we use a fixed key or derived from system key if available.
        # To keep it simple and consistent across restarts without complex key mgmt for now:
        # We will use a hardcoded key mixed with system random if it doesn't exist? 
        # No, to allow restarting, the key must be consistent.
        # We will use the SYSTEM_MASTER_KEY global logic or a specific one.
        
        smk = os.getenv('SYSTEM_MASTER_KEY', 'CRYPTARIS_PERSISTENT_MASTER_KEY_V1')
        # Deterministic key generation from the master string
        self._master_key = hashlib.sha256(smk.encode()).digest()
        self._cipher = AESGCM(self._master_key)

    def _get_db_connection(self):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        conn = self._get_db_connection()
        try:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS links (
                    id TEXT PRIMARY KEY,
                    ciphertext TEXT NOT NULL,
                    nonce TEXT NOT NULL,
                    password_hash TEXT,
                    expiry REAL,
                    created_at REAL
                )
            ''')
            # Add new columns for file support if they don't exist
            try:
                conn.execute('ALTER TABLE links ADD COLUMN file_data TEXT')
                conn.execute('ALTER TABLE links ADD COLUMN file_name TEXT')
            except sqlite3.OperationalError:
                # Columns likely already exist
                pass
            conn.commit()
        finally:
            conn.close()

    def create_link(self, url: str, password: str = None, expires_seconds: int = 3600, file_data: bytes = None, file_name: str = None) -> dict:
        """
        Creates a secure, encrypted link entry in SQLite. Can Optionally contain a file.
        """
        link_id = uuid.uuid4().hex[:12] # ID for URL
        
        # 1. Handle Password
        pwd_hash = None
        if password:
            pwd_hash = hashlib.sha256(password.encode()).hexdigest()

        # 2. Encrypt the URL
        nonce = os.urandom(12)
        encrypted_url = self._cipher.encrypt(nonce, url.encode() if url else b"", None)

        # 2b. Encrypt File Data if present
        encrypted_file_data = None
        if file_data:
            # Reusing the same nonce for simplicity since we use a different payload, but ideally different nonce
            # Wait, AES-GCM requires unique nonces for same key. We MUST use a different nonce for the file.
            file_nonce = os.urandom(12)
            encrypted_file_data_bytes = self._cipher.encrypt(file_nonce, file_data, None)
            
            # Combine nonce and ciphertext to store in a single column
            encrypted_file_data = base64.b64encode(file_nonce).decode('utf-8') + ":" + base64.b64encode(encrypted_file_data_bytes).decode('utf-8')

        # 3. Calculate Expiry
        expiry_timestamp = 0
        if expires_seconds > 0:
            expiry_timestamp = time.time() + expires_seconds
        
        # 4. Store in DB
        conn = self._get_db_connection()
        try:
            conn.execute('INSERT INTO links (id, ciphertext, nonce, password_hash, expiry, created_at, file_data, file_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                         (link_id, 
                          base64.b64encode(encrypted_url).decode('utf-8'),
                          base64.b64encode(nonce).decode('utf-8'),
                          pwd_hash,
                          expiry_timestamp,
                          time.time(),
                          encrypted_file_data,
                          file_name))
            conn.commit()
        finally:
            conn.close()

        return {"link_id": link_id, "full_url": f"https://cryptaris.io/s/{link_id}"} # Frontend handles this route usually? Or is it a display thing?
        # The user's previous code returned exactly this format.

    def access_link(self, link_id: str, password: str = None) -> dict:
        """
        Retrieves and decrypts a link from SQLite if valid.
        """
        conn = self._get_db_connection()
        try:
            row = conn.execute('SELECT * FROM links WHERE id = ?', (link_id,)).fetchone()
        finally:
            conn.close()
        
        # 1. Check Existence
        if not row:
            raise ValueError("Link not found or has expired.")

        # 2. Check Expiry
        if row['expiry'] > 0 and time.time() > row['expiry']:
            # Lazy cleanup
            self.cleanup() 
            raise ValueError("Link has expired.")

        # 3. Check Password
        if row['password_hash']:
            if not password:
                raise ValueError("Password required.")
            
            input_hash = hashlib.sha256(password.encode()).hexdigest()
            if input_hash != row['password_hash']:
                raise ValueError("Incorrect password.")

        # 4. Decrypt URL
        try:
            nonce = base64.b64decode(row['nonce'])
            ciphertext = base64.b64decode(row['ciphertext'])
            decrypted_bytes = self._cipher.decrypt(nonce, ciphertext, None)
            url = decrypted_bytes.decode('utf-8')
        except Exception:
            raise ValueError("Decryption failed. Data corruption.")
            
        # 5. Decrypt File if present
        file_bytes = None
        file_name = row['file_name']
        if row['file_data']:
            try:
                parts = row['file_data'].split(":")
                file_nonce = base64.b64decode(parts[0])
                file_ciphertext = base64.b64decode(parts[1])
                file_bytes = self._cipher.decrypt(file_nonce, file_ciphertext, None)
            except Exception:
                raise ValueError("File decryption failed. Data corruption.")

        return {"url": url, "file_data": file_bytes, "file_name": file_name}

    def cleanup(self):
        """Removes all expired links from DB."""
        now = time.time()
        conn = self._get_db_connection()
        try:
            conn.execute('DELETE FROM links WHERE expiry > 0 AND expiry < ?', (now,))
            conn.commit()
        finally:
            conn.close()

# Global Instance
link_manager = SecureLinkManager()
