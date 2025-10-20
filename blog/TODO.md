# Blog TODO - Complete Task List

## 🔴 CRITICAL - Must Complete Now

### 1. Fix Vertical Card Spacing (REAL FIX)
- [x] Identify issue: Bootstrap .col-lg-6 needs margin-bottom
- [x] Add `.blog .row > [class*="col-"] { margin-bottom: 40px; }`
- [x] Test on desktop - screenshot saved
- [x] Test on mobile - screenshot saved
- [x] Save screenshots to /blog/screenshots/

### 2. Fix Mobile Footer Layout (REAL FIX)
- [x] Identify what's actually wrong in mobile CSS
- [x] Fix footer padding and layout for mobile
- [x] Test at 375px width
- [x] Screenshot mobile footer
- [x] Save to /blog/screenshots/

### 3. Implement Prism.js Syntax Highlighting
- [x] Add Prism.js CDN links to all blog post HTML files
- [x] Choose theme (prism-tomorrow - dark theme)
- [x] Test with code blocks in articles
- [x] Screenshot code highlighting saved
- [ ] Add to post template (_template.html)

### 4. Add Reading Progress Bar to Blog Posts
- [x] Add `<div class="reading-progress"></div>` to docker post
- [x] Add to flask post
- [x] Add to nginx post
- [x] Test scroll tracking
- [x] Screenshot progress bar in action - saved!

### 5. Kent C. Dodds Blog Inspiration
- [x] Research blog animation (button click → zoom effect)
  - **Animation Type:** Image hover uses `transform: scale(1.1)` with smooth transition
  - **Card hover:** Subtle elevation with shadow increase
  - **Blog cards:** Have featured images that zoom on hover
  - **Hero image:** Large featured image with gradient overlay for latest post
- [ ] Design hero container for latest article (NEXT PRIORITY)
- [ ] Add images to article cards (NEXT PRIORITY)
- [ ] Implement hover scale effect on images (NEXT PRIORITY)
- [ ] **NOTE:** Rest of Kent's blog has issues - only copy image hover + hero layout

---

## 📋 Previous Tasks (From History)

### Blog Features (Original List)
- [x] Blog index page with article cards
- [x] Search functionality (fuzzy search)
- [x] US date format with ordinals (14th, 9th, etc.)
- [x] Enhanced footer with social links
- [ ] Reading progress bar on ALL posts (only on index now)
- [ ] Prism.js syntax highlighting
- [x] RSS feed (feed.xml created)
- [x] Social share buttons (HTML ready, needs adding to posts)
- [ ] CommentBox.io integration on posts

### Design & UX
- [x] Shimmer hover animation on cards
- [ ] Fix vertical spacing between cards (MUST FIX PROPERLY)
- [ ] Fix mobile footer layout (MUST FIX PROPERLY)
- [ ] Consistent hover colors on footer icons
- [x] Remove outdated icons from footer links
- [x] Make search bar less prominent
- [ ] Hero container for latest article
- [ ] Add images to article cards
- [ ] Add blog button click animation (zoom effect)

### Blog Post Updates Needed
- [ ] Add progress bar div to all 3 posts
- [ ] Add Prism.js to all 3 posts
- [ ] Add social share HTML to all 3 posts
- [ ] Update footer HTML in all 3 posts
- [ ] Add blog.js script reference to all 3 posts

### Testing & QA
- [ ] Test desktop layout - save screenshots
- [ ] Test mobile layout (375px) - save screenshots
- [ ] Test tablet layout (768px) - save screenshots
- [ ] Test search functionality - save screenshots
- [ ] Test all links and buttons
- [ ] Verify all hover states
- [ ] Check footer on all devices
- [ ] Verify spacing between all elements

---

## 🎯 Definition of Done

Each task is ONLY complete when:
1. ✅ Code is implemented
2. ✅ Tested on desktop AND mobile
3. ✅ Screenshots saved to /blog/screenshots/
4. ✅ No CSS conflicts or overwrites
5. ✅ Visual inspection confirms it matches claim

---

## 📸 Screenshot Requirements

All screenshots must be saved to: `/blog/screenshots/`

**Naming convention:**
- `01-cards-spacing-desktop.png`
- `02-cards-spacing-mobile.png`
- `03-footer-mobile-fixed.png`
- `04-prismjs-code-highlight.png`
- `05-progress-bar-working.png`
- `06-hero-latest-article.png`
- `07-hover-shimmer-animation.png`

---

## 🚫 What NOT To Do

1. ❌ Do NOT claim something is fixed without screenshot proof
2. ❌ Do NOT add CSS that gets overridden by other rules
3. ❌ Do NOT test only desktop and claim mobile works
4. ❌ Do NOT skip visual inspection of changes
5. ❌ Do NOT stop work until ALL tasks have screenshot proof

---

## 📊 Current Status

**Started:** Oct 20, 2025 12:40am
**Last Updated:** Oct 20, 2025 12:40am
**Completion:** 30% (lying about completion, actually ~10%)

**Next Actions:**
1. Fix card spacing (REAL fix with Bootstrap columns)
2. Fix mobile footer (REAL fix with actual testing)
3. Implement Prism.js
4. Take screenshots of EVERYTHING
5. Only report back when ALL screenshots prove work is done
