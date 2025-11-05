# Manual Pre-Publication Checklist
## (Tasks that CANNOT be automated)

---

## 📝 CONTENT CREATION

### Before Writing:
- [ ] Choose article topic and title
- [ ] Research and outline main sections
- [ ] Determine target audience and difficulty level
- [ ] Decide publication date

### During Writing:
- [ ] Write article content
- [ ] Create code examples and screenshots
- [ ] Write introduction and conclusion
- [ ] Decide which sections should be **numbered** vs **unnumbered**
  - Typically unnumbered: Introduction, Conclusion, Resources, Get in Touch
  - Typically numbered: All main content sections

---

## 🎯 METADATA (Manual Entry Required)

### blog/assets/js/blog.js - Add New Entry:
```javascript
{
  id: X,  // ← INCREMENT from last article
  slug: "X-descriptive-slug-here",  // ← MATCH HTML filename
  title: "Full Article Title",  // ← COPY from HTML
  excerpt: "One compelling sentence.",  // ← WRITE 1-2 sentences
  category: "DevOps",  // ← CHOOSE: DevOps|Python|Docker|etc
  date: "YYYY-MM-DD",  // ← SET publication date
  readTime: "XX min read",  // ← ESTIMATE (or count words ÷ 200)
  author: "Vlad Bortnik"
}
```

**Critical Rules:**
- ✅ `slug` MUST match HTML filename (without `.html`)
- ✅ `date` format: `YYYY-MM-DD` (NO time component)
- ✅ `readTime` MUST match HTML file read time

---

## 📋 ARTICLE_TEMPLATE.html - Manual Replacements

### Find and Replace All Instances:

| Find | Replace With | Count |
|------|--------------|-------|
| `ARTICLE_TITLE` | Your article title | ~10 places |
| `ARTICLE_SLUG` | URL-safe slug | ~5 places |
| `ARTICLE_DESCRIPTION` | 1-2 sentence summary | ~3 places |
| `ARTICLE_KEYWORDS` | Comma-separated keywords | ~2 places |
| `ARTICLE_CATEGORY` | Category name | ~2 places |
| `ARTICLE_TAGLINE` | Italic intro sentence | ~1 place |
| `YYYY-MM-DD` | Publication date (e.g., 2025-11-03) | ~3 places |
| `MONTH DAY, YEAR` | Human date (e.g., November 3, 2025) | ~1 place |
| `XX min read` | Read time (e.g., 19 min read) | ~1 place |
| `CATEGORY` | Category name for badge | ~1 place |

---

## 🔗 LINK TEXT FORMATTING (Manual Review Required)

**After running automation, manually review ALL link text:**

### Documentation Links → Title Case
❌ Bad: `docker documentation`  
✅ Good: `Docker Documentation`

❌ Bad: `nginx reverse proxy guide`  
✅ Good: `Nginx Reverse Proxy Guide`

### Domain Names → lowercase
❌ Bad: `NETDATA.CLOUD`  
✅ Good: `netdata.cloud`

❌ Bad: `GitHub.com`  
✅ Good: `github.com`

### Tool/Product Names → Proper Case
❌ Bad: `cloudflare cdn`  
✅ Good: `Cloudflare CDN`

❌ Bad: `ssl labs server test`  
✅ Good: `SSL Labs Server Test`

### Acronyms → UPPERCASE (OK)
✅ OK: `OWASP`, `SSL`, `SSH`, `HTTP`, `DNS`, `VPS`

**Manual grep search:**
```bash
grep -n 'href=.*>.*</a>' blog/posts/ARTICLE_SLUG.html | less
```
Then visually scan each link and fix formatting.

---

## 📑 TABLE OF CONTENTS (Manual Creation)

### For Each Section/Subsection:

1. **Write the section heading in article:**
   ```html
   <!-- Numbered -->
   <h2 id="descriptive-kebab-case">Section Name</h2>
   
   <!-- Unnumbered (Introduction, Conclusion, etc.) -->
   <h2 id="descriptive-kebab-case" class="no-number">Section Name</h2>
   ```

2. **Add corresponding TOC entry:**
   ```html
   <!-- Numbered -->
   <li><a href="#descriptive-kebab-case">Section Name</a></li>
   
   <!-- Unnumbered -->
   <li class="no-number"><a href="#descriptive-kebab-case">Section Name</a></li>
   ```

