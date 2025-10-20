# Deployment Workflow

## Overview

Your portfolio has **two separate parts** that deploy differently:

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (Static Files)                        │
│  - index.html, contact.html                     │
│  - CSS, JavaScript, images                      │
│  Deploy: Git push / rsync / FTP                 │
└─────────────────────────────────────────────────┘
              ↓ (form submits to)
┌─────────────────────────────────────────────────┐
│  BACKEND (Cloudflare Worker)                    │
│  - cloudflare-worker-resend.js                  │
│  - Sends emails via Resend API                  │
│  Deploy: wrangler deploy                        │
└─────────────────────────────────────────────────┘
```

---

## Part 1: One-Time Setup (Do Once)

### Set API Keys (Secrets)

```bash
# Set Resend API key
wrangler secret put RESEND_API_KEY
# When prompted, paste: re_iBL41yGz_BT2XXXXXXXXXXXXXXXXXXXXX

# Set Turnstile secret key
wrangler secret put TURNSTILE_SECRET_KEY
# When prompted, paste: 0x4AAAAAAB6AEZXXXXXXXXXXXXXXXXXXXXX
```

**Note:** You only need to do this ONCE. Secrets are stored encrypted in Cloudflare.

---

## Part 2: Deploying Changes

### A) When You Change **HTML/CSS/JavaScript** (Frontend)

**Files affected:**

- `index.html`
- `contact.html`
- `assets/css/*`
- `assets/js/*`
- Images

**How to deploy:**

```bash
# Option 1: If using Git/GitHub Pages
git add .
git commit -m "Update contact page"
git push

# Option 2: If using rsync to server
rsync -avz --exclude 'node_modules' . user@server:/var/www/html/

# Option 3: If using FTP
# Upload files via FileZilla/Cyberduck
```

**Do NOT run `wrangler deploy` for HTML/CSS changes!**

---

### B) When You Change **Cloudflare Worker** (Backend)

**Files affected:**

- `cloudflare-worker-resend.js`
- Form validation logic
- Email sending logic

**How to deploy:**

**Option 1: Using the script (Recommended)**

```bash
./deploy-worker.sh
```

**Option 2: Manual command**

```bash
wrangler deploy
```

**That's it!** Your Worker is now live globally.

---

## Typical Workflow Examples

### Example 1: Change Contact Form Color

```bash
# 1. Edit contact.css
vim assets/css/contact.css

# 2. Deploy frontend (NOT Worker)
git add assets/css/contact.css
git commit -m "Update contact form colors"
git push

# ❌ NO need to run: wrangler deploy
```

### Example 2: Change Email Template in Worker

```bash
# 1. Edit Worker
vim cloudflare-worker-resend.js

# 2. Deploy Worker
./deploy-worker.sh

# ✅ Worker deployed, changes live immediately
```

### Example 3: Update Both Frontend and Backend

```bash
# 1. Edit both files
vim contact.html
vim cloudflare-worker-resend.js

# 2. Deploy frontend
git add contact.html
git commit -m "Update contact form"
git push

# 3. Deploy Worker
./deploy-worker.sh

# ✅ Both deployed separately
```

---

## Quick Reference

| What Changed?          | Deploy Command        | How Often?                     |
| ---------------------- | --------------------- | ------------------------------ |
| **Secrets** (API keys) | `wrangler secret put` | Once (or when rotating keys)   |
| **HTML/CSS/JS**        | `git push` or `rsync` | Every time you change frontend |
| **Worker** (backend)   | `./deploy-worker.sh`  | Every time you change Worker   |

---

## Checking Deployment Status

### Worker Status

```bash
# List all your Workers
wrangler deployments list

# View Worker logs (real-time)
wrangler tail

# View secrets
wrangler secret list
```

### Worker URL

```
https://portfolio-contact-form.vladbortnik.workers.dev
```

---

## Troubleshooting

### "Worker not found"

```bash
# Make sure wrangler.toml exists
cat wrangler.toml

# Deploy again
wrangler deploy
```

### "Secret not configured"

```bash
# Check if secrets exist
wrangler secret list

# If missing, add them
wrangler secret put RESEND_API_KEY
wrangler secret put TURNSTILE_SECRET_KEY
```

### "Form not sending emails"

```bash
# Check Worker logs
wrangler tail

# Submit test form and watch logs in real-time
```

---

## Summary

**Remember:**

- 🔐 **Secrets**: Set once with `wrangler secret put`
- 🎨 **Frontend changes** (HTML/CSS/JS): Deploy via Git/rsync/FTP
- ⚙️ **Worker changes** (backend): Deploy with `./deploy-worker.sh`
- 📝 **Most changes** are frontend-only (no Worker deployment needed)

**You'll rarely need to redeploy the Worker** - it's mostly set-and-forget after initial setup!
