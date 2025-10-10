# Mastering Docker Compose for Multi-Container Applications

Docker Compose is an essential tool for orchestrating multi-container applications. Whether you're building a microservices architecture or just need to coordinate multiple services, Docker Compose simplifies the process dramatically. In this guide, we'll explore everything from basics to advanced patterns.

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application's services, networks, and volumes. Then, with a single command, you create and start all the services.

### Why Use Docker Compose?

- **Declarative Configuration**: Define your entire stack in a single file
- **Environment Consistency**: Same configuration across development, staging, and production
- **Easy Orchestration**: Start/stop multiple containers with one command
- **Service Dependencies**: Control startup order and dependencies
- **Networking Made Simple**: Automatic service discovery and networking
- **Volume Management**: Persistent data handling made easy

## Basic Docker Compose Structure

Here's a simple `docker-compose.yml` file structure:

```yaml
version: '3.8'

services:
  # Service definitions go here
  
networks:
  # Network definitions go here
  
volumes:
  # Volume definitions go here
```

## Real-World Example: Full-Stack Application

Let's build a complete full-stack application with:
- Flask API backend
- PostgreSQL database
- Redis cache
- Nginx reverse proxy

### Complete docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: postgres_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-admin}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-secretpassword}
      POSTGRES_DB: ${DB_NAME:-myapp}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - backend
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-admin}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis_cache
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redispass}
    volumes:
      - redis_data:/data
    networks:
      - backend
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Flask Backend API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
      args:
        - PYTHON_VERSION=3.11
    container_name: flask_api
    restart: unless-stopped
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://${DB_USER:-admin}:${DB_PASSWORD:-secretpassword}@db:5432/${DB_NAME:-myapp}
      - REDIS_URL=redis://:${REDIS_PASSWORD:-redispass}@redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - ./backend:/app
      - api_logs:/app/logs
    networks:
      - backend
      - frontend
    ports:
      - "5000:5000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 60 app:app

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: nginx_proxy
    restart: unless-stopped
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
      - nginx_logs:/var/log/nginx
    networks:
      - frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # Backend network not accessible from outside

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  api_logs:
    driver: local
  nginx_logs:
    driver: local
```

## Environment Variables

Create a `.env` file for sensitive configuration:

```bash
# Database Configuration
DB_USER=admin
DB_PASSWORD=your_secure_password_here
DB_NAME=myapp

# Redis Configuration
REDIS_PASSWORD=your_redis_password

# Application Configuration
SECRET_KEY=your_super_secret_key_change_in_production
FLASK_ENV=production

# Optional: Set specific versions
POSTGRES_VERSION=15
REDIS_VERSION=7
```

**Important**: Add `.env` to your `.gitignore` file!

## Docker Compose Commands

### Basic Operations

```bash
# Start all services in detached mode
docker-compose up -d

# Start specific services
docker-compose up -d db redis

# View running services
docker-compose ps

# Stop all services
docker-compose stop

# Stop and remove containers, networks
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v

# Rebuild services
docker-compose up -d --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api

# Scale services
docker-compose up -d --scale api=3

# Execute command in running container
docker-compose exec api flask db upgrade
docker-compose exec db psql -U admin -d myapp

# View resource usage
docker-compose top
```

## Advanced Patterns

### Service Dependencies with Health Checks

Use `depends_on` with conditions to ensure services start in the correct order:

```yaml
services:
  api:
    # ... other config ...
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

### Using Build Arguments

Pass build-time variables to your Dockerfile:

```yaml
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
      args:
        - PYTHON_VERSION=3.11
        - BUILD_DATE=${BUILD_DATE}
        - VCS_REF=${VCS_REF}
```

In your Dockerfile:

```dockerfile
ARG PYTHON_VERSION=3.11
FROM python:${PYTHON_VERSION}-slim

ARG BUILD_DATE
ARG VCS_REF

LABEL org.label-schema.build-date=${BUILD_DATE} \
      org.label-schema.vcs-ref=${VCS_REF}
```

### Multiple Environment Files

Load different environment files for different scenarios:

```yaml
services:
  api:
    env_file:
      - .env          # Common variables
      - .env.local    # Local overrides
```

### Extending Services

Create a base configuration and extend it:

**docker-compose.base.yml**:
```yaml
version: '3.8'

services:
  api:
    image: myapi:latest
    networks:
      - app_network
```

**docker-compose.dev.yml**:
```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      target: development
    volumes:
      - .:/app
    environment:
      - DEBUG=True
```

**docker-compose.prod.yml**:
```yaml
version: '3.8'

services:
  api:
    restart: always
    environment:
      - DEBUG=False
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

Run with:
```bash
# Development
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml up -d
```

## Networking Deep Dive

### Service Discovery

Services can communicate using service names:

```python
# In your Flask app, connect to PostgreSQL
DATABASE_URL = "postgresql://user:pass@db:5432/myapp"
# Note: 'db' is the service name, not localhost

