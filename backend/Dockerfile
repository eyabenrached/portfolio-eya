# Contexte de build = racine du projet (le backend a besoin de ../database/migrations)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/backend

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY database/ /app/database/

RUN useradd --create-home app \
    && mkdir -p /app/backend/uploads \
    && chown -R app:app /app
USER app

EXPOSE 8000
CMD ["./start.sh"]
