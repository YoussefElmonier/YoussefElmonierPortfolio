// Optimized main.js with error handling and performance improvements
(function() {
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
        });
    }
    
    function initViewProjectsBtn() {
        const btn = document.getElementById('viewProjectsBtn');
        const projects = document.getElementById('projects');
        if (btn && projects) {
            btn.addEventListener('click', function() {
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
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
                
                function raf(time) {
                    lenis.raf(time);
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.update();
                    }
                    requestAnimationFrame(raf);
                }
                
                requestAnimationFrame(raf);
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
                timeln.fromTo(col_left, {y: 0}, {y: '170vh', duration: 1, ease: 'none'}, 0);
                
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
    window.animateText = function(element, text) {
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
// function playAppropriateVideo() {
//     const isMobile = window.matchMedia("(max-width: 768px)").matches; // Adjust the width as needed
//     if (isMobile) {
//       document.getElementById('video-mobile').style.display = 'none';
//     } else {
//       document.getElementById('video-desktop').style.display = 'none';
//     }
//   }
