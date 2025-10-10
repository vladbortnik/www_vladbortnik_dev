# Deploying a Flask App with Docker on DigitalOcean

Deploying a Flask application to production can seem daunting, but with Docker and DigitalOcean, the process becomes streamlined and reproducible. In this comprehensive guide, I'll walk you through every step of deploying a production-ready Flask application.

## Why Docker + DigitalOcean?

Before diving into the technical details, let's understand why this combination is powerful:

- **Consistency**: Docker ensures your app runs the same way in development and production
- **Isolation**: Each application runs in its own container with its own dependencies
- **Scalability**: Easy to scale horizontally by spinning up more containers
- **Cost-effective**: DigitalOcean droplets start at $5/month
- **Simple deployment**: Once configured, deployments are as simple as `docker-compose up`

## Prerequisites

Before starting, ensure you have:

- A Flask application ready to deploy
- Basic knowledge of Python and Flask
- A DigitalOcean account
- Docker installed locally for testing
- A domain name (optional, but recommended for SSL)

## Step 1: Dockerizing Your Flask Application

First, create a `Dockerfile` in your project root:

```dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 5000

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

## Step 2: Create Docker Compose Configuration

Create a `docker-compose.yml` file for easier container orchestration:

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: flask_app
    restart: unless-stopped
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - ./app:/app
    networks:
      - app_network
    ports:
      - "5000:5000"

networks:
  app_network:
    driver: bridge
```

## Step 3: Configure Nginx as Reverse Proxy

Create an Nginx configuration file `nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Step 4: Setting Up DigitalOcean Droplet

1. **Create a new droplet**:
   - Choose Ubuntu 22.04 LTS
   - Select at least the $6/month plan (1 GB RAM)
   - Choose a datacenter region close to your users
   - Add SSH keys for secure access

2. **Connect to your droplet**:
```bash
ssh root@your_droplet_ip
```

3. **Install Docker and Docker Compose**:
```bash
# Update package index
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

## Step 5: Deploy Your Application

1. **Clone your repository or transfer files**:
```bash
git clone https://github.com/yourusername/your-flask-app.git
cd your-flask-app
```

2. **Create environment file**:
```bash
nano .env
```

Add your environment variables:
```
DATABASE_URL=postgresql://user:pass@localhost/dbname
SECRET_KEY=your-super-secret-key-here
FLASK_ENV=production
```

3. **Build and run containers**:
```bash
docker-compose up -d --build
```

4. **Verify deployment**:
```bash
docker-compose ps
docker-compose logs -f web
```

## Step 6: Configure Nginx

1. **Install Nginx**:
```bash
apt install nginx -y
```

2. **Copy your Nginx configuration**:
```bash
nano /etc/nginx/sites-available/flask_app
```

Paste your configuration, then enable it:
```bash
ln -s /etc/nginx/sites-available/flask_app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 7: Set Up SSL with Let's Encrypt

Secure your application with free SSL certificates:

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Obtain certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
certbot renew --dry-run
```

## Step 8: Security Best Practices

### Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

### Set Up Automatic Updates

```bash
apt install unattended-upgrades -y
dpkg-reconfigure --priority=low unattended-upgrades
```

### Use Environment Variables

Never hardcode sensitive data. Always use environment variables:

```python
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')
```

## Step 9: Monitoring and Logging

Set up basic logging in your Flask app:

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Flask app startup')
```

Monitor your containers:

```bash
# View running containers
docker ps

# Check resource usage
docker stats

# View logs
docker-compose logs -f --tail=100
```

## Step 10: Continuous Deployment

Create a simple deployment script `deploy.sh`:

```bash
#!/bin/bash

echo "Pulling latest changes..."
git pull origin main

echo "Rebuilding containers..."
docker-compose down
docker-compose up -d --build

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Common Issues and Solutions

### Issue: Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Issue: Container Won't Start
```bash
# Check logs
docker-compose logs web

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Issue: Nginx Configuration Errors
```bash
# Test configuration
nginx -t

# View error logs
tail -f /var/log/nginx/error.log
```

## Performance Optimization

### Use Gunicorn Workers

Calculate optimal workers: `(2 * CPU_CORES) + 1`

```python
# gunicorn.conf.py
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2
```

### Enable Gzip Compression

Add to your Nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

## Conclusion

Deploying a Flask application with Docker on DigitalOcean provides a robust, scalable, and maintainable production environment. The key takeaways:

- ✅ Use Docker for consistency and isolation
- ✅ Nginx as a reverse proxy for performance and security
- ✅ SSL certificates for encrypted communication
- ✅ Environment variables for configuration
- ✅ Proper logging and monitoring
- ✅ Security best practices from day one

With this setup, you can confidently deploy Flask applications that are production-ready and easy to maintain.

## Next Steps

- Set up a database container (PostgreSQL/MySQL)
- Implement Redis for caching
- Configure automated backups
- Set up monitoring with tools like Prometheus and Grafana
- Implement CI/CD with GitHub Actions

Have questions or suggestions? Leave a comment below!

---

**Resources**:
- [Docker Documentation](https://docs.docker.com/)
- [Flask Deployment Options](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Nginx Documentation](https://nginx.org/en/docs/)
