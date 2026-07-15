# Full Stack Portfolio Website

A modern, production-ready portfolio website with React frontend and FastAPI backend.

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- Axios for API calls
- Intersection Observer API

### Backend
- FastAPI (Python 3.9+)
- SQLModel ORM
- PostgreSQL
- Docker Compose

## Project Structure
portfolio/
├── frontend/ # React frontend
├── backend/ # FastAPI backend
└── README.md


## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Start PostgreSQL with Docker Compose

```bash
cd backend
docker-compose up -d


2. Backend Setup

bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
Backend will run at: http://localhost:8000
API Docs: http://localhost:8000/docs

3. Frontend Setup
bash
cd frontend
npm install
npm run dev
Frontend will run at: http://localhost:5173

API Endpoints
Contacts
POST /api/v1/contacts/ - Submit contact form

GET /api/v1/contacts/ - Get all contacts

GET /api/v1/contacts/{id} - Get specific contact

PATCH /api/v1/contacts/{id}/read - Mark as read

Projects
POST /api/v1/projects/ - Create project

GET /api/v1/projects/ - Get all projects

GET /api/v1/projects/featured - Get featured projects

GET /api/v1/projects/{id} - Get specific project

PUT /api/v1/projects/{id} - Update project

DELETE /api/v1/projects/{id} - Delete project

Environment Variables

Backend (.env)
text
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/portfolio_db
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
Frontend (.env)
text
VITE_API_URL=http://localhost:8000/api/v1
Running in Production
Backend
bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
Frontend
bash
npm run build
npm run preview
License
MIT

text

---

That's the complete setup! You now have:

1. **PostgreSQL** running via Docker Compose
2. **FastAPI backend** with SQLModel ORM
3. **React frontend** with Axios integration
4. **Full CRUD operations** for contacts and projects
5. **CORS configured** for frontend communication
6. **Type validation** using Pydantic schemas

To get started:

1. Start PostgreSQL: `cd backend && docker-compose up -d`
2. Start backend: `uvicorn app.main:app --reload`
3. Start frontend: `cd frontend && npm run dev`

The contact form and projects section will now connect to the database!
