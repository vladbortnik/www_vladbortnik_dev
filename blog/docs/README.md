# Blog Management Tools

## 📁 File Overview

| File | Location | Purpose | When to Use |
|------|----------|---------|-------------|
| **ARTICLE_TEMPLATE.html** | `templates/` | Pre-configured HTML template | Starting a new article |
| **MANUAL_CHECKLIST.md** | `docs/` | Manual tasks only | During article creation |
| **ARTICLE_CHECKLIST.md** | `docs/` | Automated + validation tasks | After writing, before publish |
| **validate_article.py** | `scripts/` | Automated validator script | Final pre-publication check |

---

## 🚀 Quick Start: Publishing a New Article

### 1. **Create Article** (Manual)
```bash
# Copy template
cp blog/templates/ARTICLE_TEMPLATE.html blog/posts/NEW-ARTICLE-SLUG.html

# Follow manual checklist
open blog/docs/MANUAL_CHECKLIST.md
```

### 2. **Add to Blog Index**
Edit `blog/assets/js/blog.js` and add new entry:
```javascript
{
  id: 2,  // Increment from last
  slug: "NEW-ARTICLE-SLUG",
  title: "Your Article Title",
  excerpt: "Brief description here.",
  category: "DevOps",
  date: "2025-11-XX",
  readTime: "XX min read",
  author: "Vlad Bortnik"
}
```

### 3. **Run Automation**
```bash
# Add external link attributes
python3 -c "
import re
file = 'blog/posts/NEW-ARTICLE-SLUG.html'
with open(file, 'r+') as f:
    content = f.read()
    content = re.sub(
        r'<a href=\"(https?://[^\"]+)\"(?![^>]*target=)',
        r'<a href=\"\1\" target=\"_blank\" rel=\"noopener noreferrer\"',
        content
    )
    f.seek(0)
    f.write(content)
    f.truncate()
"
```

### 4. **Validate**
```bash
# Run automated validator
python3 blog/scripts/validate_article.py blog/posts/NEW-ARTICLE-SLUG.html

# If issues found, fix them and re-run
```

### 5. **Manual Review**
- Open article in browser
- Check TOC links work
- Verify images display correctly
- Test mobile responsive layout
- Review link text formatting

### 6. **Deploy**
```bash
git add blog/
git commit -m "Add new article: TITLE"
git push
```

---

## 🛠️ Tools Reference

### validate_article.py

**Location:** `blog/scripts/validate_article.py`

**Purpose:** Automated pre-publication validation

**Usage:**
```bash
python3 blog/scripts/validate_article.py blog/posts/ARTICLE-SLUG.html
```

**Checks:**
- ✅ Image dimensions (1200x630)
- ✅ External link attributes
- ✅ Link text formatting
- ✅ Date consistency
- ✅ Read time consistency
- ✅ TOC anchor links

**Exit codes:**
- `0` = All checks passed
- `1` = Issues found (see output)

---

## 📋 Checklists

### MANUAL_CHECKLIST.md
**Contains:** Tasks that CANNOT be automated
- Content creation
- Metadata entry
- Link text formatting review
- TOC creation
- Image preparation
- Final manual review

**Estimated time:** ~50 minutes (excluding writing)

### ARTICLE_CHECKLIST.md
**Contains:** Automated processes + validation steps
- Automation scripts
- Validation commands
- Standards reference
- Troubleshooting tips

---

## 🎯 Standards Quick Reference

### Metadata
- **Date format:** `YYYY-MM-DD` (blog.js), `Month Day, Year` (HTML)
- **Read time:** Must sync across blog.js and HTML
- **Images:** ALL brand-logo.png = 1200x630

### Links
- **External links:** `target="_blank" rel="noopener noreferrer"`
- **Documentation:** Title Case (e.g., "Docker Documentation")
- **Domains:** lowercase (e.g., "netdata.cloud")
- **Products:** Proper Case (e.g., "Cloudflare CDN")

### TOC Structure
- **Numbered sections:** `<li><a href="#id">Name</a></li>`
- **Unnumbered sections:** `<li class="no-number"><a href="#id">Name</a></li>`
- **Article headings:** Add `class="no-number"` for unnumbered H2s

---

## 🐛 Troubleshooting

### Date shows wrong day in blog index
**Problem:** JavaScript Date() timezone conversion  
**Solution:** Already fixed in blog.js (manual parsing)

### External links don't open in new tab
**Problem:** Missing target attribute  
**Solution:** Run automation script from Quick Start step 3

### TOC numbering doesn't match article
**Problem:** Missing/incorrect `class="no-number"` on headings  
**Solution:** Add class to unnumbered H2s (Introduction, Conclusion, etc.)

### Validator reports wrong image dimensions
**Problem:** brand-logo.png not 1200x630  
**Solution:** Fix in 3 places (Open Graph, Schema image, Schema logo)

---

## 📚 Lessons Learned (Article #1)

1. **Timezone bug:** `new Date("2025-11-03")` converted to wrong day
2. **Image dimensions:** Mixed 512x512 and 1200x1200 (should be 1200x630)
3. **Read time sync:** blog.js showed 22 min, HTML showed 19 min
4. **Link formatting:** ALL CAPS instead of proper case
5. **External links:** Missing target="_blank"

**All issues now have automated checks or clear manual guidelines.**

---

## 📊 Time Estimates

| Phase | Time | Automation |
|-------|------|------------|
| Content writing | 2-8 hours | ❌ Manual |
| Template setup | 5 min | ✅ Template |
| Metadata entry | 5 min | ❌ Manual |
| TOC creation | 10 min | ❌ Manual |
| Link formatting | 10 min | ✅ Script + Manual review |
| Image prep | 10 min | ❌ Manual |
| Validation | 2 min | ✅ Automated |
| Final review | 10 min | ❌ Manual |
| **Total (excluding writing):** | **~50 min** | **60% automated** |

---

**Last Updated:** November 4, 2025  
**Version:** 1.0  
**Status:** Ready for Article #2 🚀
