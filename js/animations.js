/* ============================================
   ANIMATIONS MODULE
   GSAP-like animations using native JS
   ============================================ */

(function() {
    'use strict';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Animation configuration
    const config = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        staggerDelay: 0.1
    };
    
    // Store observers for cleanup
    const observers = [];
    
    // Initialize animations
    function init() {
        if (prefersReducedMotion) {
            // Show all elements immediately
            document.querySelectorAll('[data-animate], .animate-on-scroll').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }
        
        initScrollAnimations();
        initCounterAnimations();
        initTimelineAnimations();
        initParallax();
        initScrollProgress();
    }
    
    // Scroll-triggered animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay * 1000);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });
        
        animatedElements.forEach(el => observer.observe(el));
        observers.push(observer);
    }
    
    // Counter animations
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
        observers.push(observer);
    }
    
    // Animate a single counter
    function animateCounter(counter) {
        const target = parseInt(counter.dataset.target) || 0;
        const duration = 1000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuart)
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Timeline animations
    function initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineLine = document.querySelector('.timeline-line');
        
        // Animate timeline line
        if (timelineLine) {
            const lineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        lineObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            lineObserver.observe(timelineLine);
            observers.push(lineObserver);
        }
        
        // Animate timeline items
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                    itemObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        timelineItems.forEach(item => itemObserver.observe(item));
        observers.push(itemObserver);
    }
    
    // Parallax effects
    function initParallax() {
        if (prefersReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        let ticking = false;
        
        function updateParallax() {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5;
                const yPos = scrollY * speed;
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Scroll progress indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        let ticking = false;
        
        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / docHeight;
            
            progressBar.style.transform = `scaleX(${progress})`;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Section reveal animations
    function initSectionAnimations() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    
                    // Animate children with stagger
                    const children = entry.target.querySelectorAll('[data-animate]');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => observer.observe(section));
        observers.push(observer);
    }
    
    // Project card 3D tilt effect
    function initCardTilt() {
        if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
        
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.setProperty('--rotateX', `${rotateX}deg`);
                card.style.setProperty('--rotateY', `${rotateY}deg`);
                card.classList.add('tilt');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('tilt');
                card.style.setProperty('--rotateX', '0deg');
                card.style.setProperty('--rotateY', '0deg');
            });
        });
    }
    
    // Text scramble effect for titles
    function initTextScramble() {
        const elements = document.querySelectorAll('[data-scramble]');
        
        elements.forEach(el => {
            const originalText = el.textContent;
            const chars = '!<>-_\\/[]{}—=+*^?#________';
            
            let frame = 0;
            let queue = [];
            
            for (let i = 0; i < originalText.length; i++) {
                queue.push({
                    from: chars[Math.floor(Math.random() * chars.length)],
                    to: originalText[i],
                    start: Math.floor(Math.random() * 40),
                    end: Math.floor(Math.random() * 40) + 40
                });
            }
            
            function update() {
                let output = '';
                let complete = 0;
                
                for (let i = 0; i < queue.length; i++) {
                    let { from, to, start, end } = queue[i];
                    let char = from;
                    
                    if (frame >= end) {
                        complete++;
                        output += to;
                    } else if (frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = chars[Math.floor(Math.random() * chars.length)];
                            queue[i].from = char;
                        }
                        output += `<span class="scramble-char">${char}</span>`;
                    } else {
                        output += from;
                    }
                }
                
                el.innerHTML = output;
                
                if (complete === queue.length) {
                    return;
                }
                
                frame++;
                requestAnimationFrame(update);
            }
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        update();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(el);
        });
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const offset = 80; // Account for fixed nav
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            initSectionAnimations();
            initCardTilt();
            initTextScramble();
            initSmoothScroll();
        });
    } else {
        init();
        initSectionAnimations();
        initCardTilt();
        initTextScramble();
        initSmoothScroll();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        observers.forEach(observer => observer.disconnect());
    });
    
    // Re-initialize on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initParallax();
        }, 250);
    });
})();