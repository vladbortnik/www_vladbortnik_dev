# SEO Improvements Not Yet Implemented

**Last Updated:** October 2025
**Purpose:** Track SEO improvements identified but not yet completed

---

## 📊 Status Overview

| Category | Completed | Pending | Total |
|----------|-----------|---------|-------|
| **Technical SEO** | 8 | 4 | 12 |
| **Image Optimization** | 2 | 4 | 6 |
| **Content Strategy** | 1 | 3 | 4 |
| **Schema Markup** | 4 | 2 | 6 |
| **Performance** | 2 | 3 | 5 |
| **Advanced Features** | 0 | 5 | 5 |
| **TOTAL** | **17** | **21** | **38** |

**Completion Rate:** 45% (17/38)

---

## ✅ Recently Completed (October 2025)

### Technical Improvements
- ✅ Added WebSite schema to index.html
- ✅ Added ContactPage schema to contact.html
- ✅ Improved profile image alt text
- ✅ Added lazy loading to all technology icons (40+)
- ✅ Updated meta descriptions
- ✅ Created agent-focused SEO reference file

### Documentation Updates
- ✅ Updated all SEO documentation with October 2025 standards
- ✅ Added INP (replaced FID) information
- ✅ Added image SEO as essential practice
- ✅ Added AI content guidelines
- ✅ Added content publishing frequency (2x/week)
- ✅ Added comprehensive step-by-step validation process

---

## 🔲 Priority 1: Critical (Do Within 1-2 Weeks)

### 1. Image Optimization - WebP Format

**What:** Convert all images to WebP format with JPG/PNG fallbacks

**Why Important:**
- WebP images are 25-35% smaller than JPG
- Directly improves LCP and INP scores
- Essential for 2025 Core Web Vitals compliance
- Can boost PageSpeed score by 5-10 points

**Current Status:**
- All images currently in JPG/PNG format only
- No WebP implementation yet

**How to Implement:**

**Option 1: Manual Conversion (Simple)**
1. Go to: https://squoosh.app/
2. Upload each image
3. Select WebP format
4. Download optimized version
5. Save as: `image-name.webp`

**Option 2: Automated (Better for bulk)**
```bash
# Install ImageMagick
brew install imagemagick

# Convert all JPG to WebP
find assets/img -name "*.jpg" -exec sh -c 'magick "$1" "${1%.jpg}.webp"' _ {} \;

# Convert all PNG to WebP
find assets/img -name "*.png" -exec sh -c 'magick "$1" "${1%.png}.webp"' _ {} \;
```

**HTML Implementation:**
```html
<!-- Replace this -->
<img src="photo.jpg" alt="..." loading="lazy">

<!-- With this -->
<picture>
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="..." loading="lazy">
</picture>
```

**Files to Convert:**
- `/assets/img/me.jpg` (profile photo)
- `/assets/img/portfolio/technologies-icons/*.png` (40+ technology icons)
- `/assets/img/portfolio/server-setup/*.png` (project screenshots)
- All other portfolio images

**Estimated Time:** 2-3 hours
**Impact:** High (improves Core Web Vitals significantly)

---

### 2. Add Explicit Width/Height to All Images

**What:** Add width and height attributes to all `<img>` tags

**Why Important:**
- Prevents Cumulative Layout Shift (CLS)
- Browser reserves space before image loads
- No content jumping while page loads
- Critical for CLS <0.1 target

**Current Status:**
- Most images don't have width/height attributes
- Causing layout shifts as images load

**How to Implement:**

**Step 1: Find Image Dimensions**
```bash
# Check image size
identify assets/img/me.jpg
# Output: me.jpg JPEG 800x600 800x600+0+0 8-bit sRGB 150KB
```

**Step 2: Add to HTML**
```html
<!-- Before -->
<img src="me.jpg" alt="..." loading="lazy">

<!-- After -->
<img src="me.jpg" alt="..." width="800" height="600" loading="lazy">
```

