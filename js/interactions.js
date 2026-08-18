/* ============================================
   INTERACTIONS MODULE
   Custom cursor, magnetic buttons, and micro-interactions
   ============================================ */

(function() {
    'use strict';
    
    // Check device capabilities
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize all interactions
    function init() {
        if (!isTouchDevice && !prefersReducedMotion) {
            initCustomCursor();
            initMagneticButtons();
        }
        
        initNavigation();
        initMobileMenu();
        initBackToTop();
        initFormValidation();
        initFocusStates();
        initKeyboardNavigation();
    }
    
    // Custom cursor
    function initCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        
        if (!cursorDot || !cursorRing) return;
        
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let ringX = 0, ringY = 0;
        let isActive = true;
        let rafId = null;
        
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isActive) {
                isActive = true;
                animate();
            }
        }, { passive: true });
        
        // Animation loop
        function animate() {
            if (!isActive) return;
            
            // Smooth follow for dot
            dotX += (mouseX - dotX) * 0.2;
            dotY += (mouseY - dotY) * 0.2;
            
            // Smoother follow for ring
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;
            
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            
            rafId = requestAnimationFrame(animate);
        }
        
        animate();
        
        // Hover states
        const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .skill-item, input, textarea');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hover');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '0.5';
        });
        
        // Cleanup
        window.addEventListener('beforeunload', () => {
            if (rafId) cancelAnimationFrame(rafId);
        });
    }
    
    // Magnetic buttons
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.magnetic-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 20;
                
                if (distance < maxDistance * 2) {
                    const strength = (maxDistance * 2 - distance) / (maxDistance * 2);
                    const moveX = x * strength * 0.3;
                    const moveY = y * strength * 0.3;
                    
                    btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
    
    // Navigation scroll behavior
    function initNavigation() {
        const nav = document.getElementById('nav');
        let lastScroll = 0;
        let ticking = false;
        
        function updateNav() {
            const currentScroll = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            // Hide/show on scroll direction (optional)
            // if (currentScroll > lastScroll && currentScroll > 100) {
            //     nav.style.transform = 'translateY(-100%)';
            // } else {
            //     nav.style.transform = 'translateY(0)';
            // }
            
            lastScroll = currentScroll;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });
        
        // Active section highlighting
        initActiveSection();
    }
    
    // Active section highlighting
    function initActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    // Mobile menu
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        const links = menu?.querySelectorAll('.nav-link');
        
        if (!toggle || !menu) return;
        
        function toggleMenu() {
            const isOpen = menu.classList.contains('active');
            
            if (isOpen) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                menu.classList.add('active');
                toggle.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        }
        
        toggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking links
        links?.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggleMenu();
            }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('active') && 
                !menu.contains(e.target) && 
                !toggle.contains(e.target)) {
                toggleMenu();
            }
        });
    }
    
    // Back to top button
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        
        let ticking = false;
        
        function toggleVisibility() {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(toggleVisibility);
                ticking = true;
            }
        }, { passive: true });
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }
    
    // Form validation
    function initFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message
                showFormMessage(form, 'Message sent successfully!', 'success');
                form.reset();
            }
        });
        
        function validateField(field) {
            const value = field.value.trim();
            const errorEl = field.parentElement.querySelector('.form-error');
            let error = '';
            
            // Required check
            if (field.hasAttribute('required') && !value) {
                error = 'This field is required';
            }
            // Email validation
            else if (field.type === 'email' && value) {
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                }
            }
            // Min length for message
            else if (field.name === 'message' && value.length < 10) {
                error = 'Message must be at least 10 characters';
            }
            
            if (error) {
                field.classList.add('error');
                field.classList.remove('success');
                if (errorEl) errorEl.textContent = error;
                return false;
            } else {
                field.classList.remove('error');
                field.classList.add('success');
                if (errorEl) errorEl.textContent = '';
                return true;
            }
        }
        
        function clearError(field) {
            field.classList.remove('error');
            const errorEl = field.parentElement.querySelector('.form-error');
            if (errorEl) errorEl.textContent = '';
        }
        
        function showFormMessage(form, message, type) {
            // Remove existing messages
            const existing = form.querySelector('.form-message');
            if (existing) existing.remove();
            
            const msgEl = document.createElement('div');
            msgEl.className = `form-message form-message-${type}`;
            msgEl.textContent = message;
            msgEl.setAttribute('role', 'alert');
            
            // Style the message
            msgEl.style.cssText = `
                padding: 1rem;
                margin-top: 1rem;
                border-radius: 8px;
                text-align: center;
                font-weight: 500;
                animation: fadeInUp 0.3s ease;
                ${type === 'success' 
                    ? 'background: rgba(34, 197, 94, 0.1); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3);' 
                    : 'background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3);'}
            `;
            
            form.appendChild(msgEl);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                msgEl.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => msgEl.remove(), 300);
            }, 5000);
        }
    }
    
    // Focus states for accessibility
    function initFocusStates() {
        // Add visible focus ring only for keyboard navigation
        document.body.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });
        
        document.body.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
        
        // Add CSS for mouse vs keyboard focus
        const style = document.createElement('style');
        style.textContent = `
            .using-mouse *:focus {
                outline: none !important;
                box-shadow: none !important;
            }
            
            .using-mouse *:focus-visible {
                outline: 2px solid var(--accent-primary) !important;
                outline-offset: 2px !important;
            }
            
            *:focus-visible {
                outline: 2px solid var(--accent-primary);
                outline-offset: 2px;
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Keyboard navigation enhancements
    function initKeyboardNavigation() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-primary);
            color: var(--text-primary);
            padding: 0.75rem 1.5rem;
            border-radius: 0 0 8px 8px;
            z-index: 10000;
            font-weight: 500;
            transition: top 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-100%';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main-content id to first section
        const firstSection = document.querySelector('section');
        if (firstSection) {
            firstSection.id = firstSection.id || 'main-content';
        }
        
        // Arrow key navigation for project cards
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            projectCards.forEach((card, index) => {
                card.setAttribute('tabindex', '0');
                card.addEventListener('keydown', (e) => {
                    let nextIndex;
                    
                    if (e.key === 'ArrowRight') {
                        nextIndex = (index + 1) % projectCards.length;
                        projectCards[nextIndex].focus();
                    } else if (e.key === 'ArrowLeft') {
                        nextIndex = (index - 1 + projectCards.length) % projectCards.length;
                        projectCards[nextIndex].focus();
                    }
                });
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');

            navLinks.forEach((link) => {
                link.classList.remove('active');

                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach((section) => {
    sectionObserver.observe(section);
});