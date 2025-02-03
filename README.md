# To start project add files into .env directory both of parts (backend and frontend);

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

#### - uvicorn main:app --reload --log-level debug;

#### - redis-server --port 6380 --slaveof 127.0.0.1 6379 (optional, if not redis server start/stock cmd command);

# Description

Every User can create up to 3 own Projects to manage workflow and impact of each worker;
Every User can join up yo 7 side Projects to help other teams;
Every User can make up to 10 impacts for one project;

Founder of project: Invite Users, Create Impacts, Edit own and Users Impacts, See all graph Impacts.
User: create Impact, See own Impacts.

MAin functionality: 2 Graphs for retrieving data, Data Table with sorting with create/update/retrieve/destroy data.
