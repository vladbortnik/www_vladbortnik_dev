# Giscus Comment System Setup Guide

This guide will walk you through setting up Giscus comments for your blog in 5 minutes.

## What is Giscus?

Giscus is a comment system powered by GitHub Discussions. It's:
- ✅ **Free** and open-source
- ✅ **No ads** or tracking
- ✅ **Easy to install** - just a script tag
- ✅ **Markdown support** - full formatting in comments
- ✅ **Reactions** - thumbs up, heart, etc.
- ✅ **Privacy-friendly** - no third-party tracking
- ✅ **Developer-friendly** - your audience likely has GitHub accounts

## Prerequisites

- [x] A public GitHub repository for your website
- [x] Admin access to the repository

## Step 1: Enable GitHub Discussions

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Features** section
4. Check the box for **Discussions**
5. Click **Set up discussions** if prompted

## Step 2: Install Giscus App

1. Visit: https://github.com/apps/giscus
2. Click **Install**
3. Choose **Only select repositories**
4. Select your website repository (e.g., `vladbortnik/www_vladbortnik_dev`)
5. Click **Install**

## Step 3: Create Discussion Category

1. Go to your repository's **Discussions** tab
2. Click **Categories** (next to "New discussion")
3. Click **New category**
4. Create a category named: **"Blog Comments"**
5. Format: **Announcement** (so only maintainers can create new discussions)
6. Description: "Comments for blog posts"

## Step 4: Configure Giscus

1. Visit: https://giscus.app/

2. **Repository** section:
   - Enter: `YOUR_USERNAME/YOUR_REPO`
   - Example: `vladbortnik/www_vladbortnik_dev`
   - You'll see a green checkmark if it's correctly configured

3. **Page ↔️ Discussions Mapping**:
   - Choose: **`pathname`**
   - This maps each blog post URL to a unique discussion

4. **Discussion Category**:
   - Choose: **Blog Comments** (the category you just created)

5. **Features**:
   - ✅ Enable reactions for the main post
   - ✅ Emit discussion metadata
   - Choose: **Place the comment box above the comments**

6. **Theme**:
   - Choose: **Dark** or **Dark Dimmed**
   - This matches your website's dark theme

## Step 5: Copy Your Configuration

After configuration, Giscus will show a script like this:

```html
<script src="https://giscus.app/client.js"
        data-repo="YOUR_USERNAME/YOUR_REPO"
        data-repo-id="R_kgDOxxxxxxx"
        data-category="Blog Comments"
        data-category-id="DIC_kwDOxxxxxxx"
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

**Copy this entire script!**

## Step 6: Update Your Blog

1. Open `/blog/post.html` in your editor

2. Find the comments section (around line 118):

```html
<div id="giscusComments">
  <!-- PLACEHOLDER CONTENT HERE -->
</div>
```

3. **Replace everything inside** `<div id="giscusComments">...</div>` with your copied Giscus script:

```html
<div id="giscusComments">
  <!-- PASTE YOUR GISCUS SCRIPT HERE -->
  <script src="https://giscus.app/client.js"
          data-repo="YOUR_USERNAME/YOUR_REPO"
          data-repo-id="R_kgDOxxxxxxx"
          data-category="Blog Comments"
          data-category-id="DIC_kwDOxxxxxxx"
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

4. Save the file

5. Commit and push to GitHub

## Step 7: Test Comments

1. Visit any blog post on your website
2. Scroll to the comments section
3. You should see the Giscus comment box
4. Try posting a test comment
5. Check your repository's Discussions tab - you'll see a new discussion created

## Customization Options

### Change Theme Dynamically

If you want to support light/dark mode toggle:

```javascript
// In your JavaScript
function setGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (iframe) {
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    );
  }
}

// Usage
setGiscusTheme('dark'); // or 'light'
```

### Lazy Loading

To improve performance, load comments only when user scrolls near them:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load Giscus script here
      observer.disconnect();
    }
  });
});

observer.observe(document.getElementById('giscusComments'));
```

### Custom Styling

Add custom CSS to match your design:

```css
.giscus, .giscus-frame {
  width: 100%;
}

.giscus-frame {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}
```

## Troubleshooting

### Issue: "Error: Discussions not enabled"

**Solution**: Make sure you enabled Discussions in your repository settings.

### Issue: "Error: Bad credentials"

**Solution**: 
1. Reinstall the Giscus app
2. Make sure your repository is public
3. Check that the Giscus app has access to your repo

### Issue: Comments not appearing

**Solution**:
1. Check browser console for errors (F12)
2. Verify your script's `data-repo` matches exactly: `username/repo-name`
3. Ensure the repository is public
4. Clear browser cache

### Issue: "Discussion category not found"

**Solution**:
1. Go to your Discussions tab
2. Create the "Blog Comments" category if it doesn't exist
3. Make sure it's type "Announcement"
4. Re-run the Giscus configuration at giscus.app

### Issue: Can't post comments

**Solution**:
1. Make sure you're signed in to GitHub
2. Check if your repository allows discussions from non-collaborators
3. Verify the repository is public

## Managing Comments

### Moderate Comments

1. Go to your repository's **Discussions** tab
2. Click on any discussion (blog post)
3. You can:
   - Edit comments
   - Delete spam
   - Lock discussions
   - Pin important comments
   - Convert to Issues

### Get Notifications

1. Go to repository **Settings**
2. Navigate to **Notifications**
3. Enable notifications for new discussions/comments
4. Or watch specific discussions

### Backup Comments

All comments are stored in your GitHub repository's Discussions. To backup:

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Comments are accessible via GitHub API
# You can export them programmatically if needed
```

## Alternative Comment Systems

If Giscus doesn't fit your needs, consider:

| System | Pros | Cons |
|--------|------|------|
| **Utterances** | Simple, GitHub Issues-based | Requires GitHub account |
| **Disqus** | Popular, rich features | Ads, tracking, heavy |
| **Commento** | Privacy-focused | Self-hosted, paid |
| **Isso** | Self-hosted, lightweight | Requires server setup |
| **FastComments** | Fast, modern | Commercial, pricing |

## Privacy & Security

### What data does Giscus collect?

- GitHub username (from authenticated users)
- Comment content
- Reactions

Giscus does **NOT** collect:
- Email addresses (unless public in GitHub profile)
- IP addresses
- Browsing history
- Personal information

### GDPR Compliance

Giscus is GDPR-compliant because:
- Comments stored on GitHub (user's account)
- No third-party tracking
- Users can delete their own comments
- No cookies stored

### Security Best Practices

1. **Moderate regularly** - check for spam
2. **Enable branch protection** - prevent unauthorized changes
3. **Review permissions** - audit who can manage discussions
4. **Monitor notifications** - stay on top of new comments

## FAQ

**Q: Do commenters need a GitHub account?**  
A: Yes. This is actually a benefit - reduces spam and ensures quality discussions.

**Q: Can I migrate from Disqus?**  
A: Yes, but manually. Export Disqus comments and recreate them in Discussions.

**Q: What if I make my repo private?**  
A: Comments will stop working. Keep a public repo or use another solution.

**Q: Can I use Giscus on multiple sites?**  
A: Yes, install the app on multiple repositories.

**Q: How do I style the comment box?**  
A: Use the `data-theme` attribute or inject custom CSS.

**Q: Is there a rate limit?**  
A: GitHub API has rate limits, but unlikely to hit them with normal blog traffic.

---

## Next Steps

After setting up Giscus:

1. ✅ Announce commenting is available
2. ✅ Engage with first commenters
3. ✅ Set up email notifications for new comments
4. ✅ Create moderation guidelines
5. ✅ Encourage discussions at the end of posts

**Need help?** Open an issue in the Giscus repository or check the documentation at https://giscus.app

---

**Last updated**: January 2025  
**Giscus version**: Latest
