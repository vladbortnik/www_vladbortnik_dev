# Testing & Deployment Guide

This guide covers how to test your blog locally and deploy it to production.

## 🧪 Testing Locally

### Option 1: Python HTTP Server (Recommended)

```bash
# Navigate to blog directory
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/

# Start server on port 8000
python3 -m http.server 8000

# Or use Python 2
python -m SimpleHTTPServer 8000
```

Then visit: http://localhost:8000

### Option 2: PHP Built-in Server

```bash
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/
php -S localhost:8000
```

### Option 3: Node.js http-server

```bash
# Install globally (one time)
npm install -g http-server

# Run server
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/
http-server -p 8000
```

### Option 4: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## ✅ Testing Checklist

### Homepage Tests

- [ ] **Page loads correctly**
  - All assets load (CSS, JavaScript, fonts)
  - No console errors
  - Background image displays

- [ ] **Search functionality**
  - Type in search box
  - Results filter in real-time
  - Search by title works
  - Search by tags works
  - "No results" message appears when appropriate

- [ ] **Category filtering**
  - Click each category filter
  - Posts filter correctly
  - Active state shows on selected filter
  - "All" filter shows all posts

- [ ] **Tag filtering**
  - Click each tag filter
  - Posts filter correctly
  - Can combine with category filter
  - Active state displays

- [ ] **Post cards**
  - All posts display
  - Images load (or fallback to default)
  - Reading time calculates
  - Date formats correctly
  - Tags are clickable
  - "Read More" button works

- [ ] **Responsive design**
  - Test on mobile (< 768px)
  - Test on tablet (768px - 1024px)
  - Test on desktop (> 1024px)
  - Grid adjusts properly

### Post Page Tests

- [ ] **Post loads correctly**
  - Markdown renders to HTML
  - Syntax highlighting works for code blocks
  - Images display properly
  - Headers have correct hierarchy

- [ ] **Metadata displays**
  - Title renders
  - Date formats correctly
  - Author name shows
  - Category badge displays
  - Tags are clickable

- [ ] **Navigation**
  - "Back to Blog" button works
  - Header navigation links work
  - Tag clicks redirect to filtered listing

- [ ] **SEO metadata**
  - Check page title in browser tab
  - Verify meta tags (use View Page Source)
  - Structured data is present

- [ ] **Comments section**
  - Placeholder or Giscus loads
  - Theme matches site design

### Cross-Browser Testing

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (Mac)
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Testing

```bash
# Check page load speed
curl -w "@curl-format.txt" -o /dev/null -s https://vladbortnik.dev/blog/

# curl-format.txt content:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Alt text on images
- [ ] Semantic HTML structure

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] All posts have correct metadata in `posts.json`
- [ ] All markdown files exist
- [ ] Sitemap.xml is updated
- [ ] Giscus is configured (if desired)
- [ ] Test everything locally
- [ ] No console errors
- [ ] Links all work
- [ ] Images load

### Deployment Steps

#### If using Git deployment:

```bash
# Navigate to project root
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/

# Check status
git status

# Add blog files
git add blog/

# Commit
git commit -m "Add blog functionality with posts and comments"

# Push to remote
git push origin main
```

#### If manually uploading via SFTP:

```bash
# Using scp
scp -r blog/ user@your-server:/var/www/html/

