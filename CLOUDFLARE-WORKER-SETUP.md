# Cloudflare Worker Setup Guide
## Contact Form Backend - FREE, No Redirects, File Uploads

This guide will help you deploy your contact form backend to Cloudflare Workers.

---

## Prerequisites

- ✅ Cloudflare account (you already have one)
- ✅ Domain on Cloudflare (vladbortnik.dev)
- ✅ Node.js installed (for Wrangler CLI)

---

## Step 1: Install Wrangler CLI

Wrangler is Cloudflare's CLI tool for managing Workers.

```bash
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

This will open a browser to authenticate with your Cloudflare account.

---

## Step 2: Create Worker Project

```bash
# Create a new directory
mkdir contact-worker
cd contact-worker

# Initialize Worker project
wrangler init

# Choose the following options:
# - Name: contact-form
# - Template: Hello World
# - TypeScript: No (we'll use vanilla JS)
# - Git: Yes (optional)
```

---

## Step 3: Copy Worker Code

Replace the contents of `src/index.js` (or `worker.js`) with the code from `cloudflare-worker.js` in your project root.

```bash
# From your portfolio directory
cp cloudflare-worker.js contact-worker/src/index.js
```

---

## Step 4: Configure Worker

Edit the `CONFIG` object at the top of the Worker script:

```javascript
const CONFIG = {
  // ✅ REQUIRED: Your email where forms will be sent
  TO_EMAIL: 'your-actual-email@example.com',

  // ✅ REQUIRED: From email (must be your domain)
  FROM_EMAIL: 'portfolio-contact-form@vladbortnik.dev',
  FROM_NAME: 'Portfolio Contact Form',

  // ✅ REQUIRED: Your Turnstile secret key
  TURNSTILE_SECRET_KEY: 'YOUR_TURNSTILE_SECRET_KEY',

  // ✅ Update with your actual domain
  ALLOWED_ORIGINS: [
    'https://vladbortnik.dev',
    'http://localhost:8000'
  ],

  // File upload limits (adjust as needed)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5
};
```

**Where to find your Turnstile Secret Key:**
1. Go to Cloudflare Dashboard → Turnstile
2. Click on your widget
3. Copy the **Secret Key** (not the Site Key)

---

## Step 5: Configure wrangler.toml

Create or edit `wrangler.toml` in your Worker project:

```toml
name = "contact-form"
main = "src/index.js"
compatibility_date = "2025-01-01"

# Optional: Custom domain (recommended)
# After deployment, you can add a route like:
# https://contact.vladbortnik.dev
route = { pattern = "contact.vladbortnik.dev/*", zone_name = "vladbortnik.dev" }

# Or use the default workers.dev subdomain
# Your worker will be at: https://contact-form.YOUR-SUBDOMAIN.workers.dev
```

---

## Step 6: Deploy Worker

```bash
# Deploy to Cloudflare
wrangler deploy

# You'll see output like:
# ✨ Success! Deployed to https://contact-form.YOUR-SUBDOMAIN.workers.dev
```

Copy the deployed URL - you'll need it in the next step.

---

## Step 7: Update Your Contact Form

Edit `contact.html` and replace the placeholder URLs (appears twice):

**Find:**
```html
<form action="https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev" ...>
```

**Replace with your actual Worker URL:**
```html
<form action="https://contact-form.YOUR-SUBDOMAIN.workers.dev" ...>
```

---

## Step 8: Test Locally (Optional)

Test the Worker locally before deploying:

```bash
# Start local dev server
wrangler dev

# Your Worker will run at http://localhost:8787
# Update contact.html temporarily to use http://localhost:8787
```

---

## Step 9: Verify Email Delivery

### MailChannels Setup (Free, No Signup)

MailChannels is automatically available for Cloudflare Workers - no configuration needed!

**However, for best deliverability, add SPF record:**

1. Go to Cloudflare Dashboard → DNS → Records
2. Add TXT record:
   - **Name:** `@` (or your domain)
   - **Content:** `v=spf1 a mx include:relay.mailchannels.net ~all`
   - **TTL:** Auto

3. (Optional) Add DKIM for even better deliverability:
   - Generate DKIM keys
   - Add to Worker config and DNS records
   - Instructions: https://support.mailchannels.com/hc/en-us/articles/16918954360845

---

## Step 10: Test Your Form

1. Open `contact.html` in browser
2. Fill out simple form
3. Submit and check for success message
4. Check your email inbox

**If you don't receive email:**
- Check spam folder
- Verify `TO_EMAIL` in Worker config
- Check Cloudflare Worker logs: `wrangler tail`
- Ensure SPF record is added

---

## Step 11: Test File Uploads

1. Switch to "Project Request" mode
2. Upload test files (images, PDFs, etc.)
3. Submit form
4. Check email - attachments should be included

---

## Troubleshooting

### CORS Errors

If you get CORS errors, make sure your domain is in `ALLOWED_ORIGINS` in the Worker config.

### Turnstile Verification Fails

1. Check that you're using the **Secret Key** (not Site Key)
2. Verify the key in Worker matches your Cloudflare dashboard
3. Test with Turnstile widget on your form

### Email Not Received

1. Check Worker logs: `wrangler tail`
2. Verify `TO_EMAIL` is correct
3. Check spam folder
4. Ensure SPF record is added to DNS

### File Upload Errors

1. Check file size (max 10MB by default)
2. Verify file type is in `ALLOWED_FILE_TYPES`
3. Check browser console for specific errors

---

## Monitoring & Logs

### View Worker Logs

```bash
# Stream logs in real-time
wrangler tail

# View logs in Cloudflare Dashboard
# Workers → Your Worker → Logs
```

### Check Worker Analytics

Go to Cloudflare Dashboard → Workers → contact-form → Metrics

You can see:
- Request count
- Error rate
- CPU time
- Success/failure rates

---

## Cost

**100% FREE** for your use case:

- **Cloudflare Workers:** 100,000 requests/day free
- **MailChannels:** Unlimited emails (free for Workers)
- **No credit card required**

Your contact form will likely use < 100 requests/day, so you'll stay well within the free tier.

---

## Custom Domain (Optional)

Instead of `contact-form.your-subdomain.workers.dev`, use `contact.vladbortnik.dev`:

1. Go to Cloudflare Dashboard → Workers → contact-form
2. Click **Triggers** tab
3. Add Custom Domain: `contact.vladbortnik.dev`
4. Update `contact.html` with new URL

---

## Security Best Practices

✅ **Already Implemented:**
- Honeypot anti-spam
- Turnstile CAPTCHA verification
- Rate limiting (via Cloudflare)
- File type validation
- File size limits
- XSS protection (HTML escaping)
- CORS restrictions

✅ **Additional (Optional):**
- Add rate limiting per IP in Worker
- Implement email allowlist/blocklist
- Add webhook notifications
- Store submissions in Cloudflare D1 (database)

---

## Updating Your Worker

After making changes to `cloudflare-worker.js`:

```bash
cd contact-worker
cp ../cloudflare-worker.js src/index.js
wrangler deploy
```

Changes are live immediately - no downtime!

---

## Support

**Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
**MailChannels Docs:** https://support.mailchannels.com/

**Common Issues:**
- Check Worker logs first: `wrangler tail`
- Verify all CONFIG values are set correctly
- Test Turnstile separately
- Check email spam folder

---

## Summary

You now have:
- ✅ Free backend (Cloudflare Workers)
- ✅ Free email delivery (MailChannels)
- ✅ No redirects (pure AJAX API)
- ✅ File uploads (up to 10MB)
- ✅ Spam protection (Turnstile + honeypot)
- ✅ No external accounts needed (except Cloudflare)

**Your form will work exactly as designed with no compromises!**

---

## Quick Reference

**Deploy Command:**
```bash
wrangler deploy
```

**View Logs:**
```bash
wrangler tail
```

**Worker URL Format:**
```
https://contact-form.YOUR-SUBDOMAIN.workers.dev
```

**Update contact.html with your Worker URL after deployment!**