**CSS to Maintain Responsiveness:**
```css
img {
    max-width: 100%;
    height: auto;
}
```

**Which Images Need This:**
- Profile photo: `assets/img/me.jpg`
- All technology icons (check each dimension)
- Project screenshots
- Any image that loads after initial page render

**Estimated Time:** 1-2 hours
**Impact:** High (fixes CLS issues)

---

### 3. Compress All Images Under 200KB

**What:** Reduce file size of all images to under 200KB each

**Why Important:**
- Large images slow down LCP significantly
- Mobile users on slow connections suffer most
- Every 100KB saved = ~0.5s faster load time
- Critical for achieving PageSpeed 90+ on mobile

**Current Status:**
- Some images exceed 200KB
- Technology icons are well-optimized
- Project screenshots may be too large

**How to Check Image Sizes:**
```bash
# List all images with file sizes
find assets/img -type f \( -name "*.jpg" -o -name "*.png" \) -exec ls -lh {} \; | awk '{print $5 " " $9}'

# Find images larger than 200KB
find assets/img -type f \( -name "*.jpg" -o -name "*.png" \) -size +200k -exec ls -lh {} \;
```

**How to Compress:**

**Online (Easy):**
1. Go to: https://tinypng.com/
2. Upload images
3. Download compressed versions
4. Replace originals

**Command Line (Bulk):**
```bash
# Install ImageOptim CLI (Mac)
brew install imageoptim-cli

# Optimize all images
imageoptim --quality=85 assets/img/**/*.{jpg,png}
```

**Target Sizes:**
- Profile photo: <150KB
- Technology icons: <50KB each
- Project screenshots: <200KB each
- OG images: <300KB (1200x630 is large)

**Estimated Time:** 1-2 hours
**Impact:** Very High (major LCP improvement)

---

### 4. Create Custom Open Graph Images (1200x630px)

**What:** Design specific OG images for each page instead of reusing profile photo

**Why Important:**
- Higher click-through rate on social shares
- More professional appearance
- Can include text/branding
- Differentiates each page when shared

**Current Status:**
- Homepage uses profile photo (`me.jpg`)
- Server-setup page uses project screenshot
- Contact page uses profile photo
- No branded, purpose-designed OG images

**What to Create:**

**Homepage OG Image:**
- Size: 1200x630px exactly
- Content: Your photo + name + "Software Engineer"
- Background: Professional gradient or solid color
- Text: Large, high-contrast, readable at thumbnail size
- Brand colors from your website

**Server-Setup Page OG Image:**
- Size: 1200x630px
- Content: "Production Server Setup Guide"
- Include: Docker, Nginx, DigitalOcean logos
- Your branding

**Contact Page OG Image:**
- Size: 1200x630px
- Content: "Get In Touch - Vlad Bortnik"
- Include: Contact icons, your photo
- Call-to-action: "Let's build something great"

**Tools to Create:**
- **Canva** (easiest): https://canva.com/ - Templates for "Open Graph"
- **Figma** (more control): Create 1200x630 frame
- **Photoshop** (professional): Full design control

**Where to Update:**
```html
<!-- Homepage -->
<meta property="og:image" content="https://vladbortnik.dev/assets/img/og-homepage.jpg">

<!-- Server Setup -->
<meta property="og:image" content="https://vladbortnik.dev/assets/img/og-server-setup.jpg">

<!-- Contact -->
<meta property="og:image" content="https://vladbortnik.dev/assets/img/og-contact.jpg">
```

**Estimated Time:** 3-4 hours (design + create)
**Impact:** Medium-High (improves social sharing CTR)

---

## 🔲 Priority 2: Important (Do Within 1 Month)

### 5. Add Breadcrumb Navigation with Schema

**What:** Add breadcrumb navigation to `server-setup.html` with BreadcrumbList schema

**Why Important:**
- Better user experience (users know where they are)
- Google shows breadcrumbs in search results
- Improved site structure signals
- Helps with internal linking

