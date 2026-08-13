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

        // Stop the normal page reload
        event.preventDefault();

        var name = form.name.value.trim();
        var email = form.email.value.trim();
        var message = form.message.value.trim();

        // Validate name, email and message
        if (!name || !email || !message) {
            showStatus(
                'Please fill in your name, email and message.',
                true
            );
            return;
        }

        // Validate email
        if (!isValidEmail(email)) {
            showStatus(
                'Please enter a valid email address.',
                true
            );
            return;
        }

        var submitBtn = form.querySelector(
            'button[type="submit"]'
        );

        var originalLabel = submitBtn
            ? submitBtn.textContent
            : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        // Send form data to Formspree
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function (response) {

            if (response.ok) {

                showStatus(
                    'Thank you, ' + name +
                    '! Your message has been sent successfully.',
                    false
                );

                form.reset();

            } else {

                showStatus(
                    'Something went wrong. Please try again.',
                    true
                );

            }

        })
        .catch(function () {

            showStatus(
                'Unable to send the message. Please try again.',
                true
            );

        })
        .finally(function () {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }

        });
    });
}
   });