# Blog Article Publication Checklist

> **📝 For manual-only tasks, see:** `docs/MANUAL_CHECKLIST.md`  
> **🤖 This file contains:** Automated processes + validation steps

---

## 📋 PRE-PUBLICATION CHECKLIST

### 1. METADATA SETUP

#### blog/assets/js/blog.js
```javascript
{
  id: X,
  slug: "X-article-slug-here",
  title: "Article Title Here",
  excerpt: "One-sentence description here.",
  category: "DevOps|Python|Docker|etc",
  date: "YYYY-MM-DD",  // ⚠️ CRITICAL: Use YYYY-MM-DD format
  readTime: "XX min read",
  author: "Vlad Bortnik"
}
```

**CRITICAL RULES:**
- ✅ Date format: `YYYY-MM-DD` (NO timezone, NO time component)
- ✅ Read time: Include "min read" suffix
- ✅ Slug must match HTML filename (without `.html`)

---

### 2. HTML FILE REPLACEMENTS

Use `ARTICLE_TEMPLATE.html` and replace ALL instances of:

| Placeholder | Replace With | Notes |
|------------|--------------|-------|
| `ARTICLE_TITLE` | Full article title | Used in multiple places |
| `ARTICLE_SLUG` | URL-safe slug | Match blog.js slug |
| `ARTICLE_DESCRIPTION` | 1-2 sentence summary | SEO meta description |
| `ARTICLE_KEYWORDS` | Comma-separated keywords | For meta tags |
| `ARTICLE_CATEGORY` | Category name | Match blog.js category |
| `ARTICLE_TAGLINE` | Italic intro text | Article subtitle |
| `YYYY-MM-DD` | Publication date | Match blog.js date |
| `MONTH DAY, YEAR` | Human-readable date | e.g., "November 3, 2025" |
| `XX min read` | Read time | Match blog.js readTime |

---

### 3. IMAGE DIMENSIONS (CRITICAL)

**ALL brand-logo.png instances MUST be:**
- ✅ Width: `1200`
- ✅ Height: `630`

**3 Locations to verify:**
1. Open Graph meta tags (line ~17-19)
2. Schema.org "image" property (line ~61-63)
3. Schema.org "logo" property (line ~80-82)

**DO NOT USE:** 512x512, 1200x1200, or any other dimensions!

---

### 4. EXTERNAL LINKS STANDARD

**ALL external links (https://) MUST have:**
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link Text</a>
```

**Automation script:**
```bash
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev
python3 -c "
import re
with open('blog/posts/ARTICLE_SLUG.html', 'r+') as f:
    content = f.read()
    content = re.sub(
        r'<a href=\"(https?://[^\"]+)\"',
        r'<a href=\"\1\" target=\"_blank\" rel=\"noopener noreferrer\"',
        content
    )
    f.seek(0)
    f.write(content)
    f.truncate()
"
```

---

### 5. LINK TEXT FORMATTING

| Type | Format | Examples |
|------|--------|----------|
| Documentation | Title Case | "Docker Documentation", "Nginx Guide" |
| Domain names | lowercase | "netdata.cloud", "sentry.io" |
| Tool names | Proper Case | "Cloudflare CDN", "SSL Labs Server Test" |
| Acronyms | UPPERCASE | "OWASP", "SSL", "SSH" |

**Search and fix:**
```bash
# Find ALL CAPS links (except acronyms)
grep -n 'href=.*>[A-Z][A-Z ]*</a>' blog/posts/ARTICLE_SLUG.html
```

---

### 6. TABLE OF CONTENTS

**Numbered sections:**
```html
<li><a href="#section-id">Section Name</a></li>
```

**Unnumbered sections (Introduction, Conclusion, etc.):**
```html
<li class="no-number"><a href="#section-id">Section Name</a></li>
```

**Nested subsections:**
```html
<li>Parent Section
  <ol>
    <li><a href="#subsection-1">Subsection 1</a></li>
    <li><a href="#subsection-2">Subsection 2</a></li>
  </ol>
</li>
```

**Article headings:**
```html
<!-- Numbered -->
<h2 id="section-id">Section Name</h2>

<!-- Unnumbered -->
<h2 id="section-id" class="no-number">Section Name</h2>
```

---

## ✅ VALIDATION CHECKLIST

### Before Declaring "Done":

- [ ] **Date sync:** blog.js date = HTML date = Schema date
- [ ] **Read time sync:** blog.js readTime = HTML readTime
- [ ] **Image dimensions:** ALL 3 instances = 1200x630
- [ ] **External links:** ALL have `target="_blank" rel="noopener noreferrer"`
- [ ] **Link text:** Title Case for docs, lowercase for domains
- [ ] **TOC:** Numbering matches article sections
- [ ] **Anchor links:** All TOC links work (no 404s)
- [ ] **Schema.org:** Valid JSON-LD (no syntax errors)

### Automated Checks:

```bash
# Check external links
grep -c 'href="https://' blog/posts/ARTICLE_SLUG.html
grep -c 'target="_blank"' blog/posts/ARTICLE_SLUG.html
# These two numbers should match!

# Check ALL CAPS link text (should return 0 or only acronyms)
grep 'href=.*>[A-Z][A-Z ]*</a>' blog/posts/ARTICLE_SLUG.html

# Check image dimensions
grep -A2 'brand-logo.png' blog/posts/ARTICLE_SLUG.html
# Should show: width: 1200, height: 630 (3 times)
```

---

## 🚀 DEPLOYMENT STEPS

1. **Update blog.js** with new article entry
2. **Create HTML file** from template
3. **Run external links script**
4. **Manual review** of link text formatting
5. **Validate** with checklist above
6. **Test locally** with Python HTTP server
7. **Visual verification** with Playwright/browser
8. **Commit and deploy**

---

## 📝 LEARNED PATTERNS (Article #1)

### Issues Fixed:
1. ❌ Date showed "November 2nd" instead of "November 3rd"
   - ✅ **Fix:** Manual date parsing (no `new Date()` in JS)

2. ❌ Read time: 22 minutes in blog.js, 19 minutes in HTML
   - ✅ **Fix:** Always sync these values

3. ❌ Image dimensions: 512x512 and 1200x1200 mixed
   - ✅ **Fix:** Always use 1200x630 (Open Graph standard)

4. ❌ External links missing `target="_blank"`
   - ✅ **Fix:** Python script to batch add

5. ❌ Link text: "NETDATA.CLOUD" instead of "netdata.cloud"
   - ✅ **Fix:** Apply formatting rules consistently

---

## 🔄 FUTURE IMPROVEMENTS

### When Time Permits:
- [ ] Create Python build script to sync blog.js → HTML
- [ ] Add Git pre-commit hook for validation
- [ ] Extract header/footer to shared templates
- [ ] Automated link text formatting check

---

**Last Updated:** November 4, 2025
**Version:** 1.0
**Based on:** Article #1 lessons learned
