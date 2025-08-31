# AI-Automation Chatbot

A professional AI chatbot web application built with **React (TypeScript)** frontend and **Django** backend, integrated with **Hugging Face's LLM** for real-time intelligent responses. The chatbot supports **Markdown rendering**, **code snippets**, **authentication**, and **conversation history**.

---

## Live Demo

* **Frontend:** [https://chatbot-s0za.onrender.com](https://chatbot-s0za.onrender.com)

> You can try chatting anonymously or register/login to save and continue conversations.

---

## Features

* Real-time chat with AI using Hugging Face LLM
* Supports **Markdown** formatting and code blocks
* Maintains conversation context by sending the full message history to the backend for context-aware replies
* **Authentication (via Django Djoser)**

  * Login / Register with **username/email + password**
  * Authenticated users can **save conversation history** and continue later
  * Anonymous users can still chat, but conversations are not saved
* Professional UI with:

  * Typing indicator
  * Multi-line input
  * Responsive design
* Copy code snippets directly from chat
* Fully customizable and extendable for learning purposes

---

## Technologies Used

* **Frontend:** React, TypeScript, Tailwind CSS
* **Backend:** Django, Django REST Framework, Djoser
* **Database:** PostgreSQL (for conversation history & authentication)
* **AI Integration:** Hugging Face `deepseek-ai/DeepSeek-V3-0324`
* **Markdown Rendering:** `react-markdown`, `rehype-highlight`, `remark-gfm`

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Kalebtes2031/Chatbot.git
cd Chatbot
```

---

### 2. Backend Setup (Django)

```bash
cd backend
python -m venv venv
# Activate virtual environment
source venv/bin/activate      # Linux/macOS
# or
venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
HF_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://username:password@hostname:port/db_name
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,your_backend_render_url
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://chatbot-s0za.onrender.com
```

Run migrations and start the server:

```bash
cd chatbot_backend
python manage.py migrate
python manage.py runserver
```

---

### 3. Frontend Setup (React)

```bash
cd chatbot-frontend
npm install
npm run dev
```

Update your `.env` in `chatbot-frontend`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Open your browser at [http://localhost:5173](http://localhost:5173) (or the Vite dev server port).

---

## Usage

1. **Anonymous mode**: Type a message and chat instantly (no login required, conversations are not saved).
2. **Authenticated mode**:

   * Register/Login with username + password
   * Start a new chat or continue from previous conversations
   * Your chat history is saved and accessible after login
3. Copy code blocks directly from chat with the copy button.
4. All responses are rendered with Markdown formatting.

---

## Deployment Notes

* Backend uses **Gunicorn + PostgreSQL + Render** for production
* Frontend deployed via **Vite + Render**
* Ensure the `VITE_API_URL` in frontend points to the **backend production URL**
* Configure **CORS** and **allowed hosts** in backend settings for deployed URLs

---

## Future Improvements

* **Streaming responses**: Show partial model outputs in real-time
* **OAuth / social login** (Google, GitHub)
* **User profile & settings** (theme, model choice, export chat history)
* **Scalable deployment**: Docker + CI/CD pipeline

---

## License

MIT License © 2025 Kaleb Ayele

---

## Acknowledgements

* [React](https://reactjs.org/)
* [Django](https://www.djangoproject.com/)
* [Hugging Face](https://huggingface.co/)
* [Tailwind CSS](https://tailwindcss.com/)
* [react-markdown](https://github.com/remarkjs/react-markdown)

---
