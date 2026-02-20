
import requests
import os

BASE_URL = "http://127.0.0.1:5000/api"

def test_steganography():
    print("\n--- Testing Steganography ---")
    
    # Create a dummy image
    from PIL import Image
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save('test_stego.png')
    
    try:
        # Hide
        with open('test_stego.png', 'rb') as f:
            files = {'image': f}
            data = {'message': 'Secret Agent Man', 'password': ''} # Test without password first for simplicity
            r = requests.post(f"{BASE_URL}/steganography/hide", files=files, data=data)
            
        if r.status_code != 200:
            print(f"❌ FAIL - Hide Message: {r.text}")
            return
            
        with open("stego_output.png", "wb") as f:
            f.write(r.content)
            
        print("✅ PASS - Hide Message")
        
        # Reveal
        with open("stego_output.png", "rb") as f:
            files_reveal = {'image': f}
            r2 = requests.post(f"{BASE_URL}/steganography/reveal", files=files_reveal)
            
        if r2.status_code != 200:
             print(f"❌ FAIL - Reveal Message: {r2.text}")
             return

        result = r2.json()
        if result.get('message') == 'Secret Agent Man':
             print(f"✅ PASS - Reveal Message: {result['message']}")
        else:
             print(f"❌ FAIL - Reveal Message Content Mismatch: {result}")

    except Exception as e:
        print(f"❌ FAIL - Exception: {e}")

    print("\n--- Testing Encrypted Steganography ---")
    try:
        # Hide with password
        img = Image.new('RGB', (100, 100), color = 'blue')
        img.save('test_stego_enc.png')

        with open('test_stego_enc.png', 'rb') as f:
            files = {'image': f}
            data = {'message': 'Top Secret Encrypted', 'password': 'spy-password'}
            r = requests.post(f"{BASE_URL}/steganography/hide", files=files, data=data)
            
        if r.status_code != 200:
            print(f"❌ FAIL - Hide Encrypted Message: {r.text}")
            return
            
        with open("stego_enc_output.png", "wb") as f:
            f.write(r.content)
            
        print("✅ PASS - Hide Encrypted Message")
        
        # Reveal (should return encrypted string)
        with open("stego_enc_output.png", "rb") as f:
            files_reveal = {'image': f}
            r2 = requests.post(f"{BASE_URL}/steganography/reveal", files=files_reveal)
            
        if r2.status_code != 200:
             print(f"❌ FAIL - Reveal Encrypted Message: {r2.text}")
             return

        result = r2.json()
        if "ENC::" in result.get('message', ''):
             print(f"✅ PASS - Reveal Encrypted Message: Successfully retrieved encrypted blob starting with ENC::")
        else:
             print(f"❌ FAIL - Reveal Encrypted Message Content Mismatch: {result}")

    except Exception as e:
         print(f"❌ FAIL - Encrypted Flow Exception: {e}")
    finally:
        if os.path.exists('test_stego.png'): os.remove('test_stego.png')
        if os.path.exists('stego_output.png'): os.remove('stego_output.png')
        if os.path.exists('test_stego_enc.png'): os.remove('test_stego_enc.png')
        if os.path.exists('stego_enc_output.png'): os.remove('stego_enc_output.png')

if __name__ == "__main__":
    test_steganography()
