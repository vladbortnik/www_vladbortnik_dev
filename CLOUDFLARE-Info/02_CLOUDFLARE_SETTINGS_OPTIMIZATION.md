# Cloudflare Settings Optimization Guide

**Date:** November 9, 2025
**Domain:** vladbortnik.dev

## Summary

Configure critical Cloudflare settings to improve security, performance, and reliability. These settings cannot be modified via API with current token permissions, so follow the manual steps below.

---

## CRITICAL SETTINGS (Do Now - 5 Minutes)

### 1. SSL/TLS Mode: Full (Strict) ✅ CRITICAL

**Why:** Ensures end-to-end encryption between Cloudflare and your DigitalOcean server.

**Steps:**
1. Go to: https://dash.cloudflare.com → **vladbortnik.dev** → **SSL/TLS**
2. Click **Overview** tab
3. Set encryption mode to: **Full (strict)**
4. Save

**Current Status:** Probably "Flexible" or "Full"
**Should Be:** Full (strict)

**What This Does:**
- User → Cloudflare: Encrypted with Cloudflare's SSL ✅
- Cloudflare → DigitalOcean: Encrypted with your Let's Encrypt cert ✅
- Cloudflare VERIFIES your certificate is valid and from Let's Encrypt ✅

**Impact:** Maintains your A+ security rating. Without this, traffic between Cloudflare and DigitalOcean could be unencrypted.

---

### 2. Minimum TLS Version: 1.2 ✅ CRITICAL

**Why:** TLS 1.0 and 1.1 have known vulnerabilities and are deprecated.

**Steps:**
1. Go to: **SSL/TLS** → **Edge Certificates**
2. Find "Minimum TLS Version"
3. Set to: **TLS 1.2** (or TLS 1.3 if you want maximum security)
4. Save

**Current:** Probably TLS 1.0 (default for compatibility)
**Should Be:** TLS 1.2 minimum

**What This Does:**
- Blocks connections using old, vulnerable TLS versions
- Modern browsers all support TLS 1.2+
- Your Nginx already uses TLS 1.3, this adds edge protection

---

### 3. Always Online: ON ✅ CRITICAL

**Why:** If your $12/month DigitalOcean droplet goes down, Cloudflare serves cached pages instead of errors.

**Steps:**
1. Go to: **Caching** → **Configuration**
2. Find "Always Online"
3. Toggle to: **ON**
4. Save

**Current:** Probably OFF
**Should Be:** ON

