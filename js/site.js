/* ==========================================================================
   site.js: small vanilla script shared by every page.
   No jQuery / GSAP / Lenis. Content lives in js/content.js.
   ========================================================================== */
(function () {
    'use strict';

    var doc = document.documentElement;
    doc.classList.remove('no-js');

    var isDev = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname) || location.protocol === 'file:';
    if (isDev) doc.classList.add('is-dev');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var SITE = window.SITE || {};

    /* ---------- helpers ---------- */
    function isPlaceholder(url) {
        return !url || /^(TODO|REEL_URL_|YT_URL_)/i.test(String(url));
    }

    function esc(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    var ICON = {
        play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
        arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>',
        yt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>',
        ankh: '<svg class="glyph" viewBox="0 0 48 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" aria-hidden="true"><ellipse cx="24" cy="15" rx="10" ry="12"/><path d="M24 27v34M8 31h32"/></svg>'
    };

    /* ---------- site-wide values (single source of truth) ---------- */
    function fillSiteValues() {
        document.querySelectorAll('[data-site="followers"]').forEach(function (el) {
            el.textContent = SITE.instagramFollowers || '';
        });

        var t = SITE.topReel;
        document.querySelectorAll('[data-site="topreel"]').forEach(function (el) {
            if (!t) { el.hidden = true; return; }
            el.innerHTML =
                '<span>Top reel:</span> <strong>' + esc(t.views) + '</strong> views' +
                '<span class="sep" aria-hidden="true">·</span><strong>' + esc(t.likes) + '</strong> likes' +
                '<span class="sep" aria-hidden="true">·</span><strong>' + esc(t.shares) + '</strong> shares' +
                ' <span>on</span> <em class="gold" style="font-style:normal">' + esc(t.title) + '</em>';
        });

        // CV buttons: href comes from SITE.cvUrl (TODO in js/content.js)
        document.querySelectorAll('[data-cv]').forEach(function (el) {
            if (SITE.cvUrl) {
                el.setAttribute('href', SITE.cvUrl);
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener');
                el.removeAttribute('aria-disabled');
            } else {
                el.removeAttribute('href');
                el.setAttribute('aria-disabled', 'true');
                el.setAttribute('title', 'CV coming soon');
                el.setAttribute('role', 'link');
            }
        });

        document.querySelectorAll('[data-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    /* ---------- reels ---------- */
    function reelCard(r, i) {
        var linked = !isPlaceholder(r.url);
        var media;

        if (r.thumb) {
            media = '<img src="' + esc(r.thumb) + '" alt="' + esc(r.title) + ' thumbnail" loading="lazy" decoding="async" width="540" height="960">';
        } else {
            media = '<div class="reel__placeholder" aria-hidden="true">' + ICON.ankh +
                '<span class="ph-title">' + esc(r.title) + '</span></div>';
        }

        if (r.video) {
            media += '<video muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-src="' + esc(r.video) + '"' +
                (r.thumb ? ' poster="' + esc(r.thumb) + '"' : '') + '></video>';
        }

        var todo = [];
        if (!linked) todo.push('link');
        if (!r.thumb) todo.push('thumb');

        var inner =
            '<div class="reel__media">' + media +
            (r.tag ? '<span class="reel__tag">' + esc(r.tag) + '</span>' : '') +
            (linked ? '' : '<span class="reel__soon">Coming soon</span>') +
            '<span class="reel__play" aria-hidden="true">' + ICON.play + '</span>' +
            (todo.length ? '<span class="todo-badge">TODO: ' + todo.join(' + ') + '</span>' : '') +
            '</div>' +
            '<div class="reel__body">' +
            '<h3 class="reel__title">' + esc(r.title) + (linked ? ICON.arrow : '') + '</h3>' +
            (r.description ? '<p class="reel__desc">' + esc(r.description) + '</p>' : '') +
            '</div>';

        if (linked) {
            return '<li class="reel reveal" style="transition-delay:' + (i % 3) * 80 + 'ms">' +
                '<a class="reel__link" href="' + esc(r.url) + '" target="_blank" rel="noopener" ' +
                'aria-label="Watch ' + esc(r.title) + ' (opens in a new tab)">' + inner + '</a></li>';
        }
        return '<li class="reel reveal" style="transition-delay:' + (i % 3) * 80 + 'ms"><div class="reel__link">' + inner + '</div></li>';
    }

    function renderReels() {
        document.querySelectorAll('[data-reels]').forEach(function (list) {
            var data = window[list.getAttribute('data-reels')] || [];
            var limit = parseInt(list.getAttribute('data-limit'), 10) || data.length;
            list.innerHTML = data.slice(0, limit).map(reelCard).join('');
            setupCarouselDots(list);
        });
    }

    function setupCarouselDots(list) {
        var dotsEl = list.parentElement.querySelector('.carousel-dots');
        if (!dotsEl) return;
        var items = list.children;
        dotsEl.innerHTML = Array.prototype.map.call(items, function (_, i) {
            return '<span' + (i === 0 ? ' class="is-active"' : '') + '></span>';
        }).join('');
        var dots = dotsEl.children;
        var ticking = false;
        list.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var w = items[0] ? items[0].getBoundingClientRect().width + 14 : 1;
                var idx = Math.min(items.length - 1, Math.round(list.scrollLeft / w));
                for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('is-active', i === idx);
                ticking = false;
            });
        }, { passive: true });
    }

    /* ---------- credits ---------- */
    function creditCard(c, i) {
        var yt = isPlaceholder(c.youtube)
            ? '<span class="chip-link chip-link--soon">' + ICON.yt + 'YouTube soon</span>'
            : '<a class="chip-link chip-link--yt" href="' + esc(c.youtube) + '" target="_blank" rel="noopener" aria-label="Watch ' + esc(c.artist + ' ' + c.title) + ' on YouTube (opens in a new tab)">' + ICON.yt + 'Watch on YouTube</a>';
        var be = c.behance
            ? '<a class="chip-link" href="' + esc(c.behance) + '" target="_blank" rel="noopener" aria-label="' + esc(c.title) + ' case study on Behance (opens in a new tab)">Case study' + ICON.arrow + '</a>'
            : '';

        return '<li class="credit reveal" style="transition-delay:' + (i % 3) * 80 + 'ms">' +
            '<div class="credit__media"><img src="' + esc(c.thumb) + '" alt="' + esc(c.artist + ' – ' + c.title) + ' visual" loading="lazy" decoding="async" width="800" height="500"></div>' +
            '<div class="credit__body">' +
            '<span class="credit__artist">' + esc(c.artist) + '</span>' +
            '<h3 class="credit__title">' + esc(c.title) + '</h3>' +
            '<span class="credit__role">' + esc(c.role) + '</span>' +
            '<p class="credit__desc">' + esc(c.description) + '</p>' +
            '<div class="credit__links">' + yt + be + '</div>' +
            '</div></li>';
    }

    function renderCredits() {
        document.querySelectorAll('[data-credits]').forEach(function (list) {
            list.innerHTML = (window.CREDITS || []).map(creditCard).join('');
        });
    }

    /* ---------- muted video previews: play only while visible ---------- */
    function setupPreviews() {
        var vids = document.querySelectorAll('video[data-src]');
        if (!vids.length || reduceMotion || saveData || !('IntersectionObserver' in window)) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                var v = e.target;
                if (e.isIntersecting) {
                    if (!v.src) { v.src = v.getAttribute('data-src'); }
                    v.muted = true;
                    var p = v.play();
                    if (p && p.catch) p.catch(function () { });
                } else if (!v.paused) {
                    v.pause();
                }
            });
        }, { threshold: 0.45 });

        vids.forEach(function (v) { io.observe(v); });
    }

    /* ---------- hero background loop ---------- */
    function setupHero() {
        var v = document.querySelector('[data-hero-video]');
        if (!v) return;
        if (reduceMotion || saveData) { v.remove(); return; }
        var mobile = window.matchMedia('(max-width: 640px)').matches;
        v.src = v.getAttribute(mobile ? 'data-src-mobile' : 'data-src');
        v.muted = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () { });
    }

    /* ---------- reveal on scroll ---------- */
    function setupReveal() {
        var els = document.querySelectorAll('.reveal');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('is-in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------- accessible tabs ---------- */
    function setupTabs() {
        document.querySelectorAll('[role="tablist"]').forEach(function (list) {
            var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
            function select(tab, focus) {
                tabs.forEach(function (t) {
                    var on = t === tab;
                    t.setAttribute('aria-selected', on ? 'true' : 'false');
                    t.tabIndex = on ? 0 : -1;
                    var panel = document.getElementById(t.getAttribute('aria-controls'));
                    if (panel) {
                        panel.hidden = !on;
                        if (on) panel.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
                    }
                });
                if (focus) tab.focus();
            }
            tabs.forEach(function (tab, i) {
                tab.addEventListener('click', function () { select(tab); });
                tab.addEventListener('keydown', function (e) {
                    var k = e.key, n = null;
                    if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
                    if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
                    if (k === 'Home') n = tabs[0];
                    if (k === 'End') n = tabs[tabs.length - 1];
                    if (n) { e.preventDefault(); select(n, true); }
                });
            });
        });
    }

    /* ---------- contact form (Formspree) ---------- */
    function setupForm() {
        var form = document.getElementById('contactForm');
        if (!form || !window.fetch) return;
        var status = form.querySelector('.form__status');
        var btn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            btn.disabled = true;
            status.className = 'form__status';
            status.textContent = 'Sending…';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            }).then(function (res) {
                if (!res.ok) throw new Error('bad status');
                form.reset();
                status.classList.add('is-ok');
                status.textContent = 'Thanks! Your message was sent. I will get back to you soon.';
            }).catch(function () {
                status.classList.add('is-err');
                status.textContent = 'Something went wrong. Please email me directly at ' + (SITE.email || '') + '.';
            }).then(function () {
                btn.disabled = false;
            });
        });
    }

    /* ---------- dev helper: list remaining placeholders ---------- */
    function reportTodos() {
        if (!isDev) return;
        var todos = [];
        (window.REELS || []).forEach(function (r) {
            if (isPlaceholder(r.url)) todos.push('Reel link: ' + r.title + ' (' + r.url + ')');
            if (!r.thumb) todos.push('Reel thumbnail: ' + r.title);
        });
        (window.CREDITS || []).forEach(function (c) {
            if (isPlaceholder(c.youtube)) todos.push('YouTube link: ' + c.artist + ' – ' + c.title + ' (' + c.youtube + ')');
        });
        if (!SITE.cvUrl) todos.push('CV file path (SITE.cvUrl)');
        if (todos.length && window.console) console.info('[TODO] Placeholders left in js/content.js:\n- ' + todos.join('\n- '));
    }

    function init() {
        fillSiteValues();
        renderReels();
        renderCredits();
        setupHero();
        setupReveal();
        setupPreviews();
        setupTabs();
        setupForm();
        reportTodos();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
