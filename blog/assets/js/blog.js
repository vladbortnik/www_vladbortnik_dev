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
const blogPostsGrid = document.getElementById('blogPostsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const tagFilters = document.getElementById('tagFilters');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

/**
 * Initialize the blog
 */
async function initBlog() {
  try {
    // Load posts metadata
    const response = await fetch('posts/posts.json');
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
 * Initialize category and tag filters
 */
function initializeFilters() {
  // Extract unique categories
  const categories = ['all', ...new Set(allPosts.map(post => post.category))];
  
  // Extract unique tags
  const allTags = allPosts.flatMap(post => post.tags || []);
  const uniqueTags = ['all', ...new Set(allTags)];
  
  // Render category filters
  categoryFilters.innerHTML = categories.map(category => 
    `<span class="category-filter ${category === 'all' ? 'active' : ''}" 
           data-category="${category}">
      ${category === 'all' ? 'All' : category}
    </span>`
  ).join('');
  
  // Render tag filters
  tagFilters.innerHTML = uniqueTags.map(tag => 
    `<span class="tag-filter ${tag === 'all' ? 'active' : ''}" 
           data-tag="${tag}">
      ${tag === 'all' ? 'All' : tag}
    </span>`
  ).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search input
  searchInput.addEventListener('input', debounce(handleSearch, 300));
  
  // Category filters
  categoryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-filter')) {
      handleCategoryFilter(e.target);
    }
  });
  
  // Tag filters
  tagFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-filter')) {
      handleTagFilter(e.target);
    }
  });
}

/**
 * Handle search input
 */
function handleSearch(e) {
  searchQuery = e.target.value.toLowerCase().trim();
  applyFilters();
}

/**
 * Handle category filter click
 */
function handleCategoryFilter(element) {
  // Update active state
  document.querySelectorAll('.category-filter').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
  
  // Update current category
  currentCategory = element.dataset.category;
  
  // Apply filters
  applyFilters();
}

/**
 * Handle tag filter click
 */
function handleTagFilter(element) {
  // Update active state
  document.querySelectorAll('.tag-filter').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
  
  // Update current tag
  currentTag = element.dataset.tag;
  
  // Apply filters
  applyFilters();
}

/**
 * Apply all filters (search, category, tag)
 */
function applyFilters() {
  filteredPosts = allPosts.filter(post => {
    // Category filter
    const categoryMatch = currentCategory === 'all' || post.category === currentCategory;
    
    // Tag filter
    const tagMatch = currentTag === 'all' || (post.tags && post.tags.includes(currentTag));
    
    // Search filter
    const searchMatch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.author.toLowerCase().includes(searchQuery) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery)));
    
    return categoryMatch && tagMatch && searchMatch;
  });
  
  displayPosts();
}

/**
 * Display filtered posts
 */
function displayPosts() {
  // Update results count
  const totalCount = allPosts.length;
  const filteredCount = filteredPosts.length;
  resultsCount.textContent = `Showing ${filteredCount} of ${totalCount} articles`;
  
  // Show/hide no results message
  if (filteredPosts.length === 0) {
    blogPostsGrid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  
  noResults.style.display = 'none';
  
  // Render posts
  blogPostsGrid.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
}

/**
 * Create a post card HTML
 */
function createPostCard(post) {
  const postUrl = `post.html?slug=${post.slug}`;
  const imageUrl = post.image || '../assets/img/background.jpg';
  const readingTime = calculateReadingTime(post.excerpt);
  
  return `
    <div class="blog-card">
      <div style="position: relative;">
        <img src="${imageUrl}" alt="${post.title}" class="blog-card-img" 
             onerror="this.src='../assets/img/background.jpg'">
        <span class="category-badge">${post.category}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span><i class="bi bi-calendar3"></i>${formatDate(post.date)}</span>
          <span><i class="bi bi-clock"></i>${readingTime} min read</span>
          <span><i class="bi bi-person"></i>${post.author}</span>
        </div>
        <h3 class="blog-card-title">
          <a href="${postUrl}">${post.title}</a>
        </h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-footer">
          <div class="blog-card-tags">
            ${post.tags.slice(0, 3).map(tag => 
              `<span class="blog-tag" onclick="filterByTag('${tag}')">${tag}</span>`
            ).join('')}
          </div>
          <a href="${postUrl}" class="read-more-btn">
            Read More <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
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
