FROM python:3.7-alpine
RUN pip3 install flask
ENV FLASK_APP="main.py"
COPY . /app
WORKDIR /app
CMD flask run --host 0.0.0.0 --port 80