**How to Implement:**

**HTML (after header):**
```html
<nav aria-label="breadcrumb" class="breadcrumb-nav">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="/">Home</a></li>
    <li class="breadcrumb-item"><a href="/#portfolio">Projects</a></li>
    <li class="breadcrumb-item active" aria-current="page">Server Setup</li>
  </ol>
</nav>
```

**Schema (in `<head>`):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://vladbortnik.dev/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Projects",
      "item": "https://vladbortnik.dev/#portfolio"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Server Setup"
    }
  ]
}
</script>
```

**CSS Styling:**
```css
.breadcrumb-nav {
    background: #f8f9fa;
    padding: 10px 20px;
    margin-bottom: 20px;
}

.breadcrumb {
    list-style: none;
    display: flex;
    gap: 10px;
    margin: 0;
}

.breadcrumb-item + .breadcrumb-item::before {
    content: "›";
    margin-right: 10px;
    color: #6c757d;
}
```

**Where to Add:**
- `server-setup.html` (most important)
- Any future project detail pages
- Blog post pages (if not already implemented)

**Estimated Time:** 1 hour
**Impact:** Medium (improves UX and SEO)

---

### 6. Implement Blog Content Publishing Schedule

**What:** Establish and maintain 2x/week blog publishing schedule

**Why Important:**
- **Critical for 2025:** Minimum requirement for competitive rankings
- Google favors active, frequently-updated sites
- More content = more keywords = more traffic
- Builds authority faster

**Current Status:**
- Blog exists with 3 posts
- No regular publishing schedule
- Need consistent content flow

**Content Calendar Template:**

**Week 1:**
- **Tuesday:** Technical tutorial (e.g., "Docker Multi-Stage Builds Explained")
- **Friday:** Project showcase or case study

**Week 2:**
- **Tuesday:** Best practices article (e.g., "Flask Security Checklist")
- **Friday:** Quick tip or how-to

**Week 3:**
- **Tuesday:** Deep dive technical article
- **Friday:** Industry trends or opinion piece

**Week 4:**
- **Tuesday:** Problem-solving article (debug story)
- **Friday:** Tools & resources roundup

**Topic Ideas for Next 12 Posts:**
1. Docker Compose Best Practices for Production
2. Flask vs FastAPI: When to Use Each
3. Setting Up CI/CD with GitHub Actions
4. Nginx Reverse Proxy Configuration Deep Dive
5. Python Type Hints: Beyond the Basics
6. Securing Your Flask Application: Complete Checklist
7. PostgreSQL Performance Tuning for Web Apps
8. Docker Networking Explained Simply
9. Flask Application Factory Pattern
10. DevOps Monitoring Stack: Prometheus + Grafana
11. SSH Security Hardening for Servers
12. Python Asyncio for Backend Developers

**AI-Assisted Writing Workflow:**
1. Generate outline with AI
2. Write first draft (AI-assisted)
3. Add your personal experience and examples
4. Include screenshots from your projects
5. Verify all technical facts
6. Edit to match your voice
7. Read out loud - does it sound like you?
8. Publish

**Quality Checklist Per Post:**
- [ ] 1000+ words (minimum)
- [ ] Real code examples
- [ ] Screenshots or diagrams
- [ ] Personal insights/experiences
- [ ] All facts verified
- [ ] Proper meta tags (title, description)
- [ ] Open Graph image
- [ ] Internal links to other posts
- [ ] External links to sources

**Estimated Time:** 4-6 hours/week (2 posts)
**Impact:** Very High (essential for long-term SEO success)

---

### 7. Set Up Google Analytics 4 or Keep Umami

**What:** Decide between Google Analytics 4 (GA4) or continue with Umami

**Current Status:**
- Using Umami (privacy-friendly)
- No Google Analytics

**Comparison:**

**Google Analytics 4:**
- ✅ Integrated with Google Search Console
- ✅ More detailed analytics
- ✅ Event tracking
- ✅ Conversion tracking
- ❌ Privacy concerns
- ❌ Cookie consent required (GDPR)
- ❌ More complex setup

**Umami (Current):**
- ✅ Privacy-friendly
- ✅ No cookie consent needed
- ✅ Simple, clean interface
- ✅ Self-hosted (you control data)
- ❌ Less detailed analytics
- ❌ No Google integration
- ❌ Basic reporting

**Recommendation:**
Keep Umami for now, add GA4 later if needed for:
- E-commerce tracking
- Conversion funnel analysis
- Detailed user behavior

**If Adding GA4:**
1. Create GA4 property: https://analytics.google.com/
2. Get tracking ID
3. Add to `<head>`:
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
4. Add cookie consent banner
5. Update privacy policy

**Estimated Time:** 2 hours (if implementing GA4)
**Impact:** Low-Medium (Umami sufficient for now)

---

### 8. Submit to Bing Webmaster Tools

**What:** Register site with Bing and submit sitemaps

**Why Important:**
- Bing represents 6-8% of search traffic
- Growing market share
- Easy wins (less competition than Google)
- Integrates with Windows, Cortana, etc.

**Current Status:**
- Not registered with Bing
- Missing potential traffic

**How to Implement:**

**Step 1: Sign Up**
1. Go to: https://www.bing.com/webmasters
2. Sign in with Microsoft account
3. Click "Add a site"

**Step 2: Verify Ownership**
- **Option 1:** XML file upload (easiest)
- **Option 2:** Add meta tag to `<head>`
- **Option 3:** DNS verification

**Step 3: Submit Sitemaps**
1. Click "Sitemaps"
2. Add: `https://vladbortnik.dev/sitemap.xml`
3. Add: `https://vladbortnik.dev/blog/sitemap.xml`

