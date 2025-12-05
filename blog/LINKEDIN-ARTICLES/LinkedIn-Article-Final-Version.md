# Showcase Your DevOps Skills: Host Multiple Apps on One $12/Month Server

I was paying $45/month to host three portfolio projects on Heroku.

My recipe app. My book exchange platform. My portfolio site.

Not commercial apps with thousands of users—just projects to showcase my skills and learn new tech.

Then I realized: why not host them like a professional would, and learn production-grade DevOps in the process?

I built a $12/month server with Docker, Nginx, SSL certificates, and proper security. A+ ratings on security scanners. Complete infrastructure control.

Six months later, I have:
• Real production experience to talk about in interviews
• Multiple apps hosted professionally  
• Skills that transfer to any DevOps role
• $400/year saved for other learning resources

This is how I did it—and why it's the best investment you can make in your development career.

---

**📖 Want the complete technical breakdown?**

Full guide with all configurations and step-by-step setup:
👉 **[Production-Grade Multi-App Server - Complete Guide](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html)**

---

## IMAGES TO UPLOAD (in order of appearance):

1. Server architecture diagram showing all five layers
2. UFW firewall status screenshot
3. Nginx reverse proxy flow diagram
4. Docker network segregation diagram
5. SSL Labs A+ security rating
6. Security Headers A+ score
7. Docker stats showing resource usage

---

## Is This Setup Right for You?

Let me be upfront about what this is and isn't.

**This is perfect if you:**
✅ Want to showcase DevOps skills in your portfolio
✅ Have multiple personal/learning projects to host
✅ Want hands-on experience with production infrastructure  
✅ Are preparing for DevOps/infrastructure roles
✅ Like having complete control over your stack
✅ Want real projects to discuss in interviews

**This is NOT for you if:**
❌ You need to handle high traffic (thousands of concurrent users)
❌ You want zero maintenance/hands-off hosting
❌ You need guaranteed SLAs for paying customers
❌ Your apps are generating revenue (use proper cloud services)
❌ You just want to ship features without infrastructure work

**Real talk:** My apps get modest traffic—perfect for portfolio projects. If you're building the next viral app, start on platforms and scale when revenue justifies it.

But if you want to learn production-grade DevOps while hosting your projects professionally? This is exactly what you need.

---

## The Problem: Platform Hosting Tax on Learning

Every time I wanted to spin up a new learning project, I'd do the math:

$7 for Heroku. $5 for PostgreSQL add-on. $2 for custom domain. Maybe $3 for Redis.

Before I'd written a single line of code, I'd mentally spent $17/month.

I was running three projects:
- **Portfolio site** (where recruiters could find me)
- **Recipe management app** (learning Flask and PostgreSQL)  
- **Book exchange platform** (experimenting with real-time features)

The bill: **$45/month = $540/year**

But the cost wasn't even the worst part. The limitations were:
- No WebSocket support without expensive tiers
- Restrictive resource limits
- Platform-specific workarounds for everything
- No control over the infrastructure
- Every new project = another monthly fee

The moment I realized I was paying more for hosting than for Udemy courses and development tools combined, something clicked.

*There has to be a better way to learn.*

---

## The Solution: One Server, Unlimited Learning

I started researching VPS options. DigitalOcean: $12/month for 2GB RAM.

The math was obvious:
- Current cost: $45/month for 3 apps
- VPS cost: $12/month for unlimited apps
- **Savings: $33/month = $396/year**

But more importantly: **complete control** to experiment and learn.

Could I build something production-grade? With proper security? That wouldn't fall over?

Yes. And here's how.

---

**📖 Ready to see the full architecture?**

