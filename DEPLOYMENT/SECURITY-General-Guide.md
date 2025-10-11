🔍 Research Findings

Modern Solutions (No Backend/PHP Required)

Option 1: Web3Forms (Recommended)

- Free tier: 250 submissions/month with file upload
  support
- Features:
    - Advanced file uploader for multiple files
    - Webhooks to CRMs (Zapier, Notion, Google Sheets)
    - Custom redirect after submission
    - Built-in spam protection via JavaScript tokens
- Security: Cloudflare Turnstile integration (free
  CAPTCHA alternative)
- File types: Supports all file types (images, docs,
  XML, CSV, HTML)

Option 2: Formspree

- Similar serverless solution but more limited free tier
- Pro plan required for custom redirects

Option 3: Custom Static Form + Third-party Services

- Form validation handled client-side
- VirusTotal API for file scanning (500 free
  requests/day)
- Cloudflare Turnstile for spam prevention

  ---
🔒 Security Stack (Multi-layered Approach)

Layer 1: Bot Prevention

- Cloudflare Turnstile (preferred over reCAPTCHA in
2025)
    - Free, privacy-focused
    - No annoying image puzzles
    - Google reCAPTCHA now limited to 10k free
checks/month (down from 1M)

Layer 2: Honeypot Fields

- Hidden form fields invisible to humans
- Bots auto-fill them and get blocked

Layer 3: Client-side Validation

- File type whitelist (only allowed extensions)
- File size limits (prevent DoS)
- Filename sanitization
- MIME type verification

Layer 4: Rate Limiting

- Time-based submission throttling
- JavaScript cooldown periods

Layer 5: File Security (If using custom solution)

- VirusTotal API integration: Scan uploaded files with
  70+ antivirus engines
- File name randomization
- Store files outside web root
- Content-Type validation

  ---
📋 Implementation Plan

New Files to Create:

1. contact.html - Main contact page (root level)
   - Dual-mode interface:
    - Simple Mode: Quick email contact (name, email,
      message)
    - Project Request Mode: Rich form with file uploads,
      project details, budget, timeline
      - Matches your existing dark theme (#040404 bg,
      #18d26e primary green)
      - Uses existing fonts (Open Sans, Raleway, Poppins)
      - Responsive layout with Bootstrap 5 grid
2. assets/css/contact.css - Contact page styles
   - Consistent with existing _variables.scss colors
   - Dark theme with green accents
   - Form field styling matching portfolio aesthetic
   - File upload drag-drop zone
   - Progress indicators for file uploads
3. assets/js/contact.js - Contact form logic
   - Form mode switcher (Simple ↔ Project Request)
   - Client-side validation (file types, sizes, required
   fields)
   - Cloudflare Turnstile integration
   - Honeypot implementation
   - File upload handling with preview
   - Integration with Web3Forms API or Formspree
   - Optional: VirusTotal API file scanning

  ---
🎨 Form Features

Simple Contact Mode:

- Name
- Email
- Subject
- Message
- Submit button

Project Request Mode:

- Client Info: Name, Company, Email, Phone (optional)
- Project Details:
    - Project type (dropdown: Web Development, Backend
      API, DevOps, Full Stack, Other)
    - Project description (rich textarea)
    - Budget range (optional)
    - Timeline/Deadline
- File Uploads:
    - Multiple file support
    - Drag-drop interface
    - Accepted types: Images (PNG, JPG, WebP), Docs (PDF,
      DOCX, TXT), Data (CSV, XML, JSON), Web (HTML, CSS)
    - Max 10MB per file, 5 files total
    - Visual upload progress
    - Preview thumbnails
- Additional Notes (optional)

  ---
🛡️ Security Implementation Details

// Multi-layer security approach:
1. Cloudflare Turnstile widget (invisible verification)
2. Honeypot field (hidden input)
3. Rate limiting (1 submission per 60 seconds)
4. File validation:
    - Whitelist: .jpg, .png, .webp, .pdf, .docx, .txt,
      .csv, .xml, .json, .html, .css
    - Size limit: 10MB per file
    - MIME type check
    - Filename sanitization (remove special chars)
5. Optional: VirusTotal API scan before submission

  ---
🚀 Recommended Approach

Best Solution: Web3Forms + Cloudflare Turnstile

Why?
- ✅ No backend/PHP code needed
- ✅ Free tier sufficient for portfolio site
- ✅ Built-in file upload with advanced features
- ✅ Modern spam protection (Turnstile beats reCAPTCHA
  in 2025)
- ✅ Email notifications to you
- ✅ Custom success page redirect
- ✅ Webhook integration for future expansion

Setup Steps:
1. Sign up at web3forms.com (free)
2. Get access key
3. Sign up at cloudflare.com for Turnstile (free)
4. Get site key and secret key
5. Integrate into contact.html

  ---
⎿  User rejected Claude's plan:
╭───────────────────────────────────────────────────────╮
│ Contact Page Implementation Plan                      │
│                                                       │
│ New Files to Create:                                  │
│                                                       │
│ 1. contact.html - Standalone contact page at root     │
│ level                                                 │
│   - Dual-mode form: Simple contact OR rich project    │
│ request                                               │
│   - File upload interface (drag-drop, multiple files) │
│   - Matches existing dark theme and Bootstrap layout  │
│ 2. assets/css/contact.css - Custom contact page       │
│ styles                                                │
│   - Consistent with existing color scheme (#18d26e    │
│ green, #040404 dark bg)                               │
│   - Responsive form layout                            │
│   - File upload zone styling                          │
│ 3. assets/js/contact.js - Contact form JavaScript     │
│   - Form mode switching logic                         │
│   - Multi-layer security:                             │
│       - Cloudflare Turnstile (modern CAPTCHA          │
│ replacement)                                          │
│     - Honeypot fields                                 │
│     - Client-side file validation (type, size, MIME)  │
│     - Rate limiting                                   │
│   - Web3Forms API integration for serverless          │
│ submission                                            │
│   - File upload handling with previews                │
│                                                       │
│ Technology Stack:                                     │
│                                                       │
│ - Form Backend: Web3Forms (free, 250                  │
│ submissions/month)                                    │
│ - Spam Protection: Cloudflare Turnstile (free,        │
│ privacy-focused)                                      │
│ - File Upload: Web3Forms Advanced Uploader            │
│ - Security: Multi-layered (Turnstile + honeypot +     │
│ validation + rate limiting)                           │
│                                                       │
│ Features:                                             │
│                                                       │
│ - Simple mode: Quick email contact                    │
│ - Project mode: Rich form with file uploads (images,  │
│ docs, CSV, XML, HTML, etc.)                           │
│ - Max 10MB per file, 5 files total                    │
│ - Supported types: Images, PDFs, Office docs, data    │
│ files, web files                                      │
│ - No modifications to existing files                  │
│ - No PHP or backend code required                     │
╰───────────────────────────────────────────────────────╯

