# Deployment Checklist - Version 2

**Date:** November 10, 2025
**Status:** Ready for Deployment

---

## Files to Upload/Override on Remote Server

### 1. HTML Files (3 files)
**Destination:** `/var/www/vladbortnik.dev/html/`

```
index.html                  (Modified - removed inline scripts)
contact.html                (Modified - added Turnstile test key for localhost)
```

**Optional (if modified):**
```
server-setup.html          (Only if you made changes)
blog/index.html            (Only if you made changes)
blog/posts/1-production-grade-multi-app-server-12-dollar-month.html
```

### 2. JavaScript Files (2 NEW files)
**Destination:** `/var/www/vladbortnik.dev/html/assets/js/`

```
assets/js/analytics.js      (NEW - PostHog + Umami)
assets/js/utils.js          (NEW - Copyright year updater)
```

### 3. Nginx Configuration (1 file)
**Destination:** `/etc/nginx/sites-available/`

```
vladbortnik.dev            (Modified - Updated CSP with PostHog domains)
```

---

## Upload Commands

### Option A: Using SCP (Secure Copy)

```bash
# From your local machine (in project directory)

# 1. Upload HTML files
scp index.html contact.html user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/

# 2. Upload NEW JavaScript files
scp assets/js/analytics.js assets/js/utils.js user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/assets/js/

# 3. Upload Nginx config (to /tmp first for safety)
scp vladbortnik.dev user@YOUR_SERVER_IP:/tmp/
```

### Option B: Using SFTP (FileZilla, Cyberduck, etc.)

**Local paths → Remote paths:**

| Local File | Remote Destination |
|------------|-------------------|
| `index.html` | `/var/www/vladbortnik.dev/html/index.html` |
| `contact.html` | `/var/www/vladbortnik.dev/html/contact.html` |
| `assets/js/analytics.js` | `/var/www/vladbortnik.dev/html/assets/js/analytics.js` |
| `assets/js/utils.js` | `/var/www/vladbortnik.dev/html/assets/js/utils.js` |
| `vladbortnik.dev` | `/tmp/vladbortnik.dev` (then move with sudo) |

### Option C: Using rsync (Recommended for future syncs)

```bash
# Sync specific files
rsync -avz --progress \
  index.html \
  contact.html \
  assets/js/analytics.js \
  assets/js/utils.js \
  user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/

# Upload Nginx config to /tmp
rsync -avz --progress vladbortnik.dev user@YOUR_SERVER_IP:/tmp/
```

---

## Nginx Configuration Update - BEST METHOD

### Method 1: Manual Edit on Server (Safest) ✅ **RECOMMENDED**

```bash
# SSH into server
ssh user@YOUR_SERVER_IP

# Backup current config
sudo cp /etc/nginx/sites-available/vladbortnik.dev /etc/nginx/sites-available/vladbortnik.dev.backup-$(date +%Y%m%d)

# Edit config directly
sudo nano /etc/nginx/sites-available/vladbortnik.dev

# Find line 68 (location = / section)
# Replace this line:
#   OLD: script-src 'self' https://analytics.vladbortnik.dev https://cdn.jsdelivr.net https://challenges.cloudflare.com https://static.cloudflareinsights.com;
#   NEW: script-src 'self' https://analytics.vladbortnik.dev https://cdn.jsdelivr.net https://challenges.cloudflare.com https://static.cloudflareinsights.com https://us.i.posthog.com https://us-assets.i.posthog.com;

# Also update connect-src on same line:
#   OLD: connect-src 'self' https://analytics.vladbortnik.dev https://portfolio-contact-form.vladbortnik.workers.dev;
#   NEW: connect-src 'self' https://analytics.vladbortnik.dev https://portfolio-contact-form.vladbortnik.workers.dev https://us.i.posthog.com;

# Test config
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### Method 2: Upload and Replace (Faster but riskier)

```bash
# 1. Upload config to /tmp (already done with SCP above)

# 2. SSH into server
ssh user@YOUR_SERVER_IP

# 3. Backup current config
sudo cp /etc/nginx/sites-available/vladbortnik.dev /etc/nginx/sites-available/vladbortnik.dev.backup-$(date +%Y%m%d)

# 4. Move new config into place
sudo mv /tmp/vladbortnik.dev /etc/nginx/sites-available/vladbortnik.dev

# 5. Set correct permissions
sudo chown root:root /etc/nginx/sites-available/vladbortnik.dev
sudo chmod 644 /etc/nginx/sites-available/vladbortnik.dev

# 6. Test config
sudo nginx -t

# 7. If test passes, reload Nginx
sudo systemctl reload nginx

# 8. If test fails, restore backup
sudo cp /etc/nginx/sites-available/vladbortnik.dev.backup-$(date +%Y%m%d) /etc/nginx/sites-available/vladbortnik.dev
sudo nginx -t
sudo systemctl reload nginx
```

### Method 3: Using sed (One-liner for experts)

```bash
# SSH into server
ssh user@YOUR_SERVER_IP

# Backup
sudo cp /etc/nginx/sites-available/vladbortnik.dev /etc/nginx/sites-available/vladbortnik.dev.backup-$(date +%Y%m%d)

# Update script-src
sudo sed -i 's|script-src '\''self'\'' https://analytics.vladbortnik.dev https://cdn.jsdelivr.net https://challenges.cloudflare.com https://static.cloudflareinsights.com|script-src '\''self'\'' https://analytics.vladbortnik.dev https://cdn.jsdelivr.net https://challenges.cloudflare.com https://static.cloudflareinsights.com https://us.i.posthog.com https://us-assets.i.posthog.com|g' /etc/nginx/sites-available/vladbortnik.dev

