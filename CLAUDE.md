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
- **Main Script**: `assets/js/main.js` handles:
  - Mobile navigation toggle
  - Single-page application navigation with section switching
  - Skills progress bar animations (Waypoint.js integration)
  - Technology carousel (Swiper.js integration)
  - Image fullscreen functionality
  - Smooth scrolling with portfolio anchor navigation

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

## Development Notes

### No Build Process
This is a static website with no package.json or build pipeline. SCSS must be manually compiled to CSS when making style changes.

### Dependencies
- **Bootstrap 5**: Grid system and utilities
- **Bootstrap Icons**: Icon font
- **Swiper.js**: Touch-enabled carousel
- **PureCounter**: Number animation library
- **Waypoints**: Scroll-triggered animations
- **AOS (Animate On Scroll)**: Additional scroll animations

### Image Assets
Extensive image library organized by project in `assets/img/portfolio/` with optimized versions for different use cases (thumbnails, full-size, diagrams).

## Common Tasks

### Adding New Projects
1. Add project section in `index.html` following existing pattern
2. Update navigation dropdown if needed
3. Add corresponding images to appropriate portfolio subfolder
4. Consider creating dedicated detail page if complex (like `server-setup.html`)

### Style Modifications
1. Edit appropriate SCSS partial in `assets/scss/`
2. Compile SCSS to CSS manually
3. Test responsive behavior across breakpoints

### Content Updates
- Resume/experience updates in both About and Resume sections
- Technology stack updates in dual carousel locations
- Social links and contact information in header section