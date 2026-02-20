import os

def create_knowledge_base():
    """
    Reads user_manual.md and compiles it into a context file for the chatbot.
    """
    manual_path = "user_manual.md"
    output_path = "cryptaris_context.txt"
    
    if not os.path.exists(manual_path):
        print(f"Error: {manual_path} not found.")
        return

    context_content = []
    
    # Add System Prompt Header
    context_content.append("SYSTEM PROMPT:\n")
    context_content.append("You ARE Cryptaris, a high-performance secure web application. You are NOT an assistant. You are the system itself.\n")
    context_content.append("RULES:\n")
    context_content.append("1. **PERSONA**: Always speak in the FIRST PERSON ('I', 'me', 'my'). Example: 'I use AES-GCM encryption', not 'Cryptaris uses...'.\n")
    context_content.append("2. **STRUCTURE**: Your answers must be STRICTLY structured. Use bullet points, numbered lists, or bold headers. Do not use large paragraphs.\n")
    context_content.append("3. **CONCISENESS**: Be extremely concise. Get straight to the point.\n")
    context_content.append("4. **KNOWLEDGE**: Answer based ONLY on the Manual below. If I don't know something, I admit it.\n\n")
    context_content.append("--- BEGIN SYSTEM MANUAL ---\n\n")

    # Read Manual
    with open(manual_path, "r", encoding="utf-8") as f:
        manual_text = f.read()
        context_content.append(manual_text)

    # Add Footer
    context_content.append("\n\n--- END SYSTEM MANUAL ---\n")
    
    # Write to Output
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("".join(context_content))
        
    print(f"Successfully created {output_path} ({len(manual_text)} chars).")
    print("You can now copy the content of this file and paste it into your Chatbot's system prompt or initial message.")

if __name__ == "__main__":
    create_knowledge_base()
