# Redirect Management & Geographic Personalization Analysis

**Date**: November 10, 2025
**Site**: vladbortnik.dev
**Cloudflare Workers**: Available (Free tier: 100,000 requests/day)

---

## Executive Summary

### TL;DR - You Don't Need These Features Yet (But Set Up the Infrastructure Anyway)

**Current Need Assessment:**
- **Redirect Management**: 2/10 - Not needed now, but you'll need it within 6 months
- **Geo Personalization**: 1/10 - No current use case for your content type

**Why This Document Exists:**
- Setting up Cloudflare Workers redirect infrastructure is FREE and takes 5 minutes
- When you DO need redirects (blog URL changes, marketing links), you'll have it ready
- Better to have the code ready than scramble when you need to change a URL

**What To Do Now:**
1. ✅ Read this document to understand the capabilities
2. ✅ Copy the starter Worker code (Section 5)
3. ⏸️ **DON'T** implement actual redirects until you need them
4. 📌 Bookmark this for when you rename a blog post or need marketing links

---

## 1. Current State Analysis (From Your GitHub Repos)

### Your Current URL Structure

```
Production URLs:
- Main site:        vladbortnik.dev
- Blog index:       vladbortnik.dev/blog/
- Blog posts:       vladbortnik.dev/blog/posts/{slug}.html
- Project pages:    vladbortnik.dev/server-setup.html
                    vladbortnik.dev/contact.html
- Subdomains:       tldrx.vladbortnik.dev
                    recipe.vladbortnik.dev
                    bookfinder.vladbortnik.dev

Current Blog Posts:
- /blog/posts/1-production-grade-multi-app-server-12-dollar-month.html (Nov 9, 2025)
```

### Existing Redirect Configuration

**Nginx Configuration** (From production-server-infrastructure repo):
```nginx
# Only HTTP → HTTPS redirects (301)
server {
    listen 80;
    server_name vladbortnik.dev www.vladbortnik.dev;
    return 301 https://$host$request_uri;
}
```

**That's it.** No complex redirects, no URL rewrites, no geo-routing.

### Content Analysis

**Blog Topics**: DevOps, Docker, server infrastructure, Python, Flask
**Target Audience**: Global developer community
**Location-Specific Content**: None currently
**Multi-Language**: No
**Regional Variants**: No

**Conclusion**: Clean, simple setup with no redirect debt or geo requirements.

---

## 2. Redirect Management

### 2.1 Do You Need Redirects Right Now?

**Short Answer**: No.

**Long Answer**: Your site is new (Nov 2024), you have one blog post, and no URL migrations. BUT you'll need redirects soon for:

1. **Blog Post URL Changes** (Likelihood: HIGH - 80%)
   - You might rename a blog post slug for better SEO
   - External sites link to your old URL
   - Example: `1-production-grade-...` → `deploy-like-a-pro-...`

2. **Marketing Campaigns** (Likelihood: MEDIUM - 60%)
   - Trackable short URLs for social media
   - Example: `vladbortnik.dev/go/github` → GitHub profile
   - Example: `vladbortnik.dev/go/linkedin` → LinkedIn profile

3. **URL Structure Changes** (Likelihood: MEDIUM - 50%)
   - Moving from `/blog/posts/` to `/blog/`
   - Changing file extensions (`.html` to clean URLs)

4. **A/B Testing** (Likelihood: LOW - 20%)
   - Testing different landing pages
   - Feature flags for new sections

5. **External Link Management** (Likelihood: MEDIUM - 40%)
   - Publishers link to your content
   - You change the URL but can't ask them to update

### 2.2 When to Use Nginx vs Cloudflare Workers

| Scenario | Nginx | Workers | Reason |
|----------|-------|---------|--------|
| Permanent site structure change | ✅ | ❌ | Nginx is faster for high-traffic paths |
| Blog post URL rename | ❌ | ✅ | No server restart, instant updates |
| Marketing short links | ❌ | ✅ | Dynamic, trackable, external data source |
| A/B testing | ❌ | ✅ | Can use cookies, geo data, time-based logic |
| HTTP → HTTPS | ✅ | ❌ | Already handled efficiently by Nginx |
| Subdomain routing | ✅ | ❌ | Nginx load balancer handles this |
| Temporary redirects | ❌ | ✅ | Easy to modify without SSH access |
| Bulk migrations (100+ URLs) | ❌ | ✅ | Use Cloudflare Bulk Redirects API |