# Or use an FTP client like FileZilla
```

### Server Configuration

#### Nginx Configuration

Add to your nginx configuration:

```nginx
server {
    listen 80;
    server_name vladbortnik.dev www.vladbortnik.dev;
    root /var/www/html;
    
    # Main site
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Blog
    location /blog/ {
        try_files $uri $uri/ =404;
        
        # Enable CORS for API calls (if needed)
        add_header Access-Control-Allow-Origin "*";
        
        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Serve markdown files as text/plain
    location ~ \.md$ {
        default_type text/plain;
    }
}
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Apache Configuration

Add to `.htaccess` or virtual host:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /blog/
    
    # Cache static assets
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
</IfModule>
```

### DNS Configuration

Ensure your domain points to your server:

```bash
# Check DNS
dig vladbortnik.dev
nslookup vladbortnik.dev

# Verify A record
# vladbortnik.dev -> YOUR_SERVER_IP
```

### SSL/HTTPS Setup

If not already configured:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d vladbortnik.dev -d www.vladbortnik.dev

# Test auto-renewal
sudo certbot renew --dry-run
```

### Post-Deployment Verification

1. **Visit your blog**
   ```
   https://vladbortnik.dev/blog/
   ```

2. **Test all functionality**
   - Search works
   - Filters work
   - Posts load
   - Comments display (if configured)
   - Links work

3. **Check server logs**
   ```bash
   # Nginx
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   
   # Apache
   sudo tail -f /var/log/apache2/access.log
   sudo tail -f /var/log/apache2/error.log
   ```

4. **Verify HTTPS**
   ```bash
   curl -I https://vladbortnik.dev/blog/
   # Should return 200 OK
   ```

## 📊 Monitoring

### Google Search Console

1. **Add property**: `https://vladbortnik.dev`
2. **Submit sitemap**: 
   - Go to Sitemaps section
   - Add: `https://vladbortnik.dev/blog/sitemap.xml`
3. **Monitor indexing**

### Analytics

Your blog already includes Umami Analytics. To track specific events:

```javascript
// In your JavaScript
umami.track('blog-post-view', {
  slug: postSlug,
  title: postTitle
});

umami.track('search-used', {
  query: searchQuery
});
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Set up monitoring for:
```
https://vladbortnik.dev/blog/
```

### Performance Monitoring

Use Google PageSpeed Insights:
```
https://pagespeed.web.dev/
```

Test your blog:
```
https://pagespeed.web.dev/analysis?url=https://vladbortnik.dev/blog/
```

## 🐛 Debugging Production Issues

### Issue: 404 Not Found

```bash
# Check file exists
ls -la /var/www/html/blog/index.html

# Check permissions
chmod 644 /var/www/html/blog/index.html
chmod 755 /var/www/html/blog/

# Check nginx config
sudo nginx -t
```

### Issue: CSS/JS Not Loading

```bash
# Check browser console (F12)
# Look for CORS errors or 404s

# Verify file paths
ls -la /var/www/html/blog/assets/css/
ls -la /var/www/html/blog/assets/js/
```

### Issue: Posts Not Appearing

```bash
# Validate JSON
cd /var/www/html/blog/posts/
cat posts.json | python -m json.tool

# Check markdown files exist
ls -la *.md
```

### Issue: Slow Loading

```bash
# Check file sizes
du -sh /var/www/html/blog/posts/*.md

# Enable gzip compression in nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/javascript application/json;
```

## 🔄 Continuous Deployment

### Option 1: GitHub Actions

Create `.github/workflows/deploy-blog.yml`:

```yaml
name: Deploy Blog

on:
  push:
    branches: [main]
    paths:
      - 'blog/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          source: "blog/"
          target: "/var/www/html/"
```

### Option 2: Simple Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying blog..."

# Variables
SERVER="user@your-server.com"
REMOTE_PATH="/var/www/html/blog/"
LOCAL_PATH="./blog/"

# Sync files
rsync -avz --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.env' \
  $LOCAL_PATH $SERVER:$REMOTE_PATH

echo "✅ Deployment complete!"

# Reload nginx
ssh $SERVER "sudo systemctl reload nginx"

echo "✅ Nginx reloaded!"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📝 Maintenance Tasks

### Weekly

- [ ] Review new comments (if any)
- [ ] Check analytics for popular posts
- [ ] Verify all links work
- [ ] Check for 404 errors in logs

### Monthly

- [ ] Update sitemap.xml (if new posts)
- [ ] Update RSS feed
- [ ] Review performance metrics
- [ ] Check SSL certificate expiration
- [ ] Backup posts

### Quarterly

- [ ] Update dependencies (marked.js, highlight.js)
- [ ] Review and update old posts
- [ ] Analyze SEO performance
- [ ] Plan new content

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No sensitive data in public files
- [ ] `.env` files not committed
- [ ] File permissions correct (644 for files, 755 for directories)
- [ ] Server firewall configured
- [ ] SSH key authentication only
- [ ] Regular backups

### Security Headers (Nginx)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
```

## 🎉 Launch Checklist

Before announcing your blog:

- [ ] Test all features thoroughly
- [ ] Publish at least 3 quality posts
- [ ] Configure Giscus comments
- [ ] Set up analytics
- [ ] Submit sitemap to Google
- [ ] Verify social sharing (Open Graph tags)
- [ ] Test on multiple devices
- [ ] Add blog link to main website
- [ ] Announce on social media
- [ ] Share first post

---

**Questions?** Refer to README.md or open an issue.

**Last updated**: January 2025
