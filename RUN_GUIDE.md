# Cryptaris Run Guide

This guide details the commands to run all components of the Cryptaris system locally.

## 1. Start Ollama (AI Engine)
First, ensure the AI engine is running. Open a terminal and run:

```powershell
ollama serve
```

If it fails with an error (like "address already in use"), it means **Ollama is already running in the background** (check your system tray). That is a good thing!

Verify it's working by listing models:
```powershell
ollama list
```
*You should see `llama3.2` or your installed model.*

## 2. Start Backend (Python/Flask)
The backend handles API requests and the AI integration. Open a **new terminal**:

```powershell
cd backend
python app.py
```
*The server will start on `http://127.0.0.1:5000`.*
*It will automatically load `cryptaris_context.txt` for the chatbot.* (Make sure you install dependencies first: `pip install -r requirements.txt`)

## 3. Start Frontend (React)
The frontend is the user interface. Open a **new terminal**:

```powershell
npm run dev
```
*The app will be available at `http://localhost:5173` (or similar).*

## Summary o Terminals
You should have 3 terminals open:
1.  **Ollama**: Serving the model (or running in tray).
2.  **Backend**: Running `python app.py`.
3.  **Frontend**: Running `npm run dev`.
