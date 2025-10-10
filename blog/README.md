# Blog System Documentation

This is a vanilla JavaScript + Markdown-based blog system with search, filtering, tags, categories, and comment functionality.

## 📁 Directory Structure

```
/blog/
├── index.html                      # Blog listing page
├── post.html                       # Individual post template
├── sitemap.xml                     # SEO sitemap
├── robots.txt                      # Search engine rules
├── IMPLEMENTATION_PLAN.md          # Detailed implementation plan
├── README.md                       # This file
├── assets/
│   ├── css/
│   │   └── blog-style.css         # Blog-specific styles
│   ├── js/
│   │   ├── blog.js                # Blog listing logic
│   │   └── post.js                # Post rendering logic
│   └── img/                       # Blog images
└── posts/
    ├── posts.json                 # Blog post metadata
    ├── deploying-flask-app-docker-digitalocean.md
    ├── python-backend-best-practices-2025.md
    └── docker-compose-multi-container-apps.md
```

## 🚀 Features

### ✅ Implemented Features

- **Markdown-based content**: Write posts in Markdown format
- **Search functionality**: Real-time search across titles, content, authors, and tags
- **Category filtering**: Filter posts by category
- **Tag filtering**: Filter posts by tags
- **Responsive design**: Mobile-first, matches parent site theme
- **SEO optimized**: Meta tags, Open Graph, Twitter Cards, structured data
- **Reading time estimation**: Automatic calculation based on word count
- **Syntax highlighting**: Code blocks with highlight.js
- **Comment system**: Giscus integration (requires setup)
- **No build step**: Pure vanilla JavaScript, no npm/webpack needed

### 🎨 Design Features

