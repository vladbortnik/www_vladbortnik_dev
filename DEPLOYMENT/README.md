# Deployment Documentation

## Overview

This portfolio website is a static site deployed with custom infrastructure and integrations.

**Live URL:** https://vladbortnik.dev

## Architecture

### Frontend
- **Type:** Static website (HTML5, CSS3/SCSS, Vanilla JavaScript)
- **No Build Process:** All dependencies vendored locally in `assets/vendor/`
- **Hosting:** Static file hosting (likely Cloudflare Pages, GitHub Pages, or custom server)

### Backend Services
- **Contact Form:** Cloudflare Worker (`contact-worker/`)
  - Handles form submissions from `/contact.html`
  - Integrates with Cloudflare Turnstile for bot protection
  - Likely sends emails via Resend API or similar service

- **Analytics:** Self-hosted Umami Analytics
  - Endpoint: `https://analytics.vladbortnik.dev`
  - Privacy-friendly, GDPR-compliant analytics solution
  - Tracks pageviews across main site and blog

### Blog Integration
- **Location:** `/blog/` directory (separate repository)
- **Integration:** Served at `https://vladbortnik.dev/blog/`
- **Deployment:** Blog content deployed separately but served from same domain
- **Sitemap:** Both main site and blog have separate sitemaps referenced in `robots.txt`

## Deployment Steps

### 1. Static Files Deployment

```bash
# Clone the repository
git clone https://github.com/vladbortnik/www_vladbortnik_dev.git
cd www_vladbortnik_dev

# Deploy static files to hosting provider
# Method depends on hosting solution:
# - Cloudflare Pages: Connect GitHub repo
# - GitHub Pages: Enable in repo settings
# - Custom Server: rsync or FTP to web root
```

### 2. Cloudflare Worker Deployment

```bash
# Navigate to worker directory
cd contact-worker/

# Install dependencies
npm install

# Deploy to Cloudflare
wrangler deploy
```

### 3. DNS Configuration

Configure DNS records at domain registrar:

```
Type    Name    Content                 TTL
A       @       <hosting-ip>            Auto
CNAME   www     vladbortnik.dev         Auto
CNAME   blog    vladbortnik.dev         Auto
CNAME   analytics   <analytics-server>  Auto
```

### 4. SSL/TLS Setup

- SSL certificates managed by hosting provider (Cloudflare, Let's Encrypt, etc.)
- All traffic forced to HTTPS
- HSTS headers enabled for security

## Environment Variables

### Contact Worker
Required environment variables for the Cloudflare Worker:

```bash
RESEND_API_KEY=<your-resend-api-key>
TURNSTILE_SECRET_KEY=<your-turnstile-secret>
```

Set via Cloudflare dashboard or `wrangler secret put`

## SEO Configuration

### Files Maintained
- `robots.txt` - Search engine crawling rules
- `sitemap.xml` - Main site URL structure
- `blog/sitemap.xml` - Blog posts URL structure (in separate repo)

### Meta Tags
All pages include:
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (Schema.org JSON-LD)
- Canonical URLs
- Performance optimizations (preconnect, dns-prefetch)

## Performance Optimizations

1. **Vendor Dependencies:** All third-party libraries bundled locally
2. **DNS Prefetch:** Analytics domain prefetched
3. **Lazy Loading:** Images and heavy resources loaded on demand
4. **Font Loading:** Google Fonts with preconnect
5. **Analytics:** Lightweight, privacy-focused Umami instead of Google Analytics

## Monitoring

- **Analytics:** https://analytics.vladbortnik.dev
- **Uptime Monitoring:** (Configure external service like UptimeRobot)
- **Error Tracking:** (Optional: Sentry, LogRocket)

## Future Deployment Considerations

1. Consider GitHub Actions for automated deployments
2. Add CI/CD pipeline for SCSS compilation if needed
3. Implement automated testing before deployment
4. Set up staging environment for testing changes
5. Consider CDN for global performance improvement

## Rollback Procedure

If deployment issues occur:

```bash
# For static hosting (example with Git-based deployment)
git revert <commit-hash>
git push origin main

# For Cloudflare Worker
wrangler rollback
```

## Notes

- Blog moved to separate repository but still served at `/blog/` URL
- `blog/` directory in this repo is gitignored (empty placeholder)
- SCSS compilation can be done with: `sass --watch assets/scss/style.scss:assets/css/style.css`
- No build step required for deployment - pure static files

## Support & Troubleshooting

### Common Issues

**Issue:** Contact form not submitting
- Check Cloudflare Worker logs
- Verify Turnstile keys are correct
- Ensure CORS settings allow vladbortnik.dev

**Issue:** Analytics not tracking
- Verify Umami instance is running
- Check data-website-id matches Umami configuration
- Ensure analytics.vladbortnik.dev resolves correctly

**Issue:** Blog not accessible
- Verify blog deployment in separate repository
- Check DNS/routing for /blog/ path
- Ensure blog sitemap is accessible

---

**Last Updated:** 2025-10-17
**Maintainer:** Vlad Bortnik
