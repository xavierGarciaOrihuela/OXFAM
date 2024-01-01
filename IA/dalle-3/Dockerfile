# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy the Python script into the container
COPY app.py constants.py /app/
RUN pip install openai

# Run the script when the container starts
CMD ["python", "app.py"]
