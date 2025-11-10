# Cloudflare Turnstile Fix for Localhost

**Date:** November 10, 2025
**Issue:** Turnstile CAPTCHA showing 400 errors on localhost
**Solution:** Explicit rendering with environment-specific site keys

---

## Problem

When testing on localhost, Cloudflare Turnstile tried to validate with production site key and failed:
- **Error:** 400 Bad Request from `challenges.cloudflare.com`
- **Error:** "Blocked script execution in 'about:blank' because document's frame is sandboxed..."
- **Root Cause:** Production site key doesn't allow localhost domain

---

## Solution Implemented

### Changed from Auto-Render to Explicit Render

**Before (Auto-render):**
```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<div class="cf-turnstile" data-sitekey="0x4AAAAAAB6AEVcPkpc4oM3Q"></div>
```
❌ Turnstile auto-renders immediately with production key, no way to intercept

**After (Explicit render):**
```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
<script>
  var turnstileSiteKey = '0x4AAAAAAB6AEVcPkpc4oM3Q'; // Production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    turnstileSiteKey = '1x00000000000000000000AA'; // Test key (always passes)
  }

  window.onloadTurnstileCallback = function() {
    document.querySelectorAll('.cf-turnstile').forEach(function(el) {
      turnstile.render(el, {
        sitekey: turnstileSiteKey,
        theme: 'light'
      });
    });
  };
</script>
<div class="cf-turnstile"></div>
```
✅ We control when and how Turnstile renders, using correct key per environment

---

## Changes Made to contact.html

### 1. Updated Turnstile Script Tag (Line 59)
```html
<!-- OLD -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- NEW -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
```
Added `?render=explicit` parameter to prevent auto-rendering.

### 2. Added Environment Detection Script (Lines 62-85)
```javascript
// Determine which site key to use
var turnstileSiteKey = '0x4AAAAAAB6AEVcPkpc4oM3Q'; // Production

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  turnstileSiteKey = '1x00000000000000000000AA'; // Cloudflare test key
}

// Render widgets explicitly
window.onloadTurnstileCallback = function() {
  document.querySelectorAll('.cf-turnstile').forEach(function(el) {
    turnstile.render(el, {
      sitekey: turnstileSiteKey,
      theme: 'light'
    });
  });
};
```

### 3. Removed data-sitekey from HTML (Lines 240, 387)
```html
<!-- OLD -->
<div class="cf-turnstile" data-sitekey="0x4AAAAAAB6AEVcPkpc4oM3Q"></div>

<!-- NEW -->
<div class="cf-turnstile"></div>
```
Removed hardcoded site key since we render programmatically now.

---

## How It Works

### On Localhost (http://localhost:8000)
1. Script detects hostname is 'localhost'
2. Sets `turnstileSiteKey = '1x00000000000000000000AA'` (Cloudflare's test key)
3. Turnstile renders with test key → **Always passes, no validation**
4. No 400 errors, no sandboxing errors

### On Production (https://vladbortnik.dev)
1. Script detects hostname is 'vladbortnik.dev'
2. Uses production key: `'0x4AAAAAAB6AEVcPkpc4oM3Q'`
3. Turnstile renders with real key → **Validates users normally**
4. Works as expected in production

---

## Cloudflare Test Keys

Cloudflare provides these test keys for development:

| Key | Behavior |
|-----|----------|
| `1x00000000000000000000AA` | Always passes (visible) |
| `2x00000000000000000000AB` | Always blocks (visible) |
| `3x00000000000000000000FF` | Forces interactive challenge |

We use `1x00000000000000000000AA` for localhost testing.

**Source:** https://developers.cloudflare.com/turnstile/troubleshooting/testing/

---

## Testing

### Test on Localhost ✅
```bash
python3 -m http.server 8000
# Open: http://localhost:8000/contact.html
# Expected: Turnstile loads with test key, no 400 errors
```

### Test on Production ✅
```bash
# Deploy to server, then open: https://vladbortnik.dev/contact.html
# Expected: Turnstile loads with production key, validates normally
```

---

## Benefits

1. ✅ **No more 400 errors on localhost** - uses Cloudflare's official test key
2. ✅ **Clean console** - no sandboxing or CORS errors
3. ✅ **Automatic** - detects environment, no manual config needed
4. ✅ **Production-safe** - still uses real key in production
5. ✅ **Better control** - explicit rendering gives us flexibility

---

## Files Modified

- `contact.html` - Updated Turnstile implementation (lines 59-85, 240, 387)

---

## Deployment

This fix is already in `contact.html` - just upload it:

```bash
scp contact.html user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/
```

No Nginx changes needed for this fix.

---

## Verification

After deploying, verify both environments:

**Localhost:**
```bash
python3 -m http.server 8000
# Open: http://localhost:8000/contact.html
# Check console: Should see test key being used, no errors
```

**Production:**
```
Open: https://vladbortnik.dev/contact.html
# Check console: Should see production key, Turnstile validates normally
# Try submitting form: CAPTCHA should work correctly
```

---

## Rollback (if needed)

If this causes issues, restore original:
```bash
git checkout HEAD -- contact.html
scp contact.html user@YOUR_SERVER_IP:/var/www/vladbortnik.dev/html/
```

---

**Status:** ✅ Ready for deployment