**Step 4: Configure Settings**
- Set crawl rate (low for small sites)
- Review URL inspection tool
- Check for crawl errors

**Estimated Time:** 30 minutes
**Impact:** Low-Medium (easy wins, less traffic than Google)

---

## 🔲 Priority 3: Nice to Have (Do Within 3 Months)

### 9. Add FAQ Schema (If Adding FAQ Section)

**What:** Add FAQ schema to pages with frequently asked questions

**Why Needed:**
- Rich results in Google (expandable Q&A boxes)
- Higher click-through rate
- Better user experience
- Voice search optimization

**Where to Add:**
- Homepage (if adding FAQ section)
- Server-setup page (troubleshooting section)
- Contact page (common questions)

**Implementation:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What backend technologies do you specialize in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I specialize in Python/Flask, Docker, Nginx, PostgreSQL, and cloud deployment on DigitalOcean."
      }
    },
    {
      "@type": "Question",
      "name": "Where are you located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I'm based in New York City and available for remote work."
      }
    }
  ]
}
</script>
```

**First, Add FAQ Section to HTML:**
```html
<section id="faq">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-item">
    <h3>What backend technologies do you specialize in?</h3>
    <p>I specialize in Python/Flask, Docker, Nginx, PostgreSQL...</p>
  </div>
  <!-- More Q&A pairs -->
</section>
```

**Estimated Time:** 2-3 hours
**Impact:** Medium (if you add FAQ sections)

---

### 10. Implement Portfolio ItemList Schema

**What:** Add ItemList schema to portfolio section

**Why Important:**
- Tells Google about your project collection
- Can appear as carousel in search results
- Better organization signals

**Implementation:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Backend Development Projects",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "CreativeWork",
        "name": "Production-Grade Multi-Application Server",
        "description": "Custom server setup with Docker, Nginx, SSL, DNS",
        "url": "https://vladbortnik.dev/server-setup.html",
        "keywords": "Docker, Nginx, DigitalOcean, DevOps"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "SoftwareApplication",
        "name": "Recipe Web App",
        "description": "Flask-based recipe management application",
        "url": "https://vladbortnik.dev/#portfolio"
      }
    }
  ]
}
</script>
```

