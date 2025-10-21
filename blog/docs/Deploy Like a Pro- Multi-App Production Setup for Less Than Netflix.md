# Deploy Like a Pro: Multi-App Production Setup for Less Than Netflix

*A practical guide to escaping expensive hosting by building your own production-grade infrastructure on DigitalOcean—complete with Docker, Nginx, and enterprise-level security.*

---

## The Problem with Modern Hosting Costs

If you're running multiple web applications, you've probably noticed hosting costs add up quickly. Platform-as-a-Service providers charge per application: Heroku starts at $7/app, Render at $7/app, Railway at $5/app. Add databases, custom domains, and SSL certificates, and three simple applications can cost $60-90 monthly.

I faced this exact problem with three applications: a portfolio site, a recipe app, and a book exchange platform. My shared hosting bills totaled $45/month with frustrating limitations—no WebSocket support, restrictive resource limits, and complex SSL setup.

This guide shows you how to host multiple production applications on a single $12/month VPS with A security ratings, sub-100ms response times, and complete control over your infrastructure.

## Planning Your Infrastructure Requirements

Before setting up a server, map out what you actually need. Here's the framework I used:

**Essential requirements:**
- Multiple application hosting with isolation
- Custom domains and subdomains
- SSL certificates for all domains
- Separate databases per application
- Production-grade security
- Room for scaling

**Budget analysis:**
- DigitalOcean Droplet (2GB RAM): $12/month
- Automated backups: $2.40/month
- Domain names: ~$3/month (yearly cost divided)
- **Total: ~$17/month**

Compare this to platform alternatives where three apps with databases cost $35-60/month minimum.

## Choosing Your Technology Stack

### VPS Provider Selection

