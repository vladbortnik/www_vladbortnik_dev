/**
 * Blog Listing Page JavaScript
 * Handles post loading, search, filtering, and tag/category management
 */

// Global state
let allPosts = [];
let filteredPosts = [];
let currentCategory = 'all';
let currentTag = 'all';
let searchQuery = '';

// DOM Elements
const postsGrid = document.getElementById('postsGrid');
const noResults = document.getElementById('noResults');

/**
 * Initialize the blog
 */
async function initBlog() {
  try {
    // Load posts metadata (with cache-busting)
    // Use relative path that works from /blog/ directory
    const response = await fetch(`./posts/posts.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load posts');
    
    const data = await response.json();
    allPosts = data.posts || [];
    
    // Sort posts by date (newest first)
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Initialize filters
    initializeFilters();
    
    // Display posts
    filteredPosts = [...allPosts];
    displayPosts();
    
    // Setup event listeners
    setupEventListeners();
    
  } catch (error) {
    console.error('Error initializing blog:', error);
    showError('Failed to load blog posts. Please try again later.');
  }
}

/**
 * Initialize category navigation and filters
 */
function initializeFilters() {
  // Extract unique categories
  const categories = ['All Posts', ...new Set(allPosts.map(post => post.category))];
  
  // Category icon mapping
  const categoryIcons = {
    'All Posts': 'bi-grid',
    'Backend Development': 'bi-code-slash',
    'DevOps': 'bi-hdd-stack',
    'Docker': 'bi-box',
    'Cloud Infrastructure': 'bi-cloud',
    'Python': 'bi-file-code',
    'Security': 'bi-shield-check'
  };
  
  // Render category navigation pills
  const categoryNav = document.getElementById('categoryNav');
  if (categoryNav) {
    categoryNav.innerHTML = categories.map((category, index) => {
      const icon = categoryIcons[category] || 'bi-circle';
      const dataCategory = category === 'All Posts' ? 'all' : category;
      return `<span class="category-pill ${index === 0 ? 'active' : ''}" 
                    data-category="${dataCategory}">
                <i class="bi ${icon}"></i>
                ${category}
              </span>`;
    }).join('');
    
    // Add click handlers for category pills
    categoryNav.addEventListener('click', (e) => {
      if (e.target.closest('.category-pill')) {
        const pill = e.target.closest('.category-pill');
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.category;
        applyFilters();
      }
    });
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Event listeners are now set up in initializeFilters()
  // for the category navigation pills
}

/**
 * Apply category filter
 */
function applyFilters() {
  filteredPosts = allPosts.filter(post => {
    // Category filter
    const categoryMatch = currentCategory === 'all' || post.category === currentCategory;
    
    return categoryMatch;
  });
  
  displayPosts();
}

/**
 * Display filtered posts (with hero, grid, medium card, and compact list)
 */
function displayPosts() {
  const heroPost = document.getElementById('heroPost');
  const mediumPostCard = document.getElementById('mediumPostCard');
  const compactPostsList = document.getElementById('compactPostsList');
  
  // Show/hide no results message
  if (filteredPosts.length === 0) {
    if (heroPost) heroPost.style.display = 'none';
    if (mediumPostCard) mediumPostCard.style.display = 'none';
    if (compactPostsList) compactPostsList.innerHTML = '';
    postsGrid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  
  noResults.style.display = 'none';
  
  // Render full magazine layout (if not filtering)
  if (currentCategory === 'all' && filteredPosts.length > 0) {
    // 1. Hero section with first post
    const featuredPost = filteredPosts[0];
    const postUrl = `post.html?slug=${featuredPost.slug}`;
    const imageUrl = featuredPost.image || 'assets/img/background.jpg';
    const readingTime = calculateReadingTime(featuredPost.excerpt);
    
    if (heroPost) {
      heroPost.style.display = 'block';
      heroPost.innerHTML = `
        <img src="${imageUrl}" alt="${featuredPost.title}" class="hero-post-image"
             onerror="this.src='assets/img/background.jpg'">
        <div class="hero-post-overlay">
          <span class="hero-post-category">Featured</span>
          <h1 class="hero-post-title">${featuredPost.title}</h1>
          <p class="hero-post-excerpt">${featuredPost.excerpt}</p>
          <div class="hero-post-meta">
            <span><i class="bi bi-calendar3"></i> ${formatDate(featuredPost.date)}</span>
            <span><i class="bi bi-clock"></i> ${readingTime} min read</span>
            <span><i class="bi bi-person"></i> ${featuredPost.author}</span>
          </div>
        </div>
      `;
      heroPost.onclick = () => window.location.href = postUrl;
    }
    
    // 2. Posts grid with next 3 posts (2nd, 3rd, 4th)
    const gridPosts = filteredPosts.slice(1, 4);
    postsGrid.innerHTML = gridPosts.map(post => createPostCard(post)).join('');
    
    // 3. Medium post card (5th post)
    if (filteredPosts.length > 4 && mediumPostCard) {
      const mediumPost = filteredPosts[4];
      mediumPostCard.style.display = 'flex';
      mediumPostCard.innerHTML = createPostCard(mediumPost).replace('<article class="post-card"', '<div');
      mediumPostCard.onclick = () => window.location.href = `post.html?slug=${mediumPost.slug}`;
    } else if (mediumPostCard) {
      mediumPostCard.style.display = 'none';
    }
    
    // 4. Compact list with remaining posts (6th onwards)
    if (filteredPosts.length > 5 && compactPostsList) {
      const compactPosts = filteredPosts.slice(5);
      compactPostsList.innerHTML = compactPosts.map(post => {
        const postUrl = `post.html?slug=${post.slug}`;
        const readingTime = calculateReadingTime(post.excerpt);
        return `
          <article class="compact-post" onclick="window.location.href='${postUrl}'">
            <h4 class="compact-post-title">${post.title}</h4>
            <div class="compact-post-meta">
              <span>${formatDate(post.date)} • ${readingTime} min</span>
            </div>
          </article>
        `;
      }).join('');
    } else if (compactPostsList) {
      compactPostsList.innerHTML = '<p style="color: var(--text-muted); font-size: 14px;">No more posts available</p>';
    }
    
  } else {
    // Hide magazine sections when filtering
    if (heroPost) heroPost.style.display = 'none';
    if (mediumPostCard) mediumPostCard.style.display = 'none';
    if (compactPostsList) compactPostsList.innerHTML = '';
    
    // Render all filtered posts in simple grid
    postsGrid.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
  }
}

/**
 * Create a post card HTML (Magazine Editorial style)
 */
function createPostCard(post) {
  const postUrl = `post.html?slug=${post.slug}`;
  const imageUrl = post.image || 'assets/img/background.jpg';
  const readingTime = calculateReadingTime(post.excerpt);
  
  return `
    <article class="post-card" onclick="window.location.href='${postUrl}'">
      <div class="post-card-image-wrapper">
        <img src="${imageUrl}" alt="${post.title}" class="post-card-image" 
             onerror="this.src='assets/img/background.jpg'">
        <span class="post-card-category">${post.category}</span>
      </div>
      <div class="post-card-content">
        <div class="post-card-meta">
          <span><i class="bi bi-calendar3"></i> ${formatDate(post.date)}</span>
          <span><i class="bi bi-clock"></i> ${readingTime} min read</span>
        </div>
        <h3 class="post-card-title">
          <a href="${postUrl}">${post.title}</a>
        </h3>
        <p class="post-card-excerpt">${post.excerpt}</p>
        <div class="post-card-footer">
          <div class="post-card-tags">
            ${(post.tags || []).slice(0, 3).map(tag => 
              `<span class="post-tag" onclick="event.stopPropagation(); filterByTag('${tag}')">${tag}</span>`
            ).join('')}
          </div>
          <a href="${postUrl}" class="read-more" onclick="event.stopPropagation()">
            Read More <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Filter posts by clicking on a tag
 */
function filterByTag(tag) {
  currentTag = tag;
  
  // Update active state
  document.querySelectorAll('.tag-filter').forEach(el => {
    el.classList.toggle('active', el.dataset.tag === tag);
  });
  
  applyFilters();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Calculate reading time based on word count
 */
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Debounce function for search input
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show error message
 */
function showError(message) {
  blogPostsGrid.innerHTML = `
    <div class="no-results" style="display: block; grid-column: 1 / -1;">
      <i class="bi bi-exclamation-triangle"></i>
      <h3>Oops!</h3>
      <p>${message}</p>
    </div>
  `;
}

// Initialize blog on page load
document.addEventListener('DOMContentLoaded', initBlog);

// Expose filterByTag to global scope for inline onclick handlers
window.filterByTag = filterByTag;
