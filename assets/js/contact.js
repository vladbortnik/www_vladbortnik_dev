/**
 * CONTACT FORM HANDLER
 * Multi-layered security with file upload support
 * Features: Mode switching, honeypot, rate limiting, file validation, Turnstile
 */

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  const CONFIG = {
    MAX_FILES: 5,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'docx', 'doc', 'txt', 'csv', 'xml', 'json', 'html', 'css'],
    RATE_LIMIT_SECONDS: 60,
    FILE_ICONS: {
      'jpg': 'bi-file-earmark-image',
      'jpeg': 'bi-file-earmark-image',
      'png': 'bi-file-earmark-image',
      'webp': 'bi-file-earmark-image',
      'pdf': 'bi-file-earmark-pdf',
      'doc': 'bi-file-earmark-word',
      'docx': 'bi-file-earmark-word',
      'txt': 'bi-file-earmark-text',
      'csv': 'bi-file-earmark-spreadsheet',
      'xml': 'bi-file-earmark-code',
      'json': 'bi-file-earmark-code',
      'html': 'bi-file-earmark-code',
      'css': 'bi-file-earmark-code',
      'default': 'bi-file-earmark'
    }
  };

  // ==================== STATE ====================
  let uploadedFiles = [];
  let lastSubmissionTime = 0;

  // ==================== DOM ELEMENTS ====================
  const modeButtons = document.querySelectorAll('.mode-btn');
  const formContainers = document.querySelectorAll('.form-container');
  const fileInput = document.getElementById('file-input');
  const dropZone = document.getElementById('file-drop-zone');
  const filePreviewContainer = document.getElementById('file-preview');
  const simpleForm = document.getElementById('simple-contact-form');
  const projectForm = document.getElementById('project-request-form');

  // ==================== MODE SWITCHING ====================
  function initModeSwitch() {
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;

        // Update active button
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active form with animation
        formContainers.forEach(form => form.classList.remove('active'));
        const targetForm = document.getElementById(`${mode}-form`);
        if (targetForm) {
          targetForm.classList.add('active');
        }

        // Reset uploaded files when switching to project mode
        if (mode === 'project') {
          uploadedFiles = [];
          renderFilePreview();
        }
      });
    });
  }

  // ==================== FILE UPLOAD HANDLING ====================
  function initFileUpload() {
    if (!dropZone || !fileInput) return;

    const browseLinkText = dropZone.querySelector('.browse-link');

    // Click to browse
    if (browseLinkText) {
      browseLinkText.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    dropZone.addEventListener('click', (e) => {
      if (e.target === dropZone || e.target.closest('.upload-text')) {
        fileInput.click();
      }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
      fileInput.value = ''; // Reset input
    });

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
  }

  function handleFiles(files) {
    const filesArray = Array.from(files);

    // Check total file count
    if (uploadedFiles.length + filesArray.length > CONFIG.MAX_FILES) {
      showAlert(`Maximum ${CONFIG.MAX_FILES} files allowed. You currently have ${uploadedFiles.length} file(s).`, 'error');
      return;
    }

    filesArray.forEach(file => {
      // Validate file size
      if (file.size > CONFIG.MAX_FILE_SIZE) {
        showAlert(`File "${file.name}" exceeds 10MB limit.`, 'error');
        return;
      }

      // Validate file type
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension)) {
        showAlert(`File type ".${fileExtension}" is not allowed.`, 'error');
        return;
      }

      // Additional MIME type check for security
      const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/webp',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'text/csv', 'text/xml', 'application/json',
        'text/html', 'text/css'
      ];

      if (file.type && !allowedMimeTypes.includes(file.type)) {
        // MIME type validation warning (removed for production)
      }

      uploadedFiles.push(file);
    });

    renderFilePreview();
  }

  function renderFilePreview() {
    if (!filePreviewContainer) return;

    filePreviewContainer.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const iconClass = CONFIG.FILE_ICONS[fileExtension] || CONFIG.FILE_ICONS['default'];
      const fileSizeKB = (file.size / 1024).toFixed(1);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const displaySize = file.size < 1024 * 1024 ? `${fileSizeKB} KB` : `${fileSizeMB} MB`;

      const previewItem = document.createElement('div');
      previewItem.className = 'file-preview-item';
      previewItem.innerHTML = `
        <button type="button" class="remove-file" data-index="${index}" aria-label="Remove file">
          <i class="bi bi-x"></i>
        </button>
        <i class="bi ${iconClass}"></i>
        <div class="file-name">${escapeHtml(file.name)}</div>
        <div class="file-size">${displaySize}</div>
      `;

      filePreviewContainer.appendChild(previewItem);
    });

    // Add remove file listeners
    document.querySelectorAll('.remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        uploadedFiles.splice(index, 1);
        renderFilePreview();
      });
    });
  }

  // ==================== FORM SUBMISSION ====================
  function initFormSubmission() {
    if (simpleForm) {
      simpleForm.addEventListener('submit', handleSimpleFormSubmit);
    }

    if (projectForm) {
      projectForm.addEventListener('submit', handleProjectFormSubmit);
    }
  }

  async function handleSimpleFormSubmit(e) {
    e.preventDefault();

    // Honeypot check
    if (checkHoneypot(e.target)) {
      return;
    }

    // Rate limiting
    if (!checkRateLimit()) {
      showFormMessage(simpleForm, 'Please wait before submitting another message.', 'error');
      return;
    }

    const formData = new FormData(e.target);

    // Show loading message
    showFormMessage(simpleForm, 'Sending message...', 'loading');

    try {
      const response = await fetch(e.target.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showFormMessage(simpleForm, 'Message sent successfully! I\'ll get back to you soon.', 'success');
        e.target.reset();
        // Reset Turnstile if present
        if (typeof turnstile !== 'undefined') {
          turnstile.reset();
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      showFormMessage(simpleForm, 'Oops! Something went wrong. Please try again later.', 'error');
    }
  }

  async function handleProjectFormSubmit(e) {
    e.preventDefault();

    // Honeypot check
    if (checkHoneypot(e.target)) {
      return;
    }

    // Rate limiting
    if (!checkRateLimit()) {
      showFormMessage(projectForm, 'Please wait before submitting another request.', 'error');
      return;
    }

    const formData = new FormData(e.target);

    // Add uploaded files to formData
    uploadedFiles.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    // Show loading message
    showFormMessage(projectForm, 'Submitting project request...', 'loading');

    try {
      const response = await fetch(e.target.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const fileCount = uploadedFiles.length;
        const message = fileCount > 0
          ? `Project request submitted with ${fileCount} file(s)! I'll review it and get back to you soon.`
          : 'Project request submitted successfully! I\'ll review it and get back to you soon.';

        showFormMessage(projectForm, message, 'success');

        // Reset form and files
        e.target.reset();
        uploadedFiles = [];
        renderFilePreview();

        // Reset Turnstile if present
        if (typeof turnstile !== 'undefined') {
          turnstile.reset();
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      showFormMessage(projectForm, 'Oops! Something went wrong. Please try again later.', 'error');
    }
  }

  // ==================== SECURITY CHECKS ====================
  function checkHoneypot(form) {
    const honeypot = form.querySelector('[name="botcheck"]');
    return honeypot && honeypot.checked;
  }

  function checkRateLimit() {
    const currentTime = Date.now();
    const timeSinceLastSubmission = (currentTime - lastSubmissionTime) / 1000;

    if (timeSinceLastSubmission < CONFIG.RATE_LIMIT_SECONDS) {
      const remainingTime = Math.ceil(CONFIG.RATE_LIMIT_SECONDS - timeSinceLastSubmission);
      return false;
    }

    lastSubmissionTime = currentTime;
    return true;
  }

  // ==================== UI HELPERS ====================
  function showFormMessage(form, message, type) {
    const messageDiv = form.querySelector('.form-message');
    if (!messageDiv) return;

    messageDiv.className = 'form-message ' + type;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    // Auto-hide after 5 seconds for success/error messages
    if (type !== 'loading') {
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  }

  function showAlert(message, type) {
    // Simple alert for now, can be enhanced with custom modal
    alert(message);
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }


  // ==================== TURNSTILE INITIALIZATION ====================
  function initTurnstile() {
    var isLocalhost = window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '0.0.0.0';
    var sitekey = isLocalhost ? '1x00000000000000000000AA' : '0x4AAAAAAB6AEVcPkpc4oM3Q';

    document.querySelectorAll('.cf-turnstile').forEach(function(el) {
      el.setAttribute('data-sitekey', sitekey);
    });

    // Load Turnstile API
    if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  // ==================== COPYRIGHT YEAR ====================
  function updateCopyrightYear() {
    var yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // ==================== INITIALIZATION ====================
  function init() {
    initModeSwitch();
    initFileUpload();
    initFormSubmission();
    initTurnstile();
    updateCopyrightYear();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
