import sys
import os
from PIL import Image, ImageDraw

# Add backend directory to sys.path
sys.path.append(os.path.abspath("backend"))

# Now import the stega module
from backend.core.stega import hide_message_in_image, reveal_message_from_image

def create_test_image(path):
    img = Image.new('RGB', (100, 30), color = (73, 109, 137))
    d = ImageDraw.Draw(img)
    d.text((10,10), "Hello World", fill=(255, 255, 0))
    img.save(path)

def test_compression_failure():
    original = "test_original.png"
    encoded = "test_encoded.png"
    compressed = "test_compressed.jpg"  # Saving as JPG destroys LSB data
    
    # Create test image
    create_test_image(original)
    
    # Hide message
    msg = "My secret message"
    try:
        hide_message_in_image(original, msg, encoded)
        print(f"Message hidden in {encoded}")
    except Exception as e:
        print(f"Error hiding message: {e}")
        return

    # Simulate compression by saving as JPEG
    try:
        with Image.open(encoded) as img:
            img.save(compressed, "JPEG", quality=85)
        print(f"Saved compressed version as {compressed}")
    except Exception as e:
        print(f"Error creating compressed image: {e}")
        return

    # Try to reveal message from the compressed file (even if converted back to PNG)
    # The LSB data is lost during the JPEG compression step.
    compressed_png = "test_restored.png"
    try:
        with Image.open(compressed) as img:
            img.save(compressed_png)
        
        revealed_msg = reveal_message_from_image(compressed_png)
        print(f"Revealed message: '{revealed_msg}'")
    except Exception as e:
        print(f"EXPECTED FAILURE: Could not reveal message from compressed image: {e}")

    # Cleanup
    for f in [original, encoded, compressed, compressed_png]:
        if os.path.exists(f):
            try:
                os.remove(f)
            except:
                pass

if __name__ == "__main__":
    test_compression_failure()