**Rule of Thumb**:
- **Nginx**: Permanent infrastructure changes affecting 1000+ requests/day
- **Workers**: Everything else (dynamic, temporary, low-frequency)

### 2.3 Cloudflare Workers Redirect Implementation

#### Basic Redirect Worker (Production-Ready)

```javascript
/**
 * Cloudflare Worker: Redirect Management
 * Deploy: wrangler deploy
 * Monitor: https://dash.cloudflare.com/workers
 */

// Define your redirects here
const REDIRECTS = new Map([
  // Blog post URL changes
  ['/blog/posts/old-slug.html', '/blog/posts/new-slug.html'],

  // Marketing short links
  ['/go/github', 'https://github.com/vladbortnik'],
  ['/go/linkedin', 'https://linkedin.com/in/vladbortnik'],
  ['/go/twitter', 'https://x.com/vladbortnik_dev'],

  // Clean URL rewrites (remove .html)
  ['/contact', '/contact.html'],
  ['/server-setup', '/server-setup.html'],

  // Legacy URL support (if you ever change structure)
  ['/blog/1-production-grade-multi-app-server-12-dollar-month.html',
   '/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html'],
]);

// Redirect status codes
const PERMANENT = 301; // For permanent URL changes (SEO juice transfers)
const TEMPORARY = 302; // For A/B testing, temporary campaigns
const SEE_OTHER = 303; // For POST → GET redirects (rare)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if redirect exists
    if (REDIRECTS.has(pathname)) {
      const destination = REDIRECTS.get(pathname);

      // Preserve query parameters
      const destinationUrl = new URL(destination, request.url);
      destinationUrl.search = url.search;

      // Log redirect (optional - for analytics)
      console.log(`Redirecting: ${pathname} → ${destinationUrl.href}`);

      return Response.redirect(destinationUrl.href, PERMANENT);
    }

    // No redirect needed - pass through to origin
    return fetch(request);
  }
};
```

#### Advanced Redirect Worker (With Pattern Matching)

```javascript
/**
 * Advanced Redirect Worker with Pattern Matching
 * Handles wildcards, regex patterns, and dynamic logic
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Pattern 1: Wildcard redirect (all /old/* → /new/*)
    if (pathname.startsWith('/old/')) {
      const newPath = pathname.replace('/old/', '/new/');
      return Response.redirect(new URL(newPath, url.origin).href, 301);
    }

    // Pattern 2: Remove file extensions
    if (pathname.endsWith('.html')) {
      const cleanPath = pathname.replace(/\.html$/, '');
      return Response.redirect(new URL(cleanPath, url.origin).href, 301);
    }

    // Pattern 3: Normalize trailing slashes
    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      return Response.redirect(new URL(pathname + '/', url.origin).href, 301);
    }

    // Pattern 4: Date-based redirects (blog archives)
    const datePattern = /^\/blog\/(\d{4})\/(\d{2})\/(.+)$/;
    const match = pathname.match(datePattern);
    if (match) {
      const [, year, month, slug] = match;
      return Response.redirect(`/blog/posts/${slug}`, 301);
    }

    // Pattern 5: Case-insensitive redirect
    const lowerPath = pathname.toLowerCase();
    if (pathname !== lowerPath) {
      return Response.redirect(new URL(lowerPath, url.origin).href, 301);
    }

    // No redirect needed
    return fetch(request);
  }
};
```

#### Redirect Worker with External Data Source (KV Storage)

