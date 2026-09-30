# Portfolio Website

A modern, full-stack portfolio website built with React (Vite), FastAPI, PostgreSQL, and Tailwind CSS. Features an admin dashboard for managing projects and contact messages.

## 🚀 Tech Stack

### Frontend
- **React 19** with **Vite** - Lightning fast development and builds
- **Tailwind CSS 4** - Utility-first styling with modern features
- **React Router 7** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Oxlint** - Fast JavaScript/TypeScript linter

### Backend
- **FastAPI** - Modern, fast Python web framework
- **SQLModel** - SQL databases in Python, designed for simplicity and type safety
- **PostgreSQL** - Production-ready relational database
- **Pydantic** - Data validation using Python type hints
- **python-jose** - JWT authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image upload and optimization
- **Gunicorn + Uvicorn** - Production ASGI server

### Infrastructure
- **Docker & Docker Compose** - Containerized development and deployment
- **Nginx** - Reverse proxy for frontend
- **GitHub Actions** - CI/CD pipeline
- **Vercel/Netlify/Cloudflare Pages** - Frontend hosting
- **Render/Railway/Fly.io** - Backend hosting
- **Neon/Supabase** - Managed PostgreSQL

## ✨ Features

- **Responsive Design** - Mobile-first, works on all devices
- **Dark Theme** - Beautiful gradient-based dark UI
- **Smooth Animations** - Scroll-triggered animations, typing effect, floating particles
- **Admin Dashboard** - Secure JWT-authenticated admin panel
  - Manage projects (CRUD with image uploads to Cloudinary)
  - View and reply to contact messages
  - Mark messages as read/delete
- **Contact Form** - Server-validated, rate-limited contact submissions
- **Project Showcase** - Featured projects, tags, live demo & GitHub links
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Accessibility** - Semantic HTML, ARIA labels, focus management
- **Error Boundaries** - Graceful error handling with recovery options
- **Loading Skeletons** - Perceived performance improvements
- **Rate Limiting** - Login attempt throttling

## 📁 Project Structure

```
Portfolio Website/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI pipeline
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/         # API route handlers
│   │   │   └── router.py          # API router aggregation
│   │   ├── core/
│   │   │   ├── config.py          # Configuration management
│   │   │   ├── security.py        # Auth, passwords, rate limiting
│   │   │   └── security_hash.py   # Password hash generator
│   │   ├── crud.py                # Database operations
│   │   ├── database.py            # Database connection
│   │   ├── main.py                # FastAPI app factory
│   │   ├── models.py              # SQLModel models
│   │   └── schemas.py             # Pydantic schemas
│   ├── Dockerfile                 # Production backend image
│   ├── .dockerignore
│   ├── .env.example               # Environment template
│   ├── requirements.txt
│   └── runtime.txt                # Python version for PaaS
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance + API functions
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx  # React error boundary
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx # Auth guard
│   │   │   └── Skeleton.jsx       # Loading skeletons
│   │   ├── config/
│   │   │   └── portfolio.js       # Portfolio configuration
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── sections/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Projects.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile                 # Production frontend image
│   ├── Dockerfile.dev             # Development frontend image
│   ├── nginx.conf                 # Nginx config for SPA
│   ├── .dockerignore
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .oxlintrc.json
├── docker-compose.yml             # Full stack local development
├── .gitignore
└── README.md
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+ (or use Docker)
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repo
git clone https://github.com/rishisf12/Portfolio-Website.git
cd Portfolio-Website

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit backend/.env with your values (required: SECRET_KEY, ADMIN_PASSWORD_HASH, etc.)
# Generate password hash: cd backend && python -m app.core.security_hash "your-password"

# Start all services
docker-compose up -d

# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# Adminer (DB UI): http://localhost:8080
```

### Option 2: Local Development

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your values

# Run database (or use Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres123 postgres:15)
# Then run migrations (tables auto-create on startup)

# Start server
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local if needed

# Start dev server
npm run dev
# Runs on http://localhost:5173
```

## 🔐 Admin Setup

1. **Generate a secure password hash:**
   ```bash
   cd backend
   python -m app.core.security_hash "your-secure-password"
   # Copy the output (starts with $2b$)
   ```

2. **Set in backend/.env:**
   ```env
   ADMIN_PASSWORD_HASH=$2b$12$your-generated-hash
   ADMIN_NAME=Your Name
   SECRET_KEY=your-32-byte-hex-key  # Generate: openssl rand -hex 32
   ```

3. **Access admin panel:**
   - Navigate to `/admin/login`
   - Login with `ADMIN_USERNAME` (default: `admin`) and your password

## 🌐 Deployment

### Frontend (Vercel/Netlify/Cloudflare Pages)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url/api/v1`
5. Deploy

### Backend (Render/Railway/Fly.io)
1. Connect your GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT app.main:app`
4. Add environment variables from `backend/.env.example`
5. Set `ENVIRONMENT=production`
6. Deploy

### Database (Neon/Supabase)
1. Create a free PostgreSQL database
2. Copy connection string
3. Set as `DATABASE_URL` in backend environment

### CORS Configuration
In production, set `CORS_ORIGINS` to your frontend URL(s):
```env
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com
```

## 📝 Environment Variables

### Backend (backend/.env)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SECRET_KEY` | Yes | JWT signing key (32+ chars) |
| `ADMIN_PASSWORD_HASH` | Yes* | Bcrypt hash of admin password |
| `ADMIN_USERNAME` | No | Admin username (default: admin) |
| `ADMIN_NAME` | No | Name for email signatures |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins |
| `SMTP_HOST` | No | SMTP server for replies |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASSWORD` | No | SMTP password/App Password |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |
| `ENVIRONMENT` | No | `development` or `production` |

*Required in production; fallback to `ADMIN_PASSWORD` in development only.

### Frontend (frontend/.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL |

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest -v

# Frontend lint
cd frontend
npm run lint

# Frontend build
npm run build
```

## 🔒 Security Features

- **JWT Authentication** with HS256 signing
- **Bcrypt Password Hashing** (passlib replaced with native bcrypt)
- **Login Rate Limiting** (5 attempts per 15 min per IP)
- **Input Validation** (Pydantic schemas with length limits)
- **CORS Configuration** (environment-based)
- **Secure Headers** (via Nginx)
- **SQL Injection Prevention** (SQLModel/SQLAlchemy ORM)
- **XSS Protection** (React auto-escaping + CSP headers)

## 🎨 Customization

### Colors & Theme
Edit Tailwind config in `frontend/vite.config.js` (using Tailwind CSS 4 with CSS variables)

### Portfolio Content
Update `frontend/src/config/portfolio.js`:
```js
export const PORTFOLIO_CONFIG = {
  name: 'Your Name',
  title: 'Your Title',
  email: 'your@email.com',
  social: { github: '...', linkedin: '...', ... }
};
```

### Sections
Modify components in `frontend/src/sections/`:
- `Home.jsx` - Hero section
- `About.jsx` - About me + skills
- `Projects.jsx` - Project gallery
- `Contact.jsx` - Contact form + links

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

If you have questions or need help setting up:
- Open an issue on GitHub
- Check the [deployment guide](#-deployment)
- Review the [environment variables](#-environment-variables)