/sta# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional portfolio website built with vanilla HTML5, CSS3/SCSS, and JavaScript. The site showcases a backend engineer's work with a focus on server infrastructure, DevOps, and full-stack web applications.

## Architecture & Structure

### Core Structure
- `index.html` - Main portfolio page with sections: header, about, resume, projects
- `server-setup.html` - Detailed project page for the server infrastructure project
- `assets/` - All static resources organized by type

### Styling Architecture
- **SCSS Modular System**: `assets/scss/style.scss` imports:
  - `_variables.scss` - Global variables and configuration
  - `_general.scss` - Base styles and typography  
  - `_header.scss` - Header section styling
  - `_nav.scss` - Navigation component styles
  - `_sections.scss` - Main content section styles
  - `_credits.scss` - Footer/credits styling
- **Compiled CSS**: `assets/css/style.css` and `assets/css/server-setup.css`

### JavaScript Architecture
- **Main Script**: `assets/js/main.js` - Core SPA functionality with these patterns:
  - **Helper functions**: `select()` for DOM queries, `on()` for event binding, `scrollto()` for navigation
  - **Section management**: `showSection()` hides all sections, shows target section with fade animations
  - **Hash routing**: URL hash changes trigger section navigation (`#about`, `#portfolio`, etc.)
  - **Mobile navigation**: Hamburger menu toggle with Bootstrap Icon transitions
  - **Dynamic interactions**: Waypoint-triggered skill bars, Swiper carousel initialization
  - **Custom fullscreen**: Image overlay system with ESC/click-to-close functionality
- **Page-specific**: `assets/js/server-setup.js` for dedicated project detail pages

### Project Structure Pattern
Each project follows a consistent structure in the HTML:
- Project container with unique ID (`project-1`, `project-2`, etc.)
- Overview section with feature lists
- Tech stack breakdown in columns
- Screenshots/diagrams section
- Action buttons (GitHub, Live demo, or details page)

## Key Features & Components

### Navigation System
- Hash-based routing for single-page navigation
- Section show/hide animations with 350ms timing
- Mobile-responsive hamburger menu
- Active state management for navigation links

### Interactive Elements
- **Swiper Carousel**: Technology icons with responsive breakpoints
- **PureCounter**: Animated statistics counters
- **Waypoint Animations**: Skill progress bars trigger on scroll
- **Custom Fullscreen**: Image overlay system with keyboard/click controls

### Content Structure
- **4 Featured Projects**: Server setup, Recipe app, Book exchange, Portfolio website
- **Skills Section**: Progress bars with percentage values
- **Resume Integration**: Embedded professional experience and education
- **Technology Showcases**: Dual placement (About + Portfolio sections)

## Development Commands

### Local Development Server
```bash
# Start local server (Python 3)
python3 -m http.server 8000

# Start local server (Python 2)
python -m SimpleHTTPServer 8000

# Alternative with Node.js (if available)
npx serve .
```

### SCSS Compilation
```bash
# Compile main stylesheet
sass assets/scss/style.scss assets/css/style.css

# Compile with watch mode for development
sass --watch assets/scss/style.scss:assets/css/style.css

# For server-setup page (if needed)
sass assets/scss/style.scss assets/css/server-setup.css
```

### Testing & Validation
- **Manual Testing**: Open `index.html` and `server-setup.html` in browsers
- **Responsive Testing**: Test across mobile, tablet, desktop breakpoints
- **Cross-browser Testing**: Verify functionality in Chrome, Firefox, Safari, Edge
- **Accessibility**: Check keyboard navigation and screen reader compatibility

## Development Notes

### Static Website Architecture
This is a vanilla HTML/CSS/JS website with no build process or package.json. All dependencies are vendored locally in `assets/vendor/`.

### Vendor Dependencies (Local)
All JavaScript libraries and CSS frameworks are included locally in `assets/vendor/`:
- **Bootstrap 5.3.x**: `bootstrap/` - Grid system, components, utilities
- **Bootstrap Icons**: `bootstrap-icons/` - Icon font and CSS
- **Swiper 11.x**: `swiper/` - Touch carousel library
- **GLightbox**: `glightbox/` - Lightbox for images
- **PureCounter**: `purecounter/` - Animated counters
- **Waypoints**: `waypoints/` - Scroll-triggered events
- **Isotope**: `isotope-layout/` - Grid layout and filtering
- **Boxicons**: `boxicons/` - Additional icon fonts
- **Remix Icons**: `remixicon/` - Modern icon set

### Image Asset Organization
```
assets/img/portfolio/
├── bookfinder/          # Book exchange platform screenshots
├── recipe/              # Recipe app screenshots  
├── server-setup/        # Server infrastructure diagrams
│   ├── docker/          # Docker architecture diagrams
│   ├── nginx/           # Nginx configuration examples
│   ├── security/        # Security audit results
│   └── dashboard/       # Server monitoring screenshots
├── technologies-icons/ # Technology icons for carousel
└── website-portfolio/   # This website's screenshots
```

## Key Architectural Patterns

### Single Page Application (SPA) Navigation
- **Hash-based routing**: URLs like `#about`, `#portfolio` control content visibility
- **Section switching**: Only one main section visible at a time with 350ms fade transitions
- **State management**: Active navigation states updated via `showSection()` function
- **Deep linking**: Direct URLs to specific portfolio projects via `scrollToAnchorInPortfolio()`

### Responsive Image Strategy
- **Multiple versions**: Full-size, thumbnails, and optimized variants for each project
- **Lazy loading**: Images load as needed to improve performance
- **Fullscreen functionality**: Click-to-expand with custom overlay system

### Performance Considerations
- **Vendor bundling**: All dependencies served locally to reduce external requests
- **CSS optimization**: Modular SCSS compiled to single CSS file
- **Image optimization**: WebP format used where supported, fallback to PNG/JPG

## Common Tasks

### Adding New Projects
1. **HTML Structure**: Add new project section in `index.html` following the pattern:
   ```html
   <div class="col-lg-6 portfolio-item" data-aos="fade-up" data-aos-delay="100">
     <div class="portfolio-wrap" id="project-X">
       <div class="portfolio-overview"><!-- Overview content --></div>
       <div class="portfolio-tech"><!-- Tech stack --></div>
       <div class="portfolio-screenshots"><!-- Images --></div>
       <div class="portfolio-buttons"><!-- Action buttons --></div>
     </div>
   </div>
   ```
2. **Navigation**: Update dropdown menu in header navigation if project needs quick access
3. **Images**: Add project assets to `assets/img/portfolio/[project-name]/` following naming conventions
4. **Detail Pages**: For complex projects, create dedicated HTML page (e.g., `server-setup.html`)

### Style Modifications
1. **SCSS Editing**: Modify appropriate partial in `assets/scss/`:
   - `_variables.scss` - Colors, fonts, breakpoints
   - `_sections.scss` - Main content area styling
   - `_header.scss` - Header/navigation modifications
2. **Compilation**: Run `sass --watch assets/scss/style.scss:assets/css/style.css`
3. **Testing**: Verify responsive behavior at 576px, 768px, 992px, 1200px breakpoints

### Technology Stack Updates
- **About Section**: Update technology icons in the dual Swiper carousel
- **Portfolio Section**: Ensure tech stack matches project descriptions
- **Icon Assets**: Add new technology icons to `assets/img/portfolio/technologies-icons/`

### Content Management
- **Resume/Experience**: Update both About section and dedicated Resume section
- **Contact Information**: Social links and email in header section
- **Skills**: Update progress bars and percentages in skills section