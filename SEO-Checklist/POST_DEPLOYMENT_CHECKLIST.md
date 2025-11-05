# Post-Deployment Checklist

## 🚀 IMMEDIATELY AFTER DEPLOYMENT (Within 1 hour)

### 1. Verify Site is Live
```bash
# Test main pages load
curl -I https://vladbortnik.dev/
curl -I https://vladbortnik.dev/blog/
curl -I https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html
```

- [ ] Homepage loads (200 status)
- [ ] Blog index loads
- [ ] Blog post loads
- [ ] Contact page loads
- [ ] All pages show correct content (not cached old version)

---

### 2. Submit to Search Engines (CRITICAL - Do First)

#### Google Search Console
1. Go to: https://search.google.com/search-console
2. **Submit Sitemap:** `https://vladbortnik.dev/sitemap.xml`
3. **Request Indexing** for key URLs:
   - `https://vladbortnik.dev/`
   - `https://vladbortnik.dev/blog/`
   - `https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html`
4. Monitor for crawl errors (check next day)

#### Bing Webmaster Tools
1. Go to: https://www.bing.com/webmasters
2. **Submit Sitemap:** `https://vladbortnik.dev/sitemap.xml`
3. **Submit URL** for homepage and blog

---

### 3. Validate SEO (Use Online Tools)

#### Test These URLs:
- https://search.google.com/test/rich-results (Schema.org validation)
- https://cards-dev.twitter.com/validator (Twitter Card preview)
- https://developers.facebook.com/tools/debug/ (Open Graph preview)

**Expected Results:**
- ✅ Rich results valid (no errors)
- ✅ Twitter card displays correctly
- ✅ Facebook preview shows image, title, description

---

### 4. Check Analytics Setup

- [ ] **PostHog** tracking working (visit site, check dashboard)
- [ ] **Umami Analytics** recording visits
- [ ] Test form submission (contact form)
- [ ] Verify tracking on blog post page

---

### 5. Performance Check

Visit: https://pagespeed.web.dev/

Test these URLs:
- `https://vladbortnik.dev/`
- `https://vladbortnik.dev/blog/posts/1-production-grade-multi-app-server-12-dollar-month.html`

**Target Scores:**
- Desktop: 90+ (Performance), 95+ (SEO)
- Mobile: 80+ (Performance), 95+ (SEO)

Fix critical issues if any found.

---

### 6. Mobile Responsive Check

Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

Or use: https://responsivedesignchecker.com/

---

### 7. Browser Compatibility

Quick test on:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

---

## 📅 WITHIN 24 HOURS

### 1. Monitor Initial Metrics

- [ ] Check server logs for errors
- [ ] Review analytics for first visitors
- [ ] Monitor server resource usage
- [ ] Check for broken links (external tools)

---

### 2. SSL Certificate Check

Visit: https://www.ssllabs.com/ssltest/

- [ ] Test `vladbortnik.dev`
- [ ] Target: A+ rating
- [ ] Fix any security warnings

---

### 3. Backup Verification

- [ ] Verify automated backups are running
- [ ] Test restore process (if applicable)

---

## 🗓️ WITHIN 1 WEEK

### 1. Monitor Search Console

- [ ] Check for crawl errors
- [ ] Verify pages are being indexed
- [ ] Review mobile usability issues
- [ ] Check Core Web Vitals

---

### 2. Initial SEO Monitoring

- [ ] Set up position tracking (optional: Ahrefs, SEMrush)
- [ ] Monitor organic traffic in analytics
- [ ] Check referral traffic sources

---

### 3. Social Proof Setup

- [ ] Add blog to dev.to (optional)
- [ ] Submit to Hacker News (optional, wait 7-14 days)
- [ ] Add to relevant Reddit communities (optional, after 14 days)

---

## 📱 SOCIAL MEDIA SHARING TIMELINE

### **WAIT 3-5 DAYS** Before Sharing on LinkedIn/X

**Why wait?**
1. ✅ Google has time to index your pages
2. ✅ You can fix any bugs found by early organic visitors
3. ✅ Analytics baseline established
4. ✅ Rich previews (Open Graph) fully cached by social platforms

---

### **Day 3-5: LinkedIn Post**

**Best practices:**
- Share on **Tuesday, Wednesday, or Thursday**
- Post time: **8-10 AM or 5-6 PM** (your timezone)
- Use native LinkedIn article or link post
- Include 3-5 relevant hashtags: #DevOps #Docker #CloudInfrastructure
- Tag relevant connections (if appropriate)
- Add personal insight: "What I learned while building this"

**Example post structure:**
```
🚀 Just published: [Your Title]

[1-2 sentence hook about the problem you solved]

In this article, I share:
- [Key point 1]
- [Key point 2]
- [Key point 3]

[Call to action: "What's your experience with [topic]?"]

Link: [your URL]

#DevOps #Docker #Nginx #Infrastructure
```

---

### **Day 3-5: X/Twitter Post**

**Best practices:**
- Share on **Monday-Friday**
- Post time: **9-11 AM or 7-9 PM** (your timezone)
- Thread format works well for technical content
- Use 2-3 relevant hashtags

**Example thread:**
```
🧵 Thread: How I built a production-grade multi-app server for $12/month

Hosting 3 production apps on a single VPS saved me $240-480/year.

Here's the architecture and what I learned 👇

1/ [First key insight]
2/ [Second key insight]
...
[Final tweet with link]

Full guide: [your URL]

#DevOps #Docker
```

---

### **Day 7-14: Optional Communities**

**If article gains traction:**
- [ ] Dev.to (cross-post with canonical URL)
- [ ] Hashnode (cross-post with canonical URL)
- [ ] Hacker News (ask for feedback, not promotion)
- [ ] Reddit r/selfhosted, r/devops (check rules first)

**⚠️ IMPORTANT:** Always add canonical URL when cross-posting to avoid SEO penalties.

---

## 📊 ONGOING MONITORING

### Weekly (First Month)
- [ ] Check Google Search Console for errors
- [ ] Review analytics (traffic, bounce rate, time on page)
- [ ] Monitor Core Web Vitals
- [ ] Check for broken external links

### Monthly (Ongoing)
- [ ] Update sitemap if new content added
- [ ] Review SEO performance
- [ ] Check backlinks (Ahrefs, Google Search Console)
- [ ] Update outdated content

---

## 🚨 TROUBLESHOOTING

### If pages not indexing:
1. Verify robots.txt allows crawling
2. Check sitemap is accessible
3. Use "Request Indexing" in Search Console
4. Wait 3-7 days (Google crawls on its schedule)

### If social previews not showing:
1. Clear cache: https://developers.facebook.com/tools/debug/
2. Verify Open Graph tags are correct
3. Image must be publicly accessible
4. Wait 24 hours for cache refresh

### If performance score low:
1. Check image optimization (compress, resize)
2. Enable browser caching
3. Minimize CSS/JS
4. Use CDN for static assets (optional)

---

**Last Updated:** November 4, 2025  
**Status:** Ready for deployment ✅
