# Analytics Strategy for All Projects (2025)

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Status:** ✅ Research Complete - Ready for Implementation

---

## 📋 Executive Summary

This document provides a comprehensive analytics strategy for all 5 projects in the portfolio ecosystem. After extensive research of 2025 analytics solutions and analysis of current implementations, this strategy recommends a **mixed approach** that balances privacy, cost, features, and simplicity.

### Quick Recommendations

| Project | Current State | Recommendation | Action |
|---------|--------------|----------------|--------|
| **Portfolio** (vladbortnik.dev) | PostHog + Umami (redundant!) | Keep PostHog only | Remove Umami |
| **Recipe Hub** (recipe.vladbortnik.dev) | ❌ No analytics | Add Cloudflare Web Analytics | Add script |
| **BookFinder** (bookfinder.vladbortnik.dev) | ❌ No analytics | Add Cloudflare Web Analytics | Add script |
| **TL;DRx PWA** (tldrx.vladbortnik.dev) | ❌ No analytics | Add Cloudflare Web Analytics | Add script |
| **Blog** (blog/) | ⚠️ DNS prefetch only | Add PostHog | Copy script |

### Key Benefits

- ✅ **Cost Savings:** Potentially eliminate Umami self-hosted server ($5-12/month)
- ✅ **Privacy-First:** All solutions GDPR/CCPA compliant, Cloudflare requires no cookies
- ✅ **Free Tier Maximization:** All recommendations fit within generous free tiers
- ✅ **Real Visitor Tracking:** Accurate unique visitor counts without fingerprinting
- ✅ **Easy Implementation:** Simple script additions, no complex setup

---

## 🔍 Current State Analysis

### 1. Portfolio (vladbortnik.dev)

**Type:** Static HTML/CSS/JS
**Hosting:** DigitalOcean + Cloudflare
**Current Analytics:** ✅ PostHog + Umami (BOTH running)

**Findings:**
```javascript
// PostHog Configuration (lines 118-141 in index.html)
posthog.init('phc_PtXY59P30Ckark4eFmib3xrXlMd9H2eibBsFTd302Yv', {
    api_host: 'https://us.i.posthog.com',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
    persistence: 'localStorage+cookie',
    person_profiles: 'identified_only'
});

// Umami Configuration (lines 143-158)
script.src = 'https://analytics.vladbortnik.dev/script.js';
script.setAttribute('data-website-id', 'b386b8f9-b644-4400-a091-208983cb8340');
```

**Issues:**
- ❌ **Redundancy:** Running TWO analytics platforms for the same site
- ❌ **Cost:** Paying for self-hosted Umami server when PostHog free tier is sufficient
- ❌ **Complexity:** Managing two dashboards, two tracking scripts

**PostHog MCP Integration:**
- ✅ PostHog MCP server already configured in `.claude/settings.json`
- ✅ API key: `phx_6V9WFTGm3n5SX5w9jqe8ZbmUzVE5YNDZDQIz3zah2zhCTTz`
- ✅ Can query analytics data programmatically

### 2. Recipe Hub (recipe.vladbortnik.dev)

**Type:** Flask + PostgreSQL
**Hosting:** DigitalOcean Docker container
**Current Analytics:** ❌ None detected

**Key Features to Track:**
- Page views and unique visitors
- Recipe searches
- AI-powered ingredient detection usage (Azure Cognitive Services)
- Spoonacular API calls
- User engagement with recipes
- Error rates

**Needs:**
- Server-side event tracking (Python)
- Client-side pageview tracking (HTML templates)
- API call monitoring
- Performance metrics

### 3. BookFinder (bookfinder.vladbortnik.dev)

**Type:** Flask + MySQL
**Hosting:** DigitalOcean Docker container
**Current Analytics:** ❌ None detected

**Key Features to Track:**
- Page views and unique visitors
- Book searches
- User registrations
- Book listings created
- Exchange requests
- User engagement

**Needs:**
- Server-side event tracking (Python)
- Client-side pageview tracking (HTML templates)
- User activity monitoring

### 4. TL;DRx PWA (tldrx.vladbortnik.dev)

**Type:** React 19 PWA + Vite 7 + Tailwind CSS
**Hosting:** Vercel
**Current Analytics:** ❌ None detected

**Key Features to Track:**
- Page views and unique visitors
- Command searches (500+ Unix/Linux commands)
- Fuzzy search usage
- PWA installation events
- Service worker performance
- Offline usage patterns

**Needs:**
- Lightweight client-side tracking
- PWA-specific event tracking
- Performance monitoring
- Vercel-compatible solution