```javascript
/**
 * Scalable Redirect Worker using Cloudflare KV
 * For managing 100+ redirects without code deployments
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check KV store for redirect
    const destination = await env.REDIRECTS_KV.get(pathname);

    if (destination) {
      // Preserve query parameters
      const destinationUrl = new URL(destination, request.url);
      destinationUrl.search = url.search;

      // Track redirect in analytics (optional)
      ctx.waitUntil(
        fetch('https://analytics.vladbortnik.dev/track', {
          method: 'POST',
          body: JSON.stringify({
            from: pathname,
            to: destination,
            timestamp: Date.now(),
          }),
        })
      );

      return Response.redirect(destinationUrl.href, 301);
    }

    // No redirect - pass through
    return fetch(request);
  }
};

// CLI: Add redirects to KV without code deployment
// wrangler kv:key put --binding=REDIRECTS_KV "/old-url" "/new-url"
```

### 2.4 Common Redirect Scenarios

#### Scenario 1: You Rename a Blog Post Slug

**Problem**: You published a blog post with a long, ugly slug and want to improve it for SEO.

```javascript
// Current URL:  /blog/posts/1-production-grade-multi-app-server-12-dollar-month.html
// Better URL:   /blog/deploy-like-a-pro.html

const REDIRECTS = new Map([
  ['/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html',
   '/blog/deploy-like-a-pro.html'],
]);

// Deploy in 30 seconds:
// 1. Update REDIRECTS map
// 2. wrangler deploy
// 3. Done - old links still work
```

#### Scenario 2: Marketing Campaign Short Links

**Problem**: You're tweeting about your server setup project and need a short, trackable URL.

```javascript
const MARKETING_LINKS = new Map([
  ['/go/server', '/server-setup.html'],
  ['/go/recipe', 'https://recipe.vladbortnik.dev'],
  ['/go/tldrx', 'https://tldrx.vladbortnik.dev'],
]);

// Tweet: "Check out my $12/month production server: vladbortnik.dev/go/server"
// You can change the destination anytime without editing the tweet
```

#### Scenario 3: URL Structure Migration