**What This Does:**
- Cloudflare crawls and caches your site regularly
- If DigitalOcean is unreachable, serves cached version
- Users see "slightly stale" content instead of 502 errors
- Critical for blog launch (can't afford downtime)

**Limitation:** Only works for pages Cloudflare has cached. Dynamic Flask pages might not be cached.

---

## PERFORMANCE SETTINGS (Do Now - 5 Minutes)

### 4. Auto Minify: HTML, CSS, JavaScript ✅

**Why:** Removes whitespace and comments to reduce file size 10-30%.

**Steps:**
1. Go to: **Speed** → **Optimization**
2. Find "Auto Minify"
3. Check all three boxes:
   - ✅ HTML
   - ✅ CSS
   - ✅ JavaScript
4. Save

**Current:** Probably all OFF
**Should Be:** All ON

**What This Does:**
- Automatically minifies HTML, CSS, JS files
- Reduces page size (faster loads)
- Zero effort, automatic

**Warning:** Can occasionally break sites if code relies on specific formatting. If you see issues after enabling, disable and test.

---

### 5. Brotli Compression: ON ✅

**Why:** 10-20% better compression than gzip, faster page loads.

**Steps:**
1. Go to: **Speed** → **Optimization**
2. Find "Brotli"
3. Toggle to: **ON**
4. Save

**Current:** Probably ON (default now)
**Should Be:** ON

**What This Does:**
- Compresses text files (HTML, CSS, JS, JSON) before sending
- Better than gzip (older compression)
- Supported by all modern browsers

---

### 6. HTTP/3 (QUIC): ON ✅

**Why:** Faster than HTTP/2, especially on mobile and unreliable networks.

**Steps:**
1. Go to: **Network**
2. Find "HTTP/3 (with QUIC)"
3. Toggle to: **ON** (probably already on)
4. Save

**Current:** Probably ON (default)
**Should Be:** ON

**What This Does:**
- Uses QUIC protocol (faster than TCP)
- Better performance on mobile networks
- Reduces latency for repeated connections
- Future-proof

---

## SECURITY SETTINGS (Do This Week - 10 Minutes)

### 7. Bot Fight Mode: ON ✅

**Why:** Blocks known bad bots (scrapers, spammers) before they hit your server.

**Steps:**
1. Go to: **Security** → **Bots**
2. Find "Bot Fight Mode"
3. Toggle to: **ON**
4. Save

**Current:** Probably OFF
**Should Be:** ON

**What This Does:**
- Blocks requests from known malicious bots
- Reduces server load from bot traffic
- Free tier bot protection (basic, but better than nothing)
- Doesn't affect legitimate search engine crawlers (Google, Bing)

**Note:** This is NOT the same as paid "Bot Management" ($10/month). This is free basic protection.

---

### 8. Browser Integrity Check: ON ✅

**Why:** Blocks requests from browsers known to be malicious or commonly used for attacks.

**Steps:**
1. Go to: **Security** → **Settings**
2. Find "Browser Integrity Check"
3. Toggle to: **ON**
4. Save

**Current:** Probably OFF
**Should Be:** ON

**What This Does:**
- Checks browser headers for known attack patterns
- Blocks malicious or spoofed browsers
- Minimal impact on legitimate users
- Extra security layer

---

### 9. Challenge Passage: 2 Hours ✅

**Why:** Reduces friction for legitimate users while maintaining security.

**Steps:**
1. Go to: **Security** → **Settings**
2. Find "Challenge Passage"
3. Set to: **2 hours** (or 1 hour if you prefer)
4. Save

**Current:** Probably 30 minutes (default)
**Should Be:** 2 hours

**What This Does:**
- After passing a security challenge, user is trusted for 2 hours
- Reduces repeated challenges for legitimate visitors
- Still protects against automated attacks
- Better user experience

---

### 10. Security Level: Medium ✅

**Why:** Balanced security without blocking legitimate users.

**Steps:**
1. Go to: **Security** → **Settings**
2. Find "Security Level"
3. Set to: **Medium** (probably already set)
4. Save

**Current:** Probably Medium (default)
**Should Be:** Medium (High for production sites with traffic)

**What This Does:**
- Controls how aggressive Cloudflare is with challenges
- Low: Minimal challenges (good for known traffic)
- Medium: Balanced (good for most sites)
- High: Aggressive (good for sites under attack)
- I'm Under Attack: Maximum (emergency mode)

---

## OPTIONAL SETTINGS (Enable After Blog Launch)

### 11. Hotlink Protection: ON

**Why:** Prevents other sites from embedding your blog images (stealing your bandwidth).

**Steps:**
1. Go to: **Scrape Shield**
2. Find "Hotlink Protection"
3. Toggle to: **ON**
4. Save

**When:** After blog launches and you notice bandwidth usage

**What This Does:**
- Your images only load on vladbortnik.dev
- Other sites trying to embed your images get blocked
- Saves bandwidth costs
- Prevents image theft

---

### 12. Email Obfuscation: ON

**Why:** Hides email addresses from spam harvesters.

**Steps:**
1. Go to: **Scrape Shield**
2. Find "Email Address Obfuscation"
3. Toggle to: **ON**
4. Save

**What This Does:**
- Cloudflare obfuscates email addresses in HTML
- Users still see emails normally
- Bots can't scrape addresses for spam
- Reduces spam

---

### 13. Rocket Loader: TEST CAREFULLY ⚠️

**Why:** Can dramatically speed up initial page load by deferring JavaScript.

**Steps:**
1. Go to: **Speed** → **Optimization**
2. Find "Rocket Loader"
3. Toggle to: **ON**
4. **TEST YOUR SITE THOROUGHLY**
5. If anything breaks, turn it OFF immediately

**Warning:** Can break sites that rely on synchronous JavaScript execution.

**What This Does:**
- Defers JavaScript loading until after page content renders
- Page appears to load much faster
- JavaScript executes after content is visible

**Recommendation:** Test on dev/staging first. If it breaks anything, skip this.

---

## SETTINGS TO AVOID

### ❌ Development Mode
- **Don't enable unless actively testing**
- Bypasses ALL caching
- Only use temporarily (3 hours max)
- Remember to turn OFF after testing

### ❌ Rate Limiting (Dashboard)
- **Requires paid plan**
- Use Cloudflare Workers for rate limiting on free tier instead

### ❌ WAF Managed Rules
- **Requires Pro plan ($20/month)**
- Free tier only has basic security features

---

## VERIFICATION CHECKLIST

After making changes, verify:

```bash
# Test SSL/TLS mode
curl -I https://vladbortnik.dev | grep -i "cf-cache"

# Check TLS version
echo | openssl s_client -connect vladbortnik.dev:443 -tls1_2 2>/dev/null | grep "Protocol"

# Test Brotli compression
curl -H "Accept-Encoding: br" -I https://vladbortnik.dev | grep -i "content-encoding"

# Test HTTP/3
curl --http3 -I https://vladbortnik.dev
```

---

## PRIORITY ORDER

**Do Today (CRITICAL - 5 minutes):**
1. ✅ SSL/TLS mode → Full (Strict)
2. ✅ Minimum TLS → 1.2
3. ✅ Always Online → ON
4. ✅ Auto Minify → ON (all three)
5. ✅ Brotli → ON

**Do This Week (10 minutes):**
6. ✅ Bot Fight Mode → ON
7. ✅ Browser Integrity Check → ON
8. ✅ Challenge Passage → 2 hours
9. ✅ Security Level → Medium

**Do Before Blog Launch:**
10. ✅ Email Obfuscation → ON
11. ✅ Hotlink Protection → ON (after launch)

**Test Carefully (Optional):**
12. ⚠️ Rocket Loader → Test thoroughly first

---

## IMPACT SUMMARY

### Security Improvements
- ✅ End-to-end encryption verified (Full Strict SSL)
- ✅ No old TLS versions (blocks TLS 1.0/1.1)
- ✅ Bot protection enabled
- ✅ Malicious browser blocking
- ✅ Email spam protection

### Performance Improvements
- ✅ 10-30% smaller files (Auto Minify)
- ✅ 10-20% better compression (Brotli)
- ✅ Faster connections (HTTP/3)
- ✅ Reduced latency

### Reliability Improvements
- ✅ Always Online fallback (if DigitalOcean down)
- ✅ Better user experience (longer challenge passage)

### Cost Savings
- ✅ Less bot traffic (saves DigitalOcean bandwidth)
- ✅ Hotlink protection (saves bandwidth)
- ✅ Better caching (reduces origin requests)

**Total Time:** 15 minutes to configure everything
**Cost:** $0 (all free tier features)
**Impact:** Significant security + performance improvements

---

## NOTES

- **API Token Limitation:** Current API token doesn't have "Zone Settings: Edit" permission, so these settings must be changed manually in the Cloudflare dashboard.
- **No Risk:** All these settings are safe to enable and can be toggled off if issues arise.
- **Test First:** For Rocket Loader, test on a dev site before enabling on production.
- **Monitor:** After enabling, check your site to ensure everything works correctly.

## STATUS

🟡 **Pending Manual Configuration** - User needs to enable these settings in Cloudflare dashboard
📝 **Documentation Complete** - Step-by-step guide provided above
✅ **DMARC + CAA** - Already configured automatically
