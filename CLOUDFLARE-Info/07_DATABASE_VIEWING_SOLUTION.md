# PostgreSQL Database Viewing Solution for Recipe App

**Document Created:** November 10, 2025
**Target Application:** Recipe Web App (https://github.com/vladbortnik/recipe-web-app)
**Database:** PostgreSQL on DigitalOcean Droplet (Docker containerized)

---

## Executive Summary

**RECOMMENDED SOLUTION: DBeaver Community Edition**

After analyzing multiple database viewing options, **DBeaver Community** is the best solution for safely viewing your Recipe app's production PostgreSQL database. It provides:

- ✅ **Zero server footprint** - runs locally on your machine
- ✅ **Built-in SSH tunneling** - secure access without exposing database ports
- ✅ **Intuitive UI** - easy browsing, querying, and data export
- ✅ **Free and open source** - no licensing costs
- ✅ **Cross-platform** - macOS, Windows, Linux support
- ✅ **One-time setup** - save connection profiles for quick access

**Alternative Solutions:**
- **Adminer** - Lightweight web-based option (deploy as Docker container)
- **pgAdmin 4** - Feature-rich but heavier (for advanced database work)
- **Manual SSH Tunnel** - For command-line enthusiasts

---

## Table of Contents

1. [Primary Solution: DBeaver Community](#primary-solution-dbeaver-community)
2. [Alternative Solution: Adminer](#alternative-solution-adminer)
3. [Alternative Solution: pgAdmin 4](#alternative-solution-pgadmin-4)
4. [Manual SSH Tunnel Method](#manual-ssh-tunnel-method)
5. [Security Best Practices](#security-best-practices)
6. [Common Database Tasks](#common-database-tasks)
7. [Troubleshooting](#troubleshooting)

---

## Primary Solution: DBeaver Community

### Overview

DBeaver is a professional, cross-platform database management tool with excellent PostgreSQL support. It connects to your remote database via SSH tunnel, keeping your database secure while providing a beautiful GUI for browsing and querying data.

### Installation

#### macOS (Homebrew)
```bash
brew install --cask dbeaver-community
```

#### macOS (Direct Download)
1. Visit https://dbeaver.io/download/
2. Download "DBeaver Community" for macOS
3. Open the DMG file and drag to Applications folder

#### Windows
1. Visit https://dbeaver.io/download/
2. Download "DBeaver Community" installer
3. Run installer and follow prompts

#### Linux (Ubuntu/Debian)
```bash
sudo add-apt-repository ppa:serge-rider/dbeaver-ce
sudo apt update
sudo apt install dbeaver-ce
```

### Setup Instructions

#### Step 1: Gather Connection Information

You'll need the following information from your DigitalOcean droplet:

**SSH Connection:**
- Droplet IP address: `your-droplet-ip`
- SSH username: `root` or your sudo user
- SSH private key path: `~/.ssh/id_rsa` (or your key location)
- SSH port: `22` (default)

**Database Connection:**
- Database name: `recipe_db` (from your `.env` file)
- Database user: Found in `.env` as `DATABASE_URL`
- Database password: Found in `.env` as `DATABASE_URL`
- Database host: `localhost` (after SSH tunnel)
- Database port: `5432` (PostgreSQL default)

**Finding Database Credentials:**

SSH into your droplet and check the environment file:

```bash
ssh root@your-droplet-ip
cd /path/to/recipe-app
cat .env | grep DATABASE_URL
```

The `DATABASE_URL` format is: `postgresql://USER:PASSWORD@HOST:PORT/DBNAME`

Example: `postgresql://recipe_user:mysecretpass@db:5432/recipe_db`

Extract:
- User: `recipe_user`
- Password: `mysecretpass`
- Database: `recipe_db`

#### Step 2: Create New Connection in DBeaver

1. **Launch DBeaver** and click "New Database Connection" (plug icon) or go to `Database > New Database Connection`

2. **Select PostgreSQL:**
   - Choose "PostgreSQL" from the database list
   - Click "Next"

3. **Configure Main Settings:**

   **Connection Settings Tab:**
   - **Host:** `localhost` (this will be tunneled through SSH)
   - **Port:** `5432`
   - **Database:** `recipe_db`
   - **Username:** Your database user (e.g., `recipe_user`)
   - **Password:** Your database password
   - Check "Save password locally" for convenience

4. **Configure SSH Tunnel:**

   Click on the **"SSH"** tab at the top:

   - ☑️ **Check "Use SSH Tunnel"**

   **SSH Settings:**
   - **Host/IP:** Your DigitalOcean droplet IP
   - **Port:** `22`
   - **User Name:** `root` (or your SSH user)
   - **Authentication Method:** `Public Key`
   - **Private Key:** Browse to your SSH key (e.g., `~/.ssh/id_rsa`)
   - **Passphrase:** Enter if your key has one (leave blank if not)

5. **Test Connection:**
   - Click "Test Connection" button at the bottom
   - If successful, you'll see "Connected" message
   - Click "Finish" to save the connection

#### Step 3: Connect and Browse Database

1. **Open Connection:**
   - In the "Database Navigator" panel (left side), expand your new connection
   - Expand "Databases" → "recipe_db" → "Schemas" → "public" → "Tables"

2. **View Tables:**
   - You should see your SQLAlchemy tables (users, recipes, ingredients, etc.)
   - Double-click any table to view its data

3. **Browse Data:**
   - Data appears in grid view (like Excel)
   - Use filters, sorting, and search functionality
   - Navigate between tables using the tree view

### What You'll See in DBeaver

**Database Structure:**
```
recipe_db/
├── Schemas/
│   └── public/
│       ├── Tables/
│       │   ├── alembic_version         # Migration tracking
│       │   ├── users                    # User accounts
│       │   ├── recipes                  # Recipe entries
│       │   ├── ingredients              # Recipe ingredients
│       │   ├── user_favorites           # Saved recipes
│       │   └── ...                      # Other app tables
│       ├── Views/
│       ├── Sequences/
│       └── Indexes/
```

**Data Grid Features:**
- Sortable columns (click header)
- Filterable data (right-click column → Filter)
- Copy/export data (right-click → Export)
- View foreign key relationships
- Edit data directly (if needed)

### Common DBeaver Operations

#### Running SQL Queries

1. Right-click your database connection → "SQL Editor" → "New SQL Script"
2. Type your query:
   ```sql
   SELECT * FROM users LIMIT 10;
   ```
3. Press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (macOS) to execute
4. Results appear in the bottom panel

#### Viewing Table Structure

1. Right-click any table → "View Table"
2. Click tabs to see:
   - **Data:** Table contents
   - **Columns:** Field definitions and types
   - **Constraints:** Primary keys, foreign keys
   - **Indexes:** Database indexes
   - **DDL:** CREATE TABLE statement

#### Exporting Data

1. Right-click table → "Export Data"
2. Choose format: CSV, JSON, SQL, Excel, etc.
3. Configure export options
4. Click "Start" to download

#### Generating ER Diagram

1. Right-click database → "View Diagram"
2. DBeaver generates entity-relationship diagram
3. See table relationships and foreign keys visually
4. Export diagram as image if needed

---

## Alternative Solution: Adminer

### Overview

Adminer is a lightweight, single-file database management tool that runs in a web browser. It's perfect for quick database access and can be deployed as a temporary Docker container alongside your Recipe app.

### Pros and Cons

**Pros:**
- Extremely lightweight (~500KB single PHP file)
- Web-based (access from any browser)
- Supports multiple database types
- Beautiful, intuitive interface
- Can run temporarily when needed

**Cons:**
- Requires PHP and web server
- Adds a service to your production environment
- Security risk if not properly configured
- Needs to be explicitly stopped/removed after use

### Setup Method 1: Docker Container (Recommended)

This method runs Adminer as a temporary container on your DigitalOcean droplet.

#### Step 1: SSH into Your Droplet

```bash
ssh root@your-droplet-ip
```

#### Step 2: Run Adminer Container

```bash
docker run -d \
  --name adminer \
  --network recipe-app_backend \
  -p 8080:8080 \
  adminer:latest
```

**Explanation:**
- `--network recipe-app_backend`: Connects to same network as your database
- `-p 8080:8080`: Exposes Adminer on port 8080
- `adminer:latest`: Uses official Adminer image

#### Step 3: Create SSH Tunnel to Access Adminer

On your **local machine**, create an SSH tunnel:

```bash
ssh -L 8080:localhost:8080 root@your-droplet-ip
```

Keep this terminal window open.

#### Step 4: Access Adminer in Browser

1. Open browser and go to: `http://localhost:8080`
2. Login with database credentials:
   - **System:** `PostgreSQL`
   - **Server:** `db` (the Docker container name)
   - **Username:** Your database user
   - **Password:** Your database password
   - **Database:** `recipe_db`
3. Click "Login"

#### Step 5: Browse Database

You'll see:
- Tables list on the left
- Click table to view data
- SQL query box at top
- Export options for each table

#### Step 6: Stop and Remove Adminer (Important!)

When done, **always remove the Adminer container**:

```bash
docker stop adminer
docker rm adminer
```

### Setup Method 2: Nginx Integration

For more permanent setup, you can integrate Adminer into your existing Nginx configuration with authentication.

#### Step 1: Add Adminer to Docker Compose

Edit your `docker-compose.yml`:

```yaml
services:
  # ... existing services ...

  adminer:
    image: adminer:latest
    container_name: adminer
    restart: unless-stopped
    networks:
      - backend
    ports:
      - "8080:8080"
    environment:
      ADMINER_DEFAULT_SERVER: db
```

#### Step 2: Configure Nginx with Basic Auth

Create password file on droplet:

```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

Enter a strong password when prompted.

Edit Nginx configuration to add Adminer location:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    # ... existing SSL configuration ...

    location /adminer/ {
        auth_basic "Database Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

Access at: `https://your-domain.com/adminer/`

**⚠️ Security Warning:** Even with basic auth, exposing database tools to the internet is risky. Use strong passwords and consider IP whitelisting.

---

## Alternative Solution: pgAdmin 4

### Overview

pgAdmin 4 is the official PostgreSQL administration tool with comprehensive features for database management, query optimization, and schema design.

### When to Use pgAdmin

Choose pgAdmin if you need:
- Advanced query optimization tools
- Visual query builder
- Schema design and ER diagrams
- Backup and restore capabilities
- Multiple database management
- Server monitoring and statistics

### Installation

#### macOS
```bash
brew install --cask pgadmin4
```

Or download from: https://www.pgadmin.org/download/

#### Windows
Download installer from: https://www.pgadmin.org/download/

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/pgadmin.gpg
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/pgadmin.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'
sudo apt update
sudo apt install pgadmin4-desktop
```

### Setup Instructions

#### Step 1: Create SSH Tunnel

On your local machine:

```bash
ssh -L 5433:localhost:5432 root@your-droplet-ip -N
```

**Note:** Using port 5433 locally to avoid conflicts with local PostgreSQL if you have one.

Keep this terminal open while using pgAdmin.

#### Step 2: Configure pgAdmin Connection

1. Launch pgAdmin 4
2. Right-click "Servers" → "Register" → "Server"

**General Tab:**
- Name: `Recipe App Production`

**Connection Tab:**
- Host: `localhost`
- Port: `5433` (the local tunnel port)
- Maintenance database: `recipe_db`
- Username: Your database user
- Password: Your database password
- ☑️ Save password

**SSH Tunnel Tab:**
- Leave empty (tunnel is already created manually)

3. Click "Save"

#### Step 3: Browse Database

- Expand server → Databases → recipe_db → Schemas → public → Tables
- Right-click table → "View/Edit Data" → "All Rows"
- Use Query Tool for custom SQL: Tools → Query Tool

### pgAdmin Features

**Query Tool:**
- Syntax highlighting
- Query history
- Explain/Analyze plans
- Export results to CSV/JSON

**Schema Visualization:**
- ER diagrams via ERD Tool
- Dependency graphs
- Object browser with properties

**Backup & Restore:**
- Right-click database → Backup
- Choose format (Custom, Tar, Plain SQL)
- Configure backup options

---

## Manual SSH Tunnel Method

For those comfortable with command line, you can create an SSH tunnel and use any PostgreSQL client.

### Step 1: Create SSH Tunnel

```bash
ssh -L 5432:localhost:5432 root@your-droplet-ip -N
```

Or if your database is only accessible within Docker network:

```bash
# First, find the PostgreSQL container
ssh root@your-droplet-ip
docker ps | grep postgres

# Create tunnel to Docker container
ssh -L 5432:172.18.0.2:5432 root@your-droplet-ip -N
```

Replace `172.18.0.2` with your actual database container IP (use `docker inspect <container_id>`).

### Step 2: Connect with psql

```bash
psql -h localhost -p 5432 -U recipe_user -d recipe_db
```

Enter password when prompted.

### Step 3: Common psql Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d users

-- View table data
SELECT * FROM users LIMIT 10;

-- Count records
SELECT COUNT(*) FROM recipes;

-- Export query to CSV
\copy (SELECT * FROM recipes) TO 'recipes.csv' CSV HEADER;

-- Quit psql
\q
```

### Step 4: Close Tunnel

Press `Ctrl+C` in the SSH tunnel terminal to close the connection.

---

## Security Best Practices

### 1. Never Expose Database Port Directly

**❌ Don't do this:**
```bash
# Bad: Opening PostgreSQL to the internet
sudo ufw allow 5432
```

**✅ Do this:**
```bash
# Good: Use SSH tunnel for secure access
ssh -L 5432:localhost:5432 user@server
```

### 2. Create Read-Only Database User

For viewing data, create a read-only user to prevent accidental modifications:

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Access PostgreSQL container
docker exec -it recipe-app-db psql -U recipe_user -d recipe_db
```

Create read-only user:

```sql
-- Create read-only user
CREATE USER readonly_user WITH PASSWORD 'strong_password_here';

-- Grant connection privileges
GRANT CONNECT ON DATABASE recipe_db TO readonly_user;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO readonly_user;

-- Grant SELECT on all existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Grant SELECT on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO readonly_user;

-- Verify permissions
\du readonly_user
```

Now use `readonly_user` credentials in DBeaver/Adminer/pgAdmin to prevent accidental data modifications.

### 3. Use SSH Key Authentication

**Generate SSH key** (if you don't have one):

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

**Add public key to droplet:**

```bash
ssh-copy-id root@your-droplet-ip
```

**Configure DBeaver** to use private key (as shown in setup instructions above).

### 4. Enable Firewall on Droplet

Ensure only SSH port is open:

```bash
sudo ufw status
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Verify PostgreSQL port is NOT exposed:**

```bash
sudo ufw status | grep 5432
# Should return nothing
```

### 5. Use Strong Database Passwords

Update database password if it's weak:

```sql
-- SSH into droplet
docker exec -it recipe-app-db psql -U recipe_user -d recipe_db

-- Change password
ALTER USER recipe_user WITH PASSWORD 'new_strong_password_here';
```

Update `.env` file with new password and restart containers:

```bash
docker-compose down
docker-compose up -d
```

### 6. Monitor Database Access

Enable PostgreSQL logging to track connections:

Edit PostgreSQL configuration (if needed) or check Docker logs:

```bash
# View PostgreSQL logs
docker logs recipe-app-db -f

# Check for connections
docker exec -it recipe-app-db psql -U recipe_user -d recipe_db -c "SELECT * FROM pg_stat_activity;"
```

### 7. Regular Backups

**Automated backup script:**

Create `/root/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/recipe_db_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

docker exec recipe-app-db pg_dump -U recipe_user recipe_db | gzip > $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "recipe_db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

Make executable and add to cron:

```bash
chmod +x /root/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /root/backup-db.sh
```

### 8. Temporary Adminer Access Only

If using Adminer, **always remove** after use:

```bash
docker stop adminer && docker rm adminer
```

Never leave database admin tools running permanently in production.

---

## Common Database Tasks

### Browsing Tables

**DBeaver:**
1. Navigate to table in Database Navigator
2. Double-click table name
3. Data appears in grid view

**Adminer:**
1. Click "SQL command" link
2. Click table name in left sidebar
3. Data displays in table view

**pgAdmin:**
1. Right-click table → "View/Edit Data" → "All Rows"

### Running Custom Queries

**DBeaver:**
```sql
-- Find all recipes by a specific user
SELECT r.id, r.title, r.description, u.username
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE u.username = 'john_doe'
ORDER BY r.created_at DESC;

-- Count recipes by user
SELECT u.username, COUNT(r.id) as recipe_count
FROM users u
LEFT JOIN recipes r ON u.id = r.user_id
GROUP BY u.username
ORDER BY recipe_count DESC;

-- Find most popular recipes (by favorites)
SELECT r.title, COUNT(uf.id) as favorite_count
FROM recipes r
LEFT JOIN user_favorites uf ON r.id = uf.recipe_id
GROUP BY r.id, r.title
ORDER BY favorite_count DESC
LIMIT 10;
```

### Exporting Data

**DBeaver - Export to CSV:**
1. Right-click table → "Export Data"
2. Choose format: "CSV"
3. Configure:
   - Column delimiter: `,` (comma)
   - Row delimiter: `\n` (newline)
   - Header: Yes
4. Click "Proceed" → "Start"

**DBeaver - Export to JSON:**
1. Right-click table → "Export Data"
2. Choose format: "JSON"
3. Configure formatting options
4. Click "Proceed" → "Start"

**pgAdmin - Export Query Results:**
1. Run query in Query Tool
2. Click "Download as CSV" icon (⬇️) in results panel

**Adminer - Export:**
1. Select table
2. Click "Export" link at top
3. Choose format (CSV, SQL, etc.)
4. Click "Export"

### Viewing Table Relationships

**DBeaver - ER Diagram:**
1. Right-click database → "View Diagram"
2. Drag tables of interest into diagram
3. DBeaver shows foreign key relationships
4. Right-click → "Export Diagram" to save as image

**pgAdmin - Dependencies:**
1. Right-click table → "Properties"
2. Click "Dependencies" tab
3. See related objects

### Searching Data

**DBeaver - Global Search:**
1. Press `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (macOS)
2. Enter search term
3. Choose tables to search
4. View results

**SQL Search Across Tables:**
```sql
-- Search for email in users table
SELECT * FROM users WHERE email ILIKE '%example.com%';

-- Search for recipe title
SELECT * FROM recipes WHERE title ILIKE '%chocolate%';

-- Full-text search (if enabled)
SELECT * FROM recipes WHERE to_tsvector(title || ' ' || description) @@ to_tsquery('pasta');
```

### Analyzing Database Size

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('recipe_db'));

-- Table sizes
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Row counts
SELECT
    schemaname,
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

### Checking Database Performance

```sql
-- Active connections
SELECT * FROM pg_stat_activity WHERE datname = 'recipe_db';

-- Slow queries (if logging enabled)
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## Troubleshooting

### Connection Issues

#### Problem: "Connection refused" or "Connection timeout"

**Possible causes:**
1. SSH tunnel not established
2. Wrong host/port configuration
3. Firewall blocking connection

**Solutions:**

1. **Verify SSH tunnel is running:**
   ```bash
   ps aux | grep ssh
   # Should show your SSH tunnel process
   ```

2. **Test SSH connection first:**
   ```bash
   ssh root@your-droplet-ip
   # If this fails, fix SSH before trying database
   ```

3. **Check if database container is running:**
   ```bash
   ssh root@your-droplet-ip
   docker ps | grep postgres
   # Should show running PostgreSQL container
   ```

4. **Verify database port in DBeaver:**
   - Should be `localhost:5432` (or your tunnel local port)
   - NOT your droplet's IP address

#### Problem: "Authentication failed"

**Solutions:**

1. **Verify credentials from .env file:**
   ```bash
   ssh root@your-droplet-ip
   cat /path/to/recipe-app/.env | grep DATABASE_URL
   ```

2. **Test credentials with psql:**
   ```bash
   docker exec -it recipe-app-db psql -U recipe_user -d recipe_db
   # If this works, credentials are correct
   ```

3. **Check if user exists:**
   ```sql
   docker exec -it recipe-app-db psql -U postgres -d recipe_db -c "\du"
   ```

#### Problem: "Database does not exist"

**Solutions:**

1. **List available databases:**
   ```bash
   docker exec -it recipe-app-db psql -U recipe_user -l
   ```

2. **Check database name in .env:**
   ```bash
   cat .env | grep DATABASE_URL
   # Confirm database name matches
   ```

### DBeaver Specific Issues

#### Problem: "Driver not found" or "Download driver files?"

**Solution:**
- Click "Download" when prompted
- DBeaver will automatically download PostgreSQL JDBC driver
- Restart connection attempt

#### Problem: SSH tunnel fails with "Permission denied (publickey)"

**Solutions:**

1. **Verify SSH key path in DBeaver:**
   - SSH tab → Private Key → Browse to correct key
   - Common locations: `~/.ssh/id_rsa` or `~/.ssh/id_ed25519`

2. **Test SSH key manually:**
   ```bash
   ssh -i ~/.ssh/id_rsa root@your-droplet-ip
   ```

3. **Check key permissions:**
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

#### Problem: Connection works but no tables visible

**Solutions:**

1. **Check schema:**
   - Navigate to Databases → recipe_db → Schemas → public → Tables
   - Tables might be in different schema

2. **Refresh database:**
   - Right-click connection → "Refresh"

3. **Check permissions:**
   ```sql
   -- Run in SQL editor
   SELECT * FROM information_schema.tables WHERE table_schema = 'public';
   ```

### Adminer Specific Issues

#### Problem: Cannot access Adminer on localhost:8080

**Solutions:**

1. **Verify Adminer container is running:**
   ```bash
   docker ps | grep adminer
   ```

2. **Check SSH tunnel:**
   ```bash
   ssh -L 8080:localhost:8080 root@your-droplet-ip
   # Keep this running
   ```

3. **Try different port if 8080 is in use:**
   ```bash
   # On droplet
   docker run -d --name adminer --network recipe-app_backend -p 8081:8080 adminer

   # On local machine
   ssh -L 8081:localhost:8081 root@your-droplet-ip

   # Access at http://localhost:8081
   ```

#### Problem: Login fails with "Unknown database"

**Solution:**
- Server should be `db` (Docker container name), not `localhost`
- If that doesn't work, find actual container name:
  ```bash
  docker ps | grep postgres
  # Use container name in "Server" field
  ```

### Performance Issues

#### Problem: Queries are very slow

**Solutions:**

1. **Add LIMIT to large queries:**
   ```sql
   SELECT * FROM large_table LIMIT 100;
   ```

2. **Check table indexes:**
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'your_table';
   ```

3. **Analyze query performance:**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM recipes WHERE user_id = 123;
   ```

### General Tips

1. **Always close connections when done** to free up resources
2. **Use read-only user** for browsing to prevent accidents
3. **Test connections on non-production database first** if possible
4. **Keep DBeaver updated** for latest features and security patches
5. **Document your connection profiles** for team members

---

## Quick Reference

### DBeaver Keyboard Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Execute query | `Cmd+Enter` | `Ctrl+Enter` |
| New SQL script | `Cmd+Shift+N` | `Ctrl+Shift+N` |
| Format SQL | `Cmd+Shift+F` | `Ctrl+Shift+F` |
| Auto-complete | `Cmd+Space` | `Ctrl+Space` |
| Comment line | `Cmd+/` | `Ctrl+/` |
| Find | `Cmd+F` | `Ctrl+F` |

### SSH Tunnel Commands

```bash
# Standard tunnel (PostgreSQL)
ssh -L 5432:localhost:5432 root@your-droplet-ip -N

# Custom local port
ssh -L 5433:localhost:5432 root@your-droplet-ip -N

# Tunnel for Adminer
ssh -L 8080:localhost:8080 root@your-droplet-ip -N

# Background tunnel (add -f flag)
ssh -f -L 5432:localhost:5432 root@your-droplet-ip -N

# Kill background tunnel
ps aux | grep "ssh -f"
kill <PID>
```

### Useful SQL Queries

```sql
-- List all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- Table row counts
SELECT schemaname,tablename,n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Recent records
SELECT * FROM recipes ORDER BY created_at DESC LIMIT 10;

-- User statistics
SELECT
    u.username,
    COUNT(DISTINCT r.id) as recipe_count,
    COUNT(DISTINCT uf.id) as favorite_count
FROM users u
LEFT JOIN recipes r ON u.id = r.user_id
LEFT JOIN user_favorites uf ON u.id = uf.user_id
GROUP BY u.id, u.username
ORDER BY recipe_count DESC;

-- Search across multiple columns
SELECT * FROM recipes
WHERE title ILIKE '%search_term%'
   OR description ILIKE '%search_term%'
LIMIT 50;
```

---

## Summary & Recommendation

**For Easy, Secure Database Viewing:**

1. **Install DBeaver Community** (free, cross-platform)
2. **Configure SSH tunnel** within DBeaver (one-time setup)
3. **Save connection profile** for quick access
4. **Use read-only user** for safety
5. **Browse, query, and export data** easily

**Total Setup Time:** ~10 minutes
**Daily Usage:** Click connection → instant access

**Alternative for Quick Web Access:**

```bash
# On droplet
docker run -d --name adminer --network recipe-app_backend -p 8080:8080 adminer

# On local machine
ssh -L 8080:localhost:8080 root@your-droplet-ip

# Open browser: http://localhost:8080
# When done: docker stop adminer && docker rm adminer
```

---

## Additional Resources

- **DBeaver Documentation:** https://dbeaver.io/docs/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Adminer Website:** https://www.adminer.org/
- **pgAdmin Documentation:** https://www.pgadmin.org/docs/
- **SSH Tunneling Guide:** https://www.ssh.com/academy/ssh/tunneling

---

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Author:** Database Access Solution for Recipe App
**Status:** Production Ready
