#!/usr/bin/env python3
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib import colors
import html
W,H=A4
OUT=r"F:\Portfolio Website\Accenture_Resources_CodeBank_Rishikesh.pdf"
ACC=HexColor("#A100FF"); DARK=HexColor("#1A1A2E"); GRAY=HexColor("#555555"); LIGHT_BG=HexColor("#F3EFFC"); CODE_BG=HexColor("#1E1E2E")
styles=getSampleStyleSheet()
sTitle=ParagraphStyle('T',parent=styles['Title'],fontSize=22,leading=26,textColor=ACC,alignment=TA_CENTER,spaceAfter=4)
sSub=ParagraphStyle('S',parent=styles['Normal'],fontSize=11,leading=15,textColor=DARK,alignment=TA_CENTER,spaceAfter=10)
sH1=ParagraphStyle('H1',parent=styles['Heading1'],fontSize=14,leading=18,textColor=ACC,spaceBefore=12,spaceAfter=6,keepWithNext=True)
sH2=ParagraphStyle('H2',parent=styles['Heading2'],fontSize=11.5,leading=15,textColor=DARK,spaceBefore=9,spaceAfter=5,keepWithNext=True)
sBody=ParagraphStyle('B',parent=styles['Normal'],fontSize=9.3,leading=13.5,textColor=HexColor("#222222"),spaceAfter=4)
sBullet=ParagraphStyle('Bu',parent=sBody,leftIndent=16,bulletIndent=6,spaceAfter=2)
sCode=ParagraphStyle('C',parent=styles['Code'],fontSize=7.9,leading=10.5,textColor=colors.white,fontName='Courier')
sBox=ParagraphStyle('Box',parent=sBody,leftIndent=8,borderPadding=(5,5,5,8),backColor=LIGHT_BG,spaceAfter=6)
sTab=ParagraphStyle('Tab',parent=styles['Normal'],fontSize=8.3,leading=11)
def P(t): return Paragraph(t,sBody)
def B(t): return Paragraph(f"<bullet>&bull;</bullet> {t}",sBullet)
def H1(t): return Paragraph(t,sH1)
def H2(t): return Paragraph(t,sH2)
def QA(q,a): return Paragraph(f"<b>Q: {html.escape(q)}</b><br/><b>A:</b> {a}",sBox)
def CODE(c):
    ls=[Paragraph(html.escape(l) if l.strip() else "<br/>",sCode) for l in c.strip().split("\n")]
    t=Table([[ls]],colWidths=[170*mm])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),CODE_BG),('ROUNDEDCORNERS',[4,4,4,4]),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    return t
def LINK(url,label=None):
    l=label or url.replace("https://","")
    return f'<a href="{url}" color="blue"><u>{l}</u></a>'
def hf(c,d):
    c.saveState();c.setFillColor(ACC);c.rect(0,H-13*mm,W,13*mm,fill=1,stroke=0)
    c.setFillColor(colors.white);c.setFont("Helvetica-Bold",9);c.drawString(12*mm,H-8.5*mm,"Accenture Resources + Code Bank  |  Rishikesh Saroj")
    c.setFont("Helvetica",8);c.drawRightString(W-12*mm,H-8.5*mm,f"Page {d.page}")
    c.setFillColor(GRAY);c.setFont("Helvetica",7);c.drawCentredString(W/2,10*mm,"Links verified standard docs + focus + runnable code answers")
    c.restoreState()
