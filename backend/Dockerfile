FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN mkdir -p uploads

EXPOSE 10000

CMD ["sh", "-c", "DB=$(python fix_db_url.py) && export DATABASE_URL=\"$DB\" && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]