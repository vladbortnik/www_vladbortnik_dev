# How to Get Your Cloudflare Web Analytics Token

**Issue:** Free tier only allows 1 Web Analytics site, and you already have one configured.

**Solution:** Use your existing Web Analytics token.

---

## Steps to Get Your Token

1. **Go to Cloudflare Dashboard:**
   ```
   https://dash.cloudflare.com/
   ```

2. **Navigate to Web Analytics:**
   - Click **"Analytics & Logs"** (left sidebar)
   - Click **"Web Analytics"**

3. **Find Your Existing Site:**
   - You should see one site listed (whatever you named it before)
   - Click on the site name

4. **Get JavaScript Snippet:**
   - Click **"JavaScript Snippet"** button (top right)
   - OR click **"Settings"** → **"JavaScript Snippet"**

5. **Copy the Token:**
   You'll see something like:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
           data-cf-beacon='{"token": "a1b2c3d4e5f6g7h8i9j0"}'></script>
   ```

   **Copy ONLY the token part:**
   ```
   a1b2c3d4e5f6g7h8i9j0
   ```

---

## Replace Placeholder in Files

**Files to update:**
1. `blog/index.html` (line 166)
2. `blog/posts/1-production-grade-multi-app-server-12-dollar-month.html` (line 187)
3. `blog/templates/ARTICLE_TEMPLATE.html` (line 176)
4. `blog/templates/_template.html` (line 185)

**Find:**
```
REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN
```

**Replace with:**
```
your-actual-token-here
```

---

## Quick Command (After Getting Token)

```bash
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev

# Replace placeholder with your actual token
# Example (replace YOUR_TOKEN_HERE with actual token):
find blog -name "*.html" -type f -exec sed -i '' 's/REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN/YOUR_TOKEN_HERE/g' {} +

# Verify replacement worked
grep -r "REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN" blog/
# Should return nothing if successful

# Verify token was added
grep -r "data-cf-beacon" blog/ | head -1
# Should show your actual token
```

---

## Important Notes

**One Token Works for Entire Domain:**
- The same token works for:
  - `vladbortnik.dev/blog/`
  - `vladbortnik.dev/` (portfolio)
  - All pages under `vladbortnik.dev`

**Site Name Doesn't Matter:**
- Even if you named it "Portfolio" or "Main Site"
- It will still track blog visits
- Cloudflare tracks by domain, not by site name

**No Need to Create New Site:**
- Free tier = 1 Web Analytics site
- You already have it
- Just reuse the existing token

---

## Verification After Deployment

1. Deploy your changes to production
2. Visit: https://vladbortnik.dev/blog/
3. Open DevTools (F12) → Network tab
4. Look for: `beacon.min.js` (Status: 200)
5. Wait 10-15 minutes
6. Check Cloudflare dashboard:
   - Go to: Analytics & Logs → Web Analytics
   - Click your site
   - Verify blog page views appear

---

**Next:** Get your token from the dashboard, replace the placeholder, deploy!