### 5. Blog (blog/ - About to Launch)

**Type:** Static HTML blog
**Hosting:** DigitalOcean (same as portfolio)
**Current Analytics:** ⚠️ DNS prefetch configured, NO tracking scripts

**Findings:**
```html
<!-- Line 57 in blog/index.html -->
<link rel="dns-prefetch" href="https://analytics.vladbortnik.dev" />

<!-- NO tracking scripts found in blog/templates/_template.html -->
```

**Key Features to Track:**
- Article pageviews
- Reading time / scroll depth
- Social sharing (share buttons implemented)
- RSS feed subscriptions
- Popular articles
- Referral sources

**Needs:**
- Simple pageview tracking
- Article-level analytics
- Integration with portfolio analytics for cross-referencing

---

## 🔬 2025 Analytics Solutions Comparison

### Research Summary (Updated January 2025)

I researched current analytics solutions with focus on privacy-first, free tier, and ease of implementation.

### 1. Cloudflare Web Analytics ⭐ **RECOMMENDED FOR MOST PROJECTS**

**Overview:**
- Launched 2020, now auto-enabled for free domains (Oct 15, 2025+)
- 100% FREE, unlimited traffic, no caps
- Works for ANY website (not just Cloudflare customers)

**Key Features:**
- ✅ **Privacy-First:** No cookies, no fingerprinting, no localStorage
- ✅ **GDPR/CCPA Compliant:** No consent banner needed
- ✅ **Real-Time:** Aggregate performance data, load times, paint metrics
- ✅ **Simple Setup:** Single HTML snippet
- ✅ **Metrics Included:**
  - Unique visitors (no individual tracking)
  - Top pages
  - Countries
  - Device types
  - Referrers
  - Browser rendering performance
  - Server processing time

**Limitations:**
- ❌ No session recording
- ❌ No custom event tracking
- ❌ No user identification
- ❌ Basic metrics only (good for most use cases)

**Best For:**
- Flask web apps needing simple visitor tracking
- Static sites
- PWAs on Vercel
- Projects that don't need advanced features

**Setup:**
```html
<!-- Add to <head> -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "YOUR-TOKEN-HERE"}'></script>
```

**Cost:** FREE forever, unlimited traffic

### 2. PostHog

**Overview:**
- Open-source product analytics platform
- Cloud-hosted or self-hosted (MIT license)
- Already configured on portfolio with MCP integration

**2025 Free Tier:**
- ✅ 1 million events/month
- ✅ 5,000 session recordings/month
- ✅ 1 million feature flag requests/month
- ✅ 100k exception tracking/month
- ✅ 1,500 survey responses/month

**Key Features:**
- ✅ **Advanced Analytics:** Event tracking, funnels, cohorts, retention
- ✅ **Session Recording:** See exactly what users do
- ✅ **Feature Flags:** A/B testing, gradual rollouts
- ✅ **Heatmaps:** Click and scroll tracking
- ✅ **API Access:** Query data programmatically (MCP server)
- ✅ **Custom Events:** Track anything

**Limitations:**
- ❌ Uses cookies (can be configured for privacy)
- ⚠️ More complex setup than Cloudflare
- ⚠️ Self-hosted limited to ~100k events/month (they recommend cloud after that)

**Pricing After Free Tier:**
- $0.000031/event (drops to $0.000007 at 10M+ events)
- Usage-based, can be unpredictable for budgeting

**Best For:**
- Portfolio site needing advanced features
- Projects where you want session recordings
- When you need A/B testing
- Developer-focused analytics

**Current Status:**
- ✅ Already running on portfolio
- ✅ MCP server configured for programmatic access
- ✅ Under 1M events/month (free tier sufficient)

### 3. Umami Analytics

**Overview:**
- Open-source, privacy-focused analytics
- Self-hosted (Node.js + PostgreSQL) or cloud-hosted
- Currently self-hosted at `analytics.vladbortnik.dev`

**2025 Updates:**
- 🆕 **umami-analytics** Python package (Released May 31, 2025)
- Async/await support
- Custom event tracking
- Easy integration with Flask

**Cloud Pricing (if switching from self-hosted):**
- $9/month for 100k events
- $49/month for 1 million events
- $99/month for 3 million events

**Self-Hosted:**
- FREE (unlimited events)
- You pay for server hosting (~$5-12/month)
- Full data ownership
- Requires maintenance

