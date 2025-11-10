# A/B Testing Guide for Your Blog (No Code Changes Required)

## Table of Contents
1. [What is A/B Testing?](#what-is-ab-testing)
2. [Why This Matters for Your Blog](#why-this-matters)
3. [The "No Code Changes" Magic](#the-no-code-changes-magic)
4. [How It Works with Cloudflare Workers](#how-it-works)
5. [Complete Working Code](#complete-working-code)
6. [Real Examples for Your Blog](#real-examples)
7. [Measuring Results](#measuring-results)
8. [Deployment Instructions](#deployment-instructions)
9. [Testing Your Setup](#testing-your-setup)
10. [Analyzing Results & Picking a Winner](#analyzing-results)
11. [Troubleshooting](#troubleshooting)

---

## What is A/B Testing?

**Simple Definition:** A/B testing is showing two different versions of the same page to different visitors, then measuring which version performs better.

**Real-World Analogy:**
Imagine you have a coffee shop with two signs:
- Sign A: "Best Coffee in Town"
- Sign B: "Fresh Roasted Coffee - Try Free Sample"

You put up Sign A for a week, count how many people walk in (100 people).
You put up Sign B for a week, count how many people walk in (150 people).

Result: Sign B is 50% more effective! You keep using Sign B.

**For Your Blog:**
Instead of signs, you're testing things like:
- Blog post titles
- Opening paragraphs
- Call-to-action button text
- Featured image placement
- Introduction styles

---

## Why This Matters for Your Blog

**The Problem:** You spend hours writing blog posts, but you're guessing at what will make people:
- Click to read more
- Stay on the page longer
- Read to the end
- Click your project links
- Share your content

**The Solution:** A/B testing removes the guesswork. You get DATA showing what actually works.

**Real Impact Examples:**
- Testing two different blog titles could increase clicks by 30-40%
- Better CTA button text could double project link clicks
- Optimized opening paragraphs could reduce bounce rate by 20%

**Cost:** $0 with Cloudflare Workers (100,000 requests/day free tier)

---

## The "No Code Changes" Magic

### Traditional A/B Testing (The Hard Way)
1. Create two HTML files: `blog-post-A.html` and `blog-post-B.html`
2. Write server-side code to randomly route users
3. Set up database to track which user saw which version
4. Manage cookies, sessions, analytics integration
5. Maintain two versions of every page you want to test
6. When test ends, delete losing version, rename winner

**Problem:** Lots of code, lots of maintenance, lots of room for errors.

### Cloudflare Workers A/B Testing (The Smart Way)
1. Keep your original HTML file (no changes!)
2. Deploy a Cloudflare Worker (one JavaScript file)
3. Worker intercepts requests and modifies HTML on-the-fly
4. Different users see different versions
5. When test ends, remove worker OR update original HTML with winner

**Magic:** Your source code stays clean. No duplicate files. Easy to manage.

---

## How It Works

Here's what happens when someone visits your blog post:

```
1. User types: vladbortnik.dev/blog/server-setup.html
   ↓
2. Request hits Cloudflare's edge network (before your server)
   ↓
3. Cloudflare Worker intercepts the request
   ↓
4. Worker checks: "Does this user have an A/B test cookie?"
   - NO → Randomly assign to Group A or Group B (50/50 chance)
   - YES → Use their existing group (consistency!)
   ↓
5. Worker fetches your original HTML file
   ↓
6. If Group B: Worker modifies specific content
   Example: Replace title "Server Setup Guide" with "How I Built My Production Server"
   ↓
7. Modified HTML sent to user's browser
   ↓
8. User sees their variant (A or B)
   ↓
9. Analytics tracks which variant they saw + their behavior
   ↓
10. After collecting data: You see which variant performed better!
```

**Key Point:** Your original `server-setup.html` file NEVER changes. All modifications happen in real-time at Cloudflare's edge.

---

## Complete Working Code

Here's the full Cloudflare Worker code. Copy-paste ready!

### File: `worker.js`

```javascript
// ============================================================================
// A/B TESTING CLOUDFLARE WORKER FOR BLOG
// ============================================================================
// This worker enables A/B testing on static HTML blog posts without modifying
// the source HTML files. It intercepts requests, assigns users to test groups,
// and modifies HTML content on-the-fly based on configured tests.
// ============================================================================

// ============================================================================
// CONFIGURATION - Edit this section for your tests
// ============================================================================
const AB_TEST_CONFIG = {
  // Set to false to disable all A/B testing (serves original HTML)
  enabled: true,

  // Cookie name for storing user's variant assignment
  cookieName: 'ab_test_variant',

  // Cookie expiration (7 days in seconds)
  cookieMaxAge: 60 * 60 * 24 * 7,

  // Traffic split (0.5 = 50% see variant A, 50% see variant B)
  variantBSplit: 0.5,

  // Define your A/B tests here
  // Each test object can modify different parts of the HTML
  tests: {
    // Test 1: Blog post title
    blogTitle: {
      enabled: true,
      selector: 'h1.blog-title', // CSS selector for element to modify
      variantA: 'Server Infrastructure Setup Guide',
      variantB: 'How I Built My Production Server (Complete Guide)',
    },

    // Test 2: Call-to-action button
    ctaButton: {
      enabled: true,
      selector: 'a.read-more-btn',
      variantA: 'Read More',
      variantB: 'Learn How I Did It',
    },

    // Test 3: Opening paragraph
    introParagraph: {
      enabled: true,
      selector: 'p.intro-text',
      variantA: 'This guide covers the complete server setup process using Docker, Nginx, and automated deployments.',
      variantB: 'Want to deploy your own production server? I spent 3 months perfecting this setup. Here\'s everything I learned.',
    },

    // Test 4: Subtitle/description
    subtitle: {
      enabled: false, // Disabled - set to true to activate
      selector: 'h2.subtitle',
      variantA: 'A Technical Overview',
      variantB: 'From Zero to Production in 30 Minutes',
    },
  },
};

// ============================================================================
// MAIN WORKER LOGIC
// ============================================================================
export default {
  async fetch(request, env, ctx) {
    // Only process HTML pages
    const url = new URL(request.url);

    // Skip A/B testing for non-HTML requests
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) {
      return fetch(request);
    }

    // If A/B testing is disabled, return original content
    if (!AB_TEST_CONFIG.enabled) {
      return fetch(request);
    }

    // Get or assign variant for this user
    const variant = getOrAssignVariant(request);

    // Fetch the original HTML
    const response = await fetch(request);

    // Only modify HTML responses
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    // Clone response so we can modify it
    let modifiedResponse;

    if (variant === 'B') {
      // Apply variant B modifications
      modifiedResponse = new HTMLRewriter()
        .on('head', new HeadHandler(variant)) // Inject analytics tracking
        .transform(response);

      // Apply each enabled test
      for (const [testName, testConfig] of Object.entries(AB_TEST_CONFIG.tests)) {
        if (testConfig.enabled) {
          modifiedResponse = new HTMLRewriter()
            .on(testConfig.selector, new ContentReplacer(testConfig.variantB))
            .transform(await modifiedResponse);
        }
      }
    } else {
      // Variant A - just inject analytics tracking
      modifiedResponse = new HTMLRewriter()
        .on('head', new HeadHandler(variant))
        .transform(response);
    }

    // Set cookie to remember user's variant
    const newResponse = new Response(modifiedResponse.body, modifiedResponse);
    setCookie(newResponse, variant);

    return newResponse;
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets existing variant from cookie or assigns a new one
 */
function getOrAssignVariant(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = parseCookies(cookieHeader);

  // Check if user already has a variant assigned
  if (cookies[AB_TEST_CONFIG.cookieName]) {
    return cookies[AB_TEST_CONFIG.cookieName];
  }

  // Randomly assign new variant
  return Math.random() < AB_TEST_CONFIG.variantBSplit ? 'B' : 'A';
}

/**
 * Parses cookie header string into object
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
}

/**
 * Sets variant cookie on response
 */
function setCookie(response, variant) {
  const cookieValue = `${AB_TEST_CONFIG.cookieName}=${variant}; Max-Age=${AB_TEST_CONFIG.cookieMaxAge}; Path=/; SameSite=Strict`;
  response.headers.append('Set-Cookie', cookieValue);
}

// ============================================================================
// HTML REWRITER HANDLERS
// ============================================================================

/**
 * Replaces text content of matched elements
 */
class ContentReplacer {
  constructor(newContent) {
    this.newContent = newContent;
  }

  element(element) {
    element.setInnerContent(this.newContent);
  }
}

/**
 * Injects tracking code into <head>
 */
class HeadHandler {
  constructor(variant) {
    this.variant = variant;
  }

  element(element) {
    // Inject Google Analytics custom dimension for variant tracking
    const trackingCode = `
      <script>
        // A/B Test Variant Tracking
        window.abTestVariant = '${this.variant}';

        // If using Google Analytics (gtag.js)
        if (typeof gtag !== 'undefined') {
          gtag('set', 'user_properties', {
            ab_test_variant: '${this.variant}'
          });

          // Track as custom event
          gtag('event', 'ab_test_view', {
            'event_category': 'A/B Testing',
            'event_label': 'Variant ${this.variant}',
            'variant': '${this.variant}'
          });
        }

        // Simple console log for debugging
        console.log('A/B Test Variant: ${this.variant}');

        // Add variant as data attribute to body for easy debugging
        document.addEventListener('DOMContentLoaded', function() {
          document.body.setAttribute('data-ab-variant', '${this.variant}');
        });
      </script>
    `;

    element.append(trackingCode, { html: true });
  }
}
```

---

## Real Examples for Your Blog

Here are specific A/B tests you can run on your blog posts:

### Example 1: Blog Post Title Test

**What to Test:**
- Variant A: "Server Infrastructure Setup Guide"
- Variant B: "How I Built My Production Server (Complete Guide)"

**Hypothesis:** The story-based, outcome-focused title (B) will get more clicks than the generic guide title (A).

**Configuration:**
```javascript
blogTitle: {
  enabled: true,
  selector: 'h1.blog-title',
  variantA: 'Server Infrastructure Setup Guide',
  variantB: 'How I Built My Production Server (Complete Guide)',
}
```

**What to Measure:**
- Click-through rate from blog index page
- Time on page
- Scroll depth (did they read the whole thing?)

---

### Example 2: Call-to-Action Button Test

**What to Test:**
- Variant A: "Read More"
- Variant B: "See How I Built This"

**Hypothesis:** Specific, personal CTA (B) will get more clicks than generic CTA (A).

**Configuration:**
```javascript
ctaButton: {
  enabled: true,
  selector: 'a.cta-button',
  variantA: 'Read More',
  variantB: 'See How I Built This',
}
```

**What to Measure:**
- Button click rate
- Conversion to project detail page

---

### Example 3: Opening Paragraph Test

**What to Test:**
- Variant A (Technical): "This guide covers Docker containerization, Nginx reverse proxy configuration, SSL certificate automation with Let's Encrypt, and CI/CD pipeline setup."
- Variant B (Story-based): "I spent 3 months building the perfect server setup. Here's everything I learned, from initial mistakes to production-ready deployment."

**Hypothesis:** Story-based intro (B) hooks readers better than technical overview (A).

**Configuration:**
```javascript
introParagraph: {
  enabled: true,
  selector: 'p.intro',
  variantA: 'This guide covers Docker containerization, Nginx reverse proxy configuration...',
  variantB: 'I spent 3 months building the perfect server setup. Here\'s everything I learned...',
}
```

**What to Measure:**
- Bounce rate (did they leave immediately?)
- Average time on page
- Scroll depth

---

### Example 4: Featured Image Caption Test

**What to Test:**
- Variant A: "Server Architecture Diagram"
- Variant B: "The Complete System (Click to Enlarge)"

**Hypothesis:** Interactive caption (B) will get more image clicks than plain caption (A).

**Configuration:**
```javascript
imageCaption: {
  enabled: true,
  selector: 'figcaption.img-caption',
  variantA: 'Server Architecture Diagram',
  variantB: 'The Complete System (Click to Enlarge)',
}
```

---

### Example 5: Reading Time Display Test

**What to Test:**
- Variant A: "12 min read"
- Variant B: "12 minutes - Worth every second"

**Hypothesis:** Encouraging message (B) reduces intimidation and increases engagement.

**Configuration:**
```javascript
readingTime: {
  enabled: true,
  selector: 'span.reading-time',
  variantA: '12 min read',
  variantB: '12 minutes - Worth every second',
}
```

---

## Measuring Results

### Step 1: Set Up Google Analytics (If Not Already Done)

If you don't have Google Analytics set up:

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create account and property for your website
3. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Add this to your blog HTML `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Step 2: View A/B Test Results in Google Analytics

The Cloudflare Worker automatically sends variant information to Google Analytics.

**To view results:**

1. Open Google Analytics
2. Go to: **Reports** > **Engagement** > **Events**
3. Look for event: `ab_test_view`
4. Click on it to see:
   - How many users saw Variant A
   - How many users saw Variant B

**To compare behavior:**

1. Go to: **Reports** > **Engagement** > **Pages and screens**
2. Click on your blog post URL
3. Add secondary dimension: **User properties** > `ab_test_variant`
4. Compare metrics:
   - Average engagement time (Variant A vs B)
   - Views per user
   - Scroll depth (if configured)

### Step 3: Key Metrics to Track

**For Title Tests:**
- Click-through rate (CTR) from blog index
- Time on page
- Bounce rate

**For CTA Button Tests:**
- Button click events
- Conversion to target page

**For Content Tests (intro, paragraphs):**
- Average engagement time
- Scroll depth percentage
- Bounce rate

### Step 4: Simple Tracking with Browser Console

For quick debugging, the Worker injects `window.abTestVariant` into the page.

**Test it:**
1. Open your blog post
2. Press F12 (open browser console)
3. Type: `window.abTestVariant`
4. You'll see: `"A"` or `"B"`

Also check: The `<body>` tag gets a `data-ab-variant` attribute you can see in DevTools.

---

## Deployment Instructions

### Prerequisites

- Cloudflare account (free tier works!)
- Your website must be on Cloudflare (or using Cloudflare Workers Routes)
- Node.js installed (for Wrangler CLI)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

### Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This opens your browser. Log in to your Cloudflare account.

### Step 3: Create Worker Project

```bash
mkdir blog-ab-testing
cd blog-ab-testing
wrangler init
```

When prompted:
- Name: `blog-ab-testing`
- Template: Choose "Fetch handler"
- TypeScript: No (unless you prefer it)
- Git: Yes

### Step 4: Copy Worker Code

Replace contents of `src/index.js` (or `src/worker.js`) with the complete worker code from the [Complete Working Code](#complete-working-code) section above.

### Step 5: Configure Wrangler

Edit `wrangler.toml`:

```toml
name = "blog-ab-testing"
main = "src/index.js"
compatibility_date = "2025-01-10"

# Define the route for your blog
# This applies the worker to all blog pages
[[routes]]
pattern = "vladbortnik.dev/blog/*"
zone_name = "vladbortnik.dev"
```

**Important:** Replace `vladbortnik.dev` with your actual domain.

### Step 6: Configure Your A/B Test

Edit the `AB_TEST_CONFIG` section in `src/index.js`:

1. **Set your selectors** - Use actual CSS selectors from your HTML:
   ```javascript
   selector: 'h1.blog-post-title'  // Match your HTML structure
   ```

2. **Define variants** - Write your test content:
   ```javascript
   variantA: 'Your original text',
   variantB: 'Your test variation',
   ```

3. **Enable tests** - Set `enabled: true` for active tests:
   ```javascript
   blogTitle: {
     enabled: true,  // ← This test is active
     // ...
   }
   ```

### Step 7: Deploy to Cloudflare

```bash
wrangler deploy
```

You'll see output like:
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded blog-ab-testing (X.XX sec)
Published blog-ab-testing (X.XX sec)
  https://blog-ab-testing.YOUR-SUBDOMAIN.workers.dev
  vladbortnik.dev/blog/*
```

### Step 8: Verify Deployment

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your domain
3. Go to: **Workers Routes**
4. You should see: `vladbortnik.dev/blog/*` → `blog-ab-testing`

---

## Testing Your Setup

### Test 1: Verify Worker is Running

Visit your blog post:
```
https://vladbortnik.dev/blog/server-setup.html
```

**Check 1 - Browser Console:**
1. Press F12 (open DevTools)
2. Go to Console tab
3. You should see: `A/B Test Variant: A` or `A/B Test Variant: B`

**Check 2 - Cookie:**
1. In DevTools, go to: Application tab (Chrome) or Storage tab (Firefox)
2. Expand Cookies
3. You should see: `ab_test_variant` with value `A` or `B`

**Check 3 - HTML Attribute:**
1. In DevTools, inspect the `<body>` tag
2. You should see: `<body data-ab-variant="A">` or `<body data-ab-variant="B">`

### Test 2: Verify Content Changes

**If you see Variant A:**
- Content should match your `variantA` values
- This is the "control" group (original)

**If you see Variant B:**
- Content should be replaced with your `variantB` values
- Check that titles/buttons/text match what you configured

### Test 3: Force Different Variants

**To test Variant B when you keep getting A:**

1. Open DevTools → Application → Cookies
2. Delete the `ab_test_variant` cookie
3. Refresh page
4. Repeat until you get Variant B (50% chance each time)

**OR use this bookmarklet:**

Add this as a browser bookmark for quick variant switching:

```javascript
javascript:(function(){document.cookie='ab_test_variant=B;path=/';location.reload();})()
```

### Test 4: Verify Analytics Tracking

1. Visit your blog post
2. Check browser console for: `A/B Test Variant: X`
3. Open Google Analytics Real-Time view
4. Go to: **Real-time** > **Events**
5. You should see: `ab_test_view` event

---

## Analyzing Results & Picking a Winner

### When to Check Results

**Minimum Requirements:**
- At least 100 visitors per variant (200 total)
- At least 7 days of data collection
- Statistically significant difference (use calculator below)

**Recommended:**
- 500+ visitors per variant for reliable results
- 2-4 weeks of data for seasonal/weekly patterns

### How to Analyze in Google Analytics

1. **Go to Events Report:**
   - Reports > Engagement > Events
   - Find `ab_test_view`
   - See total views for each variant

2. **Compare Page Performance:**
   - Reports > Engagement > Pages and screens
   - Filter to your blog post
   - Add secondary dimension: `ab_test_variant`
   - Compare:
     - Average engagement time
     - Events per user
     - Scroll depth

3. **Check Conversions:**
   - If you set up goal events (button clicks, etc.)
   - Compare conversion rate between variants

### Statistical Significance Calculator

Use this free tool to check if your results are valid:
- [AB Test Guide Calculator](https://abtestguide.com/calc/)
- [Optimizely Stats Engine](https://www.optimizely.com/sample-size-calculator/)

**Input:**
- Visitors for Variant A
- Conversions for Variant A (e.g., button clicks)
- Visitors for Variant B
- Conversions for Variant B

**Output:**
- If p-value < 0.05: Results are statistically significant (trust them!)
- If p-value > 0.05: Keep testing, need more data

### Example Analysis

**Test:** Blog post title
- Variant A views: 523
- Variant A avg engagement: 2:34 minutes
- Variant A bounce rate: 45%

- Variant B views: 518
- Variant B avg engagement: 3:42 minutes
- Variant B bounce rate: 32%

**Result:** Variant B wins! 43% more engagement, 29% lower bounce rate.

### Picking a Winner

**Criteria for Winner:**
1. Statistically significant improvement (p < 0.05)
2. Improvement in your KEY metric (e.g., engagement time, clicks, conversions)
3. At least 10% better than control (Variant A)
4. Consistent across multiple days (not a fluke)

**If Variant A Wins:**
- Good! Your original content was already optimized
- Try a different test
- No changes needed to HTML

**If Variant B Wins:**
1. Update your original HTML file with Variant B content
2. Deploy the updated HTML
3. Remove or disable the A/B test in worker:
   ```javascript
   blogTitle: {
     enabled: false,  // ← Disable this test
     // ...
   }
   ```
4. Redeploy worker: `wrangler deploy`

**If No Clear Winner:**
- Results are too close OR not statistically significant
- Keep test running longer
- OR try a more dramatic variation

### Implementing the Winner

**Option 1: Update HTML File** (Recommended)
```bash
# Edit your blog post HTML
nano /path/to/blog/server-setup.html

# Update the title, CTA, or whatever won
# Example: Change <h1> to winning variant

# Commit and deploy
git add blog/server-setup.html
git commit -m "A/B test result: Update blog title to winning variant"
git push
```

**Option 2: Keep Worker Running**
If Variant B keeps winning, you can leave the worker active to serve B to everyone:
```javascript
// Force everyone to see Variant B
variantBSplit: 1.0  // 100% see variant B
```

---

## Troubleshooting

### Problem: "Worker not found" error

**Cause:** Worker route not configured properly

**Solution:**
1. Check `wrangler.toml` has correct domain
2. Verify route exists in Cloudflare dashboard
3. Redeploy: `wrangler deploy`

---

### Problem: Content not changing (always see Variant A)

**Possible Causes & Solutions:**

**1. CSS Selector is Wrong**
```javascript
// Check your HTML for actual selector
// If HTML has: <h1 class="post-title">
// But config has: selector: 'h1.blog-title'
// ❌ Won't match!

// Fix: Update selector to match actual HTML
selector: 'h1.post-title'
```

**2. Test is Disabled**
```javascript
blogTitle: {
  enabled: false,  // ❌ Test is disabled!
  // ...
}

// Fix: Enable it
enabled: true
```

**3. Cookie Stuck on Variant A**
- Clear cookies in browser
- Use Incognito/Private mode
- Force variant with bookmarklet (see Testing section)

---

### Problem: Google Analytics not showing events

**Possible Causes & Solutions:**

**1. Analytics Code Not on Page**
- Check `<head>` section for Google Analytics script
- Verify Measurement ID is correct

**2. Ad Blocker Enabled**
- Disable ad blocker for your domain
- Check in Incognito mode without extensions

**3. Events Need Time to Appear**
- Wait 24 hours for events to show in reports
- Use Real-Time view for immediate testing

---

### Problem: Both variants showing same content

**Cause:** HTMLRewriter selector matches Variant A content

**Solution:**
The worker compares exact text. If Variant A and B are too similar, use more specific selectors or ensure text is distinctly different.

---

### Problem: Worker slowing down page load

**Cause:** HTMLRewriter processing overhead

**Solutions:**
1. Minimize number of active tests (max 3-4 at once)
2. Use specific selectors (not `*` or `body`)
3. Consider testing one page at a time
4. Cloudflare edge workers are very fast, but complex tests add latency

---

### Problem: Want to test multiple pages

**Solution:** Update route pattern in `wrangler.toml`:

```toml
# Test all blog pages
[[routes]]
pattern = "vladbortnik.dev/blog/*"
zone_name = "vladbortnik.dev"

# OR test specific pages only
[[routes]]
pattern = "vladbortnik.dev/blog/server-setup.html"
zone_name = "vladbortnik.dev"

[[routes]]
pattern = "vladbortnik.dev/blog/recipe-app.html"
zone_name = "vladbortnik.dev"
```

---

### Problem: Need to stop test immediately

**Quick Solution:**
```bash
# Disable all tests
wrangler deploy
```

Then in worker code:
```javascript
const AB_TEST_CONFIG = {
  enabled: false,  // ← Turn off all testing
  // ...
}
```

**OR delete worker entirely:**
```bash
wrangler delete
```

---

### Debugging Tips

**1. Add Console Logging to Worker**

Edit worker code to add debug logs:
```javascript
console.log('Variant assigned:', variant);
console.log('Tests config:', AB_TEST_CONFIG.tests);
```

View logs:
```bash
wrangler tail
```

This shows real-time logs from your worker.

**2. Test Locally with Wrangler**

```bash
wrangler dev
```

This runs worker locally for testing before deployment.

**3. Check Worker Metrics**

Cloudflare Dashboard:
- Workers & Pages > Your Worker
- View requests, errors, CPU time

---

## Advanced Tips

### Running Multiple Tests Simultaneously

You can run multiple A/B tests at once:

```javascript
tests: {
  blogTitle: {
    enabled: true,
    // Test 1 config
  },
  ctaButton: {
    enabled: true,
    // Test 2 config
  },
  introParagraph: {
    enabled: true,
    // Test 3 config
  },
}
```

**Warning:** More tests = more complex analysis. Start with 1-2 tests max.

### Gradual Rollout (Not 50/50)

Test more cautiously by sending less traffic to variant B:

```javascript
// Only 20% of users see Variant B
variantBSplit: 0.2
```

Use this when testing risky changes.

### Testing Different Pages with Different Variants

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Different tests for different pages
    if (url.pathname.includes('server-setup')) {
      // Apply server-setup tests
    } else if (url.pathname.includes('recipe-app')) {
      // Apply recipe-app tests
    }

    // ...
  }
}
```

### Excluding Certain Users

```javascript
// Don't A/B test users from specific sources
const referer = request.headers.get('referer') || '';
if (referer.includes('google.com')) {
  // Skip A/B test for Google traffic
  return fetch(request);
}
```

---

## Quick Start Checklist

Ready to run your first A/B test? Follow this checklist:

- [ ] Cloudflare account created
- [ ] Website on Cloudflare (or using Workers Routes)
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Authenticated (`wrangler login`)
- [ ] Worker project created (`wrangler init`)
- [ ] Worker code copied to `src/index.js`
- [ ] `wrangler.toml` configured with correct domain/route
- [ ] A/B test configured (selectors, variants, enabled)
- [ ] Worker deployed (`wrangler deploy`)
- [ ] Test verified (check console, cookie, content)
- [ ] Google Analytics tracking confirmed
- [ ] Data collection started (wait 7-14 days)
- [ ] Results analyzed (statistical significance checked)
- [ ] Winner implemented in HTML (if applicable)

---

## Summary

**What You Learned:**
1. A/B testing = showing different versions to different users to find what works best
2. Cloudflare Workers enable A/B testing WITHOUT modifying your HTML files
3. Worker intercepts requests and modifies HTML on-the-fly
4. Google Analytics tracks which variant performs better
5. After collecting data, implement the winning variant

**Why It's Powerful:**
- Zero risk (original files unchanged)
- Free with Cloudflare (100k requests/day)
- No server-side code needed
- Easy to start/stop tests
- Data-driven decisions instead of guessing

**Next Steps:**
1. Pick ONE test to start with (blog title or CTA button)
2. Deploy the worker
3. Let it run for 1-2 weeks
4. Analyze results
5. Implement winner
6. Run next test!

**Remember:** Start small. Test one thing at a time. Let data guide your decisions.

---

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [HTMLRewriter API Reference](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [A/B Testing Statistics Calculator](https://abtestguide.com/calc/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

---

**Questions?**
- Check troubleshooting section above
- Review Cloudflare Workers docs
- Test in Incognito mode to verify behavior
- Use `wrangler tail` to debug worker logs

**Good luck with your A/B tests! May the best variant win!**
