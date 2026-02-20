
import sys
import os

# Add the backend directory to sys.path so we can import the module
sys.path.append(os.path.abspath("backend"))

from PIL import Image, ImageDraw
from backend.core.stega import hide_message_in_image, reveal_message_from_image

def create_test_image(path):
    img = Image.new('RGB', (100, 30), color = (73, 109, 137))
    d = ImageDraw.Draw(img)
    d.text((10,10), "Hello World", fill=(255, 255, 0))
    img.save(path)

def test_steganography():
    original_image = "test_original.png"
    encoded_image = "test_encoded.png"
    secret_message = "This is a secret message from verify script."

    print(f"Creating test image at {original_image}...")
    create_test_image(original_image)

    print(f"Hiding message: '{secret_message}'")
    try:
        hide_message_in_image(original_image, secret_message, encoded_image)
        print(f"Message hidden. Saved to {encoded_image}")
    except Exception as e:
        print(f"Error hiding message: {e}")
        return

    print("Attempting to reveal message...")
    try:
        revealed_message = reveal_message_from_image(encoded_image)
        print(f"Revealed message: '{revealed_message}'")
        
        if revealed_message == secret_message:
            print("SUCCESS: Message revealed correctly!")
        else:
            print("FAILURE: Revealed message does not match.")
    except Exception as e:
        print(f"Error revealing message: {e}")

    # Clean up
    if os.path.exists(original_image):
        os.remove(original_image)
    if os.path.exists(encoded_image):
        os.remove(encoded_image)

if __name__ == "__main__":
    test_steganography()