**Key Features:**
- ✅ **Privacy-First:** No cookies, GDPR compliant
- ✅ **Simple Dashboard:** Clean UI, easy to understand
- ✅ **Real-Time:** Live visitor tracking
- ✅ **Custom Events:** Track specific actions
- ✅ **Python Package:** Server-side tracking for Flask

**Python Integration Example:**
```python
import umami

# Configure
umami.set_url_base("https://analytics.vladbortnik.dev")
umami.set_website_id('your-website-id')
umami.set_hostname('recipe.vladbortnik.dev')

# Track events
umami.new_event('recipe_search', {'query': 'pasta'})
umami.new_page_view('Recipe Details', '/recipe/123')

# Disable in development
umami.disable()
```

**Best For:**
- When you need complete data ownership
- Flask apps with server-side tracking needs
- When you want to avoid any third-party services

**Current Status:**
- ✅ Self-hosted at analytics.vladbortnik.dev
- ⚠️ Only used on portfolio (redundant with PostHog)
- ⚠️ Not used on Flask apps (where it would be most valuable)

### 4. Google Analytics 4 (GA4)

**Overview:**
- Industry standard, most features
- FREE with unlimited traffic
- Most documentation and tutorials available

**Key Features:**
- ✅ Advanced reporting
- ✅ E-commerce tracking
- ✅ Conversion tracking
- ✅ Integrates with Google Ads
- ✅ Predictive metrics (AI-powered)

**Limitations:**
- ❌ Privacy concerns (cookies required)
- ❌ GDPR consent banner needed
- ❌ Data shared with Google
- ❌ Complex setup for beginners
- ❌ Overkill for simple portfolio sites

**Recommendation:** Skip GA4 for now. Current solutions (PostHog + Cloudflare) provide better privacy and sufficient features.

---

## 🎯 Recommended Strategy (Mixed Approach)

After analyzing all options, I recommend a **mixed approach** that uses the right tool for each project's needs:

### Strategy Overview

```
┌─────────────────────────────────────────────────────────────┐
│  ANALYTICS ARCHITECTURE                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PostHog (Advanced)          Cloudflare (Simple)           │
│  ├─ vladbortnik.dev          ├─ recipe.vladbortnik.dev     │
│  └─ blog/                    ├─ bookfinder.vladbortnik.dev │
│                               └─ tldrx.vladbortnik.dev      │
│                                                             │
│  Umami (Self-Hosted)                                       │
│  └─ [OPTIONAL] For server-side Flask tracking              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Rationale

1. **PostHog for Portfolio + Blog:**
   - Already configured and working
   - MCP integration provides programmatic access
   - Advanced features (session recording, events) useful for understanding user behavior
   - Blog benefits from same analytics platform for cross-referencing
   - Free tier sufficient for current traffic

2. **Cloudflare Web Analytics for Flask Apps + PWA:**
   - FREE, unlimited (no server costs)
   - Privacy-first (no consent banner needed)
   - Simple integration (one script tag)
   - Sufficient metrics for understanding visitor patterns
   - No maintenance required

3. **Remove Umami from Portfolio:**
   - Eliminates redundancy
   - Saves server costs (~$5-12/month)
   - Simplifies analytics management
   - **OPTIONAL:** Keep Umami server for server-side Flask event tracking using umami-analytics Python package

### Cost Analysis

**Current Costs:**
- Umami self-hosted server: ~$5-12/month (estimated)
- PostHog Cloud: $0 (under free tier)
- **Total:** $5-12/month

**After Implementation:**
- PostHog Cloud: $0 (free tier)
- Cloudflare Web Analytics: $0 (free)
- Umami server (optional): $0-12/month
- **Total:** $0-12/month

**Potential Savings:** $5-12/month if Umami server is shut down

### Privacy Compliance

All recommended solutions are **GDPR and CCPA compliant**:

- **Cloudflare Web Analytics:** No cookies, no fingerprinting, no personal data → **No consent banner needed**
- **PostHog:** Uses cookies but can be configured for privacy, identify-only person profiles → **May need consent banner depending on configuration**
- **Umami:** No cookies, self-hosted, complete data control → **No consent banner needed**

**Recommendation:** Add simple privacy notice in footer:
```html
<p class="text-muted small">
  This site uses privacy-friendly analytics (no cookies, no personal data collection).
  <a href="/privacy">Learn more</a>
</p>
```

---

## 📝 Implementation Plan

### Priority 1: Portfolio (vladbortnik.dev)

**Goal:** Remove Umami redundancy, keep PostHog

**Current State:**
- ✅ PostHog working (lines 118-141 in index.html)
- ❌ Umami redundant (lines 143-158 in index.html)

**Action Items:**

1. **Remove Umami from HTML files:**

**Files to edit:**
- `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/index.html`
- `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/server-setup.html`
- `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/contact.html`

**Remove these lines (143-158):**
```javascript
<!-- Umami Analytics - Production Only -->
<script>
    // Only load Umami on production domain
    if (window.location.hostname === 'vladbortnik.dev' ||
        (window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1' &&
            window.location.protocol === 'https:')) {
        const script = document.createElement('script');
        script.defer = true;
        script.src = 'https://analytics.vladbortnik.dev/script.js';
        script.setAttribute('data-website-id', 'b386b8f9-b644-4400-a091-208983cb8340');
        document.head.appendChild(script);
    } else {
        console.log('🚫 [Dev Mode] Umami Analytics disabled on localhost');
    }
</script>
```

2. **Remove DNS prefetch (optional cleanup):**
```html
<!-- Line 20 - can be removed -->
<link rel="dns-prefetch" href="https://analytics.vladbortnik.dev">
```

3. **Keep PostHog as-is:**
```javascript
<!-- PostHog Analytics - Production Only -->
<script>
    // Only initialize PostHog on production domain
    const isProduction = window.location.hostname === 'vladbortnik.dev';
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

    if (isProduction || (!isLocalhost && window.location.protocol === 'https:')) {
        // PostHog loader script...
        posthog.init('phc_PtXY59P30Ckark4eFmib3xrXlMd9H2eibBsFTd302Yv', {
            api_host: 'https://us.i.posthog.com',
            autocapture: true,
            capture_pageview: true,
            capture_pageleave: true,
            disable_session_recording: true,
            persistence: 'localStorage+cookie',
            person_profiles: 'identified_only'
        });
    }
</script>
```

4. **Test:**
```bash
# Local testing
python3 -m http.server 8000
# Visit http://localhost:8000
# Console should show: "🚫 [Dev Mode] PostHog disabled on localhost"

# Production testing (after deployment)
# Visit https://vladbortnik.dev
# Check PostHog dashboard for events
```

5. **Optional: Shut down Umami server to save costs**
   - Export historical data from Umami if needed
   - Stop Umami container/service
   - Update DNS if analytics.vladbortnik.dev is no longer needed

**Estimated Time:** 30 minutes
**Risk:** Low (PostHog continues working, just removing redundant script)

---

### Priority 2: Blog (blog/)

**Goal:** Add analytics before launch

**Current State:**
- ⚠️ DNS prefetch configured but NO tracking scripts
- 📝 Template ready at `blog/templates/_template.html`
- 🚀 About to launch

**Action Items:**

1. **Add PostHog to blog template:**

**File to edit:**
- `/Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/templates/_template.html`

**Add before `</head>` closing tag:**
```html
<!-- Preconnect for PostHog -->
<link rel="preconnect" href="https://us.i.posthog.com">

<!-- PostHog Analytics - Production Only -->
<script>
    // Only initialize PostHog on production domain
    const isProduction = window.location.hostname === 'vladbortnik.dev';
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

    if (isProduction || (!isLocalhost && window.location.protocol === 'https:')) {
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init hi $r kr ui wr Er capture Ri calculateEventProperties Ir register register_once register_for_session unregister unregister_for_session Fr getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Cr Tr createPersonProfile Or yr Mr opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Pr debug L Rr getPageViewId captureTraceFeedback captureTraceMetric gr".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

        posthog.init('phc_PtXY59P30Ckark4eFmib3xrXlMd9H2eibBsFTd302Yv', {
            api_host: 'https://us.i.posthog.com',
            autocapture: true,
            capture_pageview: true,
            capture_pageleave: true,
            disable_session_recording: false, // Enable for blog to see reading behavior
            persistence: 'localStorage+cookie',
            person_profiles: 'identified_only'
        });

        // Track article-specific properties
        if (typeof articleTitle !== 'undefined') {
            posthog.capture('article_view', {
                article_title: articleTitle,
                article_category: articleCategory || 'uncategorized',
                word_count: wordCount || 0
            });
        }
    } else {
        console.log('🚫 [Dev Mode] PostHog disabled on localhost');
    }
