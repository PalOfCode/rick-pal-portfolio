// ============================================================
// RICK PAL — PORTFOLIO SCRIPT
// Mobile nav toggle, scroll-spy active links, reveal-on-scroll
// animations, and client-side contact form handling.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Mobile nav toggle ---------- */

    var navToggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // close the menu after a link is tapped (mobile)
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Scroll-spy: highlight the active nav link ---------- */

    var sections = document.querySelectorAll('section[id]');
    var navAnchors = document.querySelectorAll('.nav-links a');

    function setActiveLink() {
        var scrollPos = window.scrollY + 120;
        var currentId = '';

        sections.forEach(function (section) {
            if (scrollPos >= section.offsetTop) {
                currentId = section.getAttribute('id');
            }
        });

        navAnchors.forEach(function (anchor) {
            anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + currentId);
        });
    }

    if (sections.length && navAnchors.length) {
        window.addEventListener('scroll', setActiveLink, { passive: true });
        setActiveLink();
    }

    /* ---------- Sticky header shadow once page is scrolled ---------- */

    var header = document.querySelector('header');

    function setHeaderScrolled() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }
    }

    window.addEventListener('scroll', setHeaderScrolled, { passive: true });
    setHeaderScrolled();

    /* ---------- Reveal-on-scroll for cards ---------- */

    var revealTargets = document.querySelectorAll(
        '.skill-card, .project-card, .education-card, .service, .about-content, .hero-content'
    );

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        revealTargets.forEach(function (el) {
            el.classList.add('reveal');
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealTargets.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---------- Contact form handling ---------- */
    // No backend is wired up yet. This validates the input and shows
    // feedback in place. Swap the body of submitForm() for a real
    // fetch() call once you have an endpoint (e.g. Formspree, your
    // own API) to send from.

    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');

    function showStatus(message, isError) {
        if (!status) return;
        status.textContent = message;
        status.classList.toggle('error', Boolean(isError));
        status.classList.add('visible');
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var name = form.name.value.trim();
            var email = form.email.value.trim();
            var message = form.message.value.trim();

            if (!name || !email || !message) {
                showStatus('Please fill in your name, email and message.', true);
                return;
            }

            if (!isValidEmail(email)) {
                showStatus('Please enter a valid email address.', true);
                return;
            }

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalLabel = submitBtn ? submitBtn.textContent : '';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            // Simulated send. Replace this block with a real request, e.g.:
            //
            // fetch('https://your-endpoint.example.com/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name: name, email: email, message: message })
            // })
            //     .then(function (res) { ... })
            //     .catch(function (err) { ... });

            setTimeout(function () {
                showStatus('Thanks, ' + name + ' — your message has been noted. I\'ll get back to you soon.', false);
                form.reset();

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalLabel;
                }
            }, 600);
        });
    }

});