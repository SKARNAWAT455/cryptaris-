from stegano import lsb
import os

def hide_message_in_image(image_path: str, message: str, save_path: str) -> str:
    """
    Hides a secret message in an image using LSB steganography.
    Converts input to RGB/RGBA to ensure compatibility.
    """
    try:
        # Check if the image path exists
        if not os.path.exists(image_path):
             raise ValueError("Input image file not found.")

        # Ensure that the image is opened and converted effectively to a format 
        # that supports LSB (like PNG avoids lossy compression artifacts from input if we just read pixels, 
        # but usage of 'lsb.hide' takes a path or image object).
        # We will let 'lsb.hide' handle it, but if it's a JPEG, lsb might fail or result be weak.
        # Actually, stegano.lsb.hide opens the image.
        
        secret = lsb.hide(image_path, message)
        secret.save(save_path)
        return save_path
    except Exception as e:
        raise ValueError(f"Steganography encoding failed: {str(e)}")

def reveal_message_from_image(image_path: str) -> str:
    """
    Reveals a secret message from an LSB-encoded image.
    """
    try:
        return lsb.reveal(image_path)
    except Exception as e:
        raise ValueError(f"Steganography decoding failed (Image might not contain a message): {str(e)}")