**Estimated Time:** 1 hour
**Impact:** Low-Medium (nice to have)

---

### 11. Add Twitter Account and Update Tags

**What:** Create Twitter/X account and add `twitter:creator` tags

**Current Status:**
- Twitter Card tags exist
- No `twitter:creator` tag (because no account)

**If Creating Twitter:**

**Step 1: Create Account**
1. Go to: https://twitter.com/signup
2. Claim: `@vladbortnik_dev` (matches brand)
3. Use professional photo
4. Bio: "Software Engineer | Python, Docker, DevOps | NYC"
5. Link: `https://vladbortnik.dev`

**Step 2: Update Website**
```html
<!-- Add to all pages -->
<meta name="twitter:creator" content="@vladbortnik_dev">
```

**Step 3: Update Schema**
```json
"sameAs": [
  "https://github.com/vladbortnik",
  "https://linkedin.com/in/vladbortnik",
  "https://twitter.com/vladbortnik_dev"  ← Add this
]
```

**Content Strategy:**
- Share blog posts (2x/week)
- Retweet interesting tech content
- Engage with #DevTwitter community
- Share quick tips and learnings

**Estimated Time:** 1 hour setup + ongoing engagement
**Impact:** Medium (optional but valuable for networking)

---

### 12. Add Video Schema (If Adding Video Content)

**What:** Add VideoObject schema if you create tutorial videos

**When to Implement:**
- If you create project walkthrough videos
- If you add video tutorials to blog posts
- If you create YouTube content

**Implementation:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Docker Deployment Tutorial",
  "description": "Complete guide to deploying Flask apps with Docker",
  "thumbnailUrl": "https://vladbortnik.dev/assets/img/video-thumb.jpg",
  "uploadDate": "2025-10-15",
  "duration": "PT10M30S",
  "contentUrl": "https://youtube.com/watch?v=xxxxx"
}
</script>
```

**Estimated Time:** 30 minutes per video
**Impact:** High (if creating video content)

---

### 13. Local SEO - Google Business Profile

**What:** Create Google Business Profile for local NYC search

**Why Consider:**
- Appear in "near me" searches
- Google Maps listing
- Local search advantage
- Good for freelance/consulting

**When to Implement:**
- If offering freelance services
- If targeting local NYC clients
- If building local brand

**Setup:**
1. Go to: https://business.google.com/
2. Create business profile
3. Verify location (if applicable)
4. Add services, hours, photos
5. Get reviews

**For Remote/Online Only:**
- Can create profile as "Service Area Business"
- Set service area to NYC metro
- Don't show physical address

**Estimated Time:** 1-2 hours
**Impact:** Medium (only if targeting local market)

---

## 📊 Tracking Progress

**How to Use This Document:**

1. **Monthly Review:**
   - Pick 2-3 items from Priority 1
   - Move completed items to "Recently Completed" section
   - Update completion percentages

2. **Quarterly Review:**
   - Reassess priorities
   - Add new items discovered
   - Remove irrelevant items

3. **Mark as Complete:**
   - Move item to "Recently Completed"
   - Add completion date
   - Update status table at top

---

## 🎯 Next Actions (This Month)

**Week 1-2:**
- [ ] Convert all images to WebP format
- [ ] Add width/height to all images
- [ ] Compress images under 200KB

**Week 3-4:**
- [ ] Create custom OG images for each page
- [ ] Add breadcrumb navigation to server-setup.html
- [ ] Set up blog content calendar

---

## 📝 Notes

**Remember:**
- Don't try to do everything at once
- Focus on high-impact items first
- Test after each implementation
- SEO is ongoing, not one-time

**Questions?**
- Refer to main SEO documentation files
- Use validation tools to test
- Join r/SEO community for help

---

**Last Updated:** October 2025
**Next Review:** January 2026
