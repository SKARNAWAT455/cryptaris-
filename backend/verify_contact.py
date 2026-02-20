
import requests
import sqlite3
import os
import time

BASE_URL = "http://127.0.0.1:5000/api"
DB_PATH = "cryptaris.db"

def test_contact_form():
    print("\n--- Testing Contact Form ---")
    
    # 1. Send Message via API
    message_data = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "This is a test message from verify script."
    }
    
    try:
        r = requests.post(f"{BASE_URL}/contact", json=message_data)
        if r.status_code != 200:
            print(f"❌ FAIL - Send Message: {r.status_code} {r.text}")
            return
        
        result = r.json()
        if result.get("status") == "saved" and "id" in result:
            print("✅ PASS - API returned success")
            msg_id = result["id"]
        else:
            print(f"❌ FAIL - API response format incorrect: {result}")
            return

        # 2. Verify in Database
        if not os.path.exists(DB_PATH):
             print(f"❌ FAIL - Database file not found at {DB_PATH}")
             return

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        row = cursor.execute("SELECT * FROM contacts WHERE id = ?", (msg_id,)).fetchone()
        
        if row:
            if row['name'] == message_data['name'] and \
               row['email'] == message_data['email'] and \
               row['message'] == message_data['message']:
                print("✅ PASS - Data persisted in SQLite correctly")
            else:
                print(f"❌ FAIL - Data mismatch in DB: {dict(row)}")
        else:
            print("❌ FAIL - Message not found in database")
            
        conn.close()

    except Exception as e:
        print(f"❌ FAIL - Exception: {e}")

if __name__ == "__main__":
    test_contact_form()