Complete breakdown with diagrams and implementation details:
👉 **[Read the Full Technical Guide](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html#the-architecture-diagram)**

---

## The Architecture: Five Layers of Production Infrastructure

[IMAGE: Server Architecture Diagram]

I sketched out maybe 20 different designs before landing on this five-layer approach.

Some were over-engineered (Kubernetes for three learning apps? Come on). Some were too simple (everything in one container? Security nightmare). 

The five-layer architecture gives me:
- **Layer 1: Nginx Reverse Proxy** - SSL termination, routing, load balancing
- **Layer 2: Docker Containers** - Application isolation and easy deployment
- **Layer 3: Network Segregation** - Databases completely isolated from internet
- **Layer 4: PostgreSQL Databases** - Separate database per app
- **Layer 5: Security** - Defense in depth with multiple protection layers

This isn't overkill—this is **how professionals do it**.

### Layer 1: Nginx as Traffic Controller

Nginx sits at the front of everything. When a request hits `recipe.vladbortnik.dev`:

1. Nginx receives it on port 443 (HTTPS)
2. Checks server block configuration
3. Terminates SSL (decrypts HTTPS)
4. Forwards internally to `http://localhost:5002`
5. My Flask app responds
6. Nginx re-encrypts and sends back to client

The client never talks directly to my application.

**What this gives you:**
- Backend architecture completely hidden
- SSL certificates managed in one place
- Static file caching (massive performance win)
- Load balancing when needed
- Zero-downtime deployments

Here's a simplified version:

```nginx
upstream recipe_app {
    server localhost:5002;
    server localhost:5003;
}

server {
    listen 443 ssl http2;
    server_name recipe.vladbortnik.dev;
    
    ssl_certificate /etc/letsencrypt/live/vladbortnik.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vladbortnik.dev/privkey.pem;
    
    location / {
        proxy_pass http://recipe_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

But the production config includes 15+ security headers, caching rules, and optimizations for A+ ratings.

---

**⚙️ Want my exact Nginx configuration?**

Complete setup with security headers and optimization:
👉 **[Get the Complete Nginx Setup](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html#nginx-configuration-the-deep-dive)**

---

### Layer 2: Docker for Application Isolation

Each app runs in its own container. This solved three problems I didn't know I had:

**Problem 1: "Works on My Machine"**

Before Docker:
- Install Python 3.9 (wait, this app needs 3.11?)
- Install dependencies (oh, they conflict with other app's versions)  
- Configure environment (where did I put those variables again?)

With Docker: `docker-compose up -d`. Done.

**Problem 2: Cascade Failures**

Without resource limits, one app consuming all memory crashes the entire server.

With Docker:
```yaml
mem_limit: 384m         # Hard limit - killed if exceeded
mem_reservation: 192m   # Guaranteed minimum  
cpus: 0.3              # Max 30% of one core
```

When my recipe app had a memory leak last month, Docker killed and restarted it. Other apps kept running.

**Problem 3: Deployment Complexity**

Updating used to mean: SSH in, pull code, install dependencies (breaking existing ones), restart, debug, eventually give up and revert.

With Docker: Build new image, `docker-compose up -d`, done. If it breaks, rollback is one command.

[IMAGE: Docker containers with resource limits]

### Layer 3: Network Segregation - The Security Win

This is where I actually said "holy shit" out loud.

**My databases cannot be reached from the internet. Period.**

They're on a Docker network with no route to the public internet:

```yaml
networks:
  frontend:  # Public-facing
  backend:   # Private only

services:
  web:
    networks:
      - frontend  # Talks to Nginx
      - backend   # Talks to database
    ports:
      - "5002:5002"
  
  db:
    networks:
      - backend  # ONLY internal
    # NO ports exposed
```

[IMAGE: Docker network diagram]

Look at that database service. No port mapping. It's not accessible from `localhost`. It's *only* accessible from containers on the backend network.

Even if:
- UFW fails and allows port 5432
- Someone discovers my server IP
- They run a port scan

There's nothing there. The database isn't listening on any public interface.

This is **enterprise-level security** on a $12/month VPS.

---

**🔒 Want the complete Docker security setup?**

Full configuration files and network isolation strategy:
👉 **[Docker Security Implementation Guide](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html#docker-configuration-application-isolation-done-right)**

---

### Layer 4: PostgreSQL in Isolation

Each app gets its own database. Separate, isolated, with persistent storage:

```yaml
db:
  image: postgres:16.4
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - backend  # Only backend network
  mem_limit: 384m
  restart: unless-stopped
```

Resource limits prevent any single database from consuming all resources. Six months in production, zero data loss incidents.

### Layer 5: Security - Defense in Depth

Within the first week, Fail2Ban blocked **47 IP addresses** trying to brute force their way in.

That's when I understood: the moment your server goes live, the attacks start.

**My security layers:**

1. **SSH Hardening**: Key-based auth only, non-root user, custom port
2. **Firewall (UFW)**: Only ports 22, 80, 443 open
3. **Intrusion Prevention (Fail2Ban)**: 3 failed attempts = 24-hour ban
4. **Application Isolation**: Docker network segregation
5. **SSL/TLS**: TLS 1.3 only, A+ ratings

[IMAGE: UFW firewall status]
[IMAGE: SSL Labs A+ rating]

The result? A+ ratings on SSL Labs, Mozilla Observatory, and Security Headers.

---

**🛡️ Want the security hardening checklist?**

Complete setup for SSH, firewall, Fail2Ban, and SSL:
👉 **[Security Implementation Guide](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html#initial-server-setup-the-foundation)**

---

## SSL Setup: Wildcard Certificates with DNS-01

Most tutorials recommend HTTP-01 challenge. I went with DNS-01, and it's one of the best decisions I made.

**Why DNS-01?**

One wildcard certificate covers everything:
- vladbortnik.dev
- *.vladbortnik.dev (all subdomains)
- Any future subdomain I add

Setup with DigitalOcean DNS:

```bash
sudo certbot certonly \
  --dns-digitalocean \
  --dns-digitalocean-credentials ~/.secrets/certbot/digitalocean.ini \
  -d vladbortnik.dev \
  -d *.vladbortnik.dev
```

Auto-renewal handles itself. I've never manually renewed. It just works.

**The A+ Configuration:**

```nginx
ssl_protocols TLSv1.3;
add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Content-Security-Policy "default-src 'self'..." always;
```

[IMAGE: Security Headers A+ score]

SSL used to terrify me. All that OpenSSL documentation? Nightmare fuel. But Let's Encrypt with DNS-01? *Chef's kiss.*

Free, automatic, more secure than paid certificates. This alone saves me $150/year.

---

**🏆 Want the SSL configuration that earned A+ ratings?**

Complete setup with security headers and automation:
👉 **[SSL/TLS Implementation Guide](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html#ssltls-configuration-the-dns-01-challenge-story)**

---

## The 2 AM Debugging Story

At 2 AM on a Tuesday, my recipe app went down.

UptimeRobot alert: "recipe.vladbortnik.dev is DOWN."

Half-asleep, I SSH'd in. Nginx: 502 errors. Docker: container running fine according to `docker ps`.

*What the hell?*

After an hour: the app had silently crashed *inside* the container. The process was running, but not responding. Docker thought everything was fine.

**The fix:** Health checks.

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5002/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Now Docker actively monitors if the app responds. If health checks fail, automatic restart.

Zero silent failures since.

Look, I'm not going to sugarcoat this—the first time I set up Docker networking, I spent three hours Googling why containers couldn't talk to each other. The answer was embarrassingly simple: I forgot to put them on the same network.

Three months in, I still forget some Docker syntax and check my notes. It's fine. Nobody remembers everything.

---

**🛠️ Want the troubleshooting playbook?**

Solutions to 15+ common issues (including the obscure ones):
👉 **[Complete Troubleshooting Guide](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html#common-issues-and-how-i-fixed-them)**

---

## The Real Economics

Let me be honest about the actual costs and value.

**What I was paying:**
- Heroku (3 apps): $21/month
- Database hosting: $15/month
- Custom domains/SSL: $9/month
- **Total: $45/month = $540/year**

**What I pay now:**
- DigitalOcean droplet: $12/month
- Automated backups: $2.40/month
- **Total: $14.40/month = $173/year**

**Savings: $367/year**

Is this going to make you rich? No.

But $367/year buys:
• Udemy courses for skill development
• Better development tools
• Conference tickets
• Or just... 30 nice dinners

**The real ROI is the skills.**

In job interviews, I can confidently discuss:
• Docker orchestration and networking
• Nginx configuration and reverse proxying
• SSL/TLS implementation
• Security best practices
• Infrastructure troubleshooting

That knowledge is worth far more than $367/year.

## What I'd Do Differently

If I started over:

**1. Document as You Build**

I spent hours later trying to remember commands. Keep a running log in a simple markdown file.

**2. Start With One App, Perfect It**

I tried to migrate all three at once. Bad idea. Deploy one simple app first, get security right, then add more.

**3. Backups From Day One**

I waited two weeks. That was stupid. Enable DigitalOcean automated snapshots immediately. And **test restoration** within the first week. Untested backups are useless.

**4. Monitoring Before Problems**

Install UptimeRobot and Netdata before you have issues, not after your site goes down. UptimeRobot has saved me twice by alerting before users noticed.

**5. Security Headers From the Start**

I initially deployed with basic config. Got B rating on SSL Labs. Adding headers later meant updating, testing, fixing CSP violations. Do it right from the start.

## Performance Wins That Actually Mattered

I tried many optimizations. Three made huge impact:

**1. Nginx Caching for Static Assets**

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2|svg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

Page load time: 1.2s → 480ms

**2. Gzip Compression**

```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
```

Transfer size reduction: 60-70% for text resources

**3. Database Connection Pooling**

```python
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
}
```

Response time under load: 400ms → 120ms

---

**⚡ Want all the performance optimization techniques?**

Complete guide to caching, compression, and database optimization:
👉 **[Performance Optimization Guide](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html#performance-optimization-what-actually-worked)**

---

## Getting Started: Your Path Forward

Time investment varies by experience:
• **Already know Docker/Nginx:** One focused evening
• **Learning as you go:** A couple of weekends
• **Your pace, your timeline**

**Weekend 1: Foundation**
- Spin up the DigitalOcean droplet
- Deploy your first app
- Basic security setup (SSH keys, firewall)

**Weekend 2: Production Polish**
- Add SSL certificates
- Configure monitoring (UptimeRobot, Netdata)
- Deploy second app

**Ongoing: 30 minutes/month maintenance**
- Check logs and disk usage
- Update packages monthly
- Verify backups are running

The full guide walks you through every step, with troubleshooting for common issues.

---
---

## 🚀 Ready to Build Your Production-Grade Portfolio Infrastructure?

This article gives you the overview and architecture approach.

**The complete guide gives you:**
✅ Every configuration file (Nginx, Docker, SSL, security)
✅ Step-by-step setup instructions  
✅ Troubleshooting for 15+ common issues
✅ Security hardening checklist
✅ Performance optimization techniques
✅ My exact server setup, fully documented

**👉 [Get the Complete Guide: Production-Grade Multi-App Server for $12/Month](https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html)**

**⭐ GitHub Repository:** [All configuration files and scripts](https://github.com/vladbortnik/production-server-infrastructure)

---
---

## Let's Connect

Questions about the setup? Want to discuss infrastructure approaches?

Drop a comment or DM me—I respond to everyone.

**Find me:**
• 🌐 Portfolio & Blog: [vladbortnik.dev](https://vladbortnik.dev)
• 💻 GitHub: [@vladbortnik](https://github.com/vladbortnik)
• 💼 LinkedIn: [/in/vladbortnik](https://linkedin.com/in/vladbortnik)
• 🐦 X/Twitter: [@vladbortnik_dev](https://x.com/vladbortnik_dev)

---

If this was valuable, share it with a developer who wants to level up their DevOps skills and build a professional portfolio infrastructure.

---

#DevOps #Docker #Nginx #WebDevelopment #SoftwareEngineering #CloudInfrastructure #PortfolioProjects #LearningInPublic #TechSkills #InfrastructureAsCode