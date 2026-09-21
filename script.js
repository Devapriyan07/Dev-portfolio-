/* ==========================================================================
   DEVAPRIYAN C.M — PORTFOLIO JAVASCRIPT
   - Theme toggle (dark/light) with persistence
   - Mobile navigation drawer
   - Scroll spy for section active states
   - Reveal animations via IntersectionObserver
   - Contact form validation and transparent status handling
   ========================================================================== */

(function () {
  'use strict';

  // 1. Theme Toggle
  const root = document.documentElement;
  const themeToggleBtns = document.querySelectorAll('[data-theme-toggle]');
  
  // Initialize theme from storage or system preference
  const savedTheme = localStorage.getItem('villo-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateThemeButtonIcons(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('villo-theme', next);
      updateThemeButtonIcons(next);
    });
  });

  function updateThemeButtonIcons(theme) {
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '◐' : '◑';
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }

  // 2. Mobile Menu Drawer
  const menuBtn = document.querySelector('[data-mobile-menu]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close drawer when clicking any link
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('show'));
  }

  // 4. Scroll-Spy for Navigation Links (on single-page index)
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 120;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentSectionId}` || href === `index.html#${currentSectionId}`) {
            link.classList.add('active');
          } else if (href.startsWith('#') || href.includes('index.html#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // 5. Contact Form Validation & Submission
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !subject || !message) {
        showStatus(
          'error',
          'VALIDATION ERROR',
          'Please fill in all fields (Name, Email, Subject, Message) before submitting.'
        );
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus(
          'error',
          'INVALID EMAIL',
          'Please enter a valid email address.'
        );
        return;
      }

      // Create mailto link for direct transmission without fake backend claims
      const mailtoUrl = `mailto:dpriyan66@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      // Transparent feedback banner
      showStatus(
        'success',
        'MESSAGE READY TO DISPATCH',
        `Thank you, ${name}! Your form inputs have been validated.<br><br>` +
        `<strong>Note:</strong> To directly send this from your email client right now, click below:<br>` +
        `<a class="mailto-trigger" href="${mailtoUrl}">Open in Mail Client (${email} → dpriyan66@gmail.com) →</a><br><br>` +
        `<small style="color:var(--muted);display:block;margin-top:8px;">(To connect to an automatic backend in production, attach your Formspree ID or EmailJS service key to this form.)</small>`
      );

      // Reset form fields
      contactForm.reset();
    });
  }

  function showStatus(type, title, text) {
    formStatus.className = `form-status ${type}`;
    formStatus.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
    formStatus.style.display = 'block';
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 6. Premium 3D tilt for certificate cards
  const certCards = document.querySelectorAll('.cert-flip-card');
  certCards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 7;
      const rotateX = (0.5 - y) * 6;
      card.style.setProperty('--mx', `${rotateY}deg`);
      card.style.setProperty('--my', `${rotateX}deg`);
    });

    const resetTilt = () => {
      card.style.setProperty('--mx', '0deg');
      card.style.setProperty('--my', '0deg');
    };
    card.addEventListener('pointerleave', resetTilt);
    card.addEventListener('blur', resetTilt, true);
  });

  // 6. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();