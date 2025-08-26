
```markdown
# AI-Automation Chatbot

A professional AI chatbot web application built with **React (TypeScript)** frontend and **Django** backend, integrated with **Hugging Face's LLM** for real-time intelligent responses. The chatbot supports **Markdown rendering**, **code snippets**, and **copy functionality**.

---

## Features

- Real-time chat with AI using Hugging Face LLM.
- Supports **Markdown** formatting and code blocks.
- Professional UI with:
  - Typing indicator
  - Multi-line input
  - Responsive design
- Copy code snippets directly from chat.
- Fully customizable and extendable for learning purposes.

---


## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Django, Django REST Framework
- **AI Integration:** Hugging Face `deepseek-ai/DeepSeek-V3-0324`
- **Markdown Rendering:** `react-markdown`, `rehype-highlight`, `remark-gfm`

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Kalebtes2031/Chatbot.git
cd Chatbot
````

### 2. Backend Setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux/macOS
# or
venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
OPENAI_API_KEY=your_openai_api_key
HF_API_KEY=your_huggingface_api_key
DEBUG=True
```

Run migrations and start the server:

```bash
cd chatbot_backend
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (React)

```bash
cd chatbot-frontend
npm install
npm run dev
```

Update your `.env` in chatbot-frontend:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Open your browser at `http://localhost:5173` (or the Vite dev server port).

---

## Usage

1. Type your message in the input box.
2. Press **Enter** or click the **send icon**.
3. The AI assistant responds with Markdown-rendered text.
4. You can copy code blocks using the **copy button**.

---

## Future Improvements

* **Multi-turn conversation:** Keep the chat context for more intelligent responses.
* **Streaming responses:** Show typing messages as the model generates responses.
* **Authentication & user sessions:** Personalized AI experience.
* **Deployment:** Docker or cloud hosting for production use.

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


