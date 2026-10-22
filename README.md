# Portfolio Website

A modern, full-stack portfolio website built with React (Vite), FastAPI, PostgreSQL, and Tailwind CSS. Features an admin dashboard for managing projects, education, achievements, and skills.

## 🚀 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Lucide React  
**Backend:** FastAPI, SQLModel, PostgreSQL, Alembic, JWT, bcrypt  
**Deployment:** Docker Compose, Vercel (frontend), Render/Railway (backend)

## ✨ Features

- **Play Store style project cards** with multi-image carousel
- **Two dedicated sections:** Technical and Mechanical
- **Education & Achievements** sections
- **Admin dashboard** with JWT token login (username: `rishisf12`)
- **Full CRUD:** Add, edit, update, remove projects, skills, education, achievements
- **Image uploads** for projects and achievement certificates
- **GitHub project import** from your repositories
- **Responsive design** - mobile-first, works on all devices
- **Dark theme** aesthetic

## 📁 Project Structure

```
Portfolio Website/
├── backend/
│   ├── app/
│   │   ├── core/           # config, database, security
│   │   ├── models.py       # SQLModel tables
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── main.py         # FastAPI app + all routes
│   │   └── __init__.py
│   ├── alembic/            # Database migrations
│   ├── uploads/            # Uploaded images
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # UI, layout, sections, projects, admin
│   │   ├── pages/          # Home, ProjectDetail, AdminDashboard
│   │   ├── hooks/          # useAuth
│   │   ├── lib/            # API client
│   │   └── styles/         # Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
├── vercel.json
├── .gitignore
└── README.md
```

## 🛠️ Quick Start

### Option 1: Docker Compose

```bash
git clone https://github.com/rishisf12/Portfolio-Website.git
cd Portfolio-Website

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit backend/.env with your SECRET_KEY and ADMIN_PASSWORD

docker-compose up -d

# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# Admin: http://localhost:5173/admin/login (username: rishisf12)
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev  # http://localhost:5173
```

## 🔐 Admin Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Set `ADMIN_USERNAME=rishisf12` and your `ADMIN_PASSWORD`
3. Generate a secure `SECRET_KEY`: `openssl rand -hex 32`
4. Access admin panel at `/admin/login` with username `rishisf12`

## 🌐 Deployment

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add `VITE_API_URL` environment variable

**Backend (Render/Railway):**
1. Connect GitHub repo
2. Build: `pip install -r requirements.txt`
3. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from `.env.example`
5. Run `alembic upgrade head` for database migrations

## 📝 API Endpoints

**Public:**
- `GET /public/settings` - Site settings
- `GET /public/categories` - Technical / Mechanical
- `GET /public/projects` - List published projects
- `GET /public/projects/{slug}` - Project detail
- `GET /public/skills` - Skills list
- `GET /public/education` - Education history
- `GET /public/achievements` - Achievements list

**Admin (JWT required):**
- `POST /auth/login` - Get token (username: rishisf12)
- `POST /admin/projects` - Create project
- `PATCH /admin/projects/{id}` - Update project
- `DELETE /admin/projects/{id}` - Delete project
- `POST /admin/projects/{id}/images` - Upload project image
- `POST /admin/skills` - Add skill
- `POST /admin/education` - Add education
- `POST /admin/achievements` - Add achievement
- `PATCH /admin/settings/{key}` - Update site setting

## 📄 License

MIT License