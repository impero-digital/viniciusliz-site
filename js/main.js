// Vinícius Liz — comportamentos do site (vanilla JS, sem dependências)
(function(){
  'use strict';

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function(){
      navLinks.classList.toggle('open');
      toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navLinks.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  /* Header background on scroll */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function(){
      header.style.background = window.scrollY > 40 ? 'rgba(0,0,0,.85)' : 'rgba(0,0,0,.55)';
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* Animated counters: <span class="counter" data-to="200" data-suffix="+" data-decimals="0"> */
  function animateCounter(el){
    var to = parseFloat(el.getAttribute('data-to') || '0');
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;
    function step(ts){
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = eased * to;
      el.textContent = val.toFixed(decimals).replace('.', decimals ? ',' : '') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = to.toFixed(decimals).replace('.', decimals ? ',' : '') + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function(el){ counterObserver.observe(el); });
  }

  /* Skill bars: <div class="skill-fill" data-pct="91"> */
  var skillFills = document.querySelectorAll('.skill-fill');
  if ('IntersectionObserver' in window && skillFills.length) {
    var skillObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var pct = entry.target.getAttribute('data-pct') || '0';
          entry.target.style.width = pct + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(function(el){ skillObserver.observe(el); });
  }

  /* Testimonial carousel: shows 3 cards per view on desktop, 1 on mobile */
  var viewport = document.querySelector('.t-viewport');
  if (viewport) {
    var track = viewport.querySelector('.t-track');
    var cards = Array.prototype.slice.call(track.querySelectorAll('.t-card'));
    var dotsWrap = document.querySelector('.slider-dots');
    var btnNext = document.querySelector('[data-slider-next]');
    var btnPrev = document.querySelector('[data-slider-prev]');
    var current = 0;
    var timer;
    var maxIndex = 0;

    function visibleCount(){
      return window.innerWidth <= 900 ? 1 : 3;
    }

    function step(){
      var gap = parseFloat(getComputedStyle(track).gap || 28);
      var cardWidth = cards[0].getBoundingClientRect().width;
      return cardWidth + gap;
    }

    function buildDots(){
      dotsWrap.innerHTML = '';
      var dots = [];
      for (var i = 0; i <= maxIndex; i++) {
        var dot = document.createElement('span');
        if (i === current) dot.classList.add('active');
        (function(idx){
          dot.addEventListener('click', function(){ goTo(idx); resetTimer(); });
        })(i);
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
      return dots;
    }

    var dots = [];

    function refresh(){
      maxIndex = Math.max(0, cards.length - visibleCount());
      current = Math.min(current, maxIndex);
      dots = buildDots();
      position();
    }

    function position(){
      track.style.transform = 'translateX(-' + (current * step()) + 'px)';
      dots.forEach(function(d, i){ d.classList.toggle('active', i === current); });
    }

    function goTo(i){
      current = Math.max(0, Math.min(i, maxIndex));
      position();
    }
    function next(){ goTo(current >= maxIndex ? 0 : current + 1); }
    function prev(){ goTo(current <= 0 ? maxIndex : current - 1); }
    function resetTimer(){
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    btnNext && btnNext.addEventListener('click', function(){ next(); resetTimer(); });
    btnPrev && btnPrev.addEventListener('click', function(){ prev(); resetTimer(); });

    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 150);
    });

    refresh();
    resetTimer();
  }

  /* Play button opens the "quem somos" video inline */
  document.querySelectorAll('[data-play-video]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var vid = document.querySelector(btn.getAttribute('data-play-video'));
      if (vid) {
        vid.muted = false;
        vid.controls = true;
        vid.play();
        btn.style.display = 'none';
      }
    });
  });

})();
