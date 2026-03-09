// Optimized main.js with error handling and performance improvements
(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Use requestIdleCallback for non-critical initialization
        const scheduleWork = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

        // Critical: Initialize smooth scrolling
        initSmoothScrolling();

        // Non-critical: Initialize other features
        scheduleWork(() => {
            initViewProjectsBtn();
            initTextAnimation();
            initGSAPAnimations();
            initMagneticNav();
            preloadProjectImages();
        });
    }

    // Preload images inside collapsed project sections so they're ready on expand
    function preloadProjectImages() {
        var imgs = document.querySelectorAll('.projects-wrapper img[loading="lazy"]');
        imgs.forEach(function (img) {
            // Remove lazy so the browser starts fetching immediately
            img.removeAttribute('loading');
            // Force the browser to download by creating an Image object
            if (img.src) {
                var preload = new Image();
                preload.src = img.src;
            }
        });
    }

    function initMagneticNav() {
        const navPill = document.querySelector('.nav-pill');
        const navItems = document.querySelectorAll('.nav-pill .nav-item');

        if (navPill) {
            navPill.addEventListener('mousemove', (e) => {
                const rect = navPill.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                navPill.style.setProperty('--mouse-x', `${x}px`);
                navPill.style.setProperty('--mouse-y', `${y}px`);
            });
        }

        navItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                if (window.gsap) {
                    gsap.to(item, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.3,
                        ease: "power2.out"
                    });

                    gsap.to(item, {
                        scale: 1.05,
                        duration: 0.3
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                if (window.gsap) {
                    gsap.to(item, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.3)"
                    });
                }
            });
        });
    }

    function initViewProjectsBtn() {
        const btn = document.getElementById('viewProjectsBtn');
        const projects = document.getElementById('projects');
        if (btn && projects) {
            btn.addEventListener('click', function () {
                projects.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    function initTextAnimation() {
        const line2 = document.querySelector('.line2');
        if (line2) {
            line2.textContent = "I'm Youssef";
        }
    }

    function initSmoothScrolling() {
        // Check if Lenis is available
        if (typeof Lenis !== 'undefined') {
            try {
                // Modern Lenis initialization (v1+)
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 1.0,
                    touchMultiplier: 2
                });

                // Expose to window for global access
                window.lenis = lenis;

                function raf(time) {
                    lenis.raf(time);
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.update();
                    }
                    requestAnimationFrame(raf);
                }

                requestAnimationFrame(raf);

                // Integration with ScrollTrigger
                if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
                    lenis.on('scroll', ScrollTrigger.update);
                }

                console.log('Lenis Smooth Scroll Initialized');
            } catch (e) {
                console.warn('Lenis initialization failed:', e);
            }
        }
    }

    function initGSAPAnimations() {
        // Check if GSAP and ScrollTrigger are available
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }

        try {
            const section_1 = document.getElementById("vertical");
            const col_left = document.querySelector(".col_left");

            if (section_1 && col_left) {
                const timeln = gsap.timeline({ paused: true });
                timeln.fromTo(col_left, { y: 0 }, { y: '170vh', duration: 1, ease: 'none' }, 0);

                ScrollTrigger.create({
                    animation: timeln,
                    trigger: section_1,
                    start: 'top top',
                    end: 'bottom center',
                    scrub: true
                });
            }
        } catch (e) {
            console.warn('GSAP animation initialization failed:', e);
        }
    }

    // Function to animate text (exported for potential use)
    window.animateText = function (element, text) {
        if (!element || !text) return;

        let index = 0;
        const intervalId = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, 100);
    };
})();

// Scroll Reveal - Progressive blur-to-clear effect
var projectRevealObserver = null;

// Safari detection — Safari has unique bugs with filter+calc+CSS variables
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

