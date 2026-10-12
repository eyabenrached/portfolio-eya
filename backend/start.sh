#!/bin/sh
set -e
echo "[start] migrations..."
alembic upgrade head
echo "[start] seed..."
python -m app.seed
echo "[start] API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
