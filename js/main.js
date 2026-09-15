// LZ Agência / Vinícius Liz — comportamentos do site (vanilla JS, sem dependências)
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

  /* Testimonial slider */
  var slider = document.querySelector('.slider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var dotsWrap = slider.querySelector('.slider-dots');
    var current = 0;
    var timer;

    slides.forEach(function(_, i){
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function(){ goTo(i); resetTimer(); });
      dotsWrap && dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

    function goTo(i){
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }
    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }
    function resetTimer(){
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }
    var btnNext = slider.parentElement.querySelector('[data-slider-next]');
    var btnPrev = slider.parentElement.querySelector('[data-slider-prev]');
    btnNext && btnNext.addEventListener('click', function(){ next(); resetTimer(); });
    btnPrev && btnPrev.addEventListener('click', function(){ prev(); resetTimer(); });
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
