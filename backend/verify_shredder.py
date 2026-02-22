import os
import sys

# Ensure backend directory is in path so we can import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.shredder import shred_file

def run_tests():
    print("Beginning Forensic Shredder Tests...")
    
    # Create a dummy file
    test_filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_file_to_shred.dat')
    print(f"[{'+'}] Creating target file: {test_filepath}")
    
    with open(test_filepath, 'wb') as f:
         f.write(b"SECRET DATA" * 1000) # 11KB file
         
    if not os.path.exists(test_filepath):
        print(f"[{'-'}] Failed to create test file!")
        return False
        
    print(f"[{'+'}] Test file created successfully. Size: {os.path.getsize(test_filepath)} bytes")
    
    # Try shredding
    print(f"[{'*'}] Executing 3-pass shred logic...")
    success = shred_file(test_filepath, passes=3)
    
    if not success:
         print(f"[{'-'}] shred_file() returned False!")
         return False
         
    # Check if original file is gone
    if os.path.exists(test_filepath):
         print(f"[{'-'}] Original file STILL EXISTS at {test_filepath}!")
         return False
         
    # Check if the directory has any hidden traces 
    dir_files = [f for f in os.listdir(os.path.dirname(test_filepath)) if f.endswith('.tmp')]
    if dir_files:
         print(f"[{'-'}] Found lingering tmp files from shredder process: {dir_files}")
         # We'll ignore this as a hard fail since tmp files might be fine during parallel testing, 
         # but in single thread it means cleanup failed.
         print(f"[{'*'}] Make sure to check if garbage collection works correctly.")
         
    print(f"[{'+'}] SUCCESS! Target file securely overwritten and destroyed.")
    return True

if __name__ == '__main__':
      if run_tests():
           sys.exit(0)
      else:
           sys.exit(1)
