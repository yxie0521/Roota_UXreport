/* ROOTA thesis report — interactions */
(function(){
  'use strict';

  /* ---- scroll progress + nav state ---- */
  var progress = document.getElementById('progress');
  var nav = document.querySelector('.nav');
  function onScroll(){
    var st = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h>0 ? (st/h*100) : 0) + '%';
    if(nav){ nav.classList.toggle('scrolled', st > 8); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  if(toggle){
    toggle.addEventListener('click', function(){ nav.classList.toggle('open'); });
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
  }

  /* ---- reveal on scroll ---- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    revealEls.forEach(function(el){ ro.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- animated bars + count-up + matrix dots (fire when section visible) ---- */
  function animateBars(scope){
    scope.querySelectorAll('.bar-fill').forEach(function(b){
      var v = b.getAttribute('data-w');
      requestAnimationFrame(function(){ b.style.width = v + '%'; });
    });
  }
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var dur = 1300, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.firstChild.nodeValue = Math.round(eased*target).toString();
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function fireOnce(selector, fn){
    var el = document.querySelector(selector);
    if(!el) return;
    if(!('IntersectionObserver' in window)){ fn(el); return; }
    var o = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ fn(e.target); o.disconnect(); } });
    }, {threshold:0.3});
    o.observe(el);
  }

  // count-up numbers
  document.querySelectorAll('[data-count]').forEach(function(el){
    if(!('IntersectionObserver' in window)){ el.firstChild.nodeValue = el.getAttribute('data-count'); return; }
    var o = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); o.disconnect(); } });
    }, {threshold:0.6});
    o.observe(el);
  });

  // bars
  document.querySelectorAll('[data-bars]').forEach(function(scope){
    var o = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ animateBars(e.target); o.disconnect(); } });
    }, {threshold:0.3});
    if('IntersectionObserver' in window){ o.observe(scope); } else { animateBars(scope); }
  });

  // matrix dots staggered
  fireOnce('.matrix-field', function(field){
    var dots = [].slice.call(field.querySelectorAll('.dot'));
    dots.forEach(function(d,i){ setTimeout(function(){ d.classList.add('in'); }, 120 + i*110); });
  });

  /* ---- scrollspy for nav ---- */
  var sections = [].slice.call(document.querySelectorAll('section[id]'));
  var navAnchors = {};
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var id = a.getAttribute('href');
    if(id && id.charAt(0)==='#') navAnchors[id.slice(1)] = a;
  });
  if('IntersectionObserver' in window && sections.length){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var id = e.target.id;
          Object.keys(navAnchors).forEach(function(k){ navAnchors[k].classList.toggle('active', k===id); });
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
    sections.forEach(function(s){ spy.observe(s); });
  }

})();
