# SEO Agent Quick Reference - October 2025

**Purpose:** Rapid reference for AI agents optimizing websites. No fluff, actionable only.
**Last Updated:** October 2025
**Not for users:** This file is for agent use during optimization tasks.

---

## 1. Core Web Vitals 2025 (UPDATED)

**Critical Performance Metrics:**

| Metric | Target | Status | Tool |
|--------|--------|--------|------|
| **LCP** (Largest Contentful Paint) | <2.5s | Required | PageSpeed Insights |
| **INP** (Interaction to Next Paint) | <200ms | **REPLACED FID Mar 2024** | Lighthouse, Chrome DevTools |
| **CLS** (Cumulative Layout Shift) | <0.1 | Required | PageSpeed Insights |

**Important:** FID (First Input Delay) is DEPRECATED. Use INP for all 2025 optimizations.

**Testing:**
- Primary: Google PageSpeed Insights
- Secondary: Lighthouse (Chrome DevTools), WebPageTest.org
- Mobile-first: Test mobile performance first

**Quick Fixes:**
- LCP: Optimize images, preload critical resources, use CDN
- INP: Reduce JavaScript execution time, optimize event handlers
- CLS: Set explicit width/height on images, avoid layout shifts

---

## 2. On-Page SEO Essentials

### Meta Tags (Required)

```html
<!-- Title: 50-60 characters, keyword-front-loaded -->
<title>Primary Keyword | Secondary Keyword | Brand</title>

<!-- Description: 150-160 characters, compelling CTA -->
<meta name="description" content="...">

<!-- Viewport: Mobile-first mandatory -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Canonical: Absolute URLs only -->
<link rel="canonical" href="https://domain.com/page">
```

### Open Graph (Social Sharing)

**Required Properties:**
```html
<meta property="og:type" content="website|article">
<meta property="og:url" content="https://absolute-url.com">
<meta property="og:title" content="Share Title">
<meta property="og:description" content="Share Description">
<meta property="og:image" content="https://absolute-url.com/image.jpg">
<meta property="og:site_name" content="Site Name">
<meta property="og:locale" content="en_US">
```

**Image Requirements:**
- Size: 1200x630px (1.91:1 ratio)
- Format: JPG or PNG
- File size: <500KB (ideal), <5MB (max)
- Absolute URL: HTTPS only
- Alt text via `og:image:alt`

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://absolute-url.com">
<meta name="twitter:title" content="Share Title">
<meta name="twitter:description" content="Share Description">
<meta name="twitter:image" content="https://absolute-url.com/image.jpg">
<meta name="twitter:creator" content="@handle"> <!-- if applicable -->
```

### Structured Data (Schema.org)

**Format:** JSON-LD only (Google recommended)
**Placement:** Before `</head>` closing tag

**Portfolio Website - Person Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Full Name",
  "url": "https://domain.com",
  "image": "https://domain.com/photo.jpg",
  "sameAs": [
    "https://github.com/username",
    "https://linkedin.com/in/username"
  ],
  "jobTitle": "Job Title",
  "knowsAbout": ["Skill1", "Skill2", "Skill3"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "City",
    "addressRegion": "State",
    "addressCountry": "US"
  }
}
```

**Multiple Schemas:** Combine Person + WebSite for portfolios.

**Validation:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

---

## 3. Technical SEO Checklist

### Critical Files

**sitemap.xml:**
- XML format, UTF-8 encoding
- List all indexable pages
- Update `<lastmod>` on content changes
- Set `<priority>` (1.0 for homepage, 0.8-0.9 for important pages)
- Submit to Google Search Console

**robots.txt:**
```txt
User-agent: *
Allow: /
Disallow: /private/
Disallow: /.git/

Sitemap: https://domain.com/sitemap.xml
Crawl-delay: 1
```

### HTTPS & Security

**Mandatory:**
- HTTPS everywhere (301 redirect HTTP → HTTPS)
- Valid SSL certificate
- HSTS header: `Strict-Transport-Security: max-age=31536000`

**Security Headers:**
```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Performance Optimization

**Compression:**
- Gzip or Brotli: Enable for text assets
- Min file size: 1KB threshold

**Caching:**
- Static assets: `Cache-Control: public, max-age=2592000` (30 days)
- HTML: `Cache-Control: no-cache, must-revalidate`

**Resource Optimization:**
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://analytics.domain.com">
```

### Mobile Optimization

**Required:**
- Responsive design (no separate mobile site)
- Touch-friendly tap targets (48x48px minimum)
- No horizontal scrolling
- Readable font sizes (16px minimum)
- Mobile-first indexing: Google uses mobile version for ranking