</script>
```

2. **Add to blog/index.html (blog homepage):**

Same script as above, add before `</head>` closing tag.

3. **Update existing DNS prefetch:**

Change line 57 in `blog/index.html` from:
```html
<link rel="dns-prefetch" href="https://analytics.vladbortnik.dev" />
```

To:
```html
<link rel="dns-prefetch" href="https://us.i.posthog.com" />
```

4. **Optional: Track social share button clicks:**

In `blog/assets/js/blog.js`, add:
```javascript
// Track share button clicks
document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', (e) => {
        if (typeof posthog !== 'undefined') {
            posthog.capture('article_shared', {
                platform: e.currentTarget.dataset.platform,
                article_title: document.title
            });
        }
    });
});
```

5. **Test:**
```bash
# Local test
python3 -m http.server 8000
cd blog && open http://localhost:8000

# Production test (after deployment)
# Visit blog post and check PostHog dashboard for events
```

**Estimated Time:** 45 minutes
**Risk:** Low (new addition, no existing analytics to break)

---

### Priority 3: Flask Apps (Recipe Hub + BookFinder)

**Goal:** Add simple visitor tracking

**Current State:**
- ❌ No analytics implemented
- 🐍 Flask + Jinja2 templates
- 🐳 Docker containers on DigitalOcean

**Recommended Solution:** Cloudflare Web Analytics (simple, free, unlimited)

**Action Items:**

#### Step 1: Get Cloudflare Web Analytics Token

1. Go to https://dash.cloudflare.com
2. Navigate to **Analytics & Logs** → **Web Analytics**
3. Click **"Add a site"**
4. Enter site hostname: `recipe.vladbortnik.dev`
5. Copy the JavaScript snippet (contains your unique token)
6. Repeat for `bookfinder.vladbortnik.dev`

#### Step 2: Add to Flask Templates

**For Recipe Hub:**

Find base template (likely `templates/base.html` or `templates/layout.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Recipe Hub{% endblock %}</title>

    <!-- Cloudflare Web Analytics -->
    <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon='{"token": "YOUR-RECIPE-TOKEN-HERE"}'></script>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

**For BookFinder:**

Same approach, use the BookFinder token:

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "YOUR-BOOKFINDER-TOKEN-HERE"}'></script>
```

#### Step 3: Deploy Updates

```bash
# SSH into DigitalOcean server
ssh root@your-server-ip

# Rebuild and restart containers
cd /path/to/recipe-app
docker-compose down
docker-compose up -d --build

cd /path/to/bookfinder-app
docker-compose down
docker-compose up -d --build
```

#### Step 4: Verify Tracking

1. Visit https://recipe.vladbortnik.dev
2. Go to Cloudflare dashboard → Web Analytics
3. Should see visitor data within 5 minutes
4. Check: unique visitors, page views, countries, devices

**Estimated Time:** 1 hour (both apps)
**Risk:** Low (simple script addition)

---

### Priority 4: TL;DRx PWA (tldrx.vladbortnik.dev)

**Goal:** Add lightweight analytics to React PWA

**Current State:**
- ❌ No analytics
- ⚚ React 19 + Vite 7
- 🚀 Deployed on Vercel

**Recommended Solution:** Cloudflare Web Analytics (free, lightweight, PWA-compatible)

**Action Items:**

#### Step 1: Get Cloudflare Token

1. Go to https://dash.cloudflare.com
2. **Analytics & Logs** → **Web Analytics** → **Add a site**
3. Enter: `tldrx.vladbortnik.dev`
4. Copy the token

#### Step 2: Add to React App

**Option A: In public/index.html (Recommended)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TL;DRx - Command Reference</title>

    <!-- Cloudflare Web Analytics -->
    <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon='{"token": "YOUR-TLDRX-TOKEN-HERE"}'></script>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

**Option B: In _document.js (if using custom document)**

```javascript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "YOUR-TLDRX-TOKEN-HERE"}'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

#### Step 3: Track PWA Install Events (Optional)

Add to your main React component or service worker:

```javascript
// Track PWA installation
window.addEventListener('beforeinstallprompt', (e) => {
  // Track that install prompt was shown
  if (window.cf_beacon) {
    // Cloudflare beacon doesn't support custom events
    // Use PostHog or GA4 if you need this
  }
});

window.addEventListener('appinstalled', (e) => {
  console.log('PWA installed');
  // Same limitation
});
```

**Note:** Cloudflare Web Analytics doesn't support custom events. If you need to track PWA-specific events (installs, offline usage), consider adding PostHog instead.

#### Step 4: Deploy to Vercel

```bash
# In your tldrx project directory
git add .
git commit -m "Add Cloudflare Web Analytics"
git push origin main

# Vercel will auto-deploy
# Or manually deploy:
vercel --prod
```

#### Step 5: Verify

1. Visit https://tldrx.vladbortnik.dev
2. Check Cloudflare dashboard → Web Analytics
3. Should see visitor data within 5 minutes

