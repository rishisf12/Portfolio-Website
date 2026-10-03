from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings
from urllib.parse import urlparse

# Check if using SQLite (for tests)
_is_sqlite = urlparse(settings.DATABASE_URL).scheme == "sqlite"

engine_kwargs = {"echo": True}
if _is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(settings.DATABASE_URL, **engine_kwargs)

def get_db():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)