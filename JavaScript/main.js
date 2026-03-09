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

(function initScrollReveal() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupScrollReveal);
    } else {
        setupScrollReveal();
    }

    function setupScrollReveal() {
        // Only observe elements that are NOT inside collapsed wrappers.
        // Proj-containers inside collapsed wrappers won't intersect on real mobile
        // because the parent has overflow:hidden + max-height:0.
        var headers = document.querySelectorAll('.projects-header');
        if (!headers.length) return;

        // Build thresholds: 0, 0.05, 0.10, ..., 1.0 (21 steps)
        var thresholds = [];
        for (var i = 0; i <= 20; i++) {
            thresholds.push(i / 20);
        }

        projectRevealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var el = entry.target;

                // Skip already-done elements
                if (el.classList.contains('proj-done')) return;

                if (entry.isIntersecting) {
                    // Map ratio to a smoother curve (ease-out)
                    var ratio = entry.intersectionRatio;
                    // Slower reveal: needs more scroll to fully appear
                    var reveal = Math.min(1, ratio * 1.2);
                    // Apply smooth easing
                    reveal = 1 - Math.pow(1 - reveal, 2);

                    el.style.setProperty('--reveal', reveal.toFixed(3));

                    // Once fully revealed, lock it in and stop observing
                    if (reveal >= 0.99) {
                        el.style.setProperty('--reveal', '1');
                        // Small delay to let the final frame render, then clean up
                        setTimeout(function () {
                            el.classList.add('proj-done');
                            el.style.removeProperty('--reveal');
                            projectRevealObserver.unobserve(el);
                        }, 100);
                    }
                } else {
                    // Only reset if element hasn't been fully revealed yet
                    if (!el.classList.contains('proj-done')) {
                        el.style.setProperty('--reveal', '0');
                    }
                }
            });
        }, {
            threshold: thresholds,
            rootMargin: '0px 0px -30px 0px'
        });

        // Only observe headers initially - they are always visible (not inside collapsed wrappers)
        headers.forEach(function (el) {
            projectRevealObserver.observe(el);
        });

        // Do NOT observe Proj-containers here - they are inside collapsed wrappers
        // and IntersectionObserver won't work on real mobile devices for hidden elements.
        // They will be revealed directly when their section is expanded (see toggleProjects).
    }
})();

// Toggle expandable project sections
function toggleProjects(headerEl) {
    var wrapper = headerEl.nextElementSibling;
    if (!wrapper) return;

    var isExpanded = headerEl.classList.contains('expanded');

    if (isExpanded) {
        // Collapse
        headerEl.classList.remove('expanded');
        wrapper.classList.remove('expanded');
    } else {
        // Expand
        headerEl.classList.add('expanded');
        wrapper.classList.add('expanded');

        // Directly reveal cards with a staggered animation.
        // We can't rely on IntersectionObserver inside the wrapper because
        // on real mobile devices, overflow:hidden containers prevent intersection detection.
        var cards = wrapper.querySelectorAll('.Proj-container:not(.proj-done)');
        cards.forEach(function (card, index) {
            // Small staggered delay for each card for a nice cascade effect
            setTimeout(function () {
                card.style.setProperty('--reveal', '1');
                // Mark as done after the transition completes
                setTimeout(function () {
                    card.classList.add('proj-done');
                    card.style.removeProperty('--reveal');
                }, 500);
            }, index * 120); // 120ms stagger between each card
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
