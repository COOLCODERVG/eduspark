
# 📘 EduSpark – AI-Powered Student Success Platform

**EduSpark** is a full-stack platform built to help students organize, learn, and grow smarter with the help of AI. It combines:

- 🧠 **AI Study Planner** – generates date-aware study plans via Gemini API  
- 📚 **Tutoring Access** – discover local and online tutors  
- 🎯 **Local Opportunities** – find competitions, summer programs, internships  
- 🧑‍💻 **Study Sessions** – join/create group video call rooms  
- 🤖 **Chatbot Assistant** – AI Q&A for subjects, exams, assignments  
- 📅 **Assignment Tracker** – manage homework, tasks, deadlines  

---

## 🚀 Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| 🧠 AI Study Planner     | Generates subject-specific, exam-aware study plans using Gemini API         |
| 📚 Tutoring Access      | Explore tutors school-based, peer-to-peer, and online                       |
| 🎯 Local Opportunities  | View competitions, volunteering, and internship programs                   |
| 🧑‍💻 Study Sessions      | Host or join live WebRTC video call study rooms                            |
| 🤖 Chatbot Assistant    | Ask natural-language questions and get AI-generated academic support       |
| 📅 Assignment Tracker   | Track and categorize your tasks and deadlines                              |
| 🌐 React Frontend       | Responsive UI using React + TailwindCSS, modular component structure       |
| 🔙 Django Backend       | Secure RESTful API implementation powered by Django + DRF                  |

---

## 🛠️ Tech Stack

- **Frontend:** React, Axios, TailwindCSS, WebRTC (for video calls)  
- **Backend:** Django, Django REST Framework, CORS, SQLite  
- **AI Integration:** Google Gemini API via `REACT_APP_GEMINI_API_KEY`  
- **Video Calls:** PeerJS/WebRTC (optional)  
- **Storage:** Supabase or PostgreSQL (future upgrades)  

---

## 🧩 Project Structure

```
eduspark/
├── backend/             # Django application
│   ├── api/             # DRF views, serializers, URLs
│   └── backend/         # Django settings and configuration
├── frontend/            # React application
│   └── src/
│       ├── components/  # Feature-specific React components
│       └── App.js
├── .env                 # Environment variables (not committed)
├── README.md
└── .gitignore
```

---

## 🔐 Environment Variables

### Frontend (`/frontend/.env`)

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

> React requires env variables to start with `REACT_APP_` to expose them to the app.

---

### Backend (`/backend/.env`) (optional)

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Important:** Do NOT commit `.env` files. Add `.env` to `.gitignore`.

---

## 🧑‍💻 Local Setup (Under 2 Minutes)

### 1. Clone the repository

```bash
git clone https://github.com/COOLCODERVG/eduspark.git
cd eduspark
```

---

### 2. Backend — Django

```bash
cd backend
python -m venv env
source env/bin/activate      # Windows: env\Scripts\activate
pip install -r requirements.txt
```

- Create `.env` file as described above
- Apply migrations and run server:

```bash
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://localhost:8000/api/`

---

### 3. Frontend — React

Open a new terminal window:

```bash
cd frontend
npm install
```

- Create `.env` file inside `frontend`
- Start React dev server:

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🧪 Testing the Platform

| What to Test           | How to Test                                                                 |
|------------------------|------------------------------------------------------------------------------|
| 📅 Study Planner       | Input subject & exam date → click **Generate** → see Gemini-powered plan     |
| 💬 AI Chatbot          | Ask “Explain photosynthesis” or “Summarize chapter 3 in chemistry”           |
| 🧑‍🏫 Tutoring           | Navigate to **Tutoring** → browse available tutor listings                   |
| 🎯 Opportunities        | Browse curated competitions/programs under **Opportunities**                |
| 📞 Study Calls         | Join/create a room → engage in WebRTC/PeerJS video call                      |
| ✅ Task Tracker         | Create, update, delete assignments and deadlines                            |

---

## 🌍 API Endpoints (Django DRF)

| Endpoint               | Method   | Description                             |
|------------------------|----------|-----------------------------------------|
| `/api/tasks/`          | GET/POST | View or create assignments/tasks      |
| `/api/tutors/`         | GET      | List all tutors                       |
| `/api/opportunities/`  | GET      | List all opportunities/programs       |
| `/api/study-plan/`     | POST     | Generate AI-driven study plan         |
| `/api/chatbot/`        | POST     | Ask AI academic questions             |

---

## 🧼 Deployment Tips (Optional)

- **Frontend**: Deploy on [Vercel](https://vercel.com), [Netlify](https://netlify.com), or GitHub Pages  
- **Backend**: Deploy on [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com)  
- Set environment variables in your hosting dashboard  
- Set `DEBUG=False` and configure `ALLOWED_HOSTS` in Django settings  

---

## 📦 Example `.gitignore`

```gitignore
.env
*.pyc
__pycache__/
env/
frontend/node_modules/
frontend/.env
```

---

## 🔧 Future Improvements

- Firebase/Google authentication  
- Group invites and scheduling for study sessions  
- AI-powered quiz and flashcard generators  
- Admin dashboard for tutors and opportunity management  
- AI-aided notetaking and summarization  

---

## 🙋 FAQ

**Q: How do I get a Gemini API key?**  
A: Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) to create your key.

---

**Q: Why isn’t my React `.env` variable working?**  
A: Restart the dev server after editing `.env`, and make sure variables start with `REACT_APP_`.

---

**Q: Can I host this app for free?**  
A: Yes! Use Vercel for frontend and Render, Railway, or Heroku for backend.

---

## 🧑‍🎓 Built by Students, for Students

Created by **Varshith Gude (COOLCODERVG)**  
Passionate about democratizing smart education through open-source AI tools.  
📧 [varshithgude.cs@gmail.com](mailto:varshithgude.cs@gmail.com)
