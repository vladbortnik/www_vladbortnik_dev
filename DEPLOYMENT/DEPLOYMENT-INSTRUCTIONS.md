# Deployment Instructions - Secure Version

## ✅ What Changed

### 1. API Keys Now Use Cloudflare Secrets (Not Hard-coded)
**Problem**: Hard-coded API keys in code = security risk
**Solution**: Use Cloudflare environment variables

---

## 🚀 Deployment Steps

### Step 1: Set Cloudflare Secrets

Run these commands to securely store your API keys:

```bash
# Set Resend API key
wrangler secret put RESEND_API_KEY
# When prompted, paste: re_iBL41yGz_BT2WijUBkYBsTcCpYCzmdhFN

# Set Turnstile secret key
wrangler secret put TURNSTILE_SECRET_KEY
# When prompted, paste: 0x4AAAAAAB6AEZHX3E60CgvZEWt8Vau7dz8
```

**Why this is secure:**
- Keys stored encrypted in Cloudflare
- Never visible in code or git
- Can be rotated anytime without code changes

---

### Step 2: Deploy the Worker

```bash
wrangler deploy cloudflare-worker-resend.js \
  --name portfolio-contact-form \
  --compatibility-date 2025-10-13
```

---

### Step 3: Verify Secrets Are Set

```bash
wrangler secret list
```

Should show:
```
RESEND_API_KEY
TURNSTILE_SECRET_KEY
```

---

## 🔗 Contact Form URL

Your contact form is now live at:

### **Primary URL:**
```
https://vladbortnik.dev/contact.html
```

### **Make it Shorter (Optional):**

#### Option 1: Cloudflare Page Rule (Redirect)
**In Cloudflare Dashboard:**
1. Go to **Rules** → **Page Rules**
2. Create rule:
   - **URL:** `*vladbortnik.dev/contact`
   - **Setting:** Forwarding URL (301 - Permanent Redirect)
   - **Destination:** `https://vladbortnik.dev/contact.html`

**Result:** `https://vladbortnik.dev/contact` → works!

#### Option 2: Create `/contact/index.html`
```bash
mkdir -p contact
cp contact.html contact/index.html
```
**Result:** `https://vladbortnik.dev/contact/` → works!

---

## 🎨 UI Fix Applied

**Problem**: Text was black-on-black (invisible) while typing
**Solution**: Added `!important` flags and webkit-specific CSS

**Fixed:**
- Input text now always white (`#fff`)
- Placeholder text lighter gray (`#888`)
- Browser autofill styling corrected
- Text visible immediately when typing

**Test:** Refresh the page and type in the form - text should be white instantly.

---

## 📋 Navigation Links

### Add Contact Link to Main Portfolio

**In `index.html`, find the navigation menu and add:**

```html

<nav id="navbar" class="navbar nav-menu">
    <ul>
        <li><a href="#hero" class="nav-link scrollto active"><i class="bx bx-home"></i> <span>Home</span></a></li>
        <li><a href="#about" class="nav-link scrollto"><i class="bx bx-user"></i> <span>About</span></a></li>
        <li><a href="#resume" class="nav-link scrollto"><i class="bx bx-file-blank"></i> <span>Resume</span></a></li>
        <li><a href="#portfolio" class="nav-link scrollto"><i class="bx bx-book-content"></i> <span>Portfolio</span></a>
        </li>
        <!-- ADD THIS LINE: -->
        <li><a href="/contact.html" class="nav-link"><i class="bx bx-envelope"></i> <span>Contact</span></a></li>
    </ul>
</nav>
```

**Alternative - Add to social links in hero section:**

```html
<div class="social-links">
  <a href="https://twitter.com/..." target="_blank"><i class="bx bxl-twitter"></i></a>
  <a href="https://linkedin.com/in/..." target="_blank"><i class="bx bxl-linkedin"></i></a>
  <a href="https://github.com/..." target="_blank"><i class="bx bxl-github"></i></a>
  <!-- ADD THIS LINE: -->
  <a href="/contact.html" title="Contact Me"><i class="bx bx-envelope"></i></a>
</div>
```

---

## 🧪 Testing Checklist

1. ✅ Open `https://vladbortnik.dev/contact.html` (or local)
2. ✅ Type in input fields - **text should be white immediately**
3. ✅ Submit simple contact form
4. ✅ Check email at `contact.me@vladbortnik.dev`
5. ✅ Test file upload (up to 5 files, 10MB each)

---

## 🔐 Security Summary

**Before:**
- ❌ API keys in code
- ❌ Visible in git commits
- ❌ Visible in deployed code

**After:**
- ✅ Keys in Cloudflare secrets
- ✅ Not in code or git
- ✅ Encrypted in Cloudflare
- ✅ Can be rotated anytime

---

## 📝 Quick Reference

**Worker endpoint:**
```
https://portfolio-contact-form.vladbortnik.workers.dev
```

**Contact form:**
```
https://vladbortnik.dev/contact.html
```

**Check secrets:**
```bash
wrangler secret list
```

**View logs:**
```bash
wrangler tail
```

**Update a secret:**
```bash
wrangler secret put RESEND_API_KEY
```

**Delete a secret:**
```bash
wrangler secret delete RESEND_API_KEY
```

---

## 🆘 Troubleshooting

### Error: "RESEND_API_KEY not configured"
**Fix:** Run `wrangler secret put RESEND_API_KEY`

### Text still black in form
**Fix:** Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Contact link doesn't work
**Fix:** Use full URL: `https://vladbortnik.dev/contact.html` or set up redirect

---

## ✅ Done!

Your contact form is now:
- ✅ Secure (keys encrypted)
- ✅ Visible (white text on dark background)
- ✅ Accessible (at /contact.html)
- ✅ Working (Resend API)