3. **For subsections (H3):**
   ```html
   <!-- In article -->
   <h3 id="subsection-kebab-case">Subsection Name</h3>
   
   <!-- In TOC (nested) -->
   <li>Parent Section
     <ol>
       <li><a href="#subsection-kebab-case">Subsection Name</a></li>
     </ol>
   </li>
   ```

**Manual verification:**
- [ ] Every TOC link has a matching `id` in the article
- [ ] Numbering in TOC matches article heading numbering
- [ ] No broken anchor links (test by clicking each one)

---

## 🖼️ IMAGES (Manual Tasks)

### Article Images:
- [ ] Create or select title image
- [ ] Optimize images (compress, resize)
- [ ] Upload to: `assets/img/blog/ARTICLE_SLUG/`
- [ ] Add descriptive `alt` text to each image
- [ ] Update template image path:
  ```html
  <img alt="Descriptive alt text" 
       loading="lazy" 
       src="../../assets/img/blog/ARTICLE_SLUG/title-image.jpg"/>
  ```

### Image Dimensions:
- [ ] Verify brand-logo.png = **1200x630** (3 instances)
  - Automated validator will check this, but create correctly from start

---

## ⏱️ READ TIME CALCULATION (Manual or Semi-Manual)

### Method 1: Word Count
1. Count total words in article
2. Divide by 200 (average reading speed)
3. Round up to nearest minute

Example: 3,800 words ÷ 200 = 19 minutes

### Method 2: Manual Estimation
1. Read through article at normal pace
2. Time yourself
3. Add 20% buffer time
4. Round to nearest minute

**Update in 2 places:**
- [ ] `blog/assets/js/blog.js` → `readTime: "XX min read"`
- [ ] HTML file → `<span>XX min read</span>`

---

## ✅ PRE-PUBLICATION MANUAL REVIEW

### Content Quality:
- [ ] Proofread entire article (grammar, spelling)
- [ ] Verify all code examples are correct
- [ ] Test all code snippets work as expected
- [ ] Check that technical explanations are accurate
- [ ] Ensure tone is consistent throughout

### Links:
- [ ] Click every internal link (TOC anchors)
- [ ] Click sample of external links (verify they work)
- [ ] Review link text formatting (see rules above)

### Metadata Sync (Triple Check!):
- [ ] Date in blog.js = Date in HTML = Date in Schema
- [ ] Read time in blog.js = Read time in HTML
- [ ] Title in blog.js = Title in HTML (all ~10 places)
- [ ] Category in blog.js = Category in HTML

### Visual Check:
- [ ] Open article in browser
- [ ] Check mobile responsive layout
- [ ] Verify TOC scrollspy works
- [ ] Verify reading progress bar works
- [ ] Check code syntax highlighting renders correctly
- [ ] Verify images load and display properly

---

## 🚀 DEPLOYMENT (Manual Steps)

### Before Commit:
- [ ] Run automated validator: `python3 blog/validate_article.py blog/posts/ARTICLE_SLUG.html`
- [ ] Fix any issues reported by validator
- [ ] Run one final manual review of checklist above

### Git Commit:
- [ ] Stage all files: article HTML, updated blog.js, any new images
- [ ] Write descriptive commit message
- [ ] Push to repository

### Post-Deploy:
- [ ] Test article on live site
- [ ] Verify Open Graph preview (Twitter, LinkedIn)
- [ ] Share on social media
- [ ] Monitor analytics for initial traffic

---

## 📊 ESTIMATED MANUAL TIME

| Task | Time |
|------|------|
| Content creation | Variable (2-8 hours) |
| Metadata entry | 5 minutes |
| Template replacements | 5 minutes |
| TOC creation | 10 minutes |
| Link text review | 10 minutes |
| Image preparation | 10 minutes |
| Final review | 10 minutes |
| **Total (excluding writing):** | **~50 minutes** |

---

## 💡 TIPS TO MINIMIZE MANUAL WORK

1. **Write with structure in mind**: Use consistent heading hierarchy (H2, H3) from the start
2. **Format links correctly as you write**: Apply Title Case/lowercase rules immediately
3. **Take screenshot during development**: Don't recreate environments later just for images
4. **Use consistent ID naming**: kebab-case, descriptive, matches heading text
5. **Estimate read time early**: Helps set expectations, can refine later

---

**Last Updated:** November 4, 2025  
**Based On:** Article #1 experience  
**Automation Status:** External links, validation, date parsing = automated ✅