doc=SimpleDocTemplate(OUT,pagesize=A4,leftMargin=13*mm,rightMargin=13*mm,topMargin=17*mm,bottomMargin=13*mm,title="Accenture Resources CodeBank",author="Rishikesh")
st=[]
st+=[Paragraph("ACCENTURE",ParagraphStyle('a',parent=sTitle,fontSize=15,textColor=GRAY,alignment=TA_CENTER)),Paragraph("Resources + Focus + Code Bank",sTitle),
Paragraph("What to study <b>MORE</b>, official links for each resume topic, and <b>copy-ready code answers</b>",sSub),
HRFlowable(width="100%",thickness=2,color=ACC,spaceAfter=6),
P("<b>Priority key:</b> <font color='#C00000'><b>CRITICAL</b></font> = asked 90% times, master code + speech. <font color='#B77900'><b>HIGH</b></font> = asked 60%, know 1 example. <b>MEDIUM</b> = know 1-line defense. Accenture OA weight: coding + pseudocode > theory. Interview weight: your 3 projects + Python + SQL + API."),
]
# Focus matrix
st+=[H1("1. Focus Matrix — Where to Spend Your Few Days")]
fm=[
["Topic","Priority","Focus MORE on (exam reality)"],
["CampusPilot OCR+LLM pitch","CRITICAL","60-sec pipeline recital + 1 bug story + ReportLab. They will spend 5 min here."],
["FastAPI + REST + status codes","CRITICAL","Layered arch, 409 vs 404 vs 422, ?tech= filter, TestClient. Live code likely."],
["Python (GIL, decorator, set/dict)","CRITICAL","Jaccard with sets, Decimal, try/except, list vs dict. OA coding is Python."],
["SQL + Postgres joins","CRITICAL","INNER/LEFT, GROUP BY/HAVING, 409 check query. They ask to write 1 query live."],
["pocketF Decimal + burn-rate","HIGH","Why float fails, 9 error types list, SAFE/ALERT formula + edge cases."],
["UrTeam Jaccard + auth","HIGH","Formula + why not ML, 403 owner check, dual DB. Shows design sense."],
["pytest + Docker + Git","HIGH","1 pytest example, image vs container, compose up. Accenture loves delivery discipline."],
["React + fetch + hooks","HIGH","useEffect fetch, props/state, Recharts. Know 1 snippet."],
["Pandas/Numpy/Matplotlib","MEDIUM","groupby, vectorization, chart gen. 1-liners enough."],
["OpenCV/Tesseract params","MEDIUM","grayscale→blur→threshold, PSM 6, 300 DPI. Don't over-deep."],
["HF LLMs temp/tokens","MEDIUM","temp 0 + JSON validation, no fine-tune. Honest scope."],
["IF + SHAP (SIH)","MEDIUM","1-line IF idea + SHAP explains. Mark as proposed."],
["Aptitude + Pseudocode","CRITICAL","Speed drills daily. OA cutoff decides interview call."],
]
rows=[[Paragraph(f"<b>{c}</b>",sTab) for c in fm[0]]]
for r in fm[1:]:
    rows.append([Paragraph(c,sTab) for c in r])
t=Table(rows,colWidths=[42*mm,24*mm,106*mm])
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),ACC),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),0.5,colors.grey),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,HexColor("#F9F7FF")]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),4),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
st+=[t]

def res_section(title, prio, focus_list, links, qa_pairs, codes):
    st.append(H2(f"{title} — [{prio}]"))
    for f in focus_list: st.append(B(f))
    st.append(P("<b>Learn from:</b> " + " &nbsp;|&nbsp; ".join([LINK(u,l) for u,l in links])))
    for c in codes: st.append(CODE(c)); st.append(Spacer(1,1*mm))
    for q,a in qa_pairs: st.append(QA(q,a))

res_section("2. Python", "CRITICAL",
 ["Sets/dicts for Jaccard + frequency; decorators; exception handling per-row; GIL implication"],
 [("https://docs.python.org/3/tutorial/","Python Official Tutorial"),("https://realpython.com/","Real Python"),("https://docs.python.org/3/library/decimal.html","Decimal Docs")],
 [("Reverse string without [::-1]?","Use two pointers to show logic, then mention slice shortcut. Complexity O(n)."),
  ("What is __init__ vs __str__?","__init__ constructs, __str__ pretty-prints. I used __str__ for debugging SQLModel rows.")],
 ["# two pointers + freq + decorator\ndef reverse(s):\n  a=list(s); i,j=0,len(a)-1\n  while i<j: a[i],a[j]=a[j],a[i]; i+=1; j-=1\n  return ''.join(a)\nfrom collections import Counter\ndef first_unique(s):\n  c=Counter(s)\n  for i,ch in enumerate(s):\n    if c[ch]==1: return i\n  return -1\nimport functools,time\ndef timer(fn):\n  @functools.wraps(fn)\n  def w(*a,**k):\n    t=time.time(); r=fn(*a,**k); print(fn.__name__, round(time.time()-t,3)); return r\n  return w"])

res_section("3. SQL + PostgreSQL + SQLModel + Alembic", "CRITICAL",
 ["Write joins + GROUP BY/HAVING live; explain 409 check; ACID; migration commands"],
 [("https://www.postgresql.org/docs/","Postgres Docs"),("https://sqlmodel.tiangolo.com/","SQLModel Docs"),("https://alembic.sqlalchemy.org/en/latest/tutorial.html","Alembic Tutorial")],
 [("LEFT JOIN vs INNER?","INNER only matches; LEFT keeps all left rows with NULLs. I list students even without team via LEFT JOIN.")],
 ["-- duplicate check (your 409) + monthly spend\nSELECT email, COUNT(*) FROM student GROUP BY email HAVING COUNT(*)>1;\nSELECT date_trunc('month',date) AS m, SUM(amount)\nFROM txn GROUP BY m ORDER BY m;\n-- alembic\n-- alembic revision --autogenerate -m \"add team_id\"\n-- alembic upgrade head"])

