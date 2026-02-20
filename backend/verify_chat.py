
import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def test_chat():
    print("\n--- Testing Chatbot ---")
    
    payload = {"message": "Hello, are you working?"}
    
    try:
        r = requests.post(f"{BASE_URL}/chat", json=payload, timeout=60)
        
        print(f"Status Code: {r.status_code}")
        if r.status_code == 200:
            print(f"Response: {r.json()}")
        else:
            print(f"Error: {r.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_chat()
