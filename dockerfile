# Stage 1: Build frontend
FROM node:18 AS frontend

# Устанавливаем рабочую директорию для frontend
WORKDIR /frontend

# Копируем package.json и package-lock.json для установки зависимостей
COPY frontend/package.json frontend/package-lock.json /frontend/

# Устанавливаем зависимости
RUN npm install

# Копируем весь код frontend
COPY frontend /frontend

# Строим приложение
RUN npm run build

# Stage 2: Build backend
FROM python:3.11-slim AS backend

# Устанавливаем рабочую директорию для backend
WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код backend
COPY backend/ /app/

# Копируем скомпилированные файлы frontend
COPY --from=frontend /frontend/.next /frontend/.next
COPY --from=frontend /frontend/public /frontend/public

# Устанавливаем зависимости для Alembic
RUN pip install alembic

# Указываем команду для выполнения миграций и запуска backend
CMD ["sh", "-c", "alembic revision --autogenerate -m 'Initial migration' && alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]

# Stage 3: Run frontend (добавляем эту стадию)
FROM node:18 AS frontend-run

# Устанавливаем рабочую директорию для frontend
WORKDIR /frontend

# Копируем все необходимые файлы для работы фронтенда
COPY --from=frontend /frontend /frontend

# Устанавливаем команду для запуска фронтенда
CMD ["npm", "run", "start"]
