/* dax.io — interactions */
(function () {
  'use strict';

  /* --- Sticky nav background on scroll --- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile nav toggle --- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* --- Reveal on scroll --- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* First-paint safety: reveal anything already in view, now, on load, and shortly after. */
  function revealInView() {
    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  }
  requestAnimationFrame(revealInView);
  window.addEventListener('load', revealInView);
  setTimeout(revealInView, 900);

  /* --- Animated stat counters --- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (String(target).split('.')[1] || '').length;
    var dur = 1400, start = null, done = false;
    var finalText = prefix + target.toFixed(decimals) + suffix;
    el.textContent = prefix + (0).toFixed(decimals) + suffix; // reset from server-rendered value
    function finish() { if (!done) { done = true; el.textContent = finalText; } }
    function step(ts) {
      if (done) return;
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else finish();
    }
    requestAnimationFrame(step);
    // Fallback: if rAF is throttled (e.g. page loaded in a background tab),
    // still show the final value so counters never stick at 0.
    setTimeout(finish, dur + 400);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* --- Testimonial expand/collapse --- */
  document.querySelectorAll('.tst-more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.tst');
      var expanded = !card.classList.contains('clamp');
      card.classList.toggle('clamp');
      btn.querySelector('span').textContent = expanded ? 'Read more' : 'Show less';
    });
  });

  /* --- Footer year --- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* --- Active nav link on scroll --- */
  var sections = document.querySelectorAll('section[id]');
  var navMap = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    navMap[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var link = navMap[e.target.id];
        if (link && e.isIntersecting) {
          Object.keys(navMap).forEach(function (k) { navMap[k].style.color = ''; });
          link.style.color = 'var(--text)';
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { so.observe(s); });
  }
})();