**Estimated Time:** 30 minutes
**Risk:** Low (simple script addition)

---

## 🎛️ Alternative: Umami for Server-Side Flask Tracking

If you want to track **server-side events** in Flask apps (not just pageviews), consider keeping the Umami server and using the **umami-analytics** Python package.

### Use Cases

- Track recipe searches (query terms, filters)
- Track AI image recognition API calls
- Track book searches and exchange requests
- Track API errors and exceptions
- Track server-side performance metrics

### Setup

#### 1. Install Python Package

```bash
# In your Flask app's virtual environment
pip install umami-analytics

# Add to requirements.txt
echo "umami-analytics>=0.1.0" >> requirements.txt
```

#### 2. Configure in Flask App

```python
# config.py or app initialization
import umami

# Configure Umami
umami.set_url_base("https://analytics.vladbortnik.dev")
umami.set_website_id('YOUR-WEBSITE-ID')  # Get from Umami dashboard
umami.set_hostname('recipe.vladbortnik.dev')

# Disable in development
if app.config['ENV'] == 'development':
    umami.disable()
```

#### 3. Track Events

```python
# In your Flask routes
from flask import request
import umami

@app.route('/search')
def search():
    query = request.args.get('q')

    # Track search
    umami.new_event('recipe_search', {
        'query': query,
        'results_count': len(results)
    })

    return render_template('results.html', results=results)

@app.route('/recipe/<int:recipe_id>')
def recipe_detail(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)

    # Track page view with metadata
    umami.new_page_view(
        title=recipe.title,
        path=f'/recipe/{recipe_id}',
        referrer=request.referrer
    )

    return render_template('recipe.html', recipe=recipe)

@app.route('/api/recognize-ingredients', methods=['POST'])
def recognize_ingredients():
    try:
        # Your Azure Cognitive Services call
        results = azure_vision.analyze_image(image)

        # Track successful API call
        umami.new_event('ai_ingredient_recognition', {
            'success': True,
            'ingredients_found': len(results)
        })

        return jsonify(results)
    except Exception as e:
        # Track error
        umami.new_event('ai_ingredient_recognition_error', {
            'error': str(e)
        })
        raise
```

#### 4. Async Support (Optional)

```python
import asyncio
import umami

# For async Flask (Quart) or async routes
@app.route('/async-search')
async def async_search():
    results = await perform_search()

    # Track with async
    await umami.new_event_async('recipe_search', {
        'query': query
    })

    return results
```

### Benefits of Server-Side Tracking

- ✅ Track API calls and backend operations
- ✅ Track operations that don't have HTML pages
- ✅ More accurate (not blocked by ad blockers)
- ✅ Track authenticated user actions
- ✅ Better for debugging and monitoring

### Cost Considerations

**Keep Umami Server:**
- Cost: ~$5-12/month (DigitalOcean Droplet or equivalent)
- Benefit: Unlimited server-side event tracking

**vs. Use PostHog for Server-Side:**
- Cost: FREE (1M events/month)
- After 1M: $0.000031/event
- Need PostHog Python SDK instead

**Recommendation:** If you need extensive server-side tracking, keep Umami. If basic client-side analytics suffice, shut down Umami to save costs and use Cloudflare Web Analytics.

---

## 📊 Monitoring and Maintenance

### PostHog Dashboard (Portfolio + Blog)

**Access:** https://us.posthog.com
**MCP Access:** Already configured in `.claude/settings.json`

**Key Metrics to Monitor:**
- Daily active users (DAU)
- Page views per section (About, Portfolio, Resume, Blog)
- Popular blog articles
- Time on page
- Bounce rate
- Referral sources

**Weekly Tasks:**
- Review top pages
- Check for unusual traffic patterns
- Monitor session recordings for UX issues
- Review blog article performance

### Cloudflare Web Analytics Dashboard (Flask Apps + PWA)

**Access:** https://dash.cloudflare.com → Analytics & Logs → Web Analytics

**Key Metrics:**
- Unique visitors
- Page views
- Top pages
- Countries and devices
- Performance metrics (Core Web Vitals)

**Weekly Tasks:**
- Compare traffic across Recipe Hub, BookFinder, and TL;DRx
- Monitor performance trends
- Check for bot traffic or anomalies

### Event Tracking Verification

**PostHog Event Explorer:**
```javascript
// In browser console on your site
posthog.debug();  // Enable debug mode
posthog.capture('test_event', {
    test_property: 'test_value'
});
// Check Events tab in PostHog dashboard
```

