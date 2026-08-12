/* ============================================================
   RICK PAL — PORTFOLIO SCRIPT
   Handles: active nav link on scroll, scroll-reveal animations,
   sticky header shadow, and contact form validation/feedback.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. Active nav link on scroll ---------- */

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const setActiveLink = () => {
        let currentId = '';
        const scrollPos = window.scrollY + 120; // offset for sticky header

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active-link');
            }
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();


    /* ---------- 2. Header shadow / shrink on scroll ---------- */

    const header = document.querySelector('header');

    const setHeaderState = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', setHeaderState, { passive: true });
    setHeaderState();


    /* ---------- 3. Scroll-reveal animations ---------- */

    const revealTargets = document.querySelectorAll(
        '.skill-card, .education-card, .service, .about-content, .contact-container, .hero-content'
    );

    revealTargets.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        revealTargets.forEach((el) => revealObserver.observe(el));
    } else {
        // Fallback: no IntersectionObserver support, just show everything
        revealTargets.forEach((el) => el.classList.add('reveal-visible'));
    }


    /* ---------- 4. Mobile nav: close/scroll behavior ---------- */

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            // Small delay lets the smooth scroll start before losing focus styles
            link.blur();
        });
    });


    /* ---------- 5. Contact form validation + feedback ---------- */

    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        const nameField = contactForm.querySelector('#contact-name');
        const emailField = contactForm.querySelector('#contact-email');
        const messageField = contactForm.querySelector('#contact-message');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Create a status message element once
        const statusMsg = document.createElement('p');
        statusMsg.className = 'form-status';
        statusMsg.setAttribute('role', 'status');
        statusMsg.setAttribute('aria-live', 'polite');
        contactForm.appendChild(statusMsg);

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const showStatus = (message, isError) => {
            statusMsg.textContent = message;
            statusMsg.classList.toggle('form-status-error', isError);
            statusMsg.classList.toggle('form-status-success', !isError);
            statusMsg.classList.add('form-status-visible');
        };

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const message = messageField.value.trim();

            if (!name || !email || !message) {
                showStatus('Please fill in all required fields.', true);
                return;
            }

            if (!emailPattern.test(email)) {
                showStatus('Please enter a valid email address.', true);
                emailField.focus();
                return;
            }

            // No backend is wired up yet (action="#"), so simulate a send.
            const originalLabel = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                showStatus(`Thanks, ${name.split(' ')[0]}! Your message has been received.`, false);
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }, 900);
        });
    }


    /* ---------- 6. Auto-update copyright year ---------- */

    const copyrightEl = document.querySelector('.copyright');
    if (copyrightEl) {
        const year = new Date().getFullYear();
        copyrightEl.textContent = copyrightEl.textContent.replace(/\d{4}/, year);
    }

});