(function initScrollReveal() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupScrollReveal);
    } else {
        setupScrollReveal();
    }

    function setupScrollReveal() {
        // --- SAFARI: skip all reveal/collapse logic, show everything ---
        if (isSafari) {
            document.body.classList.add('safari-browser');

            // Expand all wrappers and headers immediately
            var allHeaders = document.querySelectorAll('.projects-header');
            var allWrappers = document.querySelectorAll('.projects-wrapper');

            allHeaders.forEach(function (h) {
                h.classList.add('expanded', 'proj-done');
                h.style.opacity = '';
                h.style.filter = '';
                h.style.webkitFilter = '';
                h.style.transform = '';
                h.style.webkitTransform = '';
            });

            allWrappers.forEach(function (w) {
                w.classList.add('expanded');
            });

            // Mark all cards as done — fully visible
            var allCards = document.querySelectorAll('.Proj-container');
            allCards.forEach(function (card) {
                card.classList.add('proj-done');
                card.style.opacity = '';
                card.style.filter = '';
                card.style.webkitFilter = '';
                card.style.transform = '';
                card.style.webkitTransform = '';
            });

            // Hide all chevrons on Safari since sections aren't toggleable
            var chevrons = document.querySelectorAll('.projects-chevron');
            chevrons.forEach(function (c) {
                c.style.display = 'none';
            });

            return; // Skip observer setup entirely
        }

        // --- NON-SAFARI: normal reveal logic ---
        var headers = document.querySelectorAll('.projects-header');
        if (!headers.length) return;

        var thresholds = [];
        for (var i = 0; i <= 20; i++) {
            thresholds.push(i / 20);
        }

        function applyReveal(el, reveal, isHeader) {
            var blurMax = isHeader ? 8 : 12;
            var translateMax = isHeader ? 30 : 40;
            var blurVal = ((1 - reveal) * blurMax).toFixed(1);
            var translateVal = ((1 - reveal) * translateMax).toFixed(1);
            var scaleVal = isHeader ? '1' : (0.96 + reveal * 0.04).toFixed(4);

            el.style.opacity = reveal.toFixed(3);
            el.style.webkitFilter = 'blur(' + blurVal + 'px)';
            el.style.filter = 'blur(' + blurVal + 'px)';
            if (isHeader) {
                el.style.webkitTransform = 'translateY(' + translateVal + 'px)';
                el.style.transform = 'translateY(' + translateVal + 'px)';
            } else {
                el.style.webkitTransform = 'translateY(' + translateVal + 'px) scale(' + scaleVal + ')';
                el.style.transform = 'translateY(' + translateVal + 'px) scale(' + scaleVal + ')';
            }
        }

        function clearRevealStyles(el) {
            el.style.opacity = '';
            el.style.webkitFilter = '';
            el.style.filter = '';
            el.style.webkitTransform = '';
            el.style.transform = '';
        }

        window._revealHelpers = { applyReveal: applyReveal, clearRevealStyles: clearRevealStyles };

        projectRevealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var el = entry.target;
                if (el.classList.contains('proj-done')) return;

                var isHeader = el.classList.contains('projects-header');

                if (entry.isIntersecting) {
                    var ratio = entry.intersectionRatio;
                    var reveal = Math.min(1, ratio * 1.2);
                    reveal = 1 - Math.pow(1 - reveal, 2);

                    applyReveal(el, reveal, isHeader);

                    if (reveal >= 0.99) {
                        applyReveal(el, 1, isHeader);
                        setTimeout(function () {
                            el.classList.add('proj-done');
                            clearRevealStyles(el);
                            projectRevealObserver.unobserve(el);
                        }, 100);
                    }
                } else {
                    if (!el.classList.contains('proj-done')) {
                        applyReveal(el, 0, isHeader);
                    }
                }
            });
        }, {
            threshold: thresholds,
            rootMargin: '0px 0px -30px 0px'
        });

        headers.forEach(function (el) {
            projectRevealObserver.observe(el);
        });
    }
})();

// Toggle expandable project sections
function toggleProjects(headerEl) {
    // Safari: sections are always expanded, no toggle
    if (isSafari) return;

    var wrapper = headerEl.nextElementSibling;
    if (!wrapper) return;

    var isExpanded = headerEl.classList.contains('expanded');

    if (isExpanded) {
        headerEl.classList.remove('expanded');
        wrapper.classList.remove('expanded');
    } else {
        headerEl.classList.add('expanded');
        wrapper.classList.add('expanded');

        var cards = wrapper.querySelectorAll('.Proj-container:not(.proj-done)');
        var helpers = window._revealHelpers;

        cards.forEach(function (card, index) {
            if (helpers) {
                helpers.applyReveal(card, 0, false);
            }

            setTimeout(function () {
                if (helpers) {
                    helpers.applyReveal(card, 1, false);
                } else {
                    card.style.opacity = '1';
                    card.style.webkitFilter = 'blur(0px)';
                    card.style.filter = 'blur(0px)';
                    card.style.webkitTransform = 'translateY(0px) scale(1)';
                    card.style.transform = 'translateY(0px) scale(1)';
                }

                setTimeout(function () {
                    card.classList.add('proj-done');
                    if (helpers) {
                        helpers.clearRevealStyles(card);
                    } else {
                        card.style.opacity = '';
                        card.style.webkitFilter = '';
                        card.style.filter = '';
                        card.style.webkitTransform = '';
                        card.style.transform = '';
                    }
                }, 600);
            }, index * 120);
        });
    }
}


// function playAppropriateVideo() {
//     const isMobile = window.matchMedia("(max-width: 768px)").matches; // Adjust the width as needed
//     if (isMobile) {
//       document.getElementById('video-mobile').style.display = 'none';
//     } else {
//       document.getElementById('video-desktop').style.display = 'none';
//     }
//   }
