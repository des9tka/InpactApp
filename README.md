# To start project add files into env directory both of parts (backend and frontend);

## CMD to start:

### Frontend:

#### - npm install;

#### - npm run dev;

### Backend:

#### - python -m venv .venv;

#### - .venv/Scripts(bin fro linux)/activate;

#### - pip install -r requirements.txt;

#### - alembic revision --autogenerate -m "message" (for make migration);

#### - alembic upgrade head;

#### - redis-server --port 6380 --slaveof 127.0.0.1 6379 (optional, if not redis server start/stock cmd command);