After comparing providers, I chose [DigitalOcean](https://www.digitalocean.com/products/droplets) for their predictable pricing and excellent documentation. Their $12/month droplet provides:
- 2GB RAM, 1 vCPU, 25GB SSD
- Choice of datacenter locations
- [One-click backups](https://docs.digitalocean.com/products/backups/)
- Extensive tutorial library

Ubuntu 24.04 LTS serves as the operating system for its stability and community support.

### Nginx as Reverse Proxy

Nginx excels at routing traffic between multiple applications. Its reverse proxy capabilities let you:
- Route domains to different applications
- Handle SSL termination
- Manage load balancing
- Cache static content

[DigitalOcean's Nginx installation guide](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-24-04) provides the foundation.

### Docker for Application Isolation

Docker solves the "works on my machine" problem while providing:
- Isolated environments per application
- Consistent deployments with `docker-compose`
- Resource limits to prevent one app from consuming everything
- Network segregation for security

The architecture looks like this:

```
Internet → Nginx (reverse proxy) → Docker containers
                                   ├── Portfolio (HTML/CSS/JavaScript)
                                   ├── Recipe App (Flask + PostgreSQL)
                                   └── BookFinder (Flask + SQLite)
```

## Initial Server Setup and Security Hardening

### Creating a Secure Foundation

Start by following [DigitalOcean's initial server setup guide](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-24-04). Key steps include:

1. **Create a non-root user with sudo privileges:**
```bash
adduser yourusername
usermod -aG sudo yourusername
```

2. **Set up SSH key authentication** and disable password login for security.

3. **Configure UFW firewall:**
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Important: Always allow SSH before enabling the firewall to avoid locking yourself out.

### Implementing Fail2Ban

Fail2Ban protects against brute force attacks by monitoring logs and banning malicious IPs. [DigitalOcean's Fail2Ban tutorial](https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-22-04) covers installation and configuration.

My configuration bans IPs after three failed attempts:

```ini
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400
```

## Configuring Nginx as a Reverse Proxy

### Basic Reverse Proxy Setup

Install Nginx and create server blocks for each application. Here's a working configuration for a Flask application:

```nginx
server {
    listen 80;
    server_name recipe.yourdomain.com;

    location / {
        proxy_pass http://localhost:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

These headers preserve important request information:
- `Host`: Original domain name
- `X-Real-IP`: Visitor's actual IP address
- `X-Forwarded-For`: Complete proxy chain
- `X-Forwarded-Proto`: Original protocol (HTTP/HTTPS)

### Managing Multiple Applications

Create separate configuration files for each application in `/etc/nginx/sites-available/` and symlink them to `/etc/nginx/sites-enabled/`. This keeps configurations organized and makes it easy to enable/disable sites.

Test configurations before reloading:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Docker Setup and Network Security

### Installing Docker and Docker Compose

Follow [DigitalOcean's Docker installation guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-24-04) and [Docker Compose tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-24-04).

### Network Segregation Strategy

The critical security insight: never expose database ports to the internet. Use Docker networks to isolate services:

```yaml
version: '3.8'

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access

services:
  web:
    build: .
    networks:
      - frontend
      - backend
    ports:
      - "5002:5002"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/dbname

  db:
    image: postgres:16
    networks:
      - backend  # Only on internal network
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Key points:
- Databases connect only to the `backend` network
- No port mapping for databases (they're not accessible externally)
- Applications reach databases using service names (`db` instead of `localhost`)

### Resource Limits

Prevent cascade failures by limiting container resources:

```yaml
deploy:
  resources:
    limits:
      cpus: '0.3'
      memory: 384M
    reservations:
      memory: 192M
```

If one application misbehaves, it can't take down the entire server.

## SSL Certificates and Security Headers

### Obtaining SSL Certificates with Let's Encrypt

Use Certbot for free SSL certificates. [DigitalOcean's Let's Encrypt guide](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-24-04) walks through the process:

```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Enable automatic renewal:
```bash
sudo systemctl enable snap.certbot.renew.timer
```

### Achieving A Security Rating

Strong SSL configuration requires modern cipher suites and security headers. Add this to your Nginx server blocks:

```nginx
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;

# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

For Content Security Policy, start permissive and tighten gradually:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

Test your configuration at [SSL Labs](https://www.ssllabs.com/ssltest/) and [Mozilla Observatory](https://observatory.mozilla.org/).

## Deployment Workflow and Automation

### Setting Up GitHub Actions for CI/CD

Automate deployments using GitHub Actions. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull
            docker-compose build
            docker-compose down
            docker-compose up -d
```

Store sensitive information in GitHub Secrets for security.

### Backup Strategy

Configure automated backups:

1. **Server snapshots**: Enable DigitalOcean's backup service
2. **Database backups**: Daily dumps to object storage
3. **Configuration backups**: Version control for all config files

Example backup script for PostgreSQL:

```bash
#!/bin/bash
BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

docker exec postgres_container pg_dump -U username dbname > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

## Monitoring and Maintenance

### Essential Monitoring Tools

Set up monitoring from day one:

- **Uptime monitoring**: [UptimeRobot](https://uptimerobot.com/) (free tier)
- **Resource monitoring**: [Netdata](https://www.netdata.cloud/) for real-time metrics
- **Log management**: Configure log rotation with logrotate
- **Error tracking**: [Sentry](https://sentry.io/) for application errors

### Regular Maintenance Tasks

Create a maintenance checklist:

- Weekly: Check disk usage, review logs, verify backups
- Monthly: Update system packages, review security alerts
- Quarterly: Test backup restoration, audit user access

Automate updates with unattended-upgrades:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## Performance Optimization Tips

### Nginx Caching

Enable caching for static assets:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

- Use connection pooling to reduce overhead
- Index frequently queried columns
- Regular VACUUM for PostgreSQL
- Monitor slow queries and optimize them

### CDN Integration

Consider adding Cloudflare's free tier for:
- Global content caching
- DDoS protection
- Additional security features

## Cost-Benefit Analysis

### Monthly Cost Breakdown

- DigitalOcean Droplet: $12
- Backups: $2.40
- Domains (yearly/12): ~$3
- **Total: $17.40/month**

### Resource Usage After 6 Months

- CPU: 15-20% average, 40% peak
- RAM: 1.2GB of 2GB used
- Storage: 8GB of 25GB used
- **Capacity for 2-3 more applications**

### Savings Comparison

Platform alternatives for 3 apps with databases:
- Heroku: ~$39/month minimum
- Render: ~$35/month
- Railway: ~$20/month (with strict limits)

**Monthly savings: $20-40**
**Yearly savings: $240-480**

## Common Issues and Solutions

### Problem: Application Can't Connect to Database

Check Docker network configuration. Ensure both services are on the same network and use the service name (not localhost) for connections.

### Problem: SSL Certificate Renewal Fails

Verify the `.well-known/acme-challenge/` location is accessible:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
```

### Problem: High Memory Usage

Review container limits and add swap space if needed:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Next Steps and Scaling

When you outgrow a single server:

1. **Vertical scaling**: Upgrade to a larger droplet (takes minutes)
2. **Horizontal scaling**: Add a load balancer and second server
3. **Managed databases**: Move databases to DigitalOcean's managed service
4. **Container orchestration**: Consider Kubernetes for complex deployments

## Conclusion

Building your own infrastructure teaches invaluable skills while saving money. You gain complete control, learn how web infrastructure actually works, and build confidence to debug production issues.

The initial setup takes time, but the knowledge and cost savings compound over months and years. With this foundation, you can host unlimited applications, experiment freely, and scale as needed.

## Resources and Repository

Configuration files, scripts, and detailed documentation are available on GitHub and in my portfolio:

**[GitHub: Server Setup](https://github.com/vladbortnik/production-server-infrastructure)**
**[Multi-App Production Server Setup](https://vladbortnik.dev/server-setup.html)**

The repository includes:
- Complete Nginx configurations
- Docker Compose templates
- Security hardening scripts
- Automated backup scripts
- Deployment workflows
- Troubleshooting guide

### Additional Learning Resources

- [DigitalOcean Community Tutorials](https://www.digitalocean.com/community/tutorials)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

### Get in Touch

Questions about this setup? Find me on:
- [vladbortnik.dev/twitter](https://x.com/vladbortnik_dev)
- [vladbortnik.dev/linkedin](https://www.linkedin.com/in/vladbortnik)
- [vladbortnik.dev/github](https://github.com/vladbortnik)
- [vladbortnik.dev/contact](https://vladbortnik.dev/contact.html)

---

*Follow me for more practical guides on DevOps, infrastructure, and building production systems on a budget.*
