/* ==========================================================================
   Aviad Shahar Tendler — Website Scripts
   Smooth scroll, fade-in on scroll, mobile nav, form handling
   ========================================================================== */

(function () {
  'use strict';

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var offset = 72; // account for sticky nav
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      // Close mobile nav if open
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* --- Nav scroll shadow --- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  /* --- Mobile nav toggle --- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  /* --- Fade-in on scroll (Intersection Observer) --- */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Contact form handling (Formspree) --- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = new FormData(form);
    var submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })
      .then(function (response) {
        if (response.ok) {
          status.textContent = 'Message sent. I\'ll be in touch soon.';
          status.classList.add('success');
          form.reset();
        } else {
          return response.json().then(function (json) {
            var errors = json.errors
              ? json.errors.map(function (err) { return err.message; }).join(', ')
              : 'Something went wrong. Please try again.';
            status.textContent = errors;
            status.classList.add('error');
          });
        }
      })
      .catch(function () {
        status.textContent = 'Network error. Please try again later.';
        status.classList.add('error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });
})();
