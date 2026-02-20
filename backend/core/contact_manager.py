
import sqlite3
import os
import time
import uuid

# Database Path (Same as secure links to keep single DB file)
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cryptaris.db')

class ContactManager:
    def __init__(self):
        self._init_db()

    def _get_db_connection(self):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        conn = self._get_db_connection()
        try:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS contacts (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at REAL
                )
            ''')
            conn.commit()
        finally:
            conn.close()

    def save_message(self, name: str, email: str, message: str) -> dict:
        """
        Saves a contact message to the database.
        """
        msg_id = uuid.uuid4().hex
        timestamp = time.time()
        
        conn = self._get_db_connection()
        try:
            conn.execute('INSERT INTO contacts (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)',
                         (msg_id, name, email, message, timestamp))
            conn.commit()
        finally:
            conn.close()

        return {"id": msg_id, "status": "saved"}

# Global Instance
contact_manager = ContactManager()
