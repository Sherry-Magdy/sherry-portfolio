  (function(){
    var el = document.getElementById('typeline');
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var full = "> init --profile sherry_magdy";
    if(prefersReduced){
      el.innerHTML = full + '<span class="cursor"></span>';
      return;
    }
    el.innerHTML = '<span class="cursor"></span>';
    var i = 0;
    function type(){
      if(i <= full.length){
        el.innerHTML = full.slice(0,i) + '<span class="cursor"></span>';
        i++;
        setTimeout(type, 28);
      }
    }
    type();
  })();

  // Rail active-state via IntersectionObserver
  (function(){
    var sections = document.querySelectorAll('main section');
    var nodes = document.querySelectorAll('.rail-node');
    if(!sections.length || !nodes.length) return;
    var map = {};
    nodes.forEach(function(n){ map[n.dataset.target] = n; });

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.id;
        if(entry.isIntersecting){
          nodes.forEach(function(n){ n.classList.remove('active'); });
          if(map[id]) map[id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function(s){ observer.observe(s); });
  })();

  // Scroll reveal motion
  (function(){
    var items = document.querySelectorAll('.reveal');
    if(!items.length) return;
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function(el){ revealObserver.observe(el); });
  })();