res_section("4. FastAPI + REST", "CRITICAL",
 ["Draw routes→services→models; status codes; ?tech= filtering; TestClient"],
 [("https://fastapi.tiangolo.com/","FastAPI Docs"),("https://www.restapitutorial.com/","REST Tutorial"),("https://developer.mozilla.org/en-US/docs/Web/HTTP/Status","HTTP Statuses MDN")],
 [("Why 409 not 400 for duplicate?","400=bad syntax, 409=conflict with state. Client knows to change email, not fix JSON.")],
 ["from fastapi import FastAPI, HTTPException\nfrom fastapi.testclient import TestClient\napp=FastAPI()\n@app.get('/ideas')\ndef list_ideas(tech: str|None=None):\n  return {'tech':tech}\nclient=TestClient(app)\ndef test_dup():\n  r=client.post('/students',json={'email':'a@x.com'})\n  assert r.status_code in (200,201,409)"])

res_section("5. React + Vite + Tailwind + Recharts", "HIGH",
 ["useEffect fetch pattern; props vs state; Tailwind utilities; Recharts LineChart"],
 [("https://react.dev/","React Docs"),("https://vitejs.dev/guide/","Vite Guide"),("https://tailwindcss.com/docs","Tailwind Docs"),("https://recharts.org/en-US/","Recharts Docs")],
 [("How does React talk to FastAPI?","fetch(VITE_API+'/ideas') → JSON → useState → render. Handle !ok → error state. CORS enabled on backend.")],
 ["import {useEffect,useState} from 'react';\nexport default function Ideas(){\n  const [ideas,setIdeas]=useState([]);\n  useEffect(()=>{\n    fetch(`${import.meta.env.VITE_API}/ideas?tech=python`)\n      .then(r=>{if(!r.ok) throw new Error(r.status); return r.json();})\n      .then(setIdeas).catch(console.error);\n  },[]);\n  return <ul>{ideas.map(i=><li key={i.id}>{i.title}</li>)}</ul>;\n}\n// Recharts\n// <LineChart data={burn}><Line dataKey=\"balance\" /><XAxis dataKey=\"date\"/></LineChart>"])

res_section("6. Pandas + NumPy + Matplotlib (pocketF analytics)", "MEDIUM-HIGH",
 ["read_csv + groupby burn-rate; vectorized ops; savefig charts"],
 [("https://pandas.pydata.org/docs/","Pandas Docs"),("https://numpy.org/doc/","NumPy Docs"),("https://matplotlib.org/stable/users/index.html","Matplotlib Guide")],
 [("Pandas vs SQL?","SQL for storage/filter; Pandas for in-memory analytics (resample, rolling avg) before charting.")],
 ["import pandas as pd\nimport matplotlib.pyplot as plt\nfrom decimal import Decimal\ndf=pd.read_csv('txns.csv',parse_dates=['date'])\ndaily=df.groupby('date')['amount'].sum()\nburn=float(daily.tail(7).mean())\ndays_left=float(Decimal('5000'))/burn if burn>0 else float('inf')\nplt.plot(daily.index,daily.values); plt.savefig('burn.png',bbox_inches='tight')"])

res_section("7. OpenCV + Tesseract + ReportLab (CampusPilot)", "MEDIUM",
 ["Preprocess chain; PSM; confidence filter; ReportLab table"],
 [("https://docs.opencv.org/4.x/","OpenCV Docs"),("https://tesseract-ocr.github.io/","Tesseract Docs"),("https://docs.reportlab.com/","ReportLab Docs")],
 [("PSM 6 vs 3?","6=uniform block (seating tables), 3=auto. Wrong PSM = garbled rows.")],
 ["import cv2, pytesseract\nimg=cv2.imread('seat.png')\ngray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)\nblur=cv2.GaussianBlur(gray,(5,5),0)\nth=cv2.adaptiveThreshold(blur,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,31,2)\ntxt=pytesseract.image_to_data(th,config='--psm 6',output_type=pytesseract.Output.DATAFRAME)\nconf=txt[txt.conf>60]  # keep high-confidence boxes"])