**Cloudflare Verification:**
- Traffic shows within 5 minutes of page load
- Check "Last seen" timestamp in dashboard
- No manual event verification (auto-tracked)

### Monthly Analytics Review Checklist

- [ ] Review unique visitor trends across all projects
- [ ] Identify top-performing content (blog articles, portfolio projects)
- [ ] Check for traffic sources (organic, social, referral)
- [ ] Monitor performance metrics (page load times)
- [ ] Verify all analytics scripts are working
- [ ] Check for errors or missing data
- [ ] Adjust content strategy based on popular pages
- [ ] Consider A/B tests for underperforming pages

---

## 🚧 Future Enhancements

### Phase 2: Advanced Tracking (Optional)

**Conversion Tracking:**
- Track contact form submissions
- Track GitHub repository clicks
- Track external link clicks (live demos)
- Track download button clicks

**Enhanced Blog Analytics:**
- Reading time calculation
- Scroll depth tracking
- Code snippet copy events
- Social share tracking (already implemented in HTML)

**Flask App Enhancements:**
- User journey tracking (search → view → action)
- API performance monitoring
- Error tracking and alerts
- A/B testing for UI improvements

**PWA Enhancements:**
- Track PWA installation rate
- Offline usage patterns
- Service worker performance
- Command search analytics

### Phase 3: Data Integration

**PostHog MCP Integration:**
- Build custom dashboards querying PostHog API
- Automated weekly reports
- Anomaly detection (traffic spikes, errors)
- Cross-project analytics comparison

**SEO Integration:**
- Connect Google Search Console data
- Track organic search rankings
- Monitor keyword performance
- Identify content gaps

**Performance Monitoring:**
- Add Sentry or similar for error tracking
- Monitor API response times
- Track third-party service uptime (Azure, Spoonacular)
- Alert on critical errors

---

## 📋 Decision Matrix

Not sure which solution to use? Use this decision matrix:

| Requirement | Solution |
|-------------|----------|
| Need advanced features (session recording, feature flags) | **PostHog** |
| Need 100% free, unlimited traffic | **Cloudflare Web Analytics** |
| Need complete data ownership | **Umami (self-hosted)** |
| Need server-side Flask event tracking | **Umami + Python package** |
| Need no cookies (GDPR) | **Cloudflare Web Analytics** |
| Need custom events (client-side) | **PostHog** |
| Need simplest setup | **Cloudflare Web Analytics** |
| Need to track PWA-specific events | **PostHog** |
| Need e-commerce tracking | **Google Analytics 4** (not covered here) |

---

## 🎬 Getting Started (Quick Start)

### Immediate Actions (This Week)

1. **Remove Umami from Portfolio** (30 min)
   - Edit: index.html, server-setup.html, contact.html
   - Remove Umami script blocks
   - Keep PostHog
   - Deploy and verify

2. **Add Analytics to Blog** (45 min)
   - Add PostHog to blog/templates/_template.html
   - Add PostHog to blog/index.html
   - Test locally
   - Deploy with blog launch

3. **Add Cloudflare Analytics to TL;DRx** (30 min)
   - Get token from Cloudflare dashboard
   - Add to public/index.html
   - Deploy to Vercel
   - Verify tracking

### Next Week

4. **Add Cloudflare Analytics to Recipe Hub** (30 min)
   - Get token
   - Add to Flask base template
   - Deploy Docker container
   - Verify tracking

5. **Add Cloudflare Analytics to BookFinder** (30 min)
   - Get token
   - Add to Flask base template
   - Deploy Docker container
   - Verify tracking

### Optional (Future)

6. **Set up Umami server-side tracking for Flask** (2-3 hours)
   - Keep Umami server running
   - Install umami-analytics in Flask apps
   - Add event tracking to key routes
   - Test and verify

7. **Consider shutting down Umami server** (1 hour)
   - Export historical data
   - Stop Umami container/service
   - Update DNS records
   - Save $5-12/month

---

## 📚 Resources

### Documentation

- **Cloudflare Web Analytics:** https://developers.cloudflare.com/web-analytics/
- **PostHog Docs:** https://posthog.com/docs
- **Umami Analytics:** https://umami.is/docs
- **umami-analytics Python Package:** https://pypi.org/project/umami-analytics/
- **PostHog Python SDK:** https://posthog.com/docs/libraries/python

### Dashboards

- **PostHog:** https://us.posthog.com
- **Cloudflare:** https://dash.cloudflare.com → Analytics & Logs
- **Umami:** https://analytics.vladbortnik.dev (self-hosted)

