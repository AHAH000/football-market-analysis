FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose ports (api.py:8001, reddit_cloud_api.py:8002)
EXPOSE 8001 8002

CMD ["bash"]
