/**
 * Blog Posts Data and Management
 */

// Blog posts data (can be moved to a separate JSON file or API in the future)
const blogPosts = [
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
 * Format date to readable string
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get blog post data by slug
 */
function getBlogPost(slug) {
  return blogPosts.find(post => post.slug === slug);
}

// Load blog posts when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadBlogPosts();
});