**Problem**: You decide to move from `/blog/posts/` to flat `/blog/` URLs.

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Redirect all /blog/posts/* → /blog/*
    if (url.pathname.startsWith('/blog/posts/')) {
      const newPath = url.pathname.replace('/blog/posts/', '/blog/');
      return Response.redirect(new URL(newPath, url.origin).href, 301);
    }

    return fetch(request);
  }
};
```

#### Scenario 4: A/B Testing Landing Pages

**Problem**: You want to test two different portfolio layouts to see which converts better.

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      // Check if user already has a variant assigned
      const cookie = request.headers.get('Cookie') || '';
      const variantMatch = cookie.match(/ab_variant=(\w+)/);

      let variant = variantMatch ? variantMatch[1] : null;

      // Assign variant if new visitor
      if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B';
      }

      // Redirect to variant
      const destination = variant === 'A' ? '/index-a.html' : '/index-b.html';
      const response = Response.redirect(new URL(destination, url.origin).href, 302);

      // Set variant cookie
      response.headers.set('Set-Cookie',
        `ab_variant=${variant}; Path=/; Max-Age=2592000; SameSite=Strict`);

      return response;
    }

    return fetch(request);
  }
};
```

---

## 3. Geographic Personalization

### 3.1 Do You Need Geo Personalization Right Now?

**Short Answer**: No.

**Your Content Type**: Technical blog about DevOps and server infrastructure
**Geographic Relevance**: None - Docker works the same in NYC, London, and Tokyo

### 3.2 When Geo Personalization Makes Sense

#### ✅ Good Use Cases (Worth the Complexity)

1. **E-commerce with Regional Pricing**
   - Show prices in USD for US visitors, EUR for EU
   - Display shipping options based on location

2. **Event Listings**
   - Show NYC meetups to US visitors
   - Display London events to UK visitors

3. **Legal Compliance**
   - Show GDPR cookie notice only to EU visitors
   - Display California privacy notice to CA residents

4. **Multi-Language Content**
   - Redirect to /en/ or /es/ based on location
   - Offer language picker for unexpected locations

5. **Performance Optimization**
   - Route to nearest CDN region
   - Serve region-specific media assets

#### ❌ Bad Use Cases (Don't Do This)

1. **Technical Blog Content** ← This is you!
   - Docker tutorials are universal
   - No geo-specific value

2. **Blocking Regions**
   - Don't block countries unless legally required
   - Hurts SEO and global reach

3. **Personalization for Its Own Sake**
   - "Hello, visitor from United States!" adds no value
   - Just increases complexity

### 3.3 Potential Future Use Cases for Your Site

Looking at your navigation, you have a `/lab/` section marked "Coming Soon". Here's when geo might help:

```javascript
// Example: Show different lab experiments based on region
if (url.pathname === '/lab/') {
  const country = request.cf.country;

  // Show latency experiments to users in different regions
  if (country === 'US') {
    return fetch('/lab/experiments/us.html');
  } else if (country === 'EU') {
    return fetch('/lab/experiments/eu.html');
  } else {
    return fetch('/lab/experiments/global.html');
  }
}
```

But even this is questionable. Most lab experiments should be globally accessible.

### 3.4 Cloudflare Workers Geo Detection

#### How Cloudflare Provides Geographic Data

Every request to Cloudflare Workers includes a `cf` object with geographic data:

```javascript
export default {
  async fetch(request) {
    const geo = request.cf;

    console.log({
      country: geo.country,        // "US", "GB", "CA", etc. (ISO 3166-1 Alpha 2)
      continent: geo.continent,    // "NA", "EU", "AS", etc.
      city: geo.city,              // "New York", "London", etc.
      region: geo.region,          // "California", "England", etc.
      regionCode: geo.regionCode,  // "CA", "ENG", etc. (ISO 3166-2)
      postalCode: geo.postalCode,  // "10001", "SW1A", etc.
      latitude: geo.latitude,      // "40.7128"
      longitude: geo.longitude,    // "-74.0060"
      timezone: geo.timezone,      // "America/New_York"
      colo: geo.colo,              // "EWR" (Cloudflare data center)
    });

    return fetch(request);
  }
};
```

**Privacy Note**: Cloudflare does NOT expose the visitor's IP address to your Worker by default. You get geo data only, which is GDPR/CCPA compliant.

#### Basic Geo-Aware Worker

```javascript
/**
 * Geographic Content Personalization
 * Shows different content based on visitor location
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const country = request.cf.country; // ISO 3166-1 Alpha 2

    // Example: Region-specific contact information
    if (url.pathname === '/contact') {
      // Add geo header to response
      const response = await fetch(request);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('X-Visitor-Country', country);
      return newResponse;
    }

    return fetch(request);
  }
};
```

#### Geo-Based Redirect

```javascript
/**
 * Redirect users to region-specific subdomains
 * Example: UK visitors → uk.vladbortnik.dev
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const country = request.cf.country;

    // Only redirect homepage
    if (url.pathname === '/') {
      // Check if user has preference cookie
      const cookie = request.headers.get('Cookie') || '';
      const hasPreference = cookie.includes('geo_preference=set');

      if (!hasPreference && country === 'GB') {
        // Redirect UK visitors to UK-specific page
        return Response.redirect('https://uk.vladbortnik.dev', 302);
      }
    }

    return fetch(request);
  }
};
```

#### Geo-Based Content Injection

```javascript
/**
 * Inject region-specific content into HTML
 * Shows events, meetups, or offers based on location
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const country = request.cf.country;
    const city = request.cf.city;

    // Fetch original response
    const response = await fetch(request);

    // Only modify HTML pages
    const contentType = response.headers.get('Content-Type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    // Get HTML content
    let html = await response.text();

    // Inject geo-specific content
    if (country === 'US' && city === 'New York') {
      const banner = `
        <div class="geo-banner">
          🗽 NYC local? Join our DevOps meetup at WeWork Broadway!
          <a href="/events/nyc">Learn more</a>
        </div>
      `;
      html = html.replace('</body>', `${banner}</body>`);
    }

    // Return modified response
    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }
};
```

#### Timezone-Aware Content

```javascript
/**
 * Show time-sensitive content based on visitor's timezone
 * Example: "Chat support available" vs "We're offline, email us"
 */

