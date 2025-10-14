/**
 * CLOUDFLARE WORKER - Contact Form Handler (Resend API)
 * Handles form submissions with file uploads and email delivery
 * Uses Resend API (free tier: 3,000 emails/month, 100/day)
 */

// Configuration
const CONFIG = {
  // Your email address where form submissions will be sent
  TO_EMAIL: 'contact@vladbortnik.dev',
  FROM_EMAIL: 'portfolio-contact-form@vladbortnik.dev', // Must be your verified domain
  FROM_NAME: 'Portfolio Contact Form',

  // API keys loaded from environment variables (set via wrangler secret)
  RESEND_API_KEY: null, // Set via: wrangler secret put RESEND_API_KEY
  TURNSTILE_SECRET_KEY: null, // Set via: wrangler secret put TURNSTILE_SECRET_KEY

  // Allowed origins (CORS)
  ALLOWED_ORIGINS: [
    'https://vladbortnik.dev',
    'http://localhost:8000',
    'http://localhost:3000'
  ],

  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB per file
  MAX_FILES: 5,
  MAX_TOTAL_SIZE: 40 * 1024 * 1024, // 40MB total (Resend limit)
  ALLOWED_FILE_TYPES: [
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv', 'text/xml', 'application/json',
    'text/html', 'text/css'
  ]
};

// Main handler
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      // Parse form data
      const formData = await request.formData();

      // Extract fields
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject_line') || formData.get('subject') || 'Contact Form Submission',
        message: formData.get('message'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        projectType: formData.get('project_type'),
        projectDescription: formData.get('project_description'),
        budget: formData.get('budget'),
        timeline: formData.get('timeline'),
        additionalNotes: formData.get('additional_notes'),
        botcheck: formData.get('botcheck'),
        turnstileToken: formData.get('cf-turnstile-response')
      };

      // Security checks
      const securityCheck = await validateSecurity(data, request, env);
      if (!securityCheck.valid) {
        return jsonResponse({ error: securityCheck.error }, 400);
      }

      // Validate required fields
      if (!data.name || !data.email) {
        return jsonResponse({ error: 'Name and email are required' }, 400);
      }

      // Validate email format
      if (!isValidEmail(data.email)) {
        return jsonResponse({ error: 'Invalid email address' }, 400);
      }

      // Handle file attachments
      const attachments = [];
      let totalSize = 0;

      for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          // Validate file
          const fileValidation = validateFile(value);
          if (!fileValidation.valid) {
            return jsonResponse({ error: fileValidation.error }, 400);
          }

          totalSize += value.size;

          // Convert file to base64 for Resend attachment
          const arrayBuffer = await value.arrayBuffer();
          const base64 = arrayBufferToBase64(arrayBuffer);

          attachments.push({
            filename: value.name,
            content: base64
          });
        }
      }

      // Check attachment limits
      if (attachments.length > CONFIG.MAX_FILES) {
        return jsonResponse({
          error: `Maximum ${CONFIG.MAX_FILES} files allowed`
        }, 400);
      }

      if (totalSize > CONFIG.MAX_TOTAL_SIZE) {
        return jsonResponse({
          error: 'Total attachment size exceeds 40MB limit'
        }, 400);
      }

      // Send email via Resend
      await sendEmail(data, attachments, env);

      // Success response
      return jsonResponse({
        success: true,
        message: 'Form submitted successfully! I\'ll get back to you soon.'
      }, 200);

    } catch (error) {
      console.error('Form submission error:', error);
      return jsonResponse({
        error: 'Something went wrong. Please try again later.',
        details: error.message
      }, 500);
    }
  }
};

// Security validation
async function validateSecurity(data, request, env) {
  // Honeypot check
  if (data.botcheck === 'on' || data.botcheck === true) {
    return { valid: false, error: 'Bot detected' };
  }

  // Verify Turnstile token (if configured)
  if (env.TURNSTILE_SECRET_KEY) {
    const turnstileValid = await verifyTurnstile(
      data.turnstileToken,
      request.headers.get('CF-Connecting-IP'),
      env.TURNSTILE_SECRET_KEY
    );

    if (!turnstileValid) {
      return { valid: false, error: 'Security verification failed' };
    }
  }

  return { valid: true };
}

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token, ip, secret) {
  if (!token) return false;

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: secret,
      response: token,
      remoteip: ip
    })
  });

  const data = await response.json();
  return data.success;
}

// File validation
function validateFile(file) {
  // Check file size
  if (file.size > CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds 10MB limit`
    };
  }

  // Check file type
  if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed`
    };
  }

  return { valid: true };
}

// Send email via Resend API
async function sendEmail(data, attachments, env) {
  // Build email body
  const emailBody = buildEmailBody(data);

  // Prepare Resend payload
  const payload = {
    from: `${CONFIG.FROM_NAME} <${CONFIG.FROM_EMAIL}>`,
    to: [CONFIG.TO_EMAIL],
    reply_to: data.email,
    subject: data.subject,
    html: emailBody
  };

  // Add attachments if present
  if (attachments.length > 0) {
    payload.attachments = attachments;
  }

  // Get API key from environment
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  // Send via Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} ${error}`);
  }

  const result = await response.json();
  console.log('Email sent successfully:', result.id);
  return result;
}

// Build HTML email body
function buildEmailBody(data) {
  let html = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #18d26e;">New Contact Form Submission</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${escapeHtml(data.email)}</a></td>
          </tr>
  `;

  // Add optional fields if present
  if (data.company) {
    html += `
      <tr>
        <td style="padding: 10px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Company:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.company)}</td>
      </tr>
    `;
  }

  if (data.phone) {
    html += `
      <tr>
        <td style="padding: 10px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Phone:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.phone)}</td>
      </tr>
    `;
  }

  if (data.projectType) {
    html += `
      <tr>
        <td style="padding: 10px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Project Type:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.projectType)}</td>
      </tr>
    `;
  }

  if (data.budget) {
    html += `
      <tr>
        <td style="padding: 10px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Budget:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.budget)}</td>
      </tr>
    `;
  }

  if (data.timeline) {
    html += `
      <tr>
        <td style="padding: 10px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Timeline:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.timeline)}</td>
      </tr>
    `;
  }

  html += `</table>`;

  // Add message
  if (data.message || data.projectDescription) {
    html += `
      <h3 style="color: #18d26e; margin-top: 20px;">Message:</h3>
      <div style="padding: 15px; background: #f9f9f9; border-left: 4px solid #18d26e;">
        ${escapeHtml(data.message || data.projectDescription).replace(/\n/g, '<br>')}
      </div>
    `;
  }

  // Add additional notes if present
  if (data.additionalNotes) {
    html += `
      <h3 style="color: #18d26e; margin-top: 20px;">Additional Notes:</h3>
      <div style="padding: 15px; background: #f9f9f9; border-left: 4px solid #18d26e;">
        ${escapeHtml(data.additionalNotes).replace(/\n/g, '<br>')}
      </div>
    `;
  }

  html += `
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #777; font-size: 12px;">
          Sent from <a href="https://vladbortnik.dev">vladbortnik.dev</a> contact form
        </p>
      </body>
    </html>
  `;

  return html;
}

// Utility functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function handleCORS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigin = CONFIG.ALLOWED_ORIGINS.includes(origin)
    ? origin
    : CONFIG.ALLOWED_ORIGINS[0];

  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    }
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
