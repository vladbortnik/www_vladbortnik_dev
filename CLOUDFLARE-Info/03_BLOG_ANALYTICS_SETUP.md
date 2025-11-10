# Cloudflare Web Analytics Setup Guide

**Document Created:** November 10, 2025
**Purpose:** Configure Cloudflare Web Analytics for blog.vladbortnik.dev
**Status:** Implementation Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Why Cloudflare Web Analytics?](#why-cloudflare-web-analytics)
3. [Prerequisites](#prerequisites)
4. [Step 1: Create Analytics Site in Cloudflare Dashboard](#step-1-create-analytics-site-in-cloudflare-dashboard)
5. [Step 2: Get Your Analytics Beacon Script](#step-2-get-your-analytics-beacon-script)
6. [Step 3: Add Script to Blog HTML Files](#step-3-add-script-to-blog-html-files)
7. [Step 4: Verify Analytics Are Working](#step-4-verify-analytics-are-working)
8. [Step 5: Access Your Analytics Dashboard](#step-5-access-your-analytics-dashboard)
9. [What Data You'll See](#what-data-youll-see)
10. [Privacy & GDPR Compliance](#privacy--gdpr-compliance)
11. [Troubleshooting](#troubleshooting)
12. [Analytics Stack Comparison](#analytics-stack-comparison)

---

## Overview

This guide walks through setting up **Cloudflare Web Analytics** (free tier) for your blog at `vladbortnik.dev/blog/`. Cloudflare Web Analytics provides:

- **Privacy-first tracking** (no cookies, GDPR compliant)
- **Ad-blocker resistant** (Cloudflare's script is less likely to be blocked)
- **Real unique visitor counts** (accurate metrics without cookies)
- **Page views, bounce rates, traffic sources**
- **Free forever** (no upgrade required)
- **No cookies** (no consent banner needed)

**Current Analytics Stack:**
- PostHog (event tracking, user behavior)
- Umami (self-hosted analytics)
- **Cloudflare Web Analytics** (new addition - privacy-first visitor tracking)

---

## Why Cloudflare Web Analytics?

### Advantages

1. **Privacy-First Design**
   - No cookies or fingerprinting
   - Fully GDPR, CCPA, and PECR compliant
   - No consent banner required
   - Visitor data not sold to advertisers

2. **Ad-Blocker Resistant**
   - Cloudflare's beacon is delivered from the same domain (after proxying)
   - Less likely to be blocked than Google Analytics
   - Cloudflare's infrastructure is generally whitelisted

3. **Accurate Unique Visitor Tracking**
   - Uses privacy-preserving methods to count unique visitors
   - No cross-site tracking
   - Client-side JavaScript beacon

4. **Simple Implementation**
   - Single script tag
   - No configuration needed
   - Works with static sites

5. **Free Forever**
   - No data limits
   - No feature restrictions
   - No upgrade pressure

### Limitations

- Cannot create custom events (use PostHog for this)
- Cannot track user sessions in detail (use Umami for this)
- Limited segmentation compared to full analytics platforms
- No funnel tracking or conversion tracking

---

## Prerequisites

Before you begin, ensure you have:

1. **Cloudflare Account** with access to:
   - Account ID: `ce3536c2c47a369138083a89daa830d8`
   - Zone ID: `ce3536c2c47a369138083a89daa830d8`

2. **Access to Cloudflare Dashboard:**
   - Login at: https://dash.cloudflare.com/

3. **Blog Files Ready for Editing:**
   - `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/index.html`
   - `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html`
   - Any future blog posts (use templates)

---

## Step 1: Create Analytics Site in Cloudflare Dashboard

**NOTE:** Cloudflare Web Analytics **cannot** be created via API. You must use the dashboard.

### Instructions

1. **Login to Cloudflare Dashboard:**
   ```
   https://dash.cloudflare.com/
   ```

2. **Navigate to Web Analytics:**
   - In the left sidebar, click **"Analytics & Logs"**
   - Select **"Web Analytics"**
   - Or go directly to: https://dash.cloudflare.com/?to=/:account/analytics/web-analytics

3. **Add a New Site:**
   - Click the **"+ Add a site"** button
   - You'll see a form to create a new analytics site

4. **Configure Site Settings:**
   ```
   Site Name: Blog - vladbortnik.dev
   Hostname: vladbortnik.dev/blog/
   ```

   **Important:**
   - Use a descriptive name (you can have multiple sites)
   - Hostname should be your blog's domain/path
   - The hostname is used for filtering in the dashboard

5. **Enable Automatic Setup (Optional):**
   - If prompted, **disable** automatic setup
   - We'll add the script manually for better control
   - This ensures it only loads on blog pages

6. **Save and Generate Script:**
   - Click **"Add site"** or **"Create"**
   - Cloudflare will generate a unique beacon script tag

---

## Step 2: Get Your Analytics Beacon Script

After creating the site, Cloudflare will display your analytics beacon script.

### What the Script Looks Like

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "YOUR-UNIQUE-TOKEN-HERE"}'></script>
<!-- End Cloudflare Web Analytics -->
```

### Important Notes

- **Token is unique** to your analytics site
- **Script is async/defer** - won't block page load
- **No configuration needed** - works out of the box
- **Loads from Cloudflare CDN** - fast and reliable

### Where to Find the Script Later

If you need to retrieve the script again:

1. Go to **Analytics & Logs** > **Web Analytics**
2. Click on your site name: **"Blog - vladbortnik.dev"**
3. Click **"JavaScript Snippet"** or **"Manage site"**
4. Copy the script tag shown

### Copy Your Script

**Copy the complete script tag now and keep it for the next step.**

---

## Step 3: Add Script to Blog HTML Files

The Cloudflare Web Analytics script should be added to the `<head>` section of your HTML files, preferably **near the end** but **before the closing `</head>` tag**.

### File 1: Blog Index Page

**File:** `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/index.html`

**Location:** Add after line 154 (after the Umami Analytics script, before `</head>`)

#### Before (Lines 150-155):
```html
        } else {
            console.log('🚫 [Dev Mode] Umami Analytics disabled on localhost');
        }
    </script>
  </head>

  <body class="blog-page">
```

#### After (with Cloudflare Web Analytics):
```html
        } else {
            console.log('🚫 [Dev Mode] Umami Analytics disabled on localhost');
        }
    </script>

    <!-- Cloudflare Web Analytics - Privacy-first, no cookies -->
    <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon='{"token": "YOUR-UNIQUE-TOKEN-HERE"}'></script>
    <!-- End Cloudflare Web Analytics -->
  </head>

  <body class="blog-page">
```

**Replace `YOUR-UNIQUE-TOKEN-HERE` with your actual Cloudflare token.**

---

### File 2: Blog Post Template

**File:** `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html`

**Location:** Add after line 175 (after the Umami Analytics script, before `</head>`)

#### Before (Lines 171-176):
```html
    } else {
      console.log('🚫 [Dev Mode] Umami Analytics disabled on localhost');
    }
  </script>
</head>

<body>
```

#### After (with Cloudflare Web Analytics):
```html
    } else {
      console.log('🚫 [Dev Mode] Umami Analytics disabled on localhost');
    }
  </script>

  <!-- Cloudflare Web Analytics - Privacy-first, no cookies -->
  <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "YOUR-UNIQUE-TOKEN-HERE"}'></script>
  <!-- End Cloudflare Web Analytics -->
</head>

<body>
```

**Replace `YOUR-UNIQUE-TOKEN-HERE` with your actual Cloudflare token.**

---

### File 3: Blog Templates (Future Posts)

You also have template files that should be updated:

**Files to update:**
- `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/templates/ARTICLE_TEMPLATE.html`
- `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/templates/_template.html`

Add the same Cloudflare Web Analytics script tag in the `<head>` section of these templates so all future blog posts automatically include analytics tracking.

---

### Development Environment Considerations

**Option 1: Load on All Environments (Recommended)**
```html
<!-- Cloudflare Web Analytics - Privacy-first, no cookies -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "YOUR-UNIQUE-TOKEN-HERE"}'></script>
```

**Pros:**
- Works immediately on production
- Can test analytics in staging environments
- Cloudflare filters by hostname anyway

**Cons:**
- Local development hits may show in analytics
- Can inflate metrics during local testing

---

**Option 2: Production-Only Loading (Like PostHog/Umami)**

If you want to match your existing analytics pattern and only load on production:

```html
<!-- Cloudflare Web Analytics - Production Only -->
<script>
    // Only load Cloudflare Web Analytics on production domain
    if (window.location.hostname === 'vladbortnik.dev' ||
        (window.location.hostname !== 'localhost' &&
         window.location.hostname !== '127.0.0.1' &&
         window.location.protocol === 'https:')) {
        const cfScript = document.createElement('script');
        cfScript.defer = true;
        cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
        cfScript.setAttribute('data-cf-beacon', '{"token": "YOUR-UNIQUE-TOKEN-HERE"}');
        document.head.appendChild(cfScript);
    } else {
        console.log('🚫 [Dev Mode] Cloudflare Web Analytics disabled on localhost');
    }
</script>
<!-- End Cloudflare Web Analytics -->
```

**Recommendation:** Use **Option 2** to match your existing analytics pattern (PostHog and Umami are production-only).

---

## Step 4: Verify Analytics Are Working

### 1. Deploy Your Changes

1. **Save both HTML files** with the Cloudflare script added
2. **Deploy to your server:**
   ```bash
   # If using git:
   cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev
   git add blog/index.html blog/posts/1-production-grade-multi-app-server-12-dollar-month.html
   git commit -m "feat: add Cloudflare Web Analytics to blog"
   git push

   # Then deploy to your server (manual or automated)
   ```

3. **Wait for deployment** to complete

### 2. Test Analytics Loading

1. **Visit your blog** in a browser:
   ```
   https://vladbortnik.dev/blog/
   ```

2. **Open Browser DevTools** (F12 or Right-click > Inspect)

3. **Check Network Tab:**
   - Filter for: `beacon.min.js`
   - You should see a successful request to `https://static.cloudflareinsights.com/beacon.min.js`
   - Status: `200 OK`

4. **Check Console Tab:**
   - If using production-only loading, you should see no errors
   - On localhost, you should see: `🚫 [Dev Mode] Cloudflare Web Analytics disabled on localhost`

5. **Verify Beacon Requests:**
   - After 10-15 seconds, check Network tab for requests to:
   - `https://cloudflareinsights.com/cdn-cgi/rum` (beacon data)
   - Status: `204 No Content` (successful)

### 3. Check Cloudflare Dashboard

1. **Wait 5-10 minutes** for data to appear (Cloudflare has a delay)

2. **Go to Analytics Dashboard:**
   ```
   https://dash.cloudflare.com/ > Analytics & Logs > Web Analytics
   ```

3. **Click on your site:** "Blog - vladbortnik.dev"

4. **Verify Data:**
   - You should see at least 1 page view
   - Your visit should appear in the timeline
   - Traffic sources should show "Direct" or your referrer

### 4. Test All Pages

Visit each blog page to ensure tracking works everywhere:
- **Blog Index:** https://vladbortnik.dev/blog/
- **Blog Post:** https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html

Check the Network tab on each page to confirm the beacon loads.

---

## Step 5: Access Your Analytics Dashboard

### Cloudflare Dashboard Access

**Main Dashboard URL:**
```
https://dash.cloudflare.com/
```

**Direct Link to Web Analytics:**
```
https://dash.cloudflare.com/:account/analytics/web-analytics
```

**Steps to Access:**

1. **Login to Cloudflare:**
   - Visit: https://dash.cloudflare.com/
   - Use your Cloudflare credentials

2. **Navigate to Web Analytics:**
   - Click **"Analytics & Logs"** in the left sidebar
   - Select **"Web Analytics"**

3. **Select Your Site:**
   - Click on **"Blog - vladbortnik.dev"**
   - You'll see the analytics dashboard

### Dashboard Navigation

The Cloudflare Web Analytics dashboard has several sections:

1. **Overview Tab:**
   - Total page views
   - Unique visitors
   - Visits (sessions)
   - Bounce rate
   - Page load time
   - Time period selector (24h, 7d, 30d, custom)

2. **Traffic Sources:**
   - Direct
   - Social
   - Search
   - Referral
   - Email
   - Paid

3. **Top Pages:**
   - Most visited pages
   - Page views per page
   - Percentage of total traffic

4. **Locations:**
   - Country distribution
   - World map visualization

5. **Browsers & Devices:**
   - Browser types
   - Operating systems
   - Device types (desktop, mobile, tablet)

6. **Technical Details:**
   - Page load times
   - HTTP versions
   - TLS versions

---

## What Data You'll See

### Key Metrics

#### 1. Page Views
- **Definition:** Total number of pages viewed
- **Use Case:** Measure content popularity
- **Example:** 1,000 page views in 7 days

#### 2. Unique Visitors
- **Definition:** Number of distinct visitors (privacy-preserving count)
- **Use Case:** Understand audience size
- **Example:** 650 unique visitors (65% of page views)
- **Note:** Calculated without cookies or fingerprinting

#### 3. Visits (Sessions)
- **Definition:** Number of distinct browsing sessions
- **Use Case:** Measure engagement frequency
- **Example:** 800 visits from 650 unique visitors = some return visitors

#### 4. Bounce Rate
- **Definition:** Percentage of single-page sessions
- **Use Case:** Measure content engagement
- **Example:** 45% bounce rate = 55% viewed multiple pages
- **Good:** 40-60% for blog content
- **Bad:** 80%+ (poor content/UX)

#### 5. Page Load Time
- **Definition:** Average time to load pages
- **Use Case:** Monitor performance
- **Example:** 1.2 seconds (good), 5 seconds (poor)
- **Target:** Under 2 seconds

#### 6. Traffic Sources
- **Direct:** Users typing URL or bookmarks
- **Social:** Twitter, LinkedIn, Reddit, etc.
- **Search:** Google, Bing, DuckDuckGo
- **Referral:** Links from other websites
- **Email:** Newsletter links

### Privacy-Preserving Methods

Cloudflare uses several techniques to count unique visitors **without cookies or fingerprinting:**

1. **IP Address Hashing:**
   - IP address + user agent hashed daily
   - Hash cannot be reversed
   - Different hash each day (no cross-day tracking)

2. **No Persistent Identifiers:**
   - No cookies stored
   - No localStorage used
   - No cross-site tracking

3. **Aggregated Data:**
   - Individual visitor paths not tracked
   - Only aggregate statistics shown

---

## Privacy & GDPR Compliance

### Why Cloudflare Web Analytics is Privacy-First

**1. No Cookies**
- GDPR/CCPA compliant by design
- No consent banner required
- No cookie policy updates needed

**2. No Personal Data Collected**
- No personally identifiable information (PII)
- IP addresses hashed and not stored
- No cross-site tracking

**3. No Third-Party Sharing**
- Data never sold to advertisers
- No data sent to third parties
- Cloudflare doesn't monetize your analytics data

**4. GDPR Article 6(1)(f) Compliant**
- Legitimate interest basis
- Minimal data collection
- Privacy-preserving techniques

**5. EU Data Centers Available**
- Data can be processed in EU
- Meets GDPR data residency requirements

### Privacy Policy Update (Optional)

While Cloudflare Web Analytics doesn't require consent, you may want to mention it in your privacy policy:

```markdown
### Analytics

This website uses Cloudflare Web Analytics to understand visitor traffic and improve content. Cloudflare Web Analytics:

- Does not use cookies or track personal information
- Does not collect personally identifiable information
- Collects only aggregated, anonymized data
- Is fully GDPR, CCPA, and PECR compliant

For more information, see: https://www.cloudflare.com/web-analytics/
```

---

## Troubleshooting

### Issue 1: Script Not Loading

**Symptoms:**
- No network request to `beacon.min.js`
- No analytics data in dashboard

**Solutions:**

1. **Check script tag syntax:**
   ```html
   <!-- Correct -->
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
           data-cf-beacon='{"token": "abc123"}'></script>

   <!-- Wrong - missing quotes around token -->
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
           data-cf-beacon={"token": "abc123"}></script>
   ```

2. **Verify token is correct:**
   - Check Cloudflare dashboard for correct token
   - Ensure no extra spaces or characters

3. **Check browser console for errors:**
   - Open DevTools > Console
   - Look for JavaScript errors

4. **Verify script is in `<head>` section:**
   - Script must be inside `<head>`, not `<body>`

---

### Issue 2: Data Not Appearing in Dashboard

**Symptoms:**
- Script loads successfully
- Beacon requests succeed (204 status)
- But no data in dashboard

**Solutions:**

1. **Wait 10-15 minutes:**
   - Cloudflare has a delay in processing data
   - Real-time data is not instant

2. **Check hostname filter:**
   - In dashboard, verify hostname filter matches your site
   - Change time period (last 24 hours vs. last 7 days)

3. **Verify site is live:**
   - Ensure you're testing on production domain (not localhost)
   - If using production-only script, test on `vladbortnik.dev`

4. **Check ad-blockers:**
   - Some ad-blockers block analytics (even Cloudflare)
   - Test in incognito mode with extensions disabled

---

### Issue 3: Multiple Analytics Conflicts

**Symptoms:**
- Page performance degraded
- Multiple analytics scripts interfering

**Solutions:**

1. **Review all analytics scripts:**
   - PostHog: Event tracking, user behavior
   - Umami: Self-hosted web analytics
   - Cloudflare: Privacy-first page view tracking

2. **Ensure scripts are async/defer:**
   - All scripts should be non-blocking
   - Use `defer` or `async` attributes

3. **Monitor page load time:**
   - Check Cloudflare Web Analytics "Page Load Time" metric
   - Target: Under 2 seconds

---

### Issue 4: Ad-Blockers Blocking Cloudflare

**Symptoms:**
- Beacon blocked by browser extension
- Network request shows "blocked" status

**Solutions:**

1. **Educate users:**
   - Cloudflare is privacy-first (no tracking, no cookies)
   - Some ad-blockers whitelist Cloudflare by default

2. **Accept the limitation:**
   - No analytics solution is 100% ad-blocker proof
   - Cloudflare is **better** than Google Analytics at avoiding blocks

3. **Use multiple analytics:**
   - PostHog + Umami + Cloudflare = triangulate real traffic
   - Compare data across platforms

---

### Issue 5: Localhost Data Pollution

**Symptoms:**
- Local development visits appearing in analytics
- Inaccurate visitor counts

**Solutions:**

1. **Use production-only loading** (recommended):
   ```javascript
   if (window.location.hostname === 'vladbortnik.dev') {
       // Load Cloudflare script
   }
   ```

2. **Filter by hostname in dashboard:**
   - Cloudflare allows filtering by hostname
   - Exclude localhost traffic in reports

---

## Analytics Stack Comparison

You now have **three analytics platforms** on your blog:

| Feature | PostHog | Umami | Cloudflare Web Analytics |
|---------|---------|-------|--------------------------|
| **Purpose** | Event tracking, user behavior | Self-hosted analytics | Privacy-first page views |
| **Cost** | Free tier | Self-hosted (free) | Free forever |
| **Privacy** | GDPR compliant | GDPR compliant | GDPR compliant, no cookies |
| **Ad-blocker Resistance** | Medium | High | High |
| **Setup Complexity** | Medium | High | Low |
| **Custom Events** | ✅ Yes | ✅ Yes | ❌ No |
| **Unique Visitors** | ✅ Yes (with cookies) | ✅ Yes | ✅ Yes (no cookies) |
| **Traffic Sources** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Real-time Data** | ✅ Yes | ✅ Yes | ⏱️ 5-10 min delay |
| **Session Replay** | ✅ Yes (paid) | ❌ No | ❌ No |
| **Funnels** | ✅ Yes | ❌ No | ❌ No |
| **Data Ownership** | Hosted by PostHog | Self-hosted | Hosted by Cloudflare |

### Recommended Usage

**PostHog:**
- Track button clicks (e.g., "Share on Twitter", "Copy link")
- Monitor user flows (e.g., blog index → article → contact)
- A/B testing (if needed)
- Feature flags (if needed)

**Umami:**
- Self-hosted analytics for full data ownership
- Compare data with Cloudflare for accuracy
- Custom events and goals
- Detailed user paths

**Cloudflare Web Analytics:**
- Primary unique visitor tracking (most accurate, ad-blocker resistant)
- Page view metrics for blog launch stats
- Traffic source analysis
- Performance monitoring (page load time)
- Geographic distribution

**Strategy:**
- Use **Cloudflare** for primary blog metrics (visitors, page views, traffic sources)
- Use **PostHog** for detailed event tracking and user behavior
- Use **Umami** for self-hosted analytics and data validation
- **Triangulate data** across platforms for most accurate insights

---

## Summary Checklist

Before launching, ensure you've completed:

- [ ] **Created Cloudflare Web Analytics site** in dashboard
- [ ] **Copied analytics beacon script** with your unique token
- [ ] **Added script to blog/index.html** (after Umami, before `</head>`)
- [ ] **Added script to blog post HTML** (after Umami, before `</head>`)
- [ ] **Updated blog templates** for future posts
- [ ] **Deployed changes** to production server
- [ ] **Verified script loads** in browser DevTools (Network tab)
- [ ] **Confirmed data appears** in Cloudflare dashboard (wait 10 min)
- [ ] **Tested on mobile** and desktop
- [ ] **Documented token** for future reference
- [ ] **Updated privacy policy** (optional but recommended)

---

## Additional Resources

**Cloudflare Documentation:**
- [Web Analytics Overview](https://developers.cloudflare.com/analytics/web-analytics/)
- [Privacy Policy](https://www.cloudflare.com/web-analytics/)
- [FAQ](https://developers.cloudflare.com/analytics/web-analytics/faq/)

**Testing Tools:**
- [Browser DevTools](https://developer.chrome.com/docs/devtools/) - Network tab for verifying script loads
- [Cloudflare Dashboard](https://dash.cloudflare.com/) - Main analytics interface

**Support:**
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)

---

## Next Steps After Setup

Once Cloudflare Web Analytics is running:

1. **Monitor for 1 week:**
   - Check daily visitor counts
   - Identify top-performing pages
   - Analyze traffic sources

2. **Compare with Umami/PostHog:**
   - Cross-reference unique visitor counts
   - Verify page view accuracy
   - Identify discrepancies (ad-blocker blocking)

3. **Optimize based on data:**
   - Write more content on popular topics
   - Improve pages with high bounce rates
   - Double down on successful traffic sources

4. **Share your blog:**
   - Post on Twitter/X, LinkedIn, Reddit, Hacker News
   - Monitor traffic spikes in real-time
   - Celebrate your launch!

---

**Document Status:** Ready for Implementation
**Last Updated:** November 10, 2025
**Author:** Claude (Anthropic)
**For:** Vlad Bortnik - vladbortnik.dev

---

## Questions or Issues?

If you encounter any problems during setup:

1. Check the **Troubleshooting** section above
2. Review **Cloudflare Web Analytics FAQ**: https://developers.cloudflare.com/analytics/web-analytics/faq/
3. Test in browser DevTools (F12 > Network tab)
4. Verify script syntax matches examples exactly

Good luck with your blog launch!
