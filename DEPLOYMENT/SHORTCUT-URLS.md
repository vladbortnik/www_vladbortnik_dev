# Shortcut URLs Setup Guide (w/ Cloudflare)

## ✅ Three Recommended Shortcuts

### 1. `/contact` → Contact Form
```
*vladbortnik.dev/contact  →  https://vladbortnik.dev/contact.html
```

### 2. `/github` → GitHub Profile
```
*vladbortnik.dev/github  →  https://github.com/vladbortnik
```

### 3. `/work` → Portfolio Projects (RECOMMENDED)
```
*vladbortnik.dev/work  →  https://vladbortnik.dev/#portfolio
```

---

## 🔧 Setup in Cloudflare

### Go to: Cloudflare Dashboard → Rules → Page Rules

---

### **Rule 1: Contact Shortcut**

**URL Pattern:**
```
*vladbortnik.dev/contact
```

**Setting:** Forwarding URL
**Status Code:** 301 - Permanent Redirect
**Destination URL:**
```
https://vladbortnik.dev/contact.html
```

**Save and Deploy**

---

### **Rule 2: GitHub Shortcut**

**URL Pattern:**
```
*vladbortnik.dev/github
```

**Setting:** Forwarding URL
**Status Code:** 301 - Permanent Redirect
**Destination URL:**
```
https://github.com/vladbortnik
```

**Save and Deploy**

---

### **Rule 3: Work/Portfolio Shortcut**

**URL Pattern:**
```
*vladbortnik.dev/work
```

**Setting:** Forwarding URL
**Status Code:** 301 - Permanent Redirect
**Destination URL:**
```
https://vladbortnik.dev/#portfolio
```

**Save and Deploy**

---

## 🎨 What's Changed on Contact Page

### ✅ **1. Added Color Accent to Heading**
```html
<h1>Let's <span class="color-accent">Work Together</span></h1>
```

**Colors:**
- Default: `#18d26e` (green - like your portfolio)
- Hover: `#35e888` (light blue/cyan - like your portfolio)

**Effect:** "Work Together" is green, changes to blue/cyan on hover

---

### ✅ **2. Added Social Links**

**New icons added:**
- 💼 **Portfolio** (`/`) - Briefcase icon
- 🐦 **Twitter** (`https://twitter.com/vladbortnik`)
- 💻 **GitHub** (existing)
- 💼 **LinkedIn** (existing)

**Hover effects:**
- Portfolio: Green `#18d26e`
- Twitter: Twitter Blue `#1da1f2`
- GitHub: Dark Gray `#333`
- LinkedIn: LinkedIn Blue `#0077b5`

**Animation:** Icons lift up 3px on hover

---

## 📋 Icons Used

All icons from **Bootstrap Icons** (already included):

| Link | Icon | Bootstrap Icon Code |
|------|------|---------------------|
| Portfolio | 💼 | `bi-briefcase-fill` |
| Twitter | 🐦 | `bi-twitter` |
| GitHub | 💻 | `bi-github` |
| LinkedIn | 💼 | `bi-linkedin` |

---

## 🎯 Alternative Options for Third Shortcut

If you don't like `/work`, here are alternatives:

### **Option A: `/projects`**
```
*vladbortnik.dev/projects  →  https://vladbortnik.dev/#portfolio
```

### **Option B: `/about`**
```
*vladbortnik.dev/about  →  https://vladbortnik.dev/#about
```

### **Option C: `/resume`**
```
*vladbortnik.dev/resume  →  https://vladbortnik.dev/#resume
```

### **Option D: `/linkedin`**
```
*vladbortnik.dev/linkedin  →  https://linkedin.com/in/vladbortnik
```

---

## 🧪 Testing

### After setting up redirects, test these URLs:

1. **Contact:**
   ```
   https://vladbortnik.dev/contact
   ```
   Should redirect to: `https://vladbortnik.dev/contact.html`

2. **GitHub:**
   ```
   https://vladbortnik.dev/github
   ```
   Should redirect to: `https://github.com/vladbortnik`

3. **Work:**
   ```
   https://vladbortnik.dev/work
   ```
   Should redirect to: `https://vladbortnik.dev/#portfolio`

---

## 🎨 Visual Changes Preview

### Before:
```
┌─────────────────────────┐
│ Let's Work Together     │ ← All white
│                         │
│ [GitHub] [LinkedIn]     │ ← 2 icons
└─────────────────────────┘
```

### After:
```
┌──────────────────────────────┐
│ Let's Work Together          │ ← "Work Together" is green
│       ↑ Hover = light blue   │
│                              │
│ [💼] [🐦] [💻] [💼]         │ ← 4 icons with colors
│  ↑    ↑    ↑    ↑           │
│  Green Blue Gray Blue        │
└──────────────────────────────┘
```

---

## 📊 Shortcut Usage Examples

### **On Business Cards:**
```
Contact: vladbortnik.dev/contact
GitHub: vladbortnik.dev/github
Work: vladbortnik.dev/work
```

### **On LinkedIn Bio:**
```
🌐 Portfolio: vladbortnik.dev/work
📧 Contact: vladbortnik.dev/contact
💻 Code: vladbortnik.dev/github
```

### **On Twitter/X Bio:**
```
Software Engineer
📧 vladbortnik.dev/contact
💼 vladbortnik.dev/work
```

---

## ✅ Summary

**Changes Made:**
1. ✅ Added green/blue color to "Work Together" heading
2. ✅ Added Portfolio icon (briefcase)
3. ✅ Added Twitter icon
4. ✅ Enhanced hover effects on all social icons
5. ✅ Documented 3 shortcut URL recommendations

**To Set Up:**
1. Go to Cloudflare → Rules → Page Rules
2. Create 3 redirects (contact, github, work)
3. Test all URLs
4. Use on business cards, social media, etc.

**Your contact form now matches your portfolio's green/blue color scheme!** 🎨