# Update connect-src
sudo sed -i 's|connect-src '\''self'\'' https://analytics.vladbortnik.dev https://portfolio-contact-form.vladbortnik.workers.dev|connect-src '\''self'\'' https://analytics.vladbortnik.dev https://portfolio-contact-form.vladbortnik.workers.dev https://us.i.posthog.com|g' /etc/nginx/sites-available/vladbortnik.dev

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

---

## Exact Changes Made to Line 68

### BEFORE (Line 68):
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://analytics.vladbortnik.dev https://cdn.jsdelivr.net https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://analytics.vladbortnik.dev https://portfolio-contact-form.vladbortnik.workers.dev; object-src 'none'; base-uri 'self'; form-action 'self' https://portfolio-contact-form.vladbortnik.workers.dev; frame-ancestors 'none';" always;
```

### AFTER (Line 68):
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://analytics.vladbortnik.dev https://cdn.jsdelivr.net https://challenges.cloudflare.com https://static.cloudflareinsights.com https://us.i.posthog.com https://us-assets.i.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://analytics.vladbortnik.dev https://portfolio-contact-form.vladbortnik.workers.dev https://us.i.posthog.com; object-src 'none'; base-uri 'self'; form-action 'self' https://portfolio-contact-form.vladbortnik.workers.dev; frame-ancestors 'none';" always;
```

### Added Domains:
- **script-src:** `https://us.i.posthog.com` (PostHog API)
- **script-src:** `https://us-assets.i.posthog.com` (PostHog CDN)
- **connect-src:** `https://us.i.posthog.com` (PostHog API calls)

---

## Deployment Steps (Complete Workflow)

### Step 1: Upload Files
```bash
# Upload HTML + JS files
scp index.html contact.html user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/
scp assets/js/analytics.js assets/js/utils.js user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/assets/js/
```

### Step 2: Update Nginx Config
```bash
# SSH into server
ssh user@YOUR_SERVER_IP

# Backup current config
sudo cp /etc/nginx/sites-available/vladbortnik.dev /etc/nginx/sites-available/vladbortnik.dev.backup-$(date +%Y%m%d)

# Edit line 68 (use nano or upload new config)
sudo nano /etc/nginx/sites-available/vladbortnik.dev
# Add PostHog domains to script-src and connect-src

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 3: Verify Deployment
```bash
# Check files exist
ls -la /var/www/vladbortnik.dev/html/index.html
ls -la /var/www/vladbortnik.dev/html/assets/js/analytics.js
ls -la /var/www/vladbortnik.dev/html/assets/js/utils.js

# Check Nginx config syntax
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs (if issues)
sudo tail -f /var/log/nginx/error.log
```

### Step 4: Test in Browser
1. Open: https://vladbortnik.dev/
2. Open DevTools Console (F12)
3. Check for CSP errors (should be NONE)
4. Verify analytics requests:
   - Network tab → Filter: "posthog"
   - Network tab → Filter: "umami"
5. Check copyright year in footer (should show 2025)
6. Test contact form with Turnstile

---

## Rollback Plan (If Issues Occur)

### Rollback HTML Files
```bash
# Restore from Git (if committed)
git checkout HEAD -- index.html contact.html
scp index.html contact.html user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/
```

### Rollback Nginx Config
```bash
# SSH into server
ssh user@YOUR_SERVER_IP

# Restore backup
sudo cp /etc/nginx/sites-available/vladbortnik.dev.backup-YYYYMMDD /etc/nginx/sites-available/vladbortnik.dev

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Remove New JS Files (if causing issues)
```bash
# On server
sudo rm /var/www/vladbortnik.dev/html/assets/js/analytics.js
sudo rm /var/www/vladbortnik.dev/html/assets/js/utils.js
```

---

## Post-Deployment Verification

### ✅ Homepage (index.html)
- [ ] No CSP violations in console
- [ ] PostHog analytics loading (Network tab)
- [ ] Umami analytics loading (Network tab)
- [ ] Copyright year shows 2025 in all 3 footers
- [ ] All sections load correctly

### ✅ Contact Page (contact.html)
- [ ] Turnstile CAPTCHA loads and works
- [ ] No 400 errors on localhost (uses test key)
- [ ] No 400 errors on production (uses real key)
- [ ] Form submission works

### ✅ SSL Labs Test
- [ ] Visit: https://www.ssllabs.com/ssltest/analyze.html?d=vladbortnik.dev
- [ ] Expected: A+ rating (with strict CSP on homepage)

### ✅ Nginx Status
```bash
# Check Nginx is running
sudo systemctl status nginx

# Check for config errors
sudo nginx -t

# Check error logs
sudo tail -50 /var/log/nginx/error.log
```

---

## Summary

**Files Modified:** 2 HTML, 1 Nginx config
**Files Created:** 2 JavaScript files
**Primary Change:** Moved inline scripts to external files for CSP compliance
**Secondary Change:** Added Turnstile test key for localhost development
**Nginx Change:** Added PostHog domains to CSP whitelist

**Expected Result:**
- ✅ A+ SSL Labs rating on homepage
- ✅ No CSP violations
- ✅ Analytics working correctly
- ✅ Turnstile working on localhost AND production

---

## Need Help?

If deployment issues occur:
1. Check Nginx error log: `sudo tail -f /var/log/nginx/error.log`
2. Check browser console for errors
3. Verify file permissions: `ls -la /var/www/vladbortnik.dev/html/`
4. Test Nginx config: `sudo nginx -t`
5. Restore backups if needed (see Rollback Plan above)
