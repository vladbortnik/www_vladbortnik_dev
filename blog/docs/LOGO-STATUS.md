# 🎨 Brand Logo Status

## Current Implementation

**File:** `/assets/img/brand-logo.png`  
**Source:** `VB.dev-logo-transparent.png` (Hatchful generated)  
**Status:** ⏳ TEMPORARY - To be replaced

---

## What's Using This Logo

### 1. Blog Post Schema (Template)
- **File:** `/blog/templates/_template.html`
- **Lines:** 58, 77
- **Usage:** 
  - Article image (TechArticle schema)
  - Publisher logo (Organization schema)

### 2. Image Properties
- Format: PNG with transparent background
- Size: 1200x1200px (actual logo content is smaller, centered)
- Location: `/assets/img/brand-logo.png`

---

## ⚠️ Current Issue

**Colors don't match your brand:**
- Current: Red/pink (#E74C5E or similar)
- Your brand: Green (#18d26e)

---

## 🔄 How to Replace Logo (When Ready)

### Option 1: Customize in Hatchful
1. Go back to https://hatchful.shopify.com
2. Select your saved logo (if available)
3. Click "Customize"
4. Change color scheme to green (#18d26e)
5. Download as PNG (high resolution)
6. Save as: `brand-logo.png`

### Option 2: Edit in Canva
1. Upload current `brand-logo.png` to Canva
2. Select the red elements
3. Change color to #18d26e (your green)
4. Export as PNG (1200x1200px)
5. Save as: `brand-logo.png`

### Option 3: Create New Logo
1. Follow steps in `LOGO-how-to-DO.md`
2. Use different design with green colors
3. Ensure square format (512x512px minimum)
4. Save as: `brand-logo.png`

---

## ✅ After Replacing Logo

**Just do this:**
```bash
# Overwrite the existing file
cp ~/Downloads/your-new-logo.png /Users/vladbortnik/Development/portfolio-website/www_vladbortnik_dev/assets/img/brand-logo.png
```

**That's it!** The template already points to `brand-logo.png`, so:
- ✅ All future blog posts will use new logo automatically
- ✅ No code changes needed
- ✅ Schema stays valid

---

## 📍 Other Places You Might Want Logo

Consider adding your logo to:
- Favicon: `/assets/img/favicon.ico` (16x16, 32x32)
- Social media meta tags: Open Graph image
- About page header
- Email signature
- GitHub profile

---

**Last Updated:** October 21, 2025  
**Status:** Temporary red logo in use, awaiting green version
