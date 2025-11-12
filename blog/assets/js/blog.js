/**
 * Blog Posts Data and Management
 * ALL features integrated in ONE file
 */

// Blog posts data (can be moved to a separate JSON file or API in the future)
const blogPosts = [
  {
    id: 1,
    slug: "1-production-grade-multi-app-server-12-dollar-month",
    title: "Deploy Like a Pro: Production-Grade Multi-Application Server for $12/Month",
    excerpt: "Learn how to host multiple production apps on a $12/month VPS with Docker, Nginx, and enterprise-level security. Save $240-480/year on hosting costs.",
    category: "DevOps",
    date: "2025-11-10",
    readTime: "19 min read",
    author: "Vlad Bortnik"
  }
];

/**
 * Load and display blog posts on the index page
 */
function loadBlogPosts() {
  const container = document.getElementById('blog-posts-container');
  
  if (!container) return;

  // Clear loading message
  container.innerHTML = '';

  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate HTML for each post
  sortedPosts.forEach(post => {
    const postCard = createPostCard(post);
    container.innerHTML += postCard;
  });
}

/**
 * Create HTML for a blog post card
 */
function createPostCard(post) {
  const formattedDate = formatDate(post.date);
  
  return `
    <div class="col-lg-6 col-md-12">
      <div class="blog-post-card">
        <div class="post-meta">
          <span class="post-date">
            <i class="bi bi-calendar3"></i>
            ${formattedDate}
          </span>
          <span class="post-category">${post.category}</span>
        </div>
        <h3>
          <a href="posts/${post.slug}.html">${post.title}</a>
        </h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="d-flex justify-content-between align-items-center">
          <a href="posts/${post.slug}.html" class="read-more">
            Read More <i class="bi bi-arrow-right"></i>
          </a>
          <span class="text-muted" style="font-size: 14px;">
            <i class="bi bi-clock"></i> ${post.readTime}
          </span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Format date to US format with ordinal suffixes (October 19th, 2025)
 */
function formatDate(dateString) {
  // Parse date manually to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const monthName = months[month - 1];
  
  // Add ordinal suffix
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';
  
  return `${monthName} ${day}${suffix}, ${year}`;
}

/**
 * Get blog post data by slug
 */
function getBlogPost(slug) {
  return blogPosts.find(post => post.slug === slug);
}

/**
 * Fuzzy search functionality
 */
function fuzzyMatch(text, query) {
  text = text.toLowerCase();
  query = query.toLowerCase();
  
  // Exact match
  if (text.includes(query)) return true;
  
  // Month name matching
  const months = {
    'january': '01', 'jan': '01', 'february': '02', 'feb': '02',
    'march': '03', 'mar': '03', 'april': '04', 'apr': '04', 'may': '05',
    'june': '06', 'jun': '06', 'july': '07', 'jul': '07',
    'august': '08', 'aug': '08', 'september': '09', 'sep': '09', 'sept': '09',
    'october': '10', 'oct': '10', 'november': '11', 'nov': '11',
    'december': '12', 'dec': '12'
  };
  
  if (months[query]) {
    return text.includes(months[query]) || text.includes(query);
  }
  
  // Fuzzy character matching
  let queryIndex = 0;
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === query.length;
}

/**
 * Initialize search functionality
 * NOTE: Disabled until blog has 10+ articles
 * To re-enable: uncomment this function and add search HTML back to index.html
 */
/*
function initSearch() {
  const searchInput = document.getElementById('blog-search-input');
  const postsContainer = document.getElementById('blog-posts-container');

  if (!searchInput || !postsContainer) return;

  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim();

    if (!searchTerm) {
      loadBlogPosts();
      return;
    }

    const filtered = blogPosts.filter(post => {
      const searchableText = `${post.title} ${post.excerpt} ${post.category} ${post.date}`.toLowerCase();
      return fuzzyMatch(searchableText, searchTerm);
    });

    if (filtered.length === 0) {
      postsContainer.innerHTML = '<div class="col-12 text-center"><p style="color: rgba(255, 255, 255, 0.5);">No posts found matching your search.</p></div>';
    } else {
      postsContainer.innerHTML = '';
      filtered.forEach(post => {
        const postCard = createPostCard(post);
        postsContainer.innerHTML += postCard;
      });
    }
  });
}
*/

/**
 * Initialize reading progress bar
 */
function initProgressBar() {
  const progressBar = document.querySelector('.reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', function() {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNav() {
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('#navbar');

  if (!mobileNavToggle || !navbar) return;

  // Toggle mobile navigation on click
  mobileNavToggle.addEventListener('click', function(e) {
    e.preventDefault();
    navbar.classList.toggle('navbar-mobile');
    mobileNavToggle.classList.toggle('bi-list');
    mobileNavToggle.classList.toggle('bi-x');
  });

  // Close mobile nav when clicking a link
  const navLinks = document.querySelectorAll('#navbar .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        mobileNavToggle.classList.add('bi-list');
        mobileNavToggle.classList.remove('bi-x');
      }
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (navbar.classList.contains('navbar-mobile')) {
      if (!navbar.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        navbar.classList.remove('navbar-mobile');
        mobileNavToggle.classList.add('bi-list');
        mobileNavToggle.classList.remove('bi-x');
      }
    }
  });
}

/**
 * Initialize social share buttons
 */
function initSocialShare() {
  // Twitter share
  const twitterBtn = document.querySelector('.share-btn.twitter');
  if (twitterBtn) {
    twitterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(document.title);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=550,height=420');
    });
  }

  // LinkedIn share
  const linkedinBtn = document.querySelector('.share-btn.linkedin');
  if (linkedinBtn) {
    linkedinBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=420');
    });
  }

  // Copy link
  const copyBtn = document.querySelector('.share-btn.copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function(e) {
      e.preventDefault();

      const copyToClipboard = (text) => {
        // Try modern Clipboard API first (requires HTTPS)
        if (navigator.clipboard && navigator.clipboard.writeText) {
          return navigator.clipboard.writeText(text);
        } else {
          // Fallback for non-HTTPS/older browsers
          return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
              const successful = document.execCommand('copy');
              document.body.removeChild(textArea);
              if (successful) {
                resolve();
              } else {
                reject(new Error('Copy command failed'));
              }
            } catch (err) {
              document.body.removeChild(textArea);
              reject(err);
            }
          });
        }
      };

      copyToClipboard(window.location.href).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-x"></i> Copy failed';
        copyBtn.classList.add('error');

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('error');
        }, 2000);
      });
    });
  }
}

// Expose blogPosts globally for search functionality
window.blogPosts = blogPosts;

// Load blog posts and initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadBlogPosts();
  // initSearch(); // Disabled until blog has 10+ articles
  initProgressBar();
  initSocialShare();
  initMobileNav();
});
