# [YOUR NAME] - Portfolio Website

A premium, modern, highly interactive 3D portfolio website for a MEAN Stack Developer with 4+ years of professional experience.

## Overview

This portfolio showcases professional experience, skills, and projects with a sophisticated dark premium design featuring:

- Interactive 3D hero scene using Three.js
- Smooth scroll animations with GSAP-like effects
- Custom cursor with magnetic button interactions
- Glassmorphism design elements
- Fully responsive across all devices
- Accessibility-first approach
- Performance optimized

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript (ES6+)** - Modular architecture
- **Three.js** - 3D graphics and animations
- **GSAP** - Advanced scroll animations
- **Font Awesome** - Icons
- **Google Fonts** - Plus Jakarta Sans & Space Grotesk

## Project Structure

```
portfolio/
│
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main styles & design system
│   ├── responsive.css     # Responsive breakpoints
│   └── animations.css     # Animation keyframes & transitions
│
├── js/
│   ├── main.js            # Core functionality & utilities
│   ├── three-scene.js     # 3D hero scene with Three.js
│   ├── animations.js      # Scroll & interaction animations
│   └── interactions.js    # Custom cursor, navigation, forms
│
├── assets/
│   ├── images/            # Project images
│   ├── icons/             # Custom icons
│   └── resume/            # Resume PDF
│
└── README.md              # This file
```

## Features

### Design
- Dark premium theme with violet accent colors
- Glassmorphism cards with subtle borders
- Custom typography with Plus Jakarta Sans & Space Grotesk
- Generous whitespace and visual hierarchy

### 3D Hero Scene
- Interactive particle system
- Floating geometric shapes (brackets, cubes, rings)
- MEAN stack orbiting elements
- Mouse-responsive camera movement
- Fallback for reduced motion preference

### Animations
- Scroll-triggered section reveals
- Counter animations for statistics
- Timeline item animations
- Project card 3D tilt effect
- Magnetic button interactions
- Smooth page transitions

### Interactions
- Custom cursor (desktop only)
- Sticky navigation with scroll effects
- Mobile hamburger menu
- Form validation with visual feedback
- Back to top button
- Keyboard navigation support

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Focus visible states
- Reduced motion support
- Screen reader friendly

### Performance
- Lazy loading for images
- Intersection Observer for animations
- Passive event listeners
- Optimized Three.js rendering
- Debounced resize handlers

## Customization

### Personal Information
Replace all placeholder values in `index.html`:

```html
[YOUR NAME]           -> Your full name
[YOUR EMAIL]          -> your.email@example.com
[YOUR PHONE]          -> Your phone number
[YOUR LOCATION]       -> Your city
[YOUR USERNAME]       -> Your social media usernames
[COMPANY 01-04]       -> Your work experience
[PROJECT 01-05]       -> Your project names
[UNIVERSITY NAME]     -> Your university
[COLLEGE NAME]        -> Your college
```

### Colors
Edit CSS variables in `css/style.css`:

```css
:root {
    --accent-primary: #8B5CF6;    /* Change accent color */
    --accent-secondary: #A78BFA;
    --accent-glow: rgba(139, 92, 246, 0.3);
}
```

### Images
Add your project images to `assets/images/` and update the `src` attributes in `index.html`.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Targets

- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

## Development

### Local Development
Serve the files using any static server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8080
```

### Deployment
Upload the entire `portfolio` folder to your web server or hosting platform.

## Credits

- Fonts: [Google Fonts](https://fonts.google.com)
- Icons: [Font Awesome](https://fontawesome.com)
- 3D Library: [Three.js](https://threejs.org)
- Animation Library: [GSAP](https://greensock.com/gsap)

## License

This project is open source and available for personal and commercial use.

---

Built with passion and clean code by [YOUR NAME]