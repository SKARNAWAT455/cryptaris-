
import os
import time
import sys
# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from core.secure_links import link_manager

print("--- Test 1: Create Link ---")
link_data = link_manager.create_link("https://example.com/secret", "mypassword", 1)
print(f"Created Link ID: {link_data['link_id']}")

print("\n--- Test 2: Access Link (Immediate) ---")
try:
    result = link_manager.access_link(link_data['link_id'], "mypassword")
    print(f"Success! URL: {result['url']}")
except Exception as e:
    print(f"FAIL: {e}")

print("\n--- Test 3: Check DB File Existence ---")
db_path = os.path.join(os.getcwd(), 'backend', 'cryptaris.db')
if os.path.exists(db_path):
    print(f"PASS: Database file found at {db_path}")
else:
    print("FAIL: Database file NOT found!")

print("\n--- Test 4: Simulate Restart (Re-import/New Instance) ---")
# In Python, reloading a module is tricky, but creating a new instance of the manager 
# (which we can't easily do since it's a global var in the module) acts similarly if we rely on the DB.
# The `link_manager` global is already initialized. 
# We can mistakenly 're-init' it by creating a new class instance manually to verify it reads from DB.
from core.secure_links import SecureLinkManager
new_manager = SecureLinkManager()
try:
    result = new_manager.access_link(link_data['link_id'], "mypassword")
    print(f"PASS: Accessed link from NEW manager instance. Persistence confirmed.")
except Exception as e:
    print(f"FAIL: Could not access link from new instance: {e}")

print("\n--- Test 5: Cleanup Expired ---")
# Manually call cleanup (nothing expired yet, but ensures no crash)
try:
    link_manager.cleanup()
    print("PASS: Cleanup ran without error.")
except Exception as e:
    print(f"FAIL: Cleanup error: {e}")
