# Stage 1: Build
FROM python:3.9-slim as builder
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y gcc

# Copy only requirements to cache them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final image
FROM python:3.9-slim
WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY . .

# Clean up unnecessary packages
RUN apt-get purge -y gcc && apt-get autoremove -y

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
