/* ============================================
   MAIN JAVASCRIPT
   Core functionality and initialization
   ============================================ */

(function () {
    'use strict';

    // Application state
    const App = {
        initialized: false,

        prefersReducedMotion: window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches,

        isTouchDevice: window.matchMedia(
            '(pointer: coarse)'
        ).matches,

        init: function () {
            if (this.initialized) return;

            this.initPageLoad();
            this.initLazyLoading();
            this.initPerformanceOptimizations();
            this.initErrorHandling();

            this.initialized = true;

            // Dispatch custom event
            window.dispatchEvent(
                new CustomEvent('app:initialized')
            );
        },

        // Page load animation
        initPageLoad: function () {
            document.body.classList.add('page-loading');

            window.addEventListener('load', () => {
                document.body.classList.remove('page-loading');
                document.body.classList.add('page-loaded');

                // Trigger any load-dependent animations
                setTimeout(() => {
                    document.body.classList.add(
                        'page-animations-ready'
                    );
                }, 100);
            });
        },

        // Lazy loading for images
        initLazyLoading: function () {
            const lazyImages = document.querySelectorAll(
                'img[data-src]'
            );

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                const img = entry.target;

                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');

                                imageObserver.unobserve(img);
                            }
                        });
                    },
                    {
                        rootMargin: '50px 0px'
                    }
                );

                lazyImages.forEach((img) => {
                    imageObserver.observe(img);
                });
            } else {
                // Fallback for older browsers
                lazyImages.forEach((img) => {
                    img.src = img.dataset.src;
                });
            }
        },

        // Performance optimizations
        initPerformanceOptimizations: function () {
            // Debounce function
            window.debounce = function (func, wait) {
                let timeout;

                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };

                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            };

            // Throttle function
            window.throttle = function (func, limit) {
                let inThrottle;

                return function (...args) {
                    if (!inThrottle) {
                        func.apply(this, args);
                        inThrottle = true;

                        setTimeout(() => {
                            inThrottle = false;
                        }, limit);
                    }
                };
            };

            // Passive event listeners for scroll/touch
            const passiveEvents = [
                'scroll',
                'touchstart',
                'touchmove'
            ];

            passiveEvents.forEach((event) => {
                window.addEventListener(
                    event,
                    () => {},
                    { passive: true }
                );
            });

            // Preload critical resources
            this.preloadCriticalResources();
        },

        // Preload critical resources
        preloadCriticalResources: function () {
            const criticalResources = [
                // Add critical fonts or images here
                // 'assets/fonts/my-font.woff2',
                // 'assets/images/hero.webp'
            ];

            criticalResources.forEach((href) => {
                const link = document.createElement('link');

                link.rel = 'preload';
                link.href = href;

                link.as = href.endsWith('.woff2')
                    ? 'font'
                    : 'image';

                if (link.as === 'font') {
                    link.crossOrigin = 'anonymous';
                }

                document.head.appendChild(link);
            });
        },

        // Error handling
        initErrorHandling: function () {
            // Global error handler
            window.addEventListener('error', (e) => {
                console.error('Global error:', e.error);

                // Could send to error tracking service
            });

            // Unhandled promise rejections
            window.addEventListener(
                'unhandledrejection',
                (e) => {
                    console.error(
                        'Unhandled promise rejection:',
                        e.reason
                    );
                }
            );

            // Script error recovery
            document
                .querySelectorAll('script')
                .forEach((script) => {
                    script.addEventListener('error', (e) => {
                        console.error(
                            'Script failed to load:',
                            e.target.src
                        );
                    });
                });
        }
    };

    // Utility functions
    const Utils = {
        // Check if element is in viewport
        isInViewport: function (element, offset = 0) {
            const rect = element.getBoundingClientRect();

            return (
                rect.top >= -offset &&
                rect.left >= 0 &&
                rect.bottom <=
                    (window.innerHeight ||
                        document.documentElement.clientHeight) +
                        offset &&
                rect.right <=
                    (window.innerWidth ||
                        document.documentElement.clientWidth)
            );
        },

        // Smooth scroll to element
        scrollTo: function (target, offset = 80) {
            const element =
                typeof target === 'string'
                    ? document.querySelector(target)
                    : target;

            if (!element) return;

            const targetPosition =
                element.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top: targetPosition,
                behavior: App.prefersReducedMotion
                    ? 'auto'
                    : 'smooth'
            });
        },

        // Get current year
        getCurrentYear: function () {
            return new Date().getFullYear();
        },

        // Format number with commas
        formatNumber: function (num) {
            return num
                .toString()
                .replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ','
                );
        },

        // Copy to clipboard
        copyToClipboard: function (text) {
            if (navigator.clipboard) {
                return navigator.clipboard.writeText(text);
            }

            const textarea =
                document.createElement('textarea');

            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';

            document.body.appendChild(textarea);

            textarea.select();
            document.execCommand('copy');

            document.body.removeChild(textarea);

            return Promise.resolve();
        },

        // Detect browser
        detectBrowser: function () {
            const ua = navigator.userAgent;

            return {
                isChrome:
                    /Chrome/.test(ua) &&
                    /Google Inc/.test(navigator.vendor),

                isFirefox:
                    /Firefox/.test(ua),

                isSafari:
                    /Safari/.test(ua) &&
                    /Apple Computer/.test(navigator.vendor),

                isEdge:
                    /Edge/.test(ua),

                isIE:
                    /MSIE|Trident/.test(ua)
            };
        },

        // Check WebGL support
        checkWebGL: function () {
            try {
                const canvas =
                    document.createElement('canvas');

                return !!(
                    window.WebGLRenderingContext &&
                    (
                        canvas.getContext('webgl') ||
                        canvas.getContext(
                            'experimental-webgl'
                        )
                    )
                );
            } catch (e) {
                return false;
            }
        }
    };

    // Expose utilities globally
    window.App = App;
    window.Utils = Utils;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            () => App.init()
        );
    } else {
        App.init();
    }

    // Update copyright year
    const yearElements =
        document.querySelectorAll('.current-year');

    yearElements.forEach((el) => {
        el.textContent = Utils.getCurrentYear();
    });

    // Console greeting
    console.log(
        '%c[YOUR NAME] Portfolio',
        'font-size: 24px; font-weight: bold; color: #8B5CF6;'
    );

    console.log(
        '%cBuilt with passion and clean code.',
        'font-size: 14px; color: #9CA3AF;'
    );
})();