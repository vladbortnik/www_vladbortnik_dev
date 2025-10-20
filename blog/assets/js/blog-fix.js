/**
 * Blog Layout Fix Script
 * Fixes conflicts with main site's JavaScript that applies inline styles
 */

(function() {
    'use strict';
    
    function fixBlogLayout() {
        // Fix blog section positioning
        const blogSection = document.querySelector('section#blog, section.blog-post');
        if (blogSection) {
            blogSection.style.position = 'static';
            blogSection.style.opacity = '1';
            blogSection.style.top = 'auto';
            blogSection.style.overflow = 'visible';
            blogSection.style.display = 'block';
        }
        
        // Fix footer positioning
        const footer = document.querySelector('#footer');
        if (footer) {
            footer.style.position = 'relative';
            footer.style.opacity = '1';
            footer.style.display = 'block';
        }
        
        // Ensure header stays fixed
        const header = document.querySelector('#header.header-top');
        if (header) {
            header.style.position = 'fixed';
            header.style.top = '0';
            header.style.left = '0';
            header.style.right = '0';
        }
    }
    
    // Apply fixes immediately
    fixBlogLayout();
    
    // Apply fixes after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixBlogLayout);
    }
    
    // Apply fixes after all resources are loaded (to override main.js)
    window.addEventListener('load', fixBlogLayout);
    
    // Watch for any style changes and reapply fixes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                fixBlogLayout();
            }
        });
    });
    
    // Observe the blog section for style changes
    document.addEventListener('DOMContentLoaded', function() {
        const blogSection = document.querySelector('section#blog, section.blog-post');
        if (blogSection) {
            observer.observe(blogSection, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
    });
})();
