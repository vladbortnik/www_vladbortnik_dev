# 📝 Blog Post Publishing Guide

## Quick Reference: Template Placeholders

When creating a new blog post from `templates/_template.html`, replace ALL these placeholders:

### Required Placeholders

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `[POST TITLE]` | Full article title | Getting Started with PostgreSQL |
| `[POST-SLUG]` | URL-friendly slug | getting-started-postgresql |
| `[POST DESCRIPTION]` | SEO meta description (150-160 chars) | A beginner's guide to PostgreSQL database... |
| `[KEYWORDS]` | Comma-separated keywords | PostgreSQL, Database, SQL, Tutorial |
| `[YYYY-MM-DD]` | Publication date | 2025-01-20 |
| `[POST-TITLE]` | URL-encoded title for Twitter | Getting%20Started%20with%20PostgreSQL |
| `[PROFICIENCY-LEVEL]` | Skill level required | Beginner / Intermediate / Advanced |
| `[TECH-DEPENDENCIES]` | Required tech/versions | Python 3.9+, PostgreSQL 14+ |

### Where to Find Each Placeholder

#### In `<head>` Section:
- **Line 8:** `<title>[POST TITLE] | Vlad Bortnik</title>`
- **Line 9:** `<meta name="description" content="[POST DESCRIPTION - 150-160 characters]">`
- **Line 10:** `<meta name="keywords" content="[KEYWORD1, KEYWORD2, KEYWORD3]">`
- **Line 13:** `<link rel="canonical" href="...posts/[POST-SLUG].html">`
- **Lines 17-26:** Open Graph and Twitter Card metadata
- **Line 54:** TechArticle headline
- **Line 55:** TechArticle description
- **Lines 80-81:** Publication/modification dates
- **Line 84:** mainEntityOfPage @id
- **Line 86:** Keywords (JSON-LD)
- **Line 87:** Proficiency level
- **Line 88:** Dependencies
- **Lines 110-111:** BreadcrumbList title and URL

#### In `<body>` Section:
- **Lines 243-247:** Social share URLs (Twitter, LinkedIn)

---

## Step-by-Step Publishing Process

### 1️⃣ Prepare Metadata

Gather this information before starting:

```
Title:          Getting Started with PostgreSQL
Slug:           getting-started-postgresql
Description:    A beginner's guide to PostgreSQL database administration, covering installation, configuration, and basic operations.
Keywords:       PostgreSQL, Database, SQL, Tutorial, DevOps
Category:       Database
Date:           2025-01-20
Read Time:      7 min read
Proficiency:    Intermediate
Dependencies:   PostgreSQL 14+, psql CLI
```

### 2️⃣ Create Post from Template

```bash
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog
cp templates/_template.html posts/getting-started-postgresql.html
```

### 3️⃣ Search & Replace Placeholders

**Use your editor's "Find & Replace" feature:**

1. `[POST TITLE]` → `Getting Started with PostgreSQL`
2. `[POST-SLUG]` → `getting-started-postgresql`
3. `[POST DESCRIPTION]` → `A beginner's guide to PostgreSQL...` (your 150-160 char description)
4. `[KEYWORDS]` → `PostgreSQL, Database, SQL, Tutorial, DevOps`
5. `[YYYY-MM-DD]` → `2025-01-20` (appears twice: datePublished and dateModified)
6. `[POST-TITLE]` → `Getting%20Started%20with%20PostgreSQL` (URL-encoded, in Twitter share link)
7. `[PROFICIENCY-LEVEL]` → `Intermediate`
8. `[TECH-DEPENDENCIES]` → `PostgreSQL 14+, psql CLI`

### 4️⃣ Insert Your Article Content

Find the placeholder content section (around line 220):

```html
<p>
    Introduction paragraph goes here. Set the context and hook the reader...
</p>

<h2>First Major Section</h2>
```

**Replace with your HTML content.**

### 5️⃣ Add Syntax Highlighting Classes

For code blocks, add `class="language-*"`:

```html
<pre><code class="language-python">
def hello():
    print("Hello World")
</code></pre>
```

**Supported languages:** `python`, `bash`, `javascript`, `yaml`

### 6️⃣ Update Blog Index (blog.js)

Open `/blog/assets/js/blog.js` and add your post **at the top** of the `blogPosts` array:

```javascript
const blogPosts = [
  {
    id: 4,  // Increment from last ID
    slug: "getting-started-postgresql",
    title: "Getting Started with PostgreSQL",
    excerpt: "A beginner's guide to PostgreSQL database administration...",
    category: "Database",
    date: "2025-01-20",
    readTime: "7 min read",
    author: "Vlad Bortnik"
  },
  // ... existing posts
];
```

### 7️⃣ Update RSS Feed (feed.xml)

1. **Update lastBuildDate** (line 8):
   ```xml
   <lastBuildDate>Mon, 20 Jan 2025 00:00:00 GMT</lastBuildDate>
   ```

2. **Add new item at the top** (after line 10):
   ```xml
   <item>
     <title>Getting Started with PostgreSQL</title>
     <link>https://vladbortnik.dev/blog/posts/getting-started-postgresql.html</link>
     <guid>https://vladbortnik.dev/blog/posts/getting-started-postgresql.html</guid>
     <pubDate>Mon, 20 Jan 2025 00:00:00 GMT</pubDate>
     <description>A beginner's guide to PostgreSQL database administration...</description>
     <category>Database</category>
     <author>vlad@vladbortnik.dev (Vlad Bortnik)</author>
   </item>
   ```

### 8️⃣ Local Testing

```bash
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev
python3 -m http.server 8765
```

**Test URLs:**
- Blog index: `http://localhost:8765/blog/`
- Your post: `http://localhost:8765/blog/posts/getting-started-postgresql.html`

**Verify:**
- ✅ Post appears on blog index
- ✅ Search functionality works
- ✅ Social share buttons functional
- ✅ Syntax highlighting displays
- ✅ Author bio renders correctly
- ✅ Newsletter signup appears
- ✅ Mobile responsive (resize browser)
- ✅ Schema markup validates (use Google Rich Results Test)

### 9️⃣ Deploy

```bash
git add blog/posts/getting-started-postgresql.html
git add blog/assets/js/blog.js
git add blog/feed.xml
git commit -m "Add blog post: Getting Started with PostgreSQL"
git push origin main
```

---

## 📋 Pre-Publish Checklist

Before going live, verify:

- [ ] All 8 placeholders replaced
- [ ] Code blocks have `class="language-*"`
- [ ] Images have alt text
- [ ] External links have `target="_blank" rel="noopener"`
- [ ] Post added to `blog.js`
- [ ] RSS feed updated
- [ ] `lastBuildDate` updated
- [ ] Local testing passed
- [ ] Mobile view checked
- [ ] Schema validates in Google Rich Results Test

---

## 🎯 Files You'll Edit Per Post

1. `/blog/posts/your-slug.html` ← **Create new**
2. `/blog/assets/js/blog.js` ← **Add entry**
3. `/blog/feed.xml` ← **Add RSS item**

---

## 🔍 Schema Validation

Test your schema markup:
1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your post URL
3. Verify `TechArticle` and `BreadcrumbList` appear
4. Check for errors/warnings

---

## 💡 Pro Tips

1. **Use URL encoding** for Twitter share titles (replace spaces with `%20`)
2. **Keep descriptions 150-160 chars** for optimal SEO display
3. **Match proficiency level** to your target audience
4. **List dependencies** to set reader expectations
5. **Test schema** before deploying to catch errors early
6. **Update existing posts** annually to keep content fresh

---

## 🆘 Common Issues

### Schema Validation Errors
- **Missing image dimensions:** Ensure width/height are included
- **Invalid date format:** Use `YYYY-MM-DD` format
- **Missing publisher logo:** Check image URL is accessible

### Social Share Not Working
- **Check URL encoding:** Twitter title must be URL-encoded
- **Verify slug:** Ensure `[POST-SLUG]` matches filename

### Syntax Highlighting Not Showing
- **Check class name:** Must be exactly `class="language-python"` etc.
- **Verify Prism.js loaded:** Check browser console for errors
- **Supported languages:** python, bash, javascript, yaml only

---

**Last Updated:** October 20, 2025  
**Template Version:** v10 (Enhanced Schema + Author Bio + Newsletter)
