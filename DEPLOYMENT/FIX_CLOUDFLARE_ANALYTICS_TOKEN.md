# Fix: No Cloudflare Web Analytics Token Available

**Problem:** Existing Web Analytics site doesn't show JavaScript Snippet or token.

**Cause:** Site is configured for "Automatic Installation" (excludes EU visitors), which doesn't provide a manual script.

**Solution:** Delete the old site and create a new one with manual installation enabled.

---

## Step 1: Delete Existing Web Analytics Site

1. **Go to Cloudflare Dashboard:**
   ```
   https://dash.cloudflare.com/
   ```

2. **Navigate to Web Analytics:**
   - Click **"Analytics & Logs"** (left sidebar)
   - Click **"Web Analytics"**

3. **Delete the Existing Site:**
   - Find your existing site in the list
   - Click on the site name
   - Click **"Settings"** (top right)
   - Scroll down to find **"Delete Site"** button
   - Confirm deletion

---

## Step 2: Configure Web Analytics Site (Correct Settings)

1. **Go to your existing site:**
   - Click on your site name: **vladbortnik.dev**
   - OR if creating new: Click **"+ Add a site"**

2. **Configure Site Name (if creating new):**
   ```
   Site name: vladbortnik.dev
   ```

3. **IMPORTANT - Real User Measurements (RUM) Setting:**

   You'll see 4 radio button options:

   ```
   ⭕ Enable
      The JS Snippet will be automatically injected.

   ⭕ Enable, excluding visitor data in the EU
      The JS Snippet will not be injected for visitors from the EU.

   ⭕ Enable with JS Snippet installation  ← SELECT THIS ONE! ✅
      The JS Snippet needs to be installed manually.

   ⭕ Disable
      The JS Snippet will not be injected and has been disabled.
   ```

   **SELECT:** ⭕ **"Enable with JS Snippet installation"**

   This option:
   - ✅ Provides manual JavaScript snippet with token
   - ✅ Tracks ALL visitors (including EU)
   - ✅ Works with scripts we already added to your HTML

4. **Click "Update"**

5. **Copy the Script/Token:**

   After creating, you should immediately see a JavaScript snippet like:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
           data-cf-beacon='{"token": "a1b2c3d4e5f6g7h8i9j0"}'></script>
   ```

6. **Save the Token:**

   Copy ONLY the token part:
   ```
   a1b2c3d4e5f6g7h8i9j0
   ```

---

## Step 3: Replace Placeholder in Blog Files

Once you have the token, replace it in all 4 files:

### Manual Replacement (Safe)

Open each file and find/replace:

**Find:**
```
REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN
```

**Replace with:**
```
your-actual-token-here
```

**Files:**
1. `blog/index.html` (line 166)
2. `blog/posts/1-production-grade-multi-app-server-12-dollar-month.html` (line 187)
3. `blog/templates/ARTICLE_TEMPLATE.html` (line 176)
4. `blog/templates/_template.html` (line 185)

---

### Automated Replacement (After Getting Token)

```bash
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev

# Replace YOUR_ACTUAL_TOKEN with the real token you copied
find blog -name "*.html" -type f -exec sed -i '' 's/REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN/YOUR_ACTUAL_TOKEN/g' {} +

# Verify it worked (should return no results)
grep -r "REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN" blog/

# Verify token was added (should show your token)
grep -r "data-cf-beacon" blog/ | head -2
```

---

## Step 4: Verify Token Access Later

After creating the site, you can always retrieve your token again:

1. Go to: Analytics & Logs → Web Analytics
2. Click on your site name: **"vladbortnik.dev"**
3. You should now see **"JavaScript Snippet"** button (top right)
4. Click it to view/copy your token again

---

## Visual Guide: What to Check

### When Creating Site:

```
┌─────────────────────────────────────────┐
│ Add a site                              │
├─────────────────────────────────────────┤
│                                         │
│ Site name:                              │
│ [vladbortnik.dev            ]           │
│                                         │
│ Hostname (optional):                    │
│ [                           ]           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [ ] Automatic Installation          │ │ ← LEAVE UNCHECKED!
│ │                                     │ │
│ │ Enabled (Excluding visitor data    │ │
│ │ in the EU. The JS Snippet will     │ │
│ │ not be injected for visitors from  │ │
│ │ the EU)                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│          [Cancel]  [Add site]           │
└─────────────────────────────────────────┘
```

**IMPORTANT:** Leave "Automatic Installation" **UNCHECKED** to get manual script.

---

## Why This Happened

Your existing site was created with wrong RUM setting:
- Option 1 "Enable" = Automatic injection (no manual token) ❌
- Option 2 "Enable, excluding EU" = Excludes EU visitors (no manual token) ❌

The correct setting "Enable with JS Snippet installation" will:
- ✅ Track ALL visitors (including EU - still GDPR compliant)
- ✅ Provide a manual JavaScript snippet with token
- ✅ Work with the script we already added to your HTML files

---

## Troubleshooting

### If You Still Don't See Token After Creating Site:

1. **Refresh the page** after creating site
2. **Look for these buttons:**
   - "JavaScript Snippet" (top right)
   - OR "Get snippet" / "Implementation" tabs
3. **Check the overview page** - token might be displayed immediately after creation

### If "Add Site" Button is Grayed Out:

- Free tier allows 1 Web Analytics site
- Make sure you deleted the old site first
- Wait 1-2 minutes after deletion, then refresh page

---

## After Deployment

1. **Commit and deploy your changes:**
   ```bash
   git add blog/
   git commit -m "feat: add Cloudflare Web Analytics token to blog"
   git push
   # Deploy to production
   ```

2. **Verify it works:**
   - Visit: https://vladbortnik.dev/blog/
   - Open DevTools (F12) → Network tab
   - Look for: `beacon.min.js` (Status: 200 OK)
   - Check for: `cloudflareinsights.com/cdn-cgi/rum` (Status: 204)

3. **Check dashboard (10-15 minutes later):**
   - Dashboard → Analytics & Logs → Web Analytics
   - Click "vladbortnik.dev"
   - Verify your visit appears

---

## Next Steps

1. ✅ Delete existing Web Analytics site
2. ✅ Create new site with "Automatic Installation" **DISABLED**
3. ✅ Copy the token from the script
4. ✅ Replace `REPLACE_WITH_YOUR_CLOUDFLARE_TOKEN` in all 4 blog files
5. ✅ Commit, deploy, verify

---

**TL;DR:** Delete old site → Create new site with "Automatic Installation" unchecked → Copy token → Replace placeholder → Deploy