export default {
  async fetch(request) {
    const timezone = request.cf.timezone; // "America/New_York"

    // Get current time in visitor's timezone
    const visitorTime = new Date().toLocaleString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      hour12: false
    });

    const hour = parseInt(visitorTime.split(':')[0]);

    // Check if business hours (9 AM - 6 PM in visitor's timezone)
    const isBusinessHours = hour >= 9 && hour < 18;

    // Add header for frontend to use
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Business-Hours', isBusinessHours.toString());

    return newResponse;
  }
};
```

### 3.5 Cost/Benefit Analysis

| Feature | Setup Time | Maintenance | Performance Impact | SEO Impact | User Value |
|---------|------------|-------------|-------------------|------------|------------|
| **Basic Geo Detection** | 5 min | None | +5ms latency | None | Low |
| **Geo-Based Redirects** | 15 min | Low | +10ms latency | Can hurt if wrong | Medium |
| **Content Injection** | 30 min | Medium | +20ms latency | None | High (if relevant) |
| **Full Personalization** | 2 hours | High | +50ms latency | Can help local SEO | Very High (if needed) |

**For Your Site**:
- Current benefit: 0/10
- Future benefit: 3/10 (maybe for /lab/ experiments)
- Complexity cost: 6/10
- **Verdict**: Don't implement unless you have specific geo content

---

## 4. Implementation Guide

### 4.1 Prerequisites

1. ✅ Cloudflare account (free tier is fine)
2. ✅ Domain connected to Cloudflare DNS (vladbortnik.dev already is)
3. ✅ Wrangler CLI installed: `npm install -g wrangler`
4. ✅ Authenticated: `wrangler login`

### 4.2 Starter Worker Setup (5 Minutes)

#### Step 1: Create Worker Project

```bash
# Navigate to your project root
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev

# Create workers directory
mkdir -p cloudflare-workers/redirects
cd cloudflare-workers/redirects

# Initialize Worker
wrangler init redirects
```

#### Step 2: Configure wrangler.toml

```toml
name = "vladbortnik-redirects"
main = "src/index.js"
compatibility_date = "2025-11-10"

# Route configuration
routes = [
  { pattern = "vladbortnik.dev/*", zone_name = "vladbortnik.dev" },
  { pattern = "www.vladbortnik.dev/*", zone_name = "vladbortnik.dev" }
]

# Environment variables (optional)
[env.production]
vars = { ENVIRONMENT = "production" }

[env.staging]
vars = { ENVIRONMENT = "staging" }
```

#### Step 3: Create Starter Worker

```javascript
// src/index.js
/**
 * Vladbortnik.dev Redirect & Geo Worker
 * Start simple, expand as needed
 */