# Connect to Redis
REDIS_URL = "redis://:password@redis:6379/0"
```

### Custom Networks

Create isolated networks for different layers:

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # Not accessible from host
  monitoring:
    driver: bridge
```

Assign services to networks:

```yaml
services:
  nginx:
    networks:
      - frontend
  
  api:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend  # Database only accessible to backend services
```

## Volume Management

### Named Volumes vs Bind Mounts

**Named volumes** (managed by Docker):
```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      device: /path/on/host
      o: bind
```

**Bind mounts** (direct host path):
```yaml
services:
  api:
    volumes:
      - ./backend:/app  # Development: live code reload
      - /app/node_modules  # Anonymous volume: don't overwrite
```

### Volume Permissions

Handle permission issues:

```yaml
services:
  api:
    user: "1000:1000"  # Run as specific user
    volumes:
      - ./data:/app/data
```

Or in Dockerfile:
```dockerfile
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser
```

## Production Best Practices

### 1. Resource Limits

Prevent containers from consuming all system resources:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 2. Restart Policies

Ensure services restart on failure:

```yaml
services:
  api:
    restart: unless-stopped  # Restart unless manually stopped
    
  worker:
    restart: on-failure:5  # Restart up to 5 times on failure
```

### 3. Health Checks

Monitor service health:

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 4. Logging Configuration

Control log output:

```yaml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. Security Hardening

```yaml
services:
  api:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

## Debugging Tips

### View Service Logs

```bash
# All services
docker-compose logs -f --tail=100

# Specific service
docker-compose logs -f api

# Follow logs with timestamps
docker-compose logs -f -t api
```

### Inspect Containers

```bash
# Container details
docker-compose exec api env

# Network information
docker network inspect myapp_backend

# Volume information
docker volume inspect myapp_postgres_data
```

### Troubleshooting Network Issues

```bash
# Test connectivity between services
docker-compose exec api ping db
docker-compose exec api nc -zv redis 6379

# Check DNS resolution
docker-compose exec api nslookup db
```

## Complete Example: Microservices Architecture

```yaml
version: '3.8'

services:
  # API Gateway
  gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/nginx.conf
    networks:
      - frontend
    depends_on:
      - auth-service
      - user-service
      - order-service

  # Authentication Service
  auth-service:
    build: ./services/auth
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - DB_URL=postgresql://auth_db:5432/auth
    networks:
      - frontend
      - auth_backend
    depends_on:
      - auth_db

  auth_db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: auth
    volumes:
      - auth_data:/var/lib/postgresql/data
    networks:
      - auth_backend

  # User Service
  user-service:
    build: ./services/users
    environment:
      - DB_URL=postgresql://user_db:5432/users
    networks:
      - frontend
      - user_backend
    depends_on:
      - user_db

  user_db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: users
    volumes:
      - user_data:/var/lib/postgresql/data
    networks:
      - user_backend

  # Order Service
  order-service:
    build: ./services/orders
    environment:
      - DB_URL=postgresql://order_db:5432/orders
      - REDIS_URL=redis://redis:6379
    networks:
      - frontend
      - order_backend
    depends_on:
      - order_db
      - redis

  order_db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: orders
    volumes:
      - order_data:/var/lib/postgresql/data
    networks:
      - order_backend

  # Shared Redis
  redis:
    image: redis:7-alpine
    networks:
      - frontend

networks:
  frontend:
  auth_backend:
    internal: true
  user_backend:
    internal: true
  order_backend:
    internal: true

volumes:
  auth_data:
  user_data:
  order_data:
```

## Monitoring and Observability

Add monitoring stack:

```yaml
services:
  # Prometheus for metrics
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - monitoring

  # Grafana for visualization
  grafana:
    image: grafana/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus
```

## Conclusion

Docker Compose is a powerful tool for orchestrating multi-container applications. Key takeaways:

- ✅ Use `docker-compose.yml` for declarative configuration
- ✅ Leverage environment variables for configuration
- ✅ Implement health checks for reliability
- ✅ Use networks to isolate services
- ✅ Manage data with volumes
- ✅ Set resource limits for production
- ✅ Monitor logs and metrics
- ✅ Test locally before deploying

With these patterns and practices, you can build robust, scalable multi-container applications that are easy to develop, test, and deploy.

## Next Steps

- Implement CI/CD pipeline for automated deployments
- Add monitoring and alerting
- Explore Docker Swarm or Kubernetes for orchestration at scale
- Implement blue-green deployments
- Set up automated backups

---

**Resources**:
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Networking](https://docs.docker.com/network/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