res_section("8. Hugging Face LLMs + Scikit-learn + SHAP", "MEDIUM",
 ["Prompt→JSON + validation; temp 0; IF anomaly score idea"],
 [("https://huggingface.co/docs/transformers/index","HF Transformers"),("https://scikit-learn.org/stable/","Scikit-learn"),("https://shap.readthedocs.io/en/latest/","SHAP Docs")],
 [("Fine-tuned?","No — zero-shot prompt + schema validation. Fine-tune needs labeled data + GPU; overkill here.")],
 ["from transformers import pipeline\nllm=pipeline('text-generation',model='microsoft/Phi-3-mini-4k-instruct')\nprompt=\"Extract JSON {roll,room,time} from:\\n\"+ocr_text+\"\\nReturn ONLY JSON.\"\nout=llm(prompt,max_new_tokens=256,temperature=0.0)[0]['generated_text']\n# then json.loads + regex validate roll pattern\nfrom sklearn.ensemble import IsolationForest\nclf=IsolationForest(contamination=0.02).fit(X_train)  # -1 = anomaly\nscores=clf.decision_function(X_test)"])

res_section("9. Docker + pytest + Git", "HIGH",
 ["Dockerfile + compose up; fixture + parametrize; branch workflow"],
 [("https://docs.docker.com/get-started/","Docker Get Started"),("https://docs.pytest.org/en/stable/","pytest Docs"),("https://git-scm.com/doc","Git Docs")],
 [("Container vs image?","Image blueprint; container running instance; volume persists DB.")],
 ["# Dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\",\"main:app\",\"--host\",\"0.0.0.0\",\"--port\",\"8000\"]\n# compose\n# services: {api: {build: ., ports:[\"8000:8000\"]}, db: {image: \"postgres:16\", volumes:[\"pg:/var/lib/postgresql/data\"]}}\nimport pytest\n@pytest.mark.parametrize(\"a,b,exp\",[({\"p\"},{\"p\"},1.0), (set(),set(),0.0)])\ndef test_jaccard(a,b,exp):\n  from math import isclose\n  j=len(a&b)/len(a|b) if (a or b) else 0.0\n  assert isclose(j,exp)"])

st+=[H1("10. OA Practice Links (Daily 1 hr)")]
for u,l,d in [
 ("https://www.indiabix.com/","IndiaBix","Aptitude + logical + verbal topic-wise MCQs with timer"),
 ("https://www.geeksforgeeks.org/aptitude-questions-and-answers/","GFG Aptitude","Short tricks + company-wise sets"),
 ("https://leetcode.com/problemset/","LeetCode Easy","Do: Two Sum, Valid Parens, Missing Number, Merge Intervals"),
 ("https://www.hackerrank.com/domains/python","HackerRank Python","Practice input()/split() fast parsing like OA"),
 ("https://www.geeksforgeeks.org/pseudocode-questions/","GFG Pseudocode","Dry-run loops/bitwise/recursion"),
]:
    st+=[P(f"<b>{LINK(u,l)}</b> — {d}")]