---

## 4. Content Strategy 2025

### Publishing Frequency

**High-ROI Campaigns:**
- Minimum: 2x per week (continuous publishing)
- Consistency > volume
- Update old content every 6 months

### Content Quality Standards

**Priority Order:**
1. **Helpful content first** - solve user problems
2. **E-E-A-T** - Experience, Expertise, Authoritativeness, Trustworthiness
3. **Original research/insights** - unique value
4. **Depth over breadth** - comprehensive coverage

### AI Content Guidelines (2025)

**Acceptable:**
- AI-assisted writing (human review/editing required)
- Research and ideation
- Outline generation

**Prohibited:**
- Bulk AI-generated content without human value
- Auto-published AI content
- Thin/low-quality AI spam

**Rule:** Use AI responsibly. Google penalizes AI spam but accepts AI-assisted quality content.

### Semantic SEO

**LSI Keywords:**
- Include related terms naturally
- Use semantic variations
- Context over keyword density
- Example: "Docker deployment" → include "containerization", "orchestration", "Docker Compose"

**Keyword Strategy:**
- Primary: 1 main keyword per page
- Secondary: 2-3 related keywords
- Long-tail: Target specific queries
- Comparison keywords: "best", "vs", "2025", "free"

---

## 5. Image Optimization 2025 (ELEVATED PRIORITY)

**Status:** Image SEO is now **essential** for all websites in 2025, not just e-commerce.

### Image Requirements

**File Optimization:**
- Format: WebP with JPG/PNG fallback
- Compression: Lossless for logos, lossy for photos
- File size: <200KB per image (ideal)
- Dimensions: Responsive srcset for multiple sizes

**Naming Convention:**
```
✅ Good: backend-engineer-portfolio-python-flask.jpg
❌ Bad: IMG_1234.jpg, image-final-final2.jpg
```

**Alt Text:**
```html
<!-- Descriptive, specific, keyword-relevant -->
<img src="photo.jpg" alt="Vlad Bortnik backend engineer working on Docker deployment">

<!-- Not generic -->
<img src="photo.jpg" alt="image" loading="lazy">
```

**Lazy Loading:**
```html
<!-- All images below the fold -->
<img src="..." alt="..." loading="lazy">

<!-- Above the fold: no lazy loading -->
<img src="hero.jpg" alt="..." loading="eager">
```

**Open Graph Images:**
- Size: 1200x630px exactly
- Format: JPG (smaller) or PNG (transparency)
- Text: Large, high-contrast, readable at thumbnail size
- Testing: Facebook Debugger, LinkedIn Inspector

---

## 6. Link Building & Authority

### Internal Linking

**Strategy:**
- Link from high-authority pages to new content
- Use descriptive anchor text (not "click here")
- Breadcrumb navigation with schema
- 3-click rule: All pages accessible in ≤3 clicks

### External Links (Backlinks)

**Quality Sources:**
- Guest posts on relevant blogs
- GitHub profile README
- LinkedIn profile
- Dev.to, Hashnode cross-posts
- Open source contributions

**Avoid:**
- Link farms, PBNs
- Paid links without rel="sponsored"
- Irrelevant directories
- Low-quality comment spam

### Social Signals

**Profiles to Maintain:**
- GitHub (essential for developers)
- LinkedIn (professional network)
- Twitter/X (optional but valuable)
- Stack Overflow (builds authority)

**sameAs Links:**
```json
"sameAs": [
  "https://github.com/username",
  "https://linkedin.com/in/username",
  "https://twitter.com/username",
  "https://stackoverflow.com/users/id/username"
]
```

---

## 7. Testing & Validation Workflow

### Pre-Deployment Testing

**Step 1: Validate HTML/Structure**
- W3C Markup Validator
- Console errors: 0 (critical)

**Step 2: Test Open Graph**
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Inspector: https://linkedin.com/post-inspector/
- Twitter Validator: https://cards-dev.twitter.com/validator

**Step 3: Validate Structured Data**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Errors: 0, Warnings: acceptable

**Step 4: Performance Check**
- PageSpeed Insights: 90+ score
- Core Web Vitals: All green
- Mobile score ≥ Desktop score

**Step 5: Crawlability**
- Verify sitemap.xml loads
- Verify robots.txt loads
- Check canonical URLs are absolute

### Post-Deployment Monitoring

**Google Search Console (Weekly):**
- Coverage: No errors
- Sitemap: Submitted and processed
- Core Web Vitals: All green
- Manual actions: 0

**Analytics Metrics:**
- Organic traffic trend
- Bounce rate: <50% (good), <30% (excellent)
- Average session duration: >2 minutes
- Pages per session: >2

