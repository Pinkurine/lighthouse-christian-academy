// Lighthouse Christian Academy: small progressive enhancements. The site works without JS.
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var hasIO = 'IntersectionObserver' in window;

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // close after choosing a link (matters for same-page anchors like #levels)
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  // Header shadow once the page scrolls (rAF-throttled, writes only on change)
  var header = document.querySelector('.site-header');
  if (header) {
    var scrolled = null, ticking = false;
    var update = function () {
      ticking = false;
      var now = window.scrollY > 8;
      if (now !== scrolled) { scrolled = now; header.classList.toggle('is-scrolled', now); }
    };
    update();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  if (hasIO) {
    // The one scroll reveal: the level staircase rises step by step
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); reveal.unobserve(entry.target); }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.stairs').forEach(function (el) { reveal.observe(el); });

    // Pause looping animations (hero scene, verse sun) while they are off screen
    var pauser = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('offscreen', !entry.isIntersecting); });
    });
    document.querySelectorAll('.hero, .verse').forEach(function (el) { pauser.observe(el); });
  } else {
    document.querySelectorAll('.stairs').forEach(function (el) { el.classList.add('in'); });
  }

  // Pause all animations when the tab is hidden
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  // Footer year
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
