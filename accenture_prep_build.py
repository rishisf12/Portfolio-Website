#!/usr/bin/env python3
"""Build personalized Accenture OA + Interview PDF for Rishikesh Saroj"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, ListFlowable, ListItem, KeepTogether, HRFlowable)
from reportlab.lib import colors
import html

W, H = A4
OUT = r"F:\Portfolio Website\Accenture_OA_Interview_Prep_Rishikesh.pdf"

ACC = HexColor("#A100FF")  # Accenture purple
DARK = HexColor("#1A1A2E")
GRAY = HexColor("#555555")
LIGHT_BG = HexColor("#F3EFFC")
CODE_BG = HexColor("#1E1E2E")
GREEN = HexColor("#0E7C3E")

styles = getSampleStyleSheet()
sTitle = ParagraphStyle('Title2', parent=styles['Title'], fontSize=26, leading=30, textColor=ACC, alignment=TA_CENTER, spaceAfter=6)
sSub = ParagraphStyle('Sub', parent=styles['Normal'], fontSize=12, leading=16, textColor=DARK, alignment=TA_CENTER, spaceAfter=12)
sH1 = ParagraphStyle('H1', parent=styles['Heading1'], fontSize=16, leading=20, textColor=ACC, spaceBefore=14, spaceAfter=8, keepWithNext=True, borderPadding=(0,0,4,0))
sH2 = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=12.5, leading=16, textColor=DARK, spaceBefore=10, spaceAfter=6, keepWithNext=True)
sH3 = ParagraphStyle('H3', parent=styles['Heading3'], fontSize=10.5, leading=14, textColor=HexColor("#333366"), spaceBefore=8, spaceAfter=4)
sBody = ParagraphStyle('Body', parent=styles['Normal'], fontSize=9.5, leading=14, textColor=HexColor("#222222"), alignment=TA_LEFT, spaceAfter=5)
sBullet = ParagraphStyle('Bullet', parent=sBody, leftIndent=16, bulletIndent=6, spaceAfter=3)
sCode = ParagraphStyle('Code', parent=styles['Code'], fontSize=8.2, leading=11, textColor=colors.white, fontName='Courier', spaceAfter=2)
sQA = ParagraphStyle('QA', parent=sBody, leftIndent=10, borderPadding=(4,4,4,8), backColor=LIGHT_BG, spaceAfter=6)
sTable = ParagraphStyle('Table', parent=styles['Normal'], fontSize=8.5, leading=11)
sCaption = ParagraphStyle('Cap', parent=styles['Normal'], fontSize=8, leading=10, textColor=GRAY, alignment=TA_CENTER)

def P(t): return Paragraph(t, sBody)
def B(t): return Paragraph(f"<bullet>&bull;</bullet> {t}", sBullet)
def H1(t): return Paragraph(t, sH1)
def H2(t): return Paragraph(t, sH2)
def H3(t): return Paragraph(t, sH3)
def QA(q,a): return Paragraph(f"<b>Q: {html.escape(q)}</b><br/><b>A:</b> {a}", sQA)
def CODE(code):
    # render code as dark block using table
    lines = [Paragraph(html.escape(l) if l.strip() else "<br/>", sCode) for l in code.strip().split("\n")]
    t = Table([[lines]], colWidths=[170*mm])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),CODE_BG),('ROUNDEDCORNERS',[4,4,4,4]),
                           ('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),
                           ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    return t

def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(ACC)
    canvas.rect(0, H-14*mm, W, 14*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(12*mm, H-9*mm, "Accenture OA + Interview Prep  •  Rishikesh Saroj")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(W-12*mm, H-9*mm, f"Page {doc.page}")
    canvas.setFillColor(GRAY)
    canvas.setFont("Helvetica", 7)
    canvas.drawCentredString(W/2, 10*mm, "Personalized prep • Python / FastAPI / React / ML • CampusPilot • pocketF • UrTeam")
    canvas.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=14*mm, rightMargin=14*mm, topMargin=18*mm, bottomMargin=14*mm,
                        title="Accenture OA + Interview Prep - Rishikesh", author="Rishikesh Saroj")
story = []

# COVER
story += [Spacer(1,18*mm), Paragraph("ACCENTURE", ParagraphStyle('a',parent=sTitle,fontSize=18,textColor=GRAY,alignment=TA_CENTER)),
Paragraph("OA + Interview Mastery", sTitle),
Paragraph("Personalized Stepwise Guide for <b>Rishikesh Saroj</b><br/>Mechanical @ IIITDM Jabalpur • Python / FastAPI / PostgreSQL / React / ML", sSub),
HRFlowable(width="100%", thickness=2, color=ACC, spaceAfter=8),
P("This guide teaches you <b>exactly what is on your resume — to depth</b> — plus what Accenture actually tests in its Online Assessment (OA) and Technical + HR interview. Follow it day-by-day. Every section ends with <b>what to say in the interview</b>."),
Spacer(1,3*mm)]
cover_tbl_data = [
 [Paragraph("<b>Your Stack</b><br/>Python, JS, SQL<br/>Scikit-learn, OpenCV, Tesseract, HF LLMs<br/>FastAPI, SQLModel, Postgres, Alembic, Docker, pytest<br/>React, Vite, Tailwind, Recharts", sTable),
  Paragraph("<b>Your Proof</b><br/>CampusPilot (OCR+LLM, 63+ tests)<br/>pocketF (Decimal CSV, burn-rate, Docker)<br/>UrTeam (Jaccard match, 15+ APIs)<br/>SIH SkyGuard, Patent, Jagrati", sTable),
  Paragraph("<b>Accenture Tests</b><br/>OA: Aptitude + Pseudocode + CS + 2 Coding<br/>Tech Interview: Resume deep-dive + CS fund.<br/>HR: Why Accenture, strengths, relocation", sTable)]]
ct = Table(cover_tbl_data, colWidths=[55*mm,55*mm,60*mm])
ct.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),LIGHT_BG),('BOX',(0,0),(-1,-1),1,ACC),
 ('INNERGRID',(0,0),(-1,-1),0.5,colors.lightgrey),('VALIGN',(0,0),(-1,-1),'TOP'),
 ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
story += [ct, Spacer(1,4*mm),
P("<b>How to use:</b> Days 1-2 = OA + CS fundamentals. Day 3 = Backend + Frontend depth. Day 4 = ML/AI + Projects storytelling. Day 5 = Mocks + HR. Each <b>Q/A box</b> is a real interview question you must answer aloud in 60-90 seconds."),
P("<b>Golden rule for Accenture:</b> They hire <i>learnable, communicative engineers</i>. Always structure answers as: <b>What → How → Why this choice → Result/metric</b>. Quote numbers from your resume: 63+ tests, 15+ endpoints, 9 error types, 8 components, ~1500 students.")]

# 1. PATTERN
story += [H1("1. Accenture Hiring Pattern 2025-26 (What You Will Face)"), H2("1.1 Online Assessment (OA) — 90-120 min, online"),
P("<b>Section A — Cognitive & Aptitude (40-50 Q):</b> Quantitative (%, profit-loss, time-speed, series), Logical (blood relation, direction, coding-decoding, seating), Verbal (RC, synonyms, error spotting). Speed matters: ~1 min/Q."),
P("<b>Section B — Technical MCQs (30-40 Q):</b> Pseudocode output (loops, bitwise, recursion), OOPs, DBMS/SQL, OS, CN basics, Cloud/SDLC/Agile. Plus 2-5 questions on Python/Java."),
P("<b>Section C — Coding (2 problems, 45-60 min):</b> Typically 1 Easy (string/array/count) + 1 Medium (hashmap/two-pointer/simulation). Languages allowed: C/C++/Java/Python. Evaluation is on test cases + edge cases."),
P("<b>Section D — Communication (sometimes):</b> Listening, sentence repeat, JAM (speak 1 min). Speak slowly, clearly."),
H2("1.2 Interview (1-2 rounds, 20-40 min)"),
P("<b>Technical:</b> 70% resume + projects, 20% CS fundamentals (OOPs, SQL joins, OS, API), 10% live code (reverse string, SQL query, API design). <b>HR:</b> Introduce yourself, why Accenture, strengths/weakness, relocation/shifts, bond/service agreement questions.")]
tbl = [[Paragraph("<b>Round</b>",sTable),Paragraph("<b>They ask</b>",sTable),Paragraph("<b>You prepare (this guide)</b>",sTable)],
[Paragraph("OA Coding",sTable),Paragraph("Arrays, strings, dict, sorting",sTable),Paragraph("Sec 15 playbook — 15 patterns",sTable)],
[Paragraph("Tech Interview",sTable),Paragraph("Explain CampusPilot OCR+LLM; Decimal vs float; Jaccard; FastAPI vs Flask; pytest/Docker",sTable),Paragraph("Sec 4-13 project Q&A",sTable)],
[Paragraph("HR",sTable),Paragraph("Why Accenture? Team conflict? Mechanical → IT?",sTable),Paragraph("Sec 17 STAR stories",sTable)]]
t=Table(tbl,colWidths=[32*mm,60*mm,78*mm]); t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),ACC),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),0.5,colors.grey),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
story += [t]

# 2. PLAN
story += [H1("2. Your 5-Day Stepwise Plan (Few Days Left)"),
H2("Follow exactly — 6-8 hrs/day"),]
plan = [
 ["<b>Day 1 — OA Aptitude + Pseudocode + Python</b>","Aptitude formulas (Sec 16) 2h → Pseudocode drills 1.5h → Python depth (Sec 4) 2h → 2 easy codes (Sec 15) 1.5h. <i>Outcome: clear OA cut-off.</i>"],
 ["<b>Day 2 — CS Fundamentals + SQL + Coding</b>","OOPs/OS/CN/DBMS (Sec 14) 3h → SQL joins + Postgres (Sec 5) 2h → 2 medium codes + dry-run 2h. <i>Outcome: answer any MCQ.</i>"],
 ["<b>Day 3 — Backend + Frontend Depth</b>","FastAPI/REST/SQLModel/Alembic (Sec 6) 2.5h → React/Vite/Tailwind/Recharts (Sec 7) 2h → pytest/Docker/Git (Sec 9) 1.5h → speak UrTeam story aloud 1h."],
 ["<b>Day 4 — ML/AI + Your 3 Projects</b>","ML stack (Sec 8) 3h → CampusPilot + pocketF + SIH Q&A (Sec 10-13) 3h → record yourself 60-sec per project. <i>Outcome: no resume question surprises you.</i>"],
 ["<b>Day 5 — Mocks + HR + Revision</b>","Full OA mock 2h → Tech mock with friend 1.5h → HR STAR (Sec 17) 1.5h → 1-page revision sheet + early sleep."],
]
pt=[[Paragraph(a,sTable),Paragraph(b,sTable)] for a,b in plan]
ptt=Table([[Paragraph("<b>Day</b>",sTable),Paragraph("<b>Tasks + Outcome</b>",sTable)]]+pt, colWidths=[52*mm,118*mm])
ptt.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),DARK),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),0.5,colors.grey),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,HexColor("#F9F7FF")]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
story += [ptt, P("<b>Daily habit:</b> 30 min loud speaking. Interview = verbal exam. If you can't say it, you don't know it.")]

# 3 RESUME MAP
story += [H1("3. Resume Master Map — Every Keyword, What They'll Ask"), P("If a word is on your resume, you must defend it. Table below = your cheat sheet. Learn the <b>One-line defense</b> by heart."),
H2("3.1 Languages & Core")]
story += [QA("Why Python as primary, not Java?","Python lets me ship ML + API fast with one language — Scikit-learn/Pandas for logic, FastAPI for serving. JavaScript only for UI. For Accenture enterprise work I can pick up Java quickly because OOP concepts transfer; Python already taught me OOP, exception handling, and virtualenv discipline."),
QA("JavaScript — how deep?","ES6: let/const, arrow functions, promises/async-await, map/filter, destructuring. In React I use useState/useEffect, fetch/Axios to call FastAPI, conditional rendering. I know JS is single-threaded with event loop — so I never block UI with heavy compute."),
QA("SQL — what level?","Joins (INNER/LEFT), GROUP BY + HAVING, subqueries, constraints (PK/FK/UNIQUE/NOT NULL), indexes, transactions (ACID). In Postgres I designed tables via SQLModel, used Alembic migrations, wrote analytics queries with Pandas read_sql for burn-rate reports.")]

story += [H2("3.2 ML/AI keywords"), QA("Scikit-learn — what did you actually use?","Preprocessing (train_test_split, StandardScaler), models for tabular tasks, metrics (accuracy/precision/recall/F1). I know it is for classical ML on structured data — not deep learning. Deep learning would be PyTorch/TensorFlow."),
QA("OpenCV — what for?","Image preprocessing before OCR: grayscale, thresholding, denoising, contour detection to crop seating-chart tables. I know cv2.imread returns NumPy array (H×W×C), and why you blur before threshold."),
QA("Tesseract OCR — how does it work? Limitations?","OCR engine that segments characters and classifies via LSTM. Pipeline: preprocess with OpenCV → pytesseract.image_to_data → parse boxes → clean text → JSON. Fails on skewed/low-res scans and handwriting; I mitigated with DPI scaling and regex validation."),
QA("Hugging Face + Phi-3 / Mistral / Gemma — what did you do?","Used HF transformers / inference API to convert noisy OCR text into structured JSON (roll → room → timetable). Chose small open models (Phi-3-mini, Mistral-7B, Gemma) for cost/latency. Used prompt templates + JSON-mode + validation, not fine-tuning. Know tokens, context window, temperature."),
QA("Pandas / NumPy / Matplotlib — depth?","Pandas: read_csv, DataFrames, groupby, resampling for burn-rate; NumPy: vectorized ops, no Python loops; Matplotlib: auto-generated PNG charts for pocketF reports. Know the pitfall: float for money is wrong — hence Decimal."),
]

story += [H2("3.3 Backend keywords"), QA("FastAPI — why not Flask/Django?","FastAPI gives async, auto OpenAPI docs (/docs), and Pydantic validation out of box — perfect for ML APIs. Flask is minimal sync; Django is batteries-included monolith. I used layered architecture: routes → services → models, with dependency injection for DB sessions."),
QA("REST APIs — what makes a good API?","Resource-based URLs (/students/{id}), correct verbs (GET/POST/PUT/DELETE), status codes (200/201/400/404/409/422), stateless, pagination/filtering (?tech=), versioning. I built 15+ endpoints with 409 duplicate detection and domain-validated emails."),
QA("SQLModel + PostgreSQL + Alembic?","SQLModel = SQLAlchemy + Pydantic in one model class. Postgres = production relational DB with ACID, JSONB, concurrent writes. SQLite = local dev only. Alembic = migration tool (alembic revision --autogenerate + upgrade head) so schema changes don't wipe data."),
QA("Docker + Docker Compose?","Docker packages app + deps into image via Dockerfile; Compose orchestrates api + postgres via docker-compose.yml (services, volumes, env). I containerized pocketF so examiner runs 'docker compose up' and gets API+DB. Know image vs container vs volume."),
QA("pytest — 63+ tests means what?","Unit + API tests with pytest + FastAPI TestClient. I test happy path + edge cases (bad CSV rows, empty timetable, duplicate email → 409). 63 tests prove layered code is testable; CI can run 'pytest -q'. Know fixture, parametrize, assert."),
]

story += [H2("3.4 Frontend keywords"), QA("React / Vite / Tailwind / Recharts?","React: component model, props/state, hooks (useState/useEffect), SPA routing. Vite: fast dev server + build (vs CRA). Tailwind: utility-first CSS (I used inline utilities only, 8 reusable components). Recharts: declarative charts (LineChart/BarChart) for attendance/budget visuals. I know how React calls FastAPI via fetch and renders JSON."),
]

# 4 PYTHON
story += [H1("4. Python Depth (Your Primary Language — Most Questions)"), H2("4.1 Must-know concepts with interview lines"),
P("<b>OOP:</b> class/object, __init__, inheritance, polymorphism (duck typing), encapsulation (_private, __name mangling), @classmethod/@staticmethod, @property. <b>Say:</b> 'I used OOP to model Student/Idea/Transaction as SQLModel classes with validation.'"),
P("<b>Data structures:</b> list vs tuple (mutable vs immutable), dict (hashmap O(1)), set (dedup + Jaccard), list comprehension, generators (yield, lazy). <b>Say:</b> 'For skill overlap I used sets — O(n) intersection vs O(n²) loops.'"),
P("<b>Functions:</b> *args/**kwargs, lambda, decorators (@app.get), closures. <b>Error handling:</b> try/except/else/finally, raise ValueError, custom exceptions for bad CSV rows."),
P("<b>Async & typing:</b> async def + await for I/O-bound FastAPI routes; type hints (int|None, list[str]) + Pydantic for validation. <b>Memory:</b> GIL means threads don't parallelize CPU work — use multiprocessing or async I/O."),
]
story += [CODE("def jaccard(a: set[str], b: set[str]) -> float:\n    if not a and not b: return 0.0\n    return len(a & b) / len(a | b)\n\n# Decimal for money — never float\nfrom decimal import Decimal\ntotal = sum((Decimal(r['amount']) for r in rows), Decimal('0'))"),
QA("List vs Tuple vs Dict vs Set — when to use?","List for ordered mutable, tuple for fixed records, dict for key lookup, set for uniqueness/intersection. Example: skills as sets for Jaccard; CSV rows as list of dicts; money totals as Decimal."),
QA("What is decorator? Give example.","Function wrapping another to add behavior. I use @app.get('/x') and @pytest.fixture. Custom: @timer to log latency of OCR step."),
QA("GIL?","Global Interpreter Lock — only one thread runs Python bytecode at once. Good for I/O with async/threads, bad for CPU loops. For CPU-heavy OCR I would use multiprocessing or offload to service."),
]

# 5 SQL
story += [H1("5. SQL + PostgreSQL + SQLModel + Alembic"), H2("5.1 Core SQL you must write live"),
CODE("-- 1. Students with duplicate emails (your 409 logic)\nSELECT email, COUNT(*) FROM student GROUP BY email HAVING COUNT(*)>1;\n-- 2. Filter ideas by tech\nSELECT * FROM idea WHERE tech ILIKE '%python%';\n-- 3. Monthly spend (pocketF)\nSELECT date_trunc('month', date) AS m, SUM(amount) FROM txn GROUP BY m ORDER BY m;\n-- 4. LEFT JOIN: students even without team\nSELECT s.name, t.name FROM student s LEFT JOIN team t ON t.id=s.team_id;"),
P("<b>Joins in one line:</b> INNER = only matches; LEFT = all left + matches; RIGHT = mirror; FULL = both; CROSS = cartesian. <b>Constraints:</b> PRIMARY KEY, FOREIGN KEY, UNIQUE (email), NOT NULL, CHECK (amount>0). <b>Index:</b> speeds WHERE/JOIN, slows writes. <b>ACID:</b> Atomicity, Consistency, Isolation, Durability — Postgres guarantees it; SQLite doesn't scale concurrent writes."),
QA("Postgres vs SQLite?","SQLite is file-based, zero-config, single-writer — great for dev/demo. Postgres is server-based, handles concurrent writes, types (UUID, JSONB), and scales. My UrTeam auto-switches via DATABASE_URL."),
QA("What is Alembic migration?","Versioned schema change. Workflow: edit SQLModel → alembic revision --autogenerate -m 'add team_id' → alembic upgrade head. Never delete DB in prod; migrate it."),
QA("SQL injection? How did you prevent?","Never f-string SQL. Use ORM-bound params / SQLModel / SQLAlchemy placeholders. Plus Pydantic validation on inputs."),
]

# 6 FASTAPI
story += [H1("6. FastAPI + REST (Your Backend Spine)"), H2("6.1 Layered architecture (say this diagram aloud)"),
P("<b>Client (React)</b> → <b>Routes</b> (validate + status codes) → <b>Services</b> (business logic: Jaccard, burn-rate) → <b>Models</b> (SQLModel tables) → <b>Postgres</b>. OCR modules isolated so Tesseract/HF can be swapped. This layering is why you could write 63+ tests — services testable without HTTP."),
CODE("from fastapi import FastAPI, HTTPException\napp = FastAPI()\n@app.get('/ideas')\ndef list_ideas(tech: str | None = None):\n    q = select(Idea)\n    if tech: q = q.where(Idea.tech.ilike(f'%{tech}%'))\n    return session.exec(q).all()\n@app.post('/students', status_code=201)\ndef create(s: StudentCreate):\n    if exists(s.email): raise HTTPException(409, 'duplicate email')\n    ..."),
QA("GET vs POST vs PUT vs PATCH vs DELETE?","GET read (idempotent), POST create, PUT full replace, PATCH partial update, DELETE remove. Idempotent = repeat safe (GET/PUT/DELETE)."),
QA("What happens when React calls your API? (End-to-end)","React fetch → DNS → TCP/TLS → HTTP GET → FastAPI route → Pydantic validation → service → SQLModel → Postgres → JSON response → React setState → re-render. Errors mapped to 400/404/409/422."),
QA("How do you handle validation & errors?","Pydantic models (EmailStr, min_length) auto-return 422; business errors raise HTTPException(409/404) with detail; CSV importer collects per-row errors instead of failing whole file — 9 error types reported."),
]

# 7 FRONTEND
story += [H1("7. Frontend: React + Vite + Tailwind + Recharts"), P("<b>React mental model:</b> UI = f(state). Component = function returning JSX. Props flow down, events flow up. useState for local data, useEffect for fetch on mount. Key={id} for lists. Conditional render {user && <Dashboard/>}."),
CODE("// fetch FastAPI from React\nuseEffect(()=>{\n  fetch(`${import.meta.env.VITE_API}/ideas?tech=python`)\n    .then(r=>{ if(!r.ok) throw new Error(r.status); return r.json(); })\n    .then(setIdeas).catch(setError);\n},[]);"),
QA("Vite vs CRA?","Vite uses native ESM + esbuild — instant start, fast HMR. CRA is webpack-based, slower. Both build to static files served by Nginx."),
QA("Tailwind — why inline utilities?","No separate CSS files; classes like flex, gap-2, rounded-xl compose in JSX. Keeps 8 components consistent without CSS cascade bugs. Tradeoff: long classNames."),
QA("Recharts?","Declarative React charts: <LineChart><Line dataKey='balance'/></LineChart>. I fed it burn-rate JSON to show balance decline + SAFE/ALERT verdict."),
]

# 8 ML
story += [H1("8. ML / AI Stack — Speak Like a Builder, Not a Theorist"), H2("8.1 Scikit-learn + Pandas + NumPy + Matplotlib"),
P("<b>Workflow:</b> load (Pandas) → clean (fillna, encode) → split (train_test_split) → scale (StandardScaler) → model (LogReg/RandomForest/IsolationForest) → metric (accuracy/F1/RMSE) → plot (Matplotlib). <b>Overfitting:</b> train high, test low → regularize / cross-validate. <b>Say:</b> 'I use sklearn for tabular problems; LLMs for unstructured text.'"),
H2("8.2 OpenCV + Tesseract (CampusPilot)"),
P("<b>Pipeline you must recite in 60s:</b> 1) PDF → images (pdf2image/poppler) 2) OpenCV: grayscale → GaussianBlur → adaptiveThreshold → findContours/deskew 3) pytesseract.image_to_data (PSM 6 for blocks) 4) regex clean roll numbers 5) HF LLM to JSON 6) validate + store. <b>PSM:</b> Page Segmentation Mode tells Tesseract layout. <b>DPI:</b> 300 DPI minimum for accuracy."),
H2("8.3 Hugging Face LLMs (Phi-3, Mistral, Gemma)"),
P("<b>What they are:</b> Open-weight transformers on HF Hub. Phi-3-mini (~3.8B, efficient), Mistral-7B (strong reasoning), Gemma (Google). <b>How you used:</b> prompt template: 'Extract JSON {roll, room, time} from: ...' + temperature 0 + JSON repair + schema validation. No fine-tuning — zero/few-shot. <b>Tokens:</b> subword units; context window = max input length; temperature 0 = deterministic."),
QA("Why OCR + LLM, not OCR alone?","OCR gives noisy text; layout varies. LLM normalizes to schema, fixes splits ('12 34' → '1234'), maps synonyms. Validation layer rejects hallucinations — every LLM output checked against regex/DB."),
QA("Isolation Forest + SHAP (SkyGuard)?","Isolation Forest isolates anomalies by random splits — anomalies need fewer splits; anomaly score = path length. For weather stations it flags sensor faults vs real extremes. SHAP explains 'why' via Shapley values — which sensor/feature pushed the decision. I proposed, not yet built — be honest."),
]

# 9 DEVOPS
story += [H1("9. Quality: pytest + Docker + Git (Accenture Loves This)"),
CODE("# pytest example you should explain\ndef test_duplicate_email_returns_409(client):\n    client.post('/students', json={'name':'A','email':'a@x.com'})\n    r = client.post('/students', json={'name':'B','email':'a@x.com'})\n    assert r.status_code == 409\n# Dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt . \nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\",\"main:app\",\"--host\",\"0.0.0.0\"]"),
QA("What do 63+ tests prove?","Layered design, edge-case thinking, regression safety. Unit tests for Jaccard/burn-rate math; API tests for CRUD + 409 + filters; importer tests for 9 CSV error types. Run with pytest -q + coverage."),
QA("Docker image vs container vs volume vs compose?","Image = blueprint (read-only). Container = running instance. Volume = persistent data (postgres-data). Compose = YAML orchestrating api+db with networks/env. Commands: docker build -t api . / docker compose up --build."),
QA("Git workflow?","main protected; feature branches; small commits; pull + PR review; .gitignore for .env. Commands: clone, branch, add/commit/push, pull --rebase, merge."),
]

# 10-12 PROJECTS
story += [H1("10. Project 1 — CampusPilot (Your Flagship, Expect 5-8 min)"),
P("<b>One-minute pitch (memorize):</b> 'CampusPilot is an academic platform for ~1500 students. Problem: exam seating and timetables are PDFs — students can't search roll numbers. I built an OCR+LLM pipeline with Tesseract and Phi-3/Mistral that converts seating PDFs to JSON, plus attendance tracking with Safe/Warning/Critical flags and a can-miss calculator, served via FastAPI + React with 63+ tests in a layered architecture. Next: React Native for mobile.'"),
H2("Architecture to draw on paper"), P("PDF → pdf2image → OpenCV preprocess → Tesseract → text clean → HF LLM → JSON validate → FastAPI (routes/services/models/ocr) → Postgres → React (lookup, timetable PDF via ReportLab, attendance charts). ReportLab generates personalized PDF timetables server-side."),
]
for q,a in [
("How do you compute Safe/Warning/Critical + can-miss?","attendance% = present/total. Thresholds e.g. >=75 Safe, 65-75 Warning, <65 Critical. Can-miss = floor((present - 0.75*total)/0.75) — max bunks while staying >=75%. Live current/next class by parsing timetable CSV/PDF + system time."),
("What was hardest bug?","Skewed scans + merged cells broke Tesseract boxes. Fixed with deskew + DPI upscale + PSM tuning + regex post-pass; added per-page confidence log so low-confidence pages flagged for manual check instead of silent error."),
("Why layered architecture?","Routes thin, services pure (testable), models typed. Lets me mock DB/OCR in tests — reason for 63 tests. New OCR engine = swap one module."),
("ReportLab?","Server-side PDF lib. I build timetable PDFs with Platypus (Paragraph/Table) — same lib used for this guide. Handles fonts, page templates."),
]: story += [QA(q,a)]

story += [H1("11. Project 2 — pocketF (Solo — Shows Ownership)"),
P("<b>Pitch:</b> 'pocketF is a student budgeting app. Users upload bank CSVs; I import with Decimal-exact math, report bad rows across 9 error types without aborting, compute burn-rate and money-runs-out date with SAFE/ALERT verdict, auto-generate Matplotlib charts, all containerized with Docker Compose and tested with pytest.'"),
CODE("from decimal import Decimal, InvalidOperation\nerrors=[]\nfor i,row in enumerate(rows,1):\n  try:\n    amt = Decimal(row['amount'].strip())\n  except (InvalidOperation, AttributeError):\n    errors.append({'row':i,'type':'BAD_AMOUNT'}); continue"),
]
for q,a in [
("Why Decimal, not float?","Float is binary — 0.1+0.2 != 0.3. Money needs base-10 exact. Decimal('0.1')+Decimal('0.2')==Decimal('0.3'). I sum with Decimal starting at Decimal('0') and quantize to 2 places."),
("What are the 9 CSV error types? (Be ready to list ~6)","Missing column, empty amount, bad decimal, bad date, future date, duplicate row, negative where not allowed, unknown category, encoding/BOM issue. Each reported as {row, type, message} so user fixes only bad rows."),
("Burn-rate + runs-out forecast?","burn = avg daily spend over last N days (Pandas). remaining = balance; days_left = remaining/burn; end_date = today + days_left. If end_date > month_end → SAFE else ALERT. Edge cases: zero spend → Infinity guard; no data → 'insufficient data'. Tested with pytest."),
("Docker Compose setup?","Two services: api (FastAPI, port 8000) + db (postgres:16, volume pgdata). Env via .env (DATABASE_URL). One command: docker compose up --build. Shows you understand deployment, not just localhost."),
]: story += [QA(q,a)]

story += [H1("12. Project 3 — UrTeam (Teamwork + Full-Stack)"),
P("<b>Pitch:</b> 'UrTeam matches students into hackathon teams by skill overlap using Jaccard similarity — no ML needed. I built 15+ REST endpoints with 409 duplicate handling and ?tech= filtering, dual SQLite/Postgres setup, owner-verified chat approvals, and 8 reusable React+Tailwind components.'"),
CODE("skills_a={'python','react'}; skills_b={'python','ml'}\nj = len(skills_a & skills_b)/len(skills_a | skills_b)  # 0.33"),
]
for q,a in [
("Why Jaccard, not ML?","Skills are sets, not vectors. Jaccard = |A∩B|/|A∪B| is interpretable, O(n), zero deps. ML (embeddings) overkill for small data and harder to explain in interview. I can upgrade to TF-IDF/cosine later."),
("Explain 409 duplicate + ?tech= filter?","On POST /students, check email exists → 409 Conflict (not 400) so client knows it's duplicate, not bad syntax. GET /ideas?tech=python filters via ILIKE; keeps API RESTful instead of /getPythonIdeas."),
("Dual DB + auto table creation?","SQLModel.metadata.create_all for dev velocity; DATABASE_URL switches SQLite (local) ↔ Postgres (prod). For prod you'd use Alembic migrations instead of create_all to avoid data loss."),
("Chat approval + owner-verified access?","Membership request → pending → owner approves. Every mutating route checks requester == owner_id else 403 Forbidden. Prevents anyone joining/reading private chats. Auth simplified for demo; prod needs JWT."),
]: story += [QA(q,a)]

story += [H1("13. SIH + Patent + Jagrati (Differentiators)"),
QA("SkyGuard AI — explain in 90s (SIH26073)?","Problem: Automatic Weather Stations produce faults that look like extreme weather. Proposed Isolation Forest to score anomalies on temp/humidity/wind streams, plus SHAP to explain which sensor caused flag, so IMD staff trust alerts. Team of 6; my role: ML pipeline + API sketch. Status: proposed/prototype — be honest you haven't deployed at scale."),
QA("Patent 202621096766 A — what to say as mechanical student?","Co-inventor of adjustable hybrid welding device with integrated safety. Explain problem (fixed jigs don't fit varied jobs + safety gaps), your contribution (adjustable mechanism / safety interlock — keep to your actual part), status: application published, not granted. Shows cross-disciplinary engineering + documentation rigor. Don't overclaim — say 'application no. ... A'."),
QA("Jagrati volunteering?","Teach village kids evenings + plan activities. Accenture values community. Frame with STAR: led 5 kids in math, improved attendance by X, learned patience/communication — same skills for client teams."),
QA("Mechanical → Software? (They WILL ask)","Mechanical taught me systems thinking, CAD tolerances, thermodynamics problem-solving. I applied same rigor to software: layered design, testing, Docker reproducibility. Patent + SIH show I bridge both. I want Accenture because enterprise scale lets me apply engineering + AI together."),
]

story += [H1("14. Core CS for Accenture MCQs + Interview"),
H2("OOPs (4 pillars, 1 line each)"), P("Encapsulation (bundle data+methods, private), Inheritance (reuse via parent), Polymorphism (same interface, different behavior), Abstraction (hide complexity via API). Plus overloading (same name diff args — Python via defaults) vs overriding (child redefines)."),
H2("OS essentials"), P("Process vs thread (isolated vs shared memory); concurrency vs parallelism; deadlock (4 Coffman conditions); paging/virtual memory; mutex/semaphore; `ps/top/kill`, zombie vs orphan. GIL ties back to Python threads."),
H2("CN essentials"), P("OSI 7 vs TCP/IP 4; TCP (reliable, handshake) vs UDP (fast); HTTP methods/status (200/201/400/401/403/404/409/422/500); DNS → IP; 3-way handshake SYN/SYN-ACK/ACK; JWT = header.payload.signature for auth."),
H2("SDLC + Agile + Cloud (Accenture favorites)"), P("SDLC: Req→Design→Build→Test→Deploy→Maintain. Agile: sprints, standup, backlog, retro — vs Waterfall. Cloud: IaaS/PaaS/SaaS; Docker = container, K8s = orchestration; CI/CD = test+deploy on push. Say: 'I practice CI mindset with pytest + Docker.'"),
]

story += [H1("15. OA Coding Playbook — 15 Patterns, Python First"),
P("Accenture coding = input parsing + edge cases + O(n) thinking. Master these 5 first: frequency map, two pointers, sliding window, sorting+greedy, hashset. Always: read n, strip, handle empty, print exactly as asked."),
CODE("# template that never fails\nimport sys\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data: return\n    n = int(data[0]); arr = list(map(int, data[1:1+n]))\n    print(sum(arr))\nif __name__=='__main__': solve()"),
CODE("# 1 frequency  2 two-sum  3 Jaccard (your project!)\nfrom collections import Counter\ndef freq(s): return Counter(s)\ndef two_sum(a,t):\n    seen={}\n    for i,x in enumerate(a):\n        if t-x in seen: return (seen[t-x],i)\n        seen[x]=i\ndef jaccard(a,b): return len(set(a)&set(b))/len(set(a)|set(b)) if (a or b) else 0.0"),
CODE("# 4 reverse words  5 valid parentheses  6 burn-rate forecast\ndef rev_words(s): return ' '.join(s.split()[::-1])\ndef valid(p):\n    st=[]; m={')':'(',']':'[','}':'{'}\n    for c in p:\n        if c in '([{': st.append(c)\n        elif not st or st.pop()!=m[c]: return False\n    return not st"),
P("<b>Practice list (do 2/day):</b> reverse string, palindrome, anagram, second largest, missing number, move zeros, leaders in array, balanced parens, first non-repeating char, Jaccard/top-k match, CSV bad-row counter, monthly aggregate, merge intervals, stock buy-sell once, queue via two stacks. Time yourself 25 min each; test with empty/single/duplicate/large inputs."),
QA("How to explain code in interview?","State approach + complexity first: 'Hashmap O(n) time O(n) space because...', then walk dry-run, then edge cases. Never stay silent — think aloud."),
]

story += [H1("16. Aptitude + Pseudocode Cheat Sheet (OA Survival)"),
P("<b>Quant formulas:</b> % = (part/whole)*100; SP=CP*(1±%/100); SI=PRT/100; Speed=Dist/Time; upstream/downstream avg = 2xy/(x+y); series: check diff, ratio, squares (1,4,9,16), primes. <b>Logic:</b> draw tables for seating; Venn for sets; assume + test options backwards when stuck."),
P("<b>Pseudocode traps:</b> integer division (5/2=2 in C), modulo with negatives, pre vs post ++ (x++ returns then increments), && short-circuit, pass-by-value vs reference, recursion base case, bitwise (<< = *2, >> = /2, ^ = XOR). Always dry-run tiny input (n=2) on paper."),
CODE("// example: what prints? \n// for(i=0;i<3;i++) for(j=0;j<=i;j++) print('*')  => 1+2+3=6 stars\n# python trap: [0]*3 + list aliasing; range(5)[::-1]"),
]

story += [H1("17. HR + Behavioral — STAR Answers That Win"),
P("<b>Introduce yourself (60s, memorize):</b> 'I'm Rishikesh, Mechanical undergrad at IIITDM Jabalpur. I build ML-powered apps end-to-end — OCR+LLM timetables, budgeting forecasts, team matchmaking — with FastAPI, Postgres, React, Docker and 60+ tests. I co-invented a welding-device patent, proposed SkyGuard AI for SIH, and teach with Jagrati. I'm seeking an AI/ML or SDE internship at Accenture to learn enterprise delivery.'"),
]
for q,a in [
("Why Accenture?","Scale + learning: global clients, structured training, Agile delivery, and AI/cloud practice match my stack (Python/APIs/ML). I want mentorship + real production discipline — Docker/testing habits I started solo, I want to practice at enterprise scale. Plus values: innovation + community (Jagrati resonates)."),
("Strengths / Weakness?","Strength: end-to-end ownership — solo pocketF from CSV math to Docker. Weakness: I over-engineer; now I timebox MVP then add tests. Show growth."),
("Team conflict? (STAR)","Situation: SIH team split on model choice. Task: agree in 1 day. Action: I proposed 2-hr spike: Isolation Forest vs threshold, compared precision on sample faults. Result: team aligned on IF+SHAP, doc'd decision. Learning: data beats debate."),
("Relocation / shifts / bond?","Yes, flexible for relocation and shifts; understand Accenture delivery needs. (Only agree if true; keep passport/docs ready.)"),
("Where in 2 years?","Strong SDE/ML engineer owning microservices + ML pipelines with testing/DevOps discipline, mentoring juniors — grown through Accenture learning paths."),
]: story += [QA(q,a)]

story += [H1("18. Final Checklists"),
H2("OA day checklist"), P("ID + laptop charger + stable net; rough sheets; read Q twice; solve easy code first for confidence; handle empty input; print format exactly; reserve 5 min to re-run samples. If stuck >5 min, switch section — cut-off needs attempts."),
H2("Interview day checklist"), P("Open GitHub repos + live demos; draw architecture on paper; speak numbers (63 tests, 15 endpoints, 9 errors); admit what you didn't do (no fine-tuning, prototype SIH); ask 1 smart Q: 'How does Accenture review junior code / what testing bar for ML APIs?'"),
H2("One-page revision (night before)"), P("Python: GIL, decorator, Decimal. SQL: joins, HAVING, ACID. API: 200/201/409/422, layered arch. React: hooks, fetch. ML: OCR pipeline, temp=0 JSON, Jaccard formula, IF+SHAP one-liner. Projects: 60-sec pitch each. HR: intro + why Accenture + STAR conflict."),
P("<b>You are ready when:</b> you can whiteboard CampusPilot pipeline, write Jaccard + Decimal + join query without googling, and speak each project for 60s without 'umm'. Good luck — you built real things; now narrate them confidently."),
]

doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(f"OK -> {OUT}")
