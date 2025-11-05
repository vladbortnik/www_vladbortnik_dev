# Blog Folder Structure

```
blog/
├── index.html              # Blog homepage (lists all articles)
├── feed.xml               # RSS feed
│
├── assets/                # Static assets
│   ├── css/              # Blog-specific styles
│   ├── js/               # Blog JavaScript (blog.js contains article data)
│   └── img/              # Blog images
│
├── posts/                 # Published blog articles
│   └── 1-production-grade-multi-app-server-12-month.html
│
├── templates/             # Article templates
│   ├── ARTICLE_TEMPLATE.html  # New article template (use this!)
│   └── _template.html         # Legacy template
│
├── docs/                  # Documentation & checklists
│   ├── README.md                # Main guide (start here!)
│   ├── ARTICLE_CHECKLIST.md     # Automated tasks checklist
│   ├── MANUAL_CHECKLIST.md      # Manual tasks checklist
│   └── [other docs]
│
└── scripts/               # Automation scripts
    └── validate_article.py      # Article validator
```

---

## 📖 Quick Reference

### Creating a New Article
1. **Copy template:** `cp blog/templates/ARTICLE_TEMPLATE.html blog/posts/SLUG.html`
2. **Follow guide:** See `blog/docs/README.md`
3. **Use checklists:** `blog/docs/MANUAL_CHECKLIST.md` and `ARTICLE_CHECKLIST.md`

### Validating an Article
```bash
python3 blog/scripts/validate_article.py blog/posts/SLUG.html
```

### Key Files
- **Article data:** `blog/assets/js/blog.js` (add new articles here)
- **RSS feed:** `blog/feed.xml` (update with new articles)
- **Sitemap:** `/sitemap.xml` (update in root directory)

---

**For full documentation, see:** `blog/docs/README.md`
