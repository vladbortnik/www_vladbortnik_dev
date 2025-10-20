# Blog Quick Start Guide

## 🚀 Your Blog is Ready!

Everything is set up and ready to use. Here's what you have:

### ✅ What's Included

1. **Blog Index Page** - `/blog/index.html`
   - Displays all your blog posts in a responsive grid
   - Automatically loads posts from `blog.js`

2. **3 Sample Blog Posts**
   - Docker & Python Best Practices
   - Flask Authentication with JWT
   - Nginx SSL Configuration

3. **CommentBox.io Integration**
   - Project ID: `5698637896089600-proj`
   - Pre-configured with dark theme
   - Ready to use on all posts

4. **Template File** - `/blog/posts/_template.html`
   - Copy this to create new posts quickly

## 📝 Adding a New Blog Post (3 Steps)

### Step 1: Create the HTML File

Copy the template:
```bash
cd blog/posts
cp _template.html my-new-post.html
```

### Step 2: Edit the Post

Open `my-new-post.html` and replace all `[PLACEHOLDERS]`:

- `[POST TITLE]` - Your post title
- `[POST-SLUG]` - URL-friendly version (e.g., "my-new-post")
- `[POST DESCRIPTION]` - Brief summary (150-160 chars)
- `[KEYWORD1, KEYWORD2]` - SEO keywords
- `[YYYY-MM-DD]` - Publication date
- `[Month Day, Year]` - Formatted date (e.g., "January 20, 2024")
- `[X min read]` - Estimated read time
- `[CATEGORY]` - Post category (Python, DevOps, etc.)

Then write your content in the `<article>` section.

### Step 3: Add to Blog Index

Edit `blog/assets/js/blog.js` and add your post to the `blogPosts` array:

```javascript
const blogPosts = [
  {
    id: 4,  // Increment this number
    slug: "my-new-post",
    title: "My New Post Title",
    excerpt: "Brief description that appears on the index page...",
    category: "Python",
    date: "2024-01-20",
    readTime: "7 min read",
    author: "Vlad Bortnik"
  },
  // ... existing posts
];
```

**That's it!** Your new post will appear on the blog index automatically.

## 🎨 Styling Tips

### Code Blocks
```html
<pre><code>Your code here
Multiple lines supported
Automatic scrolling on overflow</code></pre>
```

### Inline Code
```html
Use <code>inline code</code> for commands or variable names
```

### Important Notes
```html
<blockquote>
    <strong>Note:</strong> Important information here
</blockquote>
```

### Lists with Bold Headers
```html
<ul>
    <li><strong>Bold Point:</strong> Description here</li>
    <li><strong>Another Point:</strong> More details</li>
</ul>
```

## 🌐 Accessing Your Blog

- **Blog Index**: `http://localhost/blog/` or `https://yoursite.com/blog/`
- **Individual Posts**: `http://localhost/blog/posts/post-slug.html`

## 🔧 Customization

### Change Colors

Edit `blog/assets/css/blog.css`:

```css
/* Main accent color */
#18d26e → Your color

/* Card background */
rgba(255, 255, 255, 0.05) → Your transparency

/* Text colors */
#fff → Your text color
```

### Change Categories

1. Add category in `blog.js` when creating posts
2. CSS automatically styles all categories the same
3. Optional: Add custom styling per category in `blog.css`

### CommentBox Settings

Edit in each post's `<script>` section:

```javascript
commentBox('5698637896089600-proj', {
    backgroundColor: '#040404',  // Match your site
    textColor: '#fff',           // Text color
    subtextColor: 'rgba(255, 255, 255, 0.6)',  // Muted text
    sortOrder: 'best'            // 'best', 'newest', or 'oldest'
});
```

## 📱 Testing

Before publishing, test:

1. **Desktop browsers**: Chrome, Firefox, Safari
2. **Mobile devices**: Phone and tablet views
3. **Links**: Click all internal and external links
4. **Comments**: Post a test comment
5. **Social sharing**: Check Open Graph preview

## 🚢 Deployment

Your blog is static HTML, so it works anywhere:

1. Upload the entire `/blog` folder to your server
2. Make sure the path structure is preserved
3. Test that assets load correctly (CSS, JS, images)
4. Verify CommentBox works on your live domain

## 💡 Pro Tips

1. **Keep URLs Clean**: Use lowercase and hyphens in slugs (e.g., `flask-best-practices`)
2. **SEO-Friendly**: Write descriptive titles and meta descriptions
3. **Read Time**: ~200 words per minute for estimation
4. **Images**: Store in `/blog/assets/img/` (create folder if needed)
5. **Consistent Publishing**: Pick a schedule (weekly, bi-weekly, monthly)

## 📊 Analytics

Posts are automatically tracked via Umami Analytics with your existing tracking ID.

View stats at: `https://analytics.vladbortnik.dev`

## 🆘 Need Help?

**CommentBox Issues**
- Dashboard: https://dashboard.commentbox.io/
- Docs: https://commentbox.io/docs

**Blog Structure**
- Check `README.md` for detailed documentation
- Use `_template.html` as a starting point

## 📚 Next Steps

1. Write your first original blog post
2. Share posts on social media (Twitter, LinkedIn)
3. Add a blog section link from your main portfolio
4. Consider adding an RSS feed for subscribers
5. Monitor which posts get the most engagement

---

**Ready to start writing?** Just copy `_template.html`, fill in your content, and add it to `blog.js`!

Happy blogging! 🚀
