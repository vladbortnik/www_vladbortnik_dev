/**
 * Blog Post Page JavaScript
 * Handles individual post loading, rendering, and metadata
 */

// DOM Elements
const loadingState = document.getElementById('loadingState');
const postContainer = document.getElementById('postContainer');
const errorState = document.getElementById('errorState');
const postTitle = document.getElementById('postTitle');
const postMeta = document.getElementById('postMeta');
const postCategories = document.getElementById('postCategories');
const postContent = document.getElementById('postContent');
const postTags = document.getElementById('postTags');

/**
 * Get URL parameter
 */
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Initialize post page
 */
async function initPost() {
  try {
    const slug = getUrlParameter('slug');
    
    if (!slug) {
      throw new Error('No post slug provided');
    }
    
    // Load posts metadata
    const response = await fetch('./posts/posts.json');
    if (!response.ok) throw new Error('Failed to load posts metadata');
    
    const data = await response.json();
    const post = data.posts.find(p => p.slug === slug);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Load markdown content
    const markdownResponse = await fetch(`./posts/${post.file}`);
    if (!markdownResponse.ok) throw new Error('Failed to load post content');
    
    const markdownContent = await markdownResponse.text();
    
    // Render post
    renderPost(post, markdownContent);
    
    // Update SEO metadata
    updateSEOMetadata(post);
    
    // Hide loading, show post
    loadingState.style.display = 'none';
    postContainer.style.display = 'block';
    
    // Initialize syntax highlighting if code blocks exist
    initializeSyntaxHighlighting();
    
  } catch (error) {
    console.error('Error loading post:', error);
    showError();
  }
}

/**
 * Render post content
 */
function renderPost(post, markdownContent) {
  // Set title
  postTitle.textContent = post.title;
  
  // Set meta information
  const readingTime = calculateReadingTime(markdownContent);
  postMeta.innerHTML = `
    <span><i class="bi bi-calendar3"></i> ${formatDate(post.date)}</span>
    <span><i class="bi bi-clock"></i> ${readingTime} min read</span>
    <span><i class="bi bi-person"></i> ${post.author}</span>
    ${post.updated ? `<span><i class="bi bi-arrow-clockwise"></i> Updated ${formatDate(post.updated)}</span>` : ''}
  `;
  
  // Set categories
  postCategories.innerHTML = `
    <span class="category-badge">${post.category}</span>
  `;
  
  // Render markdown to HTML
  marked.setOptions({
    highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          console.error('Syntax highlighting error:', err);
        }
      }
      return code;
    },
    breaks: true,
    gfm: true
  });
  
  postContent.innerHTML = marked.parse(markdownContent);
  
  // Set tags
  postTags.innerHTML = post.tags.map(tag => 
    `<a href="/blog/?tag=${tag}" class="post-tag">${tag}</a>`
  ).join('');
}

/**
 * Update SEO metadata
 */
function updateSEOMetadata(post) {
  const fullUrl = `https://vladbortnik.dev/blog/post.html?slug=${post.slug}`;
  const imageUrl = post.image || 'https://vladbortnik.dev/assets/img/me.jpg';
  
  // Page title
  document.getElementById('pageTitle').textContent = `${post.title} | Vlad Bortnik`;
  document.title = `${post.title} | Vlad Bortnik`;
  
  // Meta description
  document.getElementById('pageDescription').setAttribute('content', post.excerpt);
  
  // Meta keywords
  document.getElementById('pageKeywords').setAttribute('content', post.tags.join(', '));
  
  // Open Graph
  document.getElementById('ogUrl').setAttribute('content', fullUrl);
  document.getElementById('ogTitle').setAttribute('content', post.title);
  document.getElementById('ogDescription').setAttribute('content', post.excerpt);
  document.getElementById('ogImage').setAttribute('content', imageUrl);
  document.getElementById('articlePublished').setAttribute('content', post.date);
  
  // Twitter
  document.getElementById('twitterUrl').setAttribute('content', fullUrl);
  document.getElementById('twitterTitle').setAttribute('content', post.title);
  document.getElementById('twitterDescription').setAttribute('content', post.excerpt);
  document.getElementById('twitterImage').setAttribute('content', imageUrl);
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://vladbortnik.dev"
    },
    "publisher": {
      "@type": "Person",
      "name": "Vlad Bortnik"
    },
    "datePublished": post.date,
    "dateModified": post.updated || post.date,
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    }
  };
  
  document.getElementById('structuredData').textContent = JSON.stringify(structuredData, null, 2);
}

/**
 * Initialize syntax highlighting for code blocks
 */
function initializeSyntaxHighlighting() {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

/**
 * Calculate reading time
 */
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Show error state
 */
function showError() {
  loadingState.style.display = 'none';
  postContainer.style.display = 'none';
  errorState.style.display = 'block';
}

/**
 * Handle tag filtering from URL parameter
 */
function handleUrlTagFilter() {
  const tag = getUrlParameter('tag');
  if (tag) {
    // Redirect to blog listing with tag filter
    window.location.href = `/blog/?tag=${tag}`;
  }
}

// Initialize post on page load
document.addEventListener('DOMContentLoaded', initPost);
