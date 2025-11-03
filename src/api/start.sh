#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."

# Try connecting using mysql client until it works
while ! nc -z db 5432; do
  sleep 1 # wait 1 second before checking again
done

# Run migrations
echo "Running Django migrations..."
uv run manage.py migrate --noinput

# Collect static files (optional)
# uv run manage.py collectstatic --noinput

# Start Django
echo "Starting Django server..."
uv run manage.py runserver 0.0.0.0:8000