FROM python:3.13-alpine3.21

RUN python -m pip install --upgrade pip
WORKDIR /app
COPY . /app
RUN mkdir -p /app/config
RUN pip install --no-cache-dir -r /app/requirements.txt

ENV LOG_LEVEL=INFO
ENV TRAEFIK_URL=http://localhost:8080/
ENV NODE_NAME=default_node
ENV NODE_ADDRESS=localhost
ENV REMOTE_TRAEFIK_URL=
EXPOSE 5000
CMD ["python", "main.py"]