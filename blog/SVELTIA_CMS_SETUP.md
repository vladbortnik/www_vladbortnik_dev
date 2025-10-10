# Sveltia CMS Setup Guide
**Modern Content Management for Your Blog**

## What is Sveltia CMS?

Sveltia CMS is a modern, fast, Git-based headless CMS - the successor to Netlify/Decap CMS. It provides:
- ✅ **Web-based admin interface** at `/blog/admin/`
- ✅ **Rich text editor** with live preview
- ✅ **Image upload** with drag & drop
- ✅ **GitHub integration** - auto-commits when you publish
- ✅ **100% free** and open source
- ✅ **No backend required** - runs in browser
- ✅ **Mobile friendly** - write from anywhere

## Setup Instructions (15 minutes)

### Step 1: Create GitHub OAuth App

Sveltia CMS needs OAuth to authenticate with GitHub.

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/developers
   - Click **"OAuth Apps"** → **"New OAuth App"**

2. **Fill in the form:**
   ```
   Application name: Vlad Bortnik Blog CMS
   Homepage URL: https://vladbortnik.dev/blog/
   Authorization callback URL: https://vladbortnik.dev/blog/admin/
   ```

3. **Register the application**

4. **Note your credentials:**
   - Copy **Client ID** (you'll see it immediately)
   - Click **"Generate a new client secret"**
   - Copy **Client Secret** (save it securely!)

### Step 2: Configure GitHub Backend (If Using GitHub Pages/Direct Hosting)

If you're hosting on GitHub Pages or a static host (not Netlify), you need an OAuth provider.

**Option A: Use Netlify (Easiest)**

Even if not hosting on Netlify, you can use their OAuth:

1. **Create free Netlify account:** https://netlify.com
2. **Import your GitHub repo** (or skip site creation)
3. **Go to Site Settings** → **Access control** → **OAuth**
4. **Install GitHub provider:**
   - Provider: GitHub
   - Client ID: (paste from Step 1)
   - Client Secret: (paste from Step 1)

**Option B: Self-host OAuth Proxy**

If you don't want to use Netlify:
- Use: https://github.com/vencax/netlify-cms-github-oauth-provider
- Deploy on Heroku, Vercel, or your server

### Step 3: Update config.yml (Already Done!)

The config file is already created at `/blog/admin/config.yml`.

**You just need to verify:**
```yaml
backend:
  name: github
  repo: vladbortnik/www_vladbortnik_dev  # ← Verify this matches your repo
  branch: main  # ← or 'master' if that's your default branch
```

### Step 4: Deploy to Your Site

1. **Commit and push the admin folder:**
   ```bash
   cd /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/blog/
   git add admin/
   git commit -m "Add Sveltia CMS admin interface"
   git push
   ```

2. **Wait for deployment** (GitHub Pages, Netlify, etc.)

### Step 5: Access Admin Interface

1. **Visit:** `https://vladbortnik.dev/blog/admin/`
2. **Click "Login with GitHub"**
3. **Authorize the OAuth app**
4. **You're in!** 🎉

## Using Sveltia CMS

### Creating a New Post

1. **Visit:** `https://vladbortnik.dev/blog/admin/`
2. **Click "Blog Posts"** in sidebar
3. **Click "New Blog Posts"** button
4. **Fill in the fields:**
   - **Title:** Your post title
   - **Slug:** URL-friendly version (e.g., `my-first-post`)
   - **Excerpt:** Short description (shows in cards)
   - **Author:** Vlad Bortnik (pre-filled)
   - **Publish Date:** Select date
   - **Category:** Choose from dropdown
   - **Tags:** Add tags (press Enter after each)
   - **Featured Image:** Upload or skip
   - **Body:** Write your content in Markdown

5. **Preview:** Click "Preview" to see live preview
6. **Publish:** Click "Publish" → "Publish now"
7. **Done!** Post auto-commits to GitHub and appears on blog

### Writing Tips

**Markdown Shortcuts:**
- `# Heading 1`, `## Heading 2`, `### Heading 3`
- `**bold**`, `*italic*`
- `` `code` ``
- `[link](https://url.com)`
- `![image](path/to/image.jpg)`

**Code Blocks:**
```
```python
def hello():
    print("Hello World!")
```
```

**Images:**
- Drag & drop images directly into the editor
- Or click "+" → "Image" → Upload
- Images saved to `/blog/assets/img/posts/`

### Updating Posts Metadata

When you publish a post via Sveltia CMS, it saves the markdown file, but you may need to also update `posts.json`:

**Automatic Method (Recommended):**
1. In Sveltia CMS, go to **"Posts Metadata"** collection
2. Click **"Posts Index"**
3. Add entry matching your new post
4. **Save** and **Publish**

**Manual Method:**
1. Edit `/blog/posts/posts.json` directly
2. Add entry:
   ```json
   {
     "slug": "my-post",
     "title": "My Post Title",
     "excerpt": "Description...",
     "author": "Vlad Bortnik",
     "date": "2025-10-10",
     "category": "Backend Development",
     "tags": ["Python", "Flask"],
     "image": "assets/img/posts/my-image.jpg",
     "file": "my-post.md"
   }
   ```

## Workflow

### Regular Writing Workflow

1. **Visit** `/blog/admin/`
2. **Write** new post or edit existing
3. **Preview** to check formatting
4. **Publish** when ready
5. **Post appears** on blog immediately (after site rebuild)

### Batch Writing

- **Save as Draft:** Work on multiple posts
- **Schedule:** Set future publish dates
- **Review:** Preview before publishing

## Troubleshooting

### "Error: Failed to load config.yml"

**Fix:** Verify `/blog/admin/config.yml` exists and has correct syntax

### "Error: Authentication failed"

**Fix:** 
1. Check OAuth app credentials
2. Verify callback URL: `https://yourdomain.com/blog/admin/`
3. Try logging out and back in

### "Error: Cannot access repository"

**Fix:**
1. Verify repo name in `config.yml`: `vladbortnik/www_vladbortnik_dev`
2. Ensure your GitHub account has write access
3. Check OAuth app has repo permissions

### Posts not appearing on blog

**Fix:**
1. Verify you updated `posts.json` (or use Metadata collection)
2. Check markdown filename matches `file` field in `posts.json`
3. Clear browser cache

### Images not uploading

**Fix:**
1. Create folder: `/blog/assets/img/posts/`
2. Verify write permissions
3. Check file size (keep under 5MB)

## Advanced Features

### Local Development

Test CMS locally before deploying:

1. **Install Sveltia CMS CLI:**
   ```bash
   npm install -g @sveltia/cms-cli
   ```

2. **Run local backend:**
   ```bash
   cd /blog/
   sveltia-cms proxy
   ```

3. **Uncomment in config.yml:**
   ```yaml
   local_backend: true
   ```

4. **Access:** `http://localhost:8000/admin/`

### Editorial Workflow

Enable draft/review process:

```yaml
publish_mode: editorial_workflow
```

This adds:
- **Drafts** - Work in progress
- **In Review** - Ready for review  
- **Ready** - Approved for publish

### Custom Preview Template

Add custom preview styling to match your blog design - see Sveltia CMS docs.

## Comparison: Manual vs Sveltia CMS

| Task | Manual Method | With Sveltia CMS |
|------|--------------|------------------|
| **Create post** | 5 mins (code editor) | 3 mins (web UI) |
| **Add images** | SCP/FTP upload | Drag & drop |
| **Preview** | Build locally | Live preview |
| **Edit from phone** | ❌ | ✅ |
| **Update metadata** | Edit JSON | Form fields |
| **Risk of errors** | High (JSON syntax) | Low (validated) |
| **Learning curve** | Need Git/Markdown | Intuitive UI |

## Security Notes

✅ **Safe to use:**
- CMS runs in browser
- Uses OAuth (secure)
- No passwords stored
- Commits signed by GitHub

⚠️ **Best practices:**
- Keep OAuth secret secure
- Don't share admin access
- Review commits before pushing
- Use 2FA on GitHub

## Support

- **Sveltia CMS Docs:** https://github.com/sveltia/sveltia-cms
- **Community:** GitHub Discussions
- **Issues:** https://github.com/sveltia/sveltia-cms/issues

## Next Steps

1. ✅ Complete OAuth setup (Step 1-2)
2. ✅ Deploy admin folder (Step 4)
3. ✅ Test login (Step 5)
4. ✅ Create first post via CMS
5. ✅ Verify it appears on blog

**Happy Writing!** 🎉

---

**Note:** Sveltia CMS is actively maintained and faster than the original Netlify CMS. It's the recommended choice for modern static sites in 2025.
