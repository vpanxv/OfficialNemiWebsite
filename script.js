(function () {
    'use strict';

    /* ---- Loading screen ---- */
    window.addEventListener('load', function () {
        setTimeout(function () {
            var ls = document.getElementById('loading-screen');
            if (ls) ls.classList.add('hidden');
        }, 550);
    });

    /* ---- Nav: scroll state ---- */
    var nav = document.getElementById('topnav');
    function onScroll() {
        if (window.scrollY > 24) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Mobile menu ---- */
    var burger = document.getElementById('navBurger');
    var links = document.getElementById('navLinks');
    burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            burger.classList.remove('open');
            links.classList.remove('open');
        });
    });

    /* ---- Active nav link on scroll ---- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var sections = ['top', 'download', 'getkey', 'about', 'discord'];
    function syncActive() {
        var pos = window.scrollY + 140;
        var current = 'top';
        sections.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.offsetTop <= pos) current = id;
        });
        navLinks.forEach(function (l) {
            var href = l.getAttribute('href') || '';
            l.classList.toggle('active', href === '#' + current);
        });
    }
    window.addEventListener('scroll', syncActive, { passive: true });

    /* ---- Scroll reveal ---- */
    var reveals = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e, i) {
                if (e.isIntersecting) {
                    var el = e.target;
                    setTimeout(function () { el.classList.add('in'); }, i * 70);
                    countUp(el);
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.16 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); countUp(el); });
    }

    /* ---- Stat count-up ---- */
    function countUp(scope) {
        var nums = scope.querySelectorAll('[data-count]');
        nums.forEach(function (n) {
            if (n.dataset.done) return;
            n.dataset.done = '1';
            var target = parseInt(n.dataset.count, 10);
            var prefix = n.dataset.prefix || '';
            var suffix = n.dataset.suffix || '';
            var dur = 1100, start = null;
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                n.textContent = prefix + Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    /* ---- Toasts ---- */
    var toastBox = document.getElementById('toast-container');
    function toast(msg) {
        var t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = '<span class="t-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg></span>' + msg;
        toastBox.appendChild(t);
        setTimeout(function () {
            t.classList.add('out');
            setTimeout(function () { t.remove(); }, 250);
        }, 2600);
    }
    document.querySelectorAll('[data-toast]').forEach(function (el) {
        el.addEventListener('click', function () { toast(el.getAttribute('data-toast')); });
    });

    /* ---- Subtle 3D tilt on mock windows ---- */
    document.querySelectorAll('.feature-visual').forEach(function (fv) {
        var mock = fv.querySelector('.mock');
        if (!mock) return;
        fv.addEventListener('mousemove', function (e) {
            var r = fv.getBoundingClientRect();
            var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
            var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
            mock.style.transform = 'translateY(-4px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        });
        fv.addEventListener('mouseleave', function () { mock.style.transform = ''; });
    });

    /* ---- Get Key: checkpoint flow ---- */
    var getKeyBtn = document.getElementById('getKeyBtn');
    var keyField = document.getElementById('keyField');
    if (getKeyBtn && keyField) {
        var steps = document.querySelectorAll('.key-step');
        var stage = 0;
        var rand = function (n) {
            var s = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', o = '';
            for (var i = 0; i < n; i++) o += s.charAt(Math.floor(Math.random() * s.length));
            return o;
        };
        var copy = function (txt) { try { if (navigator.clipboard) navigator.clipboard.writeText(txt); } catch (e) {} };
        getKeyBtn.addEventListener('click', function () {
            if (stage < 3) {
                stage++;
                if (steps[stage - 1]) steps[stage - 1].classList.add('active');
                if (stage < 3) {
                    getKeyBtn.textContent = 'Continue (' + stage + '/3)';
                    toast('Checkpoint ' + stage + ' of 3 complete…');
                } else {
                    var key = 'NEMI-' + rand(4) + '-' + rand(4) + '-' + rand(4);
                    keyField.textContent = key;
                    keyField.classList.add('has-key');
                    getKeyBtn.textContent = 'Copy Key';
                    toast('Key generated successfully!');
                    copy(key);
                }
            } else {
                copy(keyField.textContent);
                toast('Key copied to clipboard!');
            }
        });
    }
})();
