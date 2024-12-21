(function () {
  "use strict";

  // AOS JavaScript Init
  AOS.init();

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
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function (e) {
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
        setTimeout(function () {
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
    if (window.location.hash === "") {
      window.location.hash = "overview"
    }
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

        setTimeout(function () {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  // let skilsContent = select('.skills-content');
  // if (skilsContent) {
  //   new Waypoint({
  //     element: skilsContent,
  //     offset: '80%',
  //     handler: function(direction) {
  //       let progress = select('.progress .progress-bar', true);
  //       progress.forEach((el) => {
  //         el.style.width = el.getAttribute('aria-valuenow') + '%'
  //       });
  //     }
  //   })
  // }

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
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  /* Email & Phone in Base64 */
  // document.getElementById("fone").innerText = atob("MTIzNDU2Nzg5MA==");
  // document.getElementById("mail").innerText = atob("bm8tcmVwbHlAZXhhbXBsZS5jb20=");
})()


/**********************************
******* SERVER SETUP SPECIFIC *****
**********************************/

/* ##### DIAGRAM ANIMATION ##### */
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
  fullImg.src = img.src;
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
    if (e.target === overlay) closeFullscreen();
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFullscreen();
  });
}

// DOCKER COMPOSE. CODE SNIPPETS POPUPs
function showCodeSnippet(type) {
  if (type === 'networks') {
    const codeSnippet = 
    `# NETWORK SEGREGATION
    networks: 
      frontend:        <span class="comment"># Public-facing network</span>
      backend:         <span class="comment"># Private, internal network</span>

    services:
      web:
        ...
        networks:
          - frontend       <span class="comment"># For communication with Internet</span>
          - backend        <span class="comment"># For communication with DB only</span>
        ports:
          "5002:5002"      <span class="comment"># The only necessary external</span>
        ...
        ...

      db:
        ...
        ...
        networks:
          - backend          <span class="comment"># Only Web Service have access to DB</span>
        # ports:
        #  - "5432:5432"     <span class="comment"># Port is not exposed to the Host (Isolated from Internet)</span>
        ...
        ...`;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'code-overlay';

    // Create code container
    const codeContainer = document.createElement('div');
    codeContainer.className = 'code-container';
    codeContainer.innerHTML = `<pre><code>${codeSnippet}</code></pre>`;

    // Initialize Prism.js or highlight.js
    // Prism.highlightElement(codeContainer.querySelector('code'));
    // or
    // hljs.highlightElement(codeContainer.querySelector('code'));

    overlay.appendChild(codeContainer);
    document.body.appendChild(overlay);

    // Show with fade effect
    setTimeout(() => overlay.classList.add('active'), 0);

    // Close on click outside
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      }
    });
  }
}
