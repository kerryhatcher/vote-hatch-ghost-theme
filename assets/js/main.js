/**
 * VoteHatcher Ghost Theme - Main JavaScript
 * Mobile menu, sticky header, CTA bar, scroll animations
 */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========================================================================
    // Mobile Menu
    // ========================================================================

    var menuToggle = document.querySelector('.mobile-menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        var focusableElements = null;
        var firstFocusable = null;
        var lastFocusable = null;

        function openMenu() {
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Close menu');
            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            focusableElements = mobileMenu.querySelectorAll('a, button');
            if (focusableElements.length) {
                firstFocusable = focusableElements[0];
                lastFocusable = focusableElements[focusableElements.length - 1];
                firstFocusable.focus();
            }
        }

        function closeMenu() {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open menu');
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            menuToggle.focus();
        }

        function isMenuOpen() {
            return menuToggle.getAttribute('aria-expanded') === 'true';
        }

        menuToggle.addEventListener('click', function () {
            if (isMenuOpen()) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Focus trap
        mobileMenu.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMenu();
                return;
            }

            if (e.key !== 'Tab' || !focusableElements) return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });

        // Close on escape from anywhere
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isMenuOpen()) {
                closeMenu();
            }
        });
    }

    // ========================================================================
    // Sticky Header Shrink
    // ========================================================================

    var header = document.querySelector('.site-header');

    if (header) {
        var scrollThreshold = 50;

        function handleScroll() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ========================================================================
    // CTA Bar Show/Hide/Dismiss
    // ========================================================================

    var ctaBar = document.querySelector('.cta-bar');

    if (ctaBar) {
        var dismissed = sessionStorage.getItem('cta-bar-dismissed') === 'true';
        var ctaDismissBtn = ctaBar.querySelector('.cta-bar-dismiss');
        var ctaShowThreshold = 300;

        if (!dismissed) {
            function handleCtaScroll() {
                if (window.scrollY > ctaShowThreshold) {
                    ctaBar.classList.add('is-visible');
                } else {
                    ctaBar.classList.remove('is-visible');
                }
            }

            window.addEventListener('scroll', handleCtaScroll, { passive: true });

            if (ctaDismissBtn) {
                ctaDismissBtn.addEventListener('click', function () {
                    ctaBar.classList.remove('is-visible');
                    sessionStorage.setItem('cta-bar-dismissed', 'true');
                    window.removeEventListener('scroll', handleCtaScroll);
                });
            }
        }
    }

    // ========================================================================
    // Scroll Reveal (IntersectionObserver)
    // ========================================================================

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        var revealElements = document.querySelectorAll('.reveal');

        if (revealElements.length) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(function (el) {
                observer.observe(el);
            });
        }
    } else {
        // If reduced motion or no IntersectionObserver, show everything
        var revealAll = document.querySelectorAll('.reveal');
        revealAll.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    // ========================================================================
    // Copy Link (Social Share)
    // ========================================================================

    var copyBtns = document.querySelectorAll('.share-copy-link');

    copyBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var url = btn.getAttribute('data-url') || window.location.href;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(function () {
                    btn.classList.add('copy-success');
                    var originalLabel = btn.getAttribute('aria-label');
                    btn.setAttribute('aria-label', 'Link copied!');
                    setTimeout(function () {
                        btn.classList.remove('copy-success');
                        btn.setAttribute('aria-label', originalLabel);
                    }, 2000);
                });
            }
        });
    });

})();
