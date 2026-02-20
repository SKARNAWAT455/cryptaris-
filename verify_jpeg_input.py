import sys
import os
from PIL import Image, ImageDraw

# Add backend directory to sys.path
sys.path.append(os.path.abspath("backend"))

# Now import the stega module
from backend.core.stega import hide_message_in_image, reveal_message_from_image

def create_jpeg(path):
    img = Image.new('RGB', (100, 30), color = (73, 109, 137))
    d = ImageDraw.Draw(img)
    d.text((10,10), "JPEG Input", fill=(255, 255, 0))
    img.save(path, "JPEG")

def test_jpeg_input():
    input_file = "test_input.jpg"
    output_png = "test_output_from_jpg.png"
    message = "Secret from JPEG source"

    create_jpeg(input_file)
    print(f"Adding message to {input_file}...")

    try:
        # hide_message_in_image should open the JPEG and handle it
        hide_message_in_image(input_file, message, output_png)
        print(f"Encoded saved to {output_png}")
        
        # Verify
        revealed = reveal_message_from_image(output_png)
        print(f"Revealed: {revealed}")

        if revealed == message:
            print("PASS: JPEG input handled correctly.")
        else:
            print(f"FAIL: Message mismatch. Expected '{message}', Got '{revealed}'")

    except Exception as e:
        print(f"FAIL: Error during process: {e}")

    # Cleanup
    for f in [input_file, output_png]:
        if os.path.exists(f):
            try:
                os.remove(f)
            except:
                pass

if __name__ == "__main__":
    test_jpeg_input()
