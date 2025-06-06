(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function(e) {
    let section = select(this.hash)
    if (section) {
      e.preventDefault()

      let navbar = select('#navbar')
      let header = select('#header')
      let sections = select('section', true)
      let navlinks = select('#navbar .nav-link', true)

      navlinks.forEach((item) => {
        item.classList.remove('active')
      })

      this.classList.add('active')

      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }

      if (this.hash == '#header') {
        header.classList.remove('header-top')
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        return;
      }

      if (!header.classList.contains('header-top')) {
        header.classList.add('header-top')
        setTimeout(function() {
          sections.forEach((item) => {
            item.classList.remove('section-show')
          })
          section.classList.add('section-show')

        }, 350);
      } else {
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        section.classList.add('section-show')
      }

      scrollto(this.hash)
    }
  }, true)

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function() {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Technologies Carousel
   */
  new Swiper('.technologies-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      430: {
        slidesPerView: 2,
        spaceBetween: 20
      },

      760: {
        slidesPerView: 3,
        spaceBetween: 20
      },

      1000: {
        slidesPerView: 4,
        spaceBetween: 20
      }
    }
  });

  /**
   * Init Pure Counter 
   * (Animated Number Counters Lib)
   */
  new PureCounter();  
})()

/* ##### OPEN IMAGE in FULLSCREEN ##### */
function openFullscreen(img) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';

  // Create close button
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-button';
  closeBtn.innerHTML = '×';

  // Create fullscreen image
  const fullImg = document.createElement('img');
  // Check if there's a different image specified for fullscreen
  fullImg.src = img.dataset.fullscreenSrc || img.src;
  fullImg.className = 'fullscreen-image';

  // Add elements to overlay
  overlay.appendChild(closeBtn);
  overlay.appendChild(fullImg);
  document.body.appendChild(overlay);

  // Show overlay with fade effect
  setTimeout(() => overlay.style.display = 'block', 0);

  // Close handlers
  const closeFullscreen = () => {
    overlay.style.display = 'none';
    overlay.remove();
  };

  closeBtn.onclick = closeFullscreen;
  overlay.onclick = (e) => {
    if (e.target === overlay || e.target === fullImg) closeFullscreen();
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFullscreen();
  });
  // fullImg.addEventListener('onclick', closeFullscreen);
}

// Add this function at the end of your main.js file
function scrollToAnchorInPortfolio(anchorId) {
  // Wait for any section transitions to complete
  setTimeout(() => {
    const element = document.getElementById(anchorId);
    if (element) {
      // Get header height for offset
      const header = document.getElementById('header');
      const headerHeight = header.offsetHeight;
      
      // Get position
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 14;
      
      // Scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, 500);
}