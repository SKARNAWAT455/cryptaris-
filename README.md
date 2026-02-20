# Cryptaris

Cryptaris is a modern, high-performance web application built with React, TypeScript, and Tailwind CSS.
It features a "Modern Clean/Luxury Minimalist" aesthetic with a focus on premium user experience.

> **User Manual**: For details on features and usage, please refer to [user_manual.md](user_manual.md).

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, shadcn/ui
-   **Backend**: Python, Flask
-   **AI Integration**: Ollama (Llama 3.2)
-   **Encryption**: AES-GCM (Dual-Key System)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm
-   Python 3.8+
-   Ollama (for Chatbot features)

### Backend Setup (Flask)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv .venv
    .\.venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    python app.py
    ```
    The API will be available at `http://localhost:5000`.

### Frontend Setup (React)

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

## 🛠️ Build for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

1. **Backend**:
   - Install dependencies: `pip install -r backend/requirements.txt`
   - Set environment variables (see `.env.example`)
   - Use a production WSGI server: `gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app`

2. **Frontend**:
   - Create `.env` file with `VITE_API_URL=https://your-api-domain.com/api`
   - Build for production: `npm run build`
   - Serve the `dist/` folder using Nginx/Apache or a static host (Vercel/Netlify).

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

[MIT](LICENSE)
