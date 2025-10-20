# Resend Setup Guide for Contact Form

This guide will help you set up Resend API to replace the discontinued MailChannels service.

## Why Resend?

MailChannels' free service was discontinued in mid-2024. Cloudflare's Email Service is in private beta only. Resend is the best free alternative:

- ✅ **Free tier**: 3,000 emails/month, 100 emails/day
- ✅ **File attachments**: Up to 40MB per email
- ✅ **Simple setup**: 10 minutes
- ✅ **Reliable delivery**: Built by developers for developers

---

## Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Click **"Sign up"**
3. Create account with your email
4. Verify your email address

---

## Step 2: Get Your API Key

1. After logging in, go to **API Keys** in the dashboard
2. Click **"Create API Key"**
3. Name it: `portfolio-contact-form`
4. **Permissions**: Select "Sending access" (Full access or Restricted)
5. Click **"Add"**
6. **Copy the API key** - you'll only see it once!
   - Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 3: Verify Your Domain

Resend requires domain verification to prevent spam.

### Add DNS Records

1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter: `vladbortnik.dev`
4. Resend will show you **3 DNS records** to add:

#### Example DNS Records (yours will be different):

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...

Type: TXT
Name: @ (or vladbortnik.dev)
Value: resend-verification=xxxxxx

Type: MX (if you want to receive bounces - optional)
Name: @
Value: feedback-smtp.resend.com
Priority: 10
```

### Add Records to Cloudflare DNS

1. Go to **Cloudflare Dashboard** → **vladbortnik.dev** → **DNS** → **Records**
2. Click **"Add record"** for each record Resend provided
3. Wait 2-5 minutes for DNS propagation
4. In Resend dashboard, click **"Verify"**
5. ✅ Status should show "Verified"

---

## Step 4: Update Worker Configuration

Update the new Worker file with your API keys:

```javascript
// In cloudflare-worker-resend.js

const CONFIG = {
  TO_EMAIL: 'contact.me@vladbortnik.dev',     // ✅ Already set
  FROM_EMAIL: 'portfolio-contact-form@vladbortnik.dev', // ✅ Already set

  RESEND_API_KEY: 're_YOUR_ACTUAL_KEY_HERE',  // ⚠️ UPDATE THIS
  TURNSTILE_SECRET_KEY: 'YOUR_TURNSTILE_KEY', // ⚠️ UPDATE THIS (or leave as-is to skip verification)

  // ... rest stays the same
};
```

---

## Step 5: Deploy Updated Worker

Deploy the new Worker to Cloudflare:

```bash
# From project root
wrangler deploy cloudflare-worker-resend.js \
  --name portfolio-contact-form \
  --compatibility-date 2025-10-13
```

---

## Step 6: Test the Contact Form

1. Start local server:
   ```bash
   python3 -m http.server 8000
   ```

2. Open: http://localhost:8000/contact.html

3. Fill out the form and submit

4. Monitor Worker logs:
   ```bash
   wrangler tail
   ```

5. **Check your email** at `contact.me@vladbortnik.dev`

---

## Troubleshooting

### Error: "Resend API error: 401"
- **Cause**: Invalid API key
- **Fix**: Double-check you copied the full API key from Resend dashboard

### Error: "Resend API error: 403"
- **Cause**: Domain not verified or FROM_EMAIL doesn't match verified domain
- **Fix**:
  1. Verify domain in Resend dashboard
  2. Ensure `FROM_EMAIL` uses `@vladbortnik.dev`

### Error: "Resend API error: 422"
- **Cause**: Invalid email format or missing required fields
- **Fix**: Check that `TO_EMAIL` and `FROM_EMAIL` are valid

### No email received
- **Check**: Spam/junk folder
- **Check**: Resend dashboard → Logs to see delivery status
- **Verify**: Domain verification is complete

---

## DNS Records Summary

After setup, you'll have these DNS records in Cloudflare:

**For Resend (new):**
- TXT record: `resend._domainkey` (DKIM)
- TXT record: `resend-verification=xxx`
- MX record (optional): `feedback-smtp.resend.com`

**For FastMail (existing - keep these):**
- MX records: `in1-smtp.messagingengine.com`, `in2-smtp.messagingengine.com`
- TXT record: SPF (`v=spf1 include:spf.messagingengine.com ~all`)
- CNAME records: DKIM selectors `fm1`, `fm2`, `fm3._domainkey`

**Cloudflare-specific (existing):**
- TXT record: `_mailchannels` (can delete - no longer needed)
- TXT record: `_dmarc`

---

## Cost & Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- 1 custom domain
- 40MB attachment size limit
- 1-day data retention

**Your contact form usage:**
- Estimated: 5-20 emails/month
- **Well within free tier limits** ✅

---

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Status**: https://status.resend.com
- **Email support**: Available for free tier users

---

## Quick Reference

**Resend API Endpoint:**
```
POST https://api.resend.com/emails
```

**Authentication:**
```
Authorization: Bearer re_your_api_key
```

**Example Request:**
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "contact@vladbortnik.dev",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<p>Hello from Resend!</p>"
  }'
```

---

## Next Steps

1. ✅ Sign up for Resend
2. ✅ Get API key
3. ✅ Verify domain
4. ✅ Update Worker config
5. ✅ Deploy Worker
6. ✅ Test contact form

**Once deployed, your contact form will work immediately!**