st+=[H1("11. What to Focus MORE — Final Verdict"),
P("If only <b>10 hours</b> left: <b>4h</b> OA coding + pseudocode drills (cutoff), <b>3h</b> speak CampusPilot + FastAPI + SQL aloud with code above, <b>2h</b> pocketF Decimal/burn + UrTeam Jaccard/auth, <b>1h</b> HR intro + why Accenture + 1 STAR story. Interviewers forgive shallow OpenCV/LLM theory if your <b>pipeline + API + DB + tests</b> story is crisp and honest about scope (prototype, no fine-tune). Demo beats jargon."),
P("Keep both PDFs + GitHub open in interview. Offer: 'I can show the 409 handler / Jaccard function / burn chart live.' That one line converts interview to selection.")]
st+=[H1("12. Per-Resource Focus Map — Exact Subtopics (Study / Skip)"),
P("<b>How to read:</b> STUDY = do hands-on + speak aloud. SKIP = ignore for this interview. TIME = suggested mins. Interview line = what to say."),
]
focus_map=[
 ["<b>Python Tutorial</b><br/>docs.python.org/3/tutorial/ [45 min]","STUDY: Sec5 list/dict/set/comprehension, Sec7 input/split, Sec8 try/except/else, Sec9 class/__init__/inheritance.<br/>SKIP: functional programming, venv deep, asyncio.","Say: sets for Jaccard, dict Counter for freq, try/except per CSV row."],
 ["<b>Real Python + Decimal</b><br/>realpython.com + docs.python.org/3/library/decimal [20 min]","STUDY: Decimal('0.1') exact, quantize 2 places, f-string format.<br/>SKIP: fractions, statistics module.","Say: float 0.1+0.2!=0.3 so money uses Decimal."],
 ["<b>FastAPI Docs</b><br/>fastapi.tiangolo.com [60 min]","STUDY: path/query params, Pydantic EmailStr/min_length, HTTPException 409/404/422, /docs, TestClient.<br/>SKIP: OAuth2, websockets, background tasks.","Say: routes thin, services pure, 409 duplicate, ?tech= filter."],
 ["<b>REST + MDN Status</b><br/>restapitutorial + MDN HTTP Status [20 min]","STUDY: GET/POST/PUT/PATCH/DELETE + 200/201/400/404/409/422/500.<br/>SKIP: caching, HATEOAS.","Say: 409 conflict not 400; 422 validation."],
 ["<b>Postgres + SQLModel + Alembic</b><br/>postgresql.org + sqlmodel + alembic [60 min]","STUDY: INNER/LEFT JOIN, GROUP BY+HAVING, UNIQUE email, ACID, revision --autogenerate + upgrade head.<br/>SKIP: replication, triggers, partitioning.","Say: SQLite dev, Postgres prod, migrate never drop."],
 ["<b>React.dev + Vite</b><br/>react.dev + vitejs.dev/guide [45 min]","STUDY: useState/useEffect fetch, props down/events up, key={id}, VITE_API env.<br/>SKIP: redux, context, memo, SSR.","Say: fetch FastAPI JSON to state then render + error state."],
 ["<b>Tailwind + Recharts</b><br/>tailwindcss + recharts.org [20 min]","STUDY: flex/gap/rounded/text-sm utilities; LineChart+Line+XAxis dataKey.<br/>SKIP: custom config, animations.","Say: inline utilities for 8 components; burn chart via Recharts."],
 ["<b>Pandas + NumPy + Matplotlib</b><br/>pandas/numpy/matplotlib docs [40 min]","STUDY: read_csv parse_dates, groupby sum, tail mean burn, vectorized ops, savefig.<br/>SKIP: multi-index, merging complex.","Say: SQL stores, Pandas analyzes, Matplotlib reports."],
 ["<b>OpenCV + Tesseract + ReportLab</b><br/>docs.opencv + tesseract-ocr + reportlab [30 min]","STUDY: cvtColor grayscale, GaussianBlur, adaptiveThreshold, --psm 6, conf&gt;60, Platypus Table.<br/>SKIP: SIFT, training Tesseract, custom fonts.","Say: preprocess + PSM tuning fixed skewed scans."],
 ["<b>HF + Scikit + SHAP</b><br/>huggingface + scikit-learn + shap [30 min]","STUDY: temp 0 JSON prompt + validation, train_test_split, IsolationForest(-1), SHAP one-liner.<br/>SKIP: fine-tuning, GPU training.","Say: zero-shot no fine-tune; IF isolates anomalies, SHAP explains."],
 ["<b>Docker + pytest + Git</b><br/>docs.docker + pytest + git-scm [45 min]","STUDY: FROM/WORKDIR/COPY/RUN/CMD, compose api+db+volume, fixture+parametrize, branch/add/commit/push.<br/>SKIP: swarm, k8s, hooks.","Say: compose up runs all; 63 tests prove layers."],
 ["<b>OA: IndiaBix + GFG + LeetCode + HRank</b><br/>indiabix + gfg + leetcode + hackerrank [daily 60 min]","STUDY: %, P&amp;L, speed, seating/Venn + Two Sum/Parens/Missing/Anagram + stdin split parse.<br/>SKIP: Hard DP/graphs.","Say: speed 1 min/Q, easy-first coding."],
]
fr=[[Paragraph("<b>Resource [time]</b>",sTab),Paragraph("<b>STUDY vs SKIP</b>",sTab),Paragraph("<b>Interview line</b>",sTab)]]
for a,b,c in focus_map:
    fr.append([Paragraph(a,sTab),Paragraph(b,sTab),Paragraph(c,sTab)])
ft=Table(fr,colWidths=[48*mm,68*mm,56*mm])
ft.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),ACC),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),0.5,colors.grey),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,HexColor("#F9F7FF")]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),4),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
st+=[ft, P("<b>Remaining resources covered same way:</b> NumPy vectorization (no loops), Matplotlib savefig bbox_inches, Vite env import.meta.env, Alembic downgrade, Git pull --rebase — each needs 1 example only, not full docs. Total extra time ~2 hrs. Priority order top-to-bottom in table."),
H1("13. Updated Final Verdict — All Topics"),
P("Do rows 1-5 fully (4 hrs), rows 6-8 with 1 code each (2 hrs), rows 9-12 skim + 1 line (1 hr). You now have <b>every resource + exact subtopic + code</b> in these 2 PDFs. Revise table above night before.")]
doc.build(st,onFirstPage=hf,onLaterPages=hf)
print("OK -> "+OUT)