// Simple redirect map (expand as needed)
const REDIRECTS = new Map([
  // Example marketing links
  ['/go/github', 'https://github.com/vladbortnik'],
  ['/go/linkedin', 'https://linkedin.com/in/vladbortnik'],
]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check for redirect
    if (REDIRECTS.has(pathname)) {
      const destination = REDIRECTS.get(pathname);
      return Response.redirect(destination, 301);
    }

    // Log geo data (debugging - remove in production)
    if (pathname === '/_worker-debug' && env.ENVIRONMENT !== 'production') {
      return new Response(JSON.stringify({
        country: request.cf.country,
        city: request.cf.city,
        timezone: request.cf.timezone,
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Pass through to origin
    return fetch(request);
  }
};
```

#### Step 4: Test Locally

```bash
# Start local development server
wrangler dev

# Test redirects
curl -I http://localhost:8787/go/github
# Should see: Location: https://github.com/vladbortnik

# Test geo data (won't work locally, deploy to staging)
curl http://localhost:8787/_worker-debug
```

#### Step 5: Deploy

```bash
# Deploy to production
wrangler deploy

# Check deployment
curl -I https://vladbortnik.dev/go/github
# Should see: Location: https://github.com/vladbortnik
```

### 4.3 Monitoring and Debugging

#### View Worker Logs

```bash
# Tail live logs
wrangler tail

# Filter errors only
wrangler tail --status error
```

#### Cloudflare Dashboard Analytics

1. Go to https://dash.cloudflare.com
2. Select your domain → Workers & Pages
3. Click on your worker → Metrics
4. View: Requests, Errors, CPU time, Bandwidth

#### Add Custom Analytics

```javascript
export default {
  async fetch(request, env, ctx) {
    const start = Date.now();

    // Your worker logic here
    const response = await fetch(request);

    // Log performance
    const duration = Date.now() - start;
    console.log(`Request: ${request.url} | Duration: ${duration}ms`);

    return response;
  }
};
```

---

## 5. Honest Recommendations

### What To Do NOW (5 Minutes)

1. ✅ **Set up the Worker infrastructure**
   - Copy the starter code from Section 4.2
   - Deploy with `wrangler deploy`
   - Verify it works: `curl -I https://vladbortnik.dev/go/github`

2. ✅ **Add 2-3 marketing short links**
   ```javascript
   const REDIRECTS = new Map([
     ['/go/github', 'https://github.com/vladbortnik'],
     ['/go/linkedin', 'https://linkedin.com/in/vladbortnik'],
     ['/go/twitter', 'https://x.com/vladbortnik_dev'],
   ]);
   ```

3. ✅ **Bookmark this document** for when you need more complex redirects

### What To Wait On (For Now)

1. ⏸️ **Don't implement geo personalization** until you have location-specific content
   - No NYC meetups yet? Don't show NYC banners
   - No regional pricing? No need for geo detection

2. ⏸️ **Don't add redirects "just in case"**
   - Wait until you actually change a URL
   - Keep the REDIRECTS map clean

3. ⏸️ **Don't migrate Nginx redirects to Workers**
   - HTTP → HTTPS is fine in Nginx
   - Only move dynamic redirects to Workers

### When To Revisit This Decision

**Check back when:**

1. ✅ **You have 10+ blog posts** (URL changes become more likely)
2. ✅ **You launch /lab/ section** (might have regional experiments)
3. ✅ **You add event listings** (NYC meetups, conferences)
4. ✅ **You get traffic from 10+ countries** (geo optimization becomes valuable)
5. ✅ **Someone links to your old URL** (need redirect to preserve traffic)
6. ✅ **You want to track marketing campaigns** (short links with analytics)

---

## 6. Decision Framework

### Should I Add a Redirect?

```
Start
  ↓
Did the URL change? ────No───→ Don't add redirect
  ↓ Yes
Are external sites linking to it? ────No───→ Update internal links, no redirect needed
  ↓ Yes
Will it get >10 requests/month? ────No───→ Consider if SEO matters
  ↓ Yes
Is it temporary (campaign)? ──Yes──→ Use 302 redirect
  ↓ No
Use 301 redirect ────────────────→ Add to Worker, deploy
```

### Should I Use Geo Personalization?

```
Start
  ↓
Do I have location-specific content? ────No───→ Don't use geo
  ↓ Yes
Does it improve user experience? ────No───→ Don't use geo (complexity not worth it)
  ↓ Yes
Can I maintain region-specific content? ────No───→ Start simple, expand later
  ↓ Yes
Is performance impact acceptable? ────No───→ Cache aggressively, use edge compute
  ↓ Yes
Implement geo personalization ────────────→ Start with 2-3 regions, expand gradually
```

---

## 7. Additional Resources

### Cloudflare Workers Documentation
- Official Docs: https://developers.cloudflare.com/workers/
- Redirect Examples: https://developers.cloudflare.com/workers/examples/redirect/
- Bulk Redirects: https://developers.cloudflare.com/workers/examples/bulk-redirects/
- Geo Location: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties

### Wrangler CLI
- Installation: https://developers.cloudflare.com/workers/wrangler/install-and-update/
- Commands Reference: https://developers.cloudflare.com/workers/wrangler/commands/

### Testing Tools
- Test redirects: `curl -I https://vladbortnik.dev/path`
- Test geo data: https://workers.cloudflare.com/playground
- Monitor performance: Cloudflare Dashboard → Workers → Metrics

---

## 8. Appendix: Complete Examples

### A. Production-Ready Redirect Worker

```javascript
/**
 * Production-Grade Redirect Worker
 * Handles redirects, logging, and error handling
 */

const REDIRECTS = new Map([
  // Blog URL changes
  ['/blog/old-post.html', '/blog/posts/new-post.html'],

  // Marketing links
  ['/go/github', 'https://github.com/vladbortnik'],
  ['/go/linkedin', 'https://linkedin.com/in/vladbortnik'],

  // Legacy support
  ['/portfolio', '/#portfolio'],
  ['/resume', '/#resume'],
]);

// Analytics endpoint (replace with your analytics server)
const ANALYTICS_URL = 'https://analytics.vladbortnik.dev/track';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      // Check for redirect
      if (REDIRECTS.has(pathname)) {
        const destination = REDIRECTS.get(pathname);
        const destinationUrl = new URL(destination, request.url);

        // Preserve query parameters
        destinationUrl.search = url.search;

        // Log redirect asynchronously (don't block response)
        ctx.waitUntil(
          logRedirect(pathname, destinationUrl.href, request)
        );

        return Response.redirect(destinationUrl.href, 301);
      }

      // No redirect - pass through
      return fetch(request);

    } catch (error) {
      // Log error
      console.error('Worker error:', error);

      // Fail open - pass through to origin
      return fetch(request);
    }
  }
};

async function logRedirect(from, to, request) {
  try {
    await fetch(ANALYTICS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'redirect',
        from,
        to,
        country: request.cf.country,
        timestamp: Date.now(),
        userAgent: request.headers.get('User-Agent'),
      }),
    });
  } catch (error) {
    // Log errors but don't throw (analytics failure shouldn't break redirects)
    console.error('Analytics error:', error);
  }
}
```

### B. Advanced Geo Worker

```javascript
/**
 * Advanced Geographic Personalization
 * Region-specific content with caching
 */

// Region configurations
const REGIONS = {
  US: {
    currency: 'USD',
    timezone: 'America/New_York',
    events: ['NYC DevOps Meetup', 'San Francisco Cloud Summit'],
  },
  GB: {
    currency: 'GBP',
    timezone: 'Europe/London',
    events: ['London Tech Week', 'Manchester DevOps Days'],
  },
  EU: {
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    events: ['Berlin Tech Conference', 'Amsterdam Cloud Days'],
  },
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf.country;

    // Determine region
    let region = 'US'; // Default
    if (country === 'GB') region = 'GB';
    else if (['DE', 'FR', 'IT', 'ES', 'NL'].includes(country)) region = 'EU';

    // Only personalize specific paths
    if (url.pathname === '/events') {
      return serveRegionalEvents(region, request);
    }

    // Add geo headers for client-side use
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Visitor-Region', region);
    newResponse.headers.set('X-Visitor-Country', country);
    newResponse.headers.set('X-Visitor-Timezone', request.cf.timezone);

    return newResponse;
  }
};

async function serveRegionalEvents(region, request) {
  const config = REGIONS[region];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Events - ${region}</title>
    </head>
    <body>
      <h1>Upcoming Events in Your Region</h1>
      <ul>
        ${config.events.map(event => `<li>${event}</li>`).join('')}
      </ul>
      <p>Timezone: ${config.timezone}</p>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
```

---

## Conclusion

**Your Current Situation**: You don't need complex redirects or geo personalization right now.

**What You Should Do**: Set up the infrastructure (5 minutes) so it's ready when you need it.

**When To Use It**:
- Redirects: When you rename a blog post or need marketing short links
- Geo: When you have location-specific content (events, regional offers)

**Bottom Line**: Don't add complexity for complexity's sake. But having the tools ready means you won't scramble when you need to change a URL at 2 AM.

---

**Next Steps:**
1. Copy the starter Worker code (Section 4.2)
2. Deploy with `wrangler deploy`
3. Test with `/go/github` redirect
4. Bookmark this document for future reference
5. Move on to more important work

**Questions?** Open a GitHub issue or check the Cloudflare Workers docs.

---

**Generated**: November 10, 2025
**Last Updated**: November 10, 2025
**Version**: 1.0
