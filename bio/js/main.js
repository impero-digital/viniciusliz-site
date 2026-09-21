(function () {
  // Wire up links from links.js config
  var map = {
    'card-analise': 'LINK_ANALISE_INSTAGRAM',
    'card-metodo': 'LINK_METODO_IMPERO',
    'card-assessoria': 'LINK_ASSESSORIA',
    'link-portfolio': 'LINK_PORTFOLIO',
    'link-comunidade': 'LINK_COMUNIDADE',
    'link-whatsapp': 'LINK_WHATSAPP',
    'link-instagram': 'LINK_INSTAGRAM',
    'link-youtube': 'LINK_YOUTUBE',
  };

  if (typeof BIO_LINKS !== 'undefined') {
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      var url = BIO_LINKS[map[id]];
      if (el && url) {
        el.setAttribute('href', url);
        if (url === '#') {
          el.removeAttribute('target');
        }
      }
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add('in');
    });
  }
})();
