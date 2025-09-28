
(function(){
  var saved = localStorage.getItem('theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(saved === 'dark' || (!saved && prefersDark)) document.body.classList.add('dark');
  function setActiveLink(){
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a').forEach(function(a){
      if(a.getAttribute('href') === path) a.classList.add('active');
    });
  }
  function isLocalLink(a){
    if(!a || !a.href) return false;
    var url = new URL(a.href, location.href);
    return url.origin === location.origin;
  }
  function navigate(url){
    if (document.startViewTransition){
      document.startViewTransition(function(){ window.location.href = url; });
    }else{
      document.body.classList.add('page-leave');
      document.body.addEventListener('animationend', function(){ window.location.href = url; }, { once:true });
    }
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(!a) return;
    if(!isLocalLink(a)) return;
    if(a.hasAttribute('download') || a.getAttribute('target') === '_blank' || a.getAttribute('rel') === 'external' || a.href.startsWith('mailto:')) return;
    e.preventDefault();
    navigate(a.getAttribute('href'));
  });
  document.addEventListener('DOMContentLoaded', function(){
    setActiveLink();
    var btn = document.getElementById('themeToggle');
    if(btn){
      btn.addEventListener('click', function(){
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        btn.textContent = document.body.classList.contains('dark') ? '☀︎' : '☾';
      });
      btn.textContent = document.body.classList.contains('dark') ? '☀︎' : '☾';
    }
    var counters = document.querySelectorAll('[data-count]');
    if(!counters.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          var end = parseInt(el.dataset.count,10);
          var cur = 0;
          var step = Math.max(1, Math.round(end/80));
          var t = setInterval(function(){
            cur += step;
            if(cur >= end){ cur = end; clearInterval(t); }
            el.textContent = cur.toLocaleString();
          }, 12);
          io.unobserve(el);
        }
      });
    },{threshold:.3});
    counters.forEach(function(el){ io.observe(el); });
  });
})();