---

## 8. Quick Decision Matrix

### When to Optimize

| Scenario | Action | Priority |
|----------|--------|----------|
| New page created | Add all meta tags, OG, structured data | High |
| Content updated significantly | Update lastmod in sitemap, meta description | Medium |
| Site structure changed | Regenerate sitemap, update internal links | High |
| Performance <90 | Optimize images, enable compression, lazy load | High |
| No rich results | Add/fix structured data | Medium |
| Poor social previews | Add/fix Open Graph tags | High |
| Not mobile-friendly | Responsive redesign required | Critical |

### Common Issues & Fixes

| Problem | Diagnosis | Solution |
|---------|-----------|----------|
| No social preview | Missing OG tags | Add Open Graph meta tags |
| Image doesn't show | Relative URL | Use absolute HTTPS URLs |
| Rich results missing | No schema | Add JSON-LD structured data |
| Slow LCP | Large images | Optimize images, use WebP, lazy load |
| Poor INP | Heavy JavaScript | Reduce JS, debounce handlers |
| Layout shift (CLS) | No image dimensions | Add width/height attributes |
| Pages not indexed | Not in sitemap | Add to sitemap, submit to GSC |

---

## 9. 2025-Specific Priorities

### What Changed in 2025

1. **INP replaced FID** (March 2024) - Update all performance monitoring
2. **Image SEO elevated** - Now essential, not optional
3. **AI content scrutiny** - Google actively penalizes AI spam
4. **Content frequency matters** - 2x/week minimum for competitive niches
5. **Mobile-first assumed** - Desktop-only sites penalized

### What Stayed the Same

1. **Quality content wins** - No shortcuts
2. **User experience first** - Technical SEO supports UX
3. **HTTPS mandatory** - Non-negotiable
4. **Structured data important** - Rich results drive CTR
5. **Backlinks matter** - Quality over quantity

### Agent Optimization Workflow

**For any website optimization:**

1. **Audit:** Run PageSpeed, validate HTML, check GSC
2. **Fix Critical:** HTTPS, Core Web Vitals, mobile responsiveness
3. **Add Meta:** Title, description, OG tags, canonical
4. **Structure Data:** Person/Organization/Article schema
5. **Optimize Images:** Compress, alt text, lazy load, WebP
6. **Internal Links:** Navigation, breadcrumbs, related content
7. **Sitemap:** Create/update, submit to GSC
8. **Monitor:** GSC weekly, analytics daily
9. **Content:** 2x/week publishing schedule
10. **Iterate:** Adjust based on performance data

---

## 10. Validation Checklist

**Before marking SEO as complete:**

- [ ] Core Web Vitals: LCP <2.5s, INP <200ms, CLS <0.1
- [ ] Meta tags: Title, description, viewport present
- [ ] Open Graph: All required properties with absolute URLs
- [ ] Twitter Cards: Configured and tested
- [ ] Structured data: Valid JSON-LD, 0 errors
- [ ] Canonical URLs: Absolute HTTPS URLs
- [ ] HTTPS: Enforced with 301 redirects
- [ ] Sitemap.xml: Exists, valid XML, submitted to GSC
- [ ] Robots.txt: Exists, allows crawling, points to sitemap
- [ ] Images: Alt text, optimized size, WebP format
- [ ] Mobile: Responsive, no horizontal scroll, readable
- [ ] Performance: PageSpeed score 90+
- [ ] Security headers: X-Frame-Options, CSP, etc.
- [ ] Internal links: Working, descriptive anchors
- [ ] Social previews: Tested with Facebook/LinkedIn debuggers
- [ ] Google Search Console: Property verified, sitemap submitted

**Zero tolerance for:**
- ❌ HTTP without HTTPS redirect
- ❌ Relative URLs in OG tags
- ❌ Missing viewport meta tag
- ❌ Structured data errors
- ❌ Broken internal/external links
- ❌ Images without alt text
- ❌ Core Web Vitals in red

---

## Quick Reference URLs

**Testing:**
- PageSpeed: https://pagespeed.web.dev/
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Inspector: https://linkedin.com/post-inspector/
- Twitter Validator: https://cards-dev.twitter.com/validator
- Rich Results: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/

**Search Console:**
- Google: https://search.google.com/search-console
- Bing: https://www.bing.com/webmasters

**Documentation:**
- Schema.org: https://schema.org/
- Open Graph: https://ogp.me/
- Core Web Vitals: https://web.dev/vitals/

---

**End of Quick Reference**
**Last Updated:** October 2025
**Next Review:** January 2026