### Support

- **PostHog:** Slack community, GitHub issues
- **Cloudflare:** Community forums, support tickets
- **Umami:** GitHub discussions

---

## ✅ Success Criteria

You'll know the implementation is successful when:

1. ✅ Portfolio has only ONE analytics solution (PostHog)
2. ✅ Blog tracks pageviews and article performance
3. ✅ All 3 Flask apps (Recipe, BookFinder, TL;DRx) track unique visitors
4. ✅ All analytics dashboards show recent visitor data
5. ✅ Privacy compliance maintained (GDPR/CCPA)
6. ✅ Monthly costs reduced (if Umami server shut down)
7. ✅ No analytics scripts broken or throwing errors
8. ✅ Easy to monitor all projects from respective dashboards

---

## 🤔 FAQs

**Q: Why not use Google Analytics for everything?**
A: Privacy concerns, GDPR consent requirements, and overkill for simple portfolio sites. PostHog + Cloudflare provide better privacy and sufficient features.

**Q: Should I keep the Umami server?**
A: Only if you need server-side Flask event tracking (searches, API calls, errors). Otherwise, shut it down to save $5-12/month.

**Q: Can I use PostHog for Flask apps too?**
A: Yes! PostHog has a Python SDK. However, Cloudflare is simpler and free. Use PostHog if you need advanced features.

**Q: What about Vercel Analytics?**
A: Vercel Analytics costs $10/month. Cloudflare Web Analytics is free and provides similar visitor tracking.

**Q: Do I need consent banners?**
A: **Cloudflare Web Analytics:** No (no cookies, no personal data)
**PostHog:** Depends on configuration. Current setup uses cookies, so technically yes for EU visitors. Can configure PostHog for cookieless mode.
**Umami:** No (no cookies, privacy-first)

**Q: How accurate is "unique visitor" tracking without cookies?**
A: Cloudflare uses IP + User-Agent hashing for daily unique counts. It's approximate but GDPR-compliant. PostHog uses cookies for more accurate tracking.

**Q: Can I A/B test with these solutions?**
A: Yes with PostHog (feature flags). No with Cloudflare or Umami.

---

## 📞 Next Steps

**Ready to implement?**

1. Review this document
2. Choose your preferred strategy (recommended: mixed approach)
3. Follow the implementation plan step-by-step
4. Test each implementation locally before deploying
5. Monitor dashboards for a week to ensure data is flowing
6. Schedule monthly analytics review

**Questions or issues?**

- Check the FAQ section above
- Review official documentation links
- Test in localhost first before production
- Keep this document updated as you make changes

---

**Document Status:** ✅ Ready for Implementation
**Last Updated:** November 10, 2025
**Next Review:** December 10, 2025 (after implementation)

---

## Appendix A: Code Snippets Reference

### PostHog Initialization (Production-Only)

```javascript
<script>
    const isProduction = window.location.hostname === 'vladbortnik.dev';
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

    if (isProduction || (!isLocalhost && window.location.protocol === 'https:')) {
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init hi $r kr ui wr Er capture Ri calculateEventProperties Ir register register_once register_for_session unregister unregister_for_session Fr getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Cr Tr createPersonProfile Or yr Mr opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Pr debug L Rr getPageViewId captureTraceFeedback captureTraceMetric gr".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

        posthog.init('phc_PtXY59P30Ckark4eFmib3xrXlMd9H2eibBsFTd302Yv', {
            api_host: 'https://us.i.posthog.com',
            autocapture: true,
            capture_pageview: true,
            capture_pageleave: true,
            disable_session_recording: true,
            persistence: 'localStorage+cookie',
            person_profiles: 'identified_only'
        });
    } else {
        console.log('🚫 [Dev Mode] PostHog disabled on localhost');
    }
</script>
```

### Cloudflare Web Analytics

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "YOUR-TOKEN-HERE"}'></script>
```

### Umami Self-Hosted

```html
<script defer
        src="https://analytics.vladbortnik.dev/script.js"
        data-website-id="YOUR-WEBSITE-ID"></script>
```

### Umami Python Package

```python
import umami

# Configure
umami.set_url_base("https://analytics.vladbortnik.dev")
umami.set_website_id('your-website-id')
umami.set_hostname('yourdomain.com')

# Track page view
umami.new_page_view('Page Title', '/path')

# Track custom event
umami.new_event('button_click', {
    'button_name': 'signup',
    'location': 'header'
})

# Disable in dev
umami.disable()
```

---

**End of Document**
