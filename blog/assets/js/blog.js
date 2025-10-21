/**
 * Blog Posts Data and Management
 * ALL features integrated in ONE file
 */

// Blog posts data (can be moved to a separate JSON file or API in the future)
const blogPosts = [
  {
    id: 4,
    slug: "deploy-multi-app-production-setup",
    title: "Deploy Like a Pro: Multi-App Production Setup for Less Than Netflix",
    excerpt: "Learn how to host multiple production apps on a $12/month VPS with Docker, Nginx, and enterprise-level security. Save $240-480/year on hosting costs.",
    category: "DevOps",
    date: "2025-10-21",
    readTime: "16 min read",
    author: "Vlad Bortnik"
  },
  {
    id: 1,
    slug: "docker-python-best-practices",
    title: "Docker & Python: Production Best Practices",
    excerpt: "Learn how to containerize Python applications effectively with Docker, including multi-stage builds, security considerations, and optimization techniques for production environments.",
    category: "DevOps",
    date: "2024-01-15",
    readTime: "8 min read",
    author: "Vlad Bortnik"
  },
  {
    id: 2,
    slug: "flask-authentication-jwt",
    title: "Implementing Secure Authentication in Flask with JWT",
    excerpt: "A comprehensive guide to building secure authentication systems in Flask applications using JSON Web Tokens, including best practices for token management and security.",
    category: "Python",
    date: "2024-01-10",
    readTime: "10 min read",
    author: "Vlad Bortnik"
  },
  {
    id: 3,
    slug: "nginx-ssl-configuration",
    title: "Nginx Configuration for Production: SSL/TLS Setup",
    excerpt: "Step-by-step guide to configuring Nginx with SSL/TLS certificates, including Let's Encrypt integration, security headers, and performance optimization.",
    category: "Server Config",
    date: "2024-01-05",
    readTime: "6 min read",
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
  const date = new Date(dateString);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  // Add ordinal suffix
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';
  
  return `${month} ${day}${suffix}, ${year}`;
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
 */
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
      navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('copied');
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
  initSearch();
  initProgressBar();
  initSocialShare();
});
