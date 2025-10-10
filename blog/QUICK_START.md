# Quick Start Guide

Get your blog running in 5 minutes!

## 🚀 Immediate Steps

### 1. Test Locally (2 minutes)

```bash
# Navigate to blog directory
cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/

# Start a local server
python3 -m http.server 8000

# Open in browser
# Visit: http://localhost:8000
```

**What to check:**
- ✅ Blog homepage loads
- ✅ Search box works
- ✅ Filter buttons work
- ✅ 3 sample posts appear
- ✅ Click a post to view it
- ✅ Post content renders correctly

### 2. Setup Giscus Comments (3 minutes)

**Only if you want comments enabled right now:**

1. **Enable Discussions** in your GitHub repo:
   - Go to Settings → Features → Check "Discussions"

2. **Install Giscus app**:
   - Visit: https://github.com/apps/giscus
   - Install on your repository

3. **Configure and copy script**:
   - Visit: https://giscus.app/
   - Enter your repo name
   - Choose "pathname" mapping
   - Choose "dark" theme
   - Copy the generated script

4. **Update post.html**:
   - Open `/blog/post.html` line ~118
   - Replace placeholder with your script
   - Save file

**Or skip this step** and use the placeholder. Comments will show setup instructions to visitors.

### 3. Deploy (Varies)

**If using Git:**
```bash
git add blog/
git commit -m "Add blog functionality"
git push
```

**If uploading manually:**
```bash
scp -r blog/ user@server:/var/www/html/
```

**Or use FTP/SFTP client** (FileZilla, Cyberduck, etc.)

---

## ✨ Your Blog is Ready!

Visit: `https://yourdomain.com/blog/`

## 📝 Quick Feature Overview

### Already Working:
- ✅ **Search** - Type to filter posts instantly
- ✅ **Categories** - Filter by DevOps, Backend, Docker
- ✅ **Tags** - Filter by Python, Flask, Docker, etc.
- ✅ **Responsive** - Works on mobile, tablet, desktop
- ✅ **Dark theme** - Matches your main site
- ✅ **SEO** - Meta tags, sitemap, structured data
- ✅ **Fast** - No build step, pure vanilla JS
- ✅ **3 Sample Posts** - Ready to read

### To Add Comments:
- Follow step 2 above (takes 3 minutes)

---

## 🎯 What's Next?

### Option 1: Start Writing (Recommended)

Replace sample posts with your own content:

1. **Create new markdown file**:
   ```bash
   touch blog/posts/my-first-real-post.md
   ```

2. **Write your content** (Markdown format)

3. **Add metadata** to `blog/posts/posts.json`:
   ```json
   {
     "slug": "my-first-real-post",
     "title": "My First Real Post",
     "excerpt": "Brief description here...",
     "author": "Vlad Bortnik",
     "date": "2025-01-20",
     "category": "Backend Development",
     "tags": ["Python", "Web Development"],
     "file": "my-first-real-post.md"
   }
   ```

4. **Test locally** → **Deploy**

### Option 2: Customize Design

Edit colors in `/blog/assets/css/blog-style.css`:

```css
:root {
  --bg-primary: #040404;        /* Background */
  --accent-primary: #18d26e;    /* Your brand color */
  --accent-hover: #35e888;      /* Hover state */
}
```

### Option 3: Add to Main Site

Link to your blog from your homepage:

```html
<!-- In your main index.html navigation -->
<li><a class="nav-link" href="/blog/">Blog</a></li>
```

---

## 📚 Documentation Available

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `GISCUS_SETUP_GUIDE.md` | Detailed comment setup |
| `TESTING_DEPLOYMENT.md` | Testing & deployment guide |
| `IMPLEMENTATION_PLAN.md` | Technical architecture details |
| `QUICK_START.md` | This file! |

---

## 🆘 Troubleshooting

### Posts not showing?
- Check browser console (F12) for errors
- Verify `posts.json` has valid JSON syntax
- Ensure markdown files exist in `/posts/` folder

### Search not working?
- Verify JavaScript files are loading
- Check `blog.js` path in `index.html`

### Styling looks wrong?
- Clear browser cache (Ctrl+Shift+R)
- Check `blog-style.css` is loading
- Verify Bootstrap CSS is loading

### Still stuck?
Open browser console (F12) and check for error messages.

---

## 🎉 You're Done!

Your blog is fully functional with:
- Search & filtering
- 3 sample posts
- Mobile-responsive design
- SEO optimization
- Comment system ready (just needs Giscus config)

**Start writing and sharing your knowledge!** 🚀

---

**Need help?** Check the detailed README.md or documentation files.