- Dark theme matching main site (#040404 background, #18d26e accent)
- Bootstrap 5 grid system
- Smooth transitions and animations
- Card-based post layout
- Glassmorphism effects

## 📝 Adding New Blog Posts

### Step 1: Create Markdown File

Create a new `.md` file in `/blog/posts/` directory:

```bash
touch posts/my-new-post.md
```

### Step 2: Write Your Content

Use Markdown syntax for formatting:

```markdown
# My Post Title

Introduction paragraph here...

## Section Heading

Content with **bold** and *italic* text.

### Code Examples

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

### Lists

- Item 1
- Item 2
- Item 3

### Images

![Alt text](../assets/img/image.jpg)

### Links

[Link text](https://example.com)
```

### Step 3: Update posts.json

Add metadata for your post in `/blog/posts/posts.json`:

```json
{
  "posts": [
    {
      "slug": "my-new-post",
      "title": "My New Post Title",
      "excerpt": "A brief 150-200 character summary of your post that will appear in cards and search results.",
      "author": "Vlad Bortnik",
      "date": "2025-01-20",
      "updated": null,
      "category": "Backend Development",
      "tags": ["Python", "Docker", "DevOps"],
      "file": "my-new-post.md",
      "image": null
    },
    // ... other posts
  ]
}
```

#### Metadata Fields:

- **slug**: URL-friendly identifier (no spaces, lowercase, hyphens)
- **title**: Post title (appears in listings and post page)
- **excerpt**: Short summary (150-200 chars, used for SEO and cards)
- **author**: Author name
- **date**: Publication date (YYYY-MM-DD format)
- **updated**: Last update date (YYYY-MM-DD or null)
- **category**: Main category (choose existing or create new)
- **tags**: Array of tags (relevant keywords)
- **file**: Markdown filename
- **image**: Cover image path (optional, uses default if null)

### Step 4: Update Sitemap

Add your new post to `/blog/sitemap.xml`:

```xml
<url>
  <loc>https://vladbortnik.dev/blog/post.html?slug=my-new-post</loc>
  <lastmod>2025-01-20</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### Step 5: Test Locally

Open `index.html` in a browser to verify your post appears correctly.

## 💬 Setting Up Giscus Comments

### Prerequisites

1. Your GitHub repository must be **public**
2. Enable **Discussions** in your repository

### Setup Steps

1. **Install Giscus App**
   - Visit: https://github.com/apps/giscus
   - Click "Install"
   - Select your repository

2. **Configure Giscus**
   - Visit: https://giscus.app/
   - Enter your repo: `username/repo-name`
   - Choose mapping: **"pathname"** (recommended)
   - Choose category: Create "Blog Comments" in your repo's Discussions
   - Choose theme: **"dark"** or **"dark_dimmed"**
   - Enable reactions

3. **Get Your Script**
   
   Giscus will generate a script like this:
   
   ```html
   <script src="https://giscus.app/client.js"
           data-repo="YOUR_USERNAME/YOUR_REPO"
           data-repo-id="YOUR_REPO_ID"
           data-category="Blog Comments"
           data-category-id="YOUR_CATEGORY_ID"
           data-mapping="pathname"
           data-strict="0"
           data-reactions-enabled="1"
           data-emit-metadata="0"
           data-input-position="top"
           data-theme="dark"
           data-lang="en"
           crossorigin="anonymous"
           async>
   </script>
   ```

4. **Update post.html**
   
   Replace the placeholder in `/blog/post.html` (line ~118) with your generated script:
   
   ```html
   <div id="giscusComments">
     <!-- Replace the placeholder div with your Giscus script -->
     <script src="https://giscus.app/client.js"
             data-repo="YOUR_USERNAME/YOUR_REPO"
             data-repo-id="YOUR_REPO_ID"
             data-category="Blog Comments"
             data-category-id="YOUR_CATEGORY_ID"
             data-mapping="pathname"
             data-strict="0"
             data-reactions-enabled="1"
             data-emit-metadata="0"
             data-input-position="top"
             data-theme="dark"
             data-lang="en"
             crossorigin="anonymous"
             async>
     </script>
   </div>
   ```

## 🔍 SEO Best Practices

### On-Page SEO Checklist

- ✅ Unique title for each post (50-60 characters)
- ✅ Meta description (150-160 characters)
- ✅ Relevant keywords in content naturally
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Alt text for all images
- ✅ Internal links to related posts
- ✅ External links to authoritative sources
- ✅ Mobile-responsive design
- ✅ Fast loading times

### Structured Data

Each post automatically generates Schema.org structured data for:
- BlogPosting type
- Author information
- Publication dates
- Article metadata

### Submit to Search Engines

1. **Google Search Console**
   - Add property: `https://vladbortnik.dev`
   - Submit sitemap: `https://vladbortnik.dev/blog/sitemap.xml`

2. **Bing Webmaster Tools**
   - Add site
   - Submit sitemap

## 🎨 Customization

### Changing Colors

Edit `/blog/assets/css/blog-style.css`:

```css
:root {
  --bg-primary: #040404;        /* Main background */
  --accent-primary: #18d26e;    /* Primary accent color */
  --accent-hover: #35e888;      /* Hover state */
  --text-primary: #fff;         /* Primary text */
  --text-secondary: rgba(255, 255, 255, 0.8);  /* Secondary text */
}
```

### Adding Custom Sections

Edit `index.html` or `post.html` to add new sections. The structure follows Bootstrap 5 grid system.

### Modifying Fonts

Update the Google Fonts link in the `<head>` section:

```html
<link href="https://fonts.googleapis.com/css?family=YOUR_FONT" rel="stylesheet">
```

Then update CSS:

```css
body {
  font-family: "Your Font", sans-serif;
}
```

## 🚀 Deployment

### Local Development

Simply open `index.html` in a browser. No server needed (but CORS may require a local server for some browsers).

### Using Python Server

```bash
cd /blog/
python -m http.server 8000
# Visit: http://localhost:8000
```

### Production Deployment

1. **Upload to server**
   ```bash
   scp -r blog/ user@your-server:/var/www/html/
   ```

2. **Nginx Configuration**
   
   Add to your nginx config:
   ```nginx
   location /blog/ {
       alias /var/www/html/blog/;
       index index.html;
       try_files $uri $uri/ =404;
   }
   ```

3. **Set proper permissions**
   ```bash
   chmod -R 755 /var/www/html/blog/
   ```

## 🔧 Troubleshooting

### Posts Not Appearing

1. Check browser console for errors (F12)
2. Verify `posts.json` has valid JSON syntax
3. Ensure markdown files exist in `/posts/` directory
4. Check file paths are correct

### Styling Issues

1. Verify CSS file path is correct
2. Check Bootstrap CSS is loading
3. Clear browser cache
4. Check for CSS conflicts

### Search Not Working

1. Verify JavaScript files are loading
2. Check browser console for errors
3. Ensure `posts.json` is accessible

### Comments Not Showing

1. Verify Giscus script is added to `post.html`
2. Check GitHub Discussions is enabled
3. Verify repo is public
4. Check Giscus app is installed on your repo

## 📊 Analytics

The blog uses Umami Analytics (same as main site). Track:
- Page views
- Popular posts
- User engagement
- Traffic sources

## 🔄 Future Enhancements

Potential features to add:

- [ ] RSS/Atom feed generation
- [ ] Post series/collections
- [ ] Author pages (if multiple authors)
- [ ] Related posts section
- [ ] Newsletter subscription
- [ ] Social share buttons
- [ ] Print-friendly styles
- [ ] Dark/light theme toggle
- [ ] Table of contents for long posts
- [ ] Estimated reading progress bar

## 📚 Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [Marked.js Documentation](https://marked.js.org/)
- [Giscus Documentation](https://giscus.app/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Highlight.js Languages](https://highlightjs.org/static/demo/)

## 🤝 Contributing

To contribute a guest post:
1. Fork the repository
2. Create a new markdown file
3. Add metadata to `posts.json`
4. Submit a pull request

## 📝 License

This blog system is part of the vladbortnik.dev website.

---

**Questions or Issues?**  
Open an issue on GitHub or contact via the main website.
