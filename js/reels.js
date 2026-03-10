/**
 * reels.js — Performance-Optimised Reel Video Lazy-Loading
 *
 * Strategy:
 *  1. Cards enter viewport → IntersectionObserver triggers
 *  2. Video src injected only when card is in view (avoids loading
 *     6-8 MB video files upfront)
 *  3. Video plays only when visible; pauses when scrolled away
 *     → dramatically reduces network usage & CPU/GPU load
 *  4. Staggered card reveal animations for polished entrance
 *  5. Hover intent detection: starts loading when cursor nears card
 *     (preload on hover — ~150ms head start before play click)
 */

(function () {
    'use strict';

    /* ── Config ── */
    const PLAY_THRESHOLD   = 0.4;    // 40% visible → start playing
    const REVEAL_THRESHOLD = 0.08;   // 8% visible → reveal card
    const STAGGER_MS       = 90;     // ms between each card reveal

    /* ── State ── */
    const videoLoadState = new WeakMap(); // track which vids have been src-loaded

    /* ─────────────────────────────────────────────────────────────
       1. Load video src lazily
    ───────────────────────────────────────────────────────────── */
    function loadVideoSrc(video) {
        if (videoLoadState.get(video)) return; // already loaded
        videoLoadState.set(video, true);

        const mp4  = video.dataset.srcMp4;
        const webm = video.dataset.srcWebm;

        // Prefer webm (smaller), fall back to mp4
        const canPlayWebm = video.canPlayType('video/webm') !== '';

        if (canPlayWebm && webm) {
            const src = document.createElement('source');
            src.src  = webm;
            src.type = 'video/webm';
            video.appendChild(src);
        }

        if (mp4) {
            const src = document.createElement('source');
            src.src  = mp4;
            src.type = 'video/mp4';
            video.appendChild(src);
        }

        video.load();
    }

    /* ─────────────────────────────────────────────────────────────
       2. Play / Pause helpers (with safe promise handling)
    ───────────────────────────────────────────────────────────── */
    function safePlay(video) {
        if (video.paused) {
            loadVideoSrc(video); // ensure src is loaded
            const p = video.play();
            if (p && typeof p.catch === 'function') {
                p.catch(function () { /* autoplay blocked — poster shows fine */ });
            }
        }
    }

    function safePause(video) {
        if (!video.paused) {
            video.pause();
        }
    }

    /* ─────────────────────────────────────────────────────────────
       3. Reveal observer — card entrance animations (staggered)
    ───────────────────────────────────────────────────────────── */
    function initRevealObserver(cards) {
        const revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const card  = entry.target;
                    const index = parseInt(card.dataset.index || '0', 10);

                    setTimeout(function () {
                        card.classList.add('reel-card--visible');
                    }, index * STAGGER_MS);

                    // Stop watching after reveal (one-shot)
                    revealObs.unobserve(card);
                }
            });
        }, {
            threshold: 0.01,
            rootMargin: '200px 0px 200px 0px'
        });

        cards.forEach(function (card) { revealObs.observe(card); });
    }

    /* ─────────────────────────────────────────────────────────────
       4. Play observer — video plays only when in viewport
    ───────────────────────────────────────────────────────────── */
    function initPlayObserver(videos) {
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all, do nothing smart
            videos.forEach(function (v) { loadVideoSrc(v); });
            return;
        }

        const playObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                const video = entry.target;
                if (entry.isIntersecting) {
                    safePlay(video);
                } else {
                    safePause(video);
                }
            });
        }, {
            threshold: PLAY_THRESHOLD
        });

        videos.forEach(function (v) { playObs.observe(v); });
    }

    /* ─────────────────────────────────────────────────────────────
       5. Hover-intent preload — start loading when mouse enters card
          (gives ~100-300ms head-start before user actually clicks)
    ───────────────────────────────────────────────────────────── */
    function initHoverPreload(cards) {
        cards.forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                const video = card.querySelector('.reel-video');
                if (video) loadVideoSrc(video);
            }, { passive: true, once: true });
        });
    }

    /* ─────────────────────────────────────────────────────────────
       6. Touch-start preload for mobile
    ───────────────────────────────────────────────────────────── */
    function initTouchPreload(cards) {
        cards.forEach(function (card) {
            card.addEventListener('touchstart', function () {
                const video = card.querySelector('.reel-video');
                if (video) loadVideoSrc(video);
            }, { passive: true, once: true });
        });
    }

    /* ─────────────────────────────────────────────────────────────
       7. Visibility change — pause all when tab hidden (battery saver)
    ───────────────────────────────────────────────────────────── */
    function initVisibilityPause(videos) {
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                videos.forEach(function (v) { safePause(v); });
            }
            // When tab regains focus, IntersectionObserver re-handles play
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────
       8. Nav mouse-tracking glow (matches existing site nav style)
    ───────────────────────────────────────────────────────────── */
    function initNavGlow() {
        const pill = document.querySelector('.nav-pill');
        if (!pill) return;

        pill.addEventListener('mousemove', function (e) {
            const rect = pill.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top)  / rect.height) * 100;
            pill.style.setProperty('--mouse-x', x + '%');
            pill.style.setProperty('--mouse-y', y + '%');
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────
       BOOT
    ───────────────────────────────────────────────────────────── */
    function init() {
        const cards  = Array.from(document.querySelectorAll('.reel-card'));
        const videos = cards.map(function (c) { return c.querySelector('.reel-video'); })
                             .filter(Boolean);

        if (!cards.length) return;

        // Use IdleCallback for non-critical setup so we don't block paint
        const schedule = window.requestIdleCallback
            ? window.requestIdleCallback
            : function (cb) { setTimeout(cb, 16); };

        // Critical path: reveal + play observers start immediately
        initRevealObserver(cards);
        initPlayObserver(videos);

        // Deferred: preload helpers don't need to run right away
        schedule(function () {
            initHoverPreload(cards);
            initTouchPreload(cards);
            initVisibilityPause(videos);
            initNavGlow();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
