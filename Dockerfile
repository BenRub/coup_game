FROM python:3.7-alpine

# Install gunicorn and Flask
RUN pip3 install flask gunicorn

COPY . /app
WORKDIR /app

# Heroku sets $PORT
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:$PORT main:app"]