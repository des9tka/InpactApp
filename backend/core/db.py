from sqlmodel import create_engine, SQLModel, Session
from typing import Generator

# Database URL for SQLite (use an actual file path if needed)
DATABASE_URL = "sqlite:///db.sqlite"

# Create the database engine with SQLite
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def init_db():
    """Initializes the database by creating tables defined in the SQLModel metadata."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Returns a generator for creating a session that is automatically closed after usage."""
    with Session(engine) as session:
        yield session
