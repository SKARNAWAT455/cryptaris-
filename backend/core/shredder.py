import os
import secrets
import gc

def shred_file(filepath: str, passes: int = 3) -> bool:
    """
    Securely overwrites a file with random data, zeros, and ones multiple times
    before finally deleting it from the filesystem.
    
    This is a basic implementation of a secure file shredding algorithm 
    (similar to DoD 5220.22-M 3-pass wiping, but simplified).
    
    Args:
        filepath (str): The path to the file to shred.
        passes (int): The number of overwrite passes. Ensure it is >= 1.
        
    Returns:
        bool: True if successful, False otherwise.
    """
    if not os.path.exists(filepath):
        return False
        
    try:
        file_size = os.path.getsize(filepath)
        
        # If the file is 0 bytes, we just delete it.
        if file_size == 0:
            os.remove(filepath)
            return True
            
        with open(filepath, 'ba+', buffering=0) as f:
            for pass_num in range(passes):
                f.seek(0)
                
                # Pass 1: Overwrite with Zeros
                if pass_num % 3 == 0:
                    f.write(b'\x00' * file_size)
                    
                # Pass 2: Overwrite with Ones
                elif pass_num % 3 == 1:
                    f.write(b'\xFF' * file_size)
                    
                # Pass 3: Overwrite with Random data
                else:
                    # Write in chunks to prevent huge memory usage on large files
                    chunk_size = 1024 * 1024  # 1MB chunks
                    bytes_written = 0
                    while bytes_written < file_size:
                        write_size = min(chunk_size, file_size - bytes_written)
                        f.write(secrets.token_bytes(write_size))
                        bytes_written += write_size
                
                # Ensure it's written to disk before the next pass
                f.flush()
                # Use os.fsync on Windows and Unix
                os.fsync(f.fileno())

        # Rename the file to an obscure name before deleting to hide original filename
        dir_name = os.path.dirname(filepath)
        random_filename = secrets.token_hex(16) + ".tmp"
        obscured_target_path = os.path.join(dir_name, random_filename)
        
        # In rare cases where the random name exists just overwrite it
        if os.path.exists(obscured_target_path):
             os.remove(obscured_target_path)
             
        os.rename(filepath, obscured_target_path)
        
        # Finally delete
        os.remove(obscured_target_path)
        
        # Force garbage collection to ensure any lingering file handlers are cleared in extreme cases
        gc.collect() 
        return True
        
    except Exception as e:
        print(f"Error shredding file {filepath}: {str(e)}")
        # Attempt standard deletion as fallback if permissions or something fails mid-shred
        try:
             if os.path.exists(filepath):
                 os.remove(filepath)
        except Exception:
             pass
        return False

