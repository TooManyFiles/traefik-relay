FROM python:3.13-alpine3.21

RUN python -m pip install --upgrade pip
WORKDIR /app
COPY . /app
RUN mkdir -p /app/config
RUN pip install --no-cache-dir -r /app/requirements.txt
EXPOSE 5000
CMD ["python", "main.py"]