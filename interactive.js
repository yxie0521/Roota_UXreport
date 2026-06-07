/* ROOTA — interactive widgets + Tweaks panel */
(function(){
  'use strict';
  var $ = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return [].slice.call((r||document).querySelectorAll(s)); };

  /* =========================================================
     1. SCENARIO SIMULATOR
     ========================================================= */
  (function(){
    var sim = $('#sim'); if(!sim) return;
    var scenes = [
      { img:'screens/sim1.png', prompt:'You arrive at Riverside Park with your child. Families are gathered near the BBQ area — some setting up, others chatting. What do you do first?',
        choices:[
          {l:'Walk over and smile at the nearest family', f:'Warm and natural. A small smile is the easiest icebreaker — and people remember it.'},
          {l:'Find a quiet spot to watch for a while', f:'Totally fine. Reading the scene for a moment helps you feel grounded before joining in.'},
          {l:'Let your child lead you toward the other kids', f:'Lovely instinct. Children are wonderful bridges — the parents usually follow.'}]},
      { img:'screens/sim2.png', prompt:'Food is nearly ready. A parent you haven\u2019t met turns with a friendly smile and says, \u201cFirst time here?\u201d How do you respond?',
        choices:[
          {l:'Smile and say \u201cYes! Any tips for a newcomer?\u201d', f:'Perfect. A small question opens the door — most people love helping someone new.'},
          {l:'Nod and say \u201cYeah, just checking it out!\u201d', f:'Easygoing and honest. There\u2019s no pressure to say more than feels comfortable.'},
          {l:'Smile back and let your child say hello', f:'Sweet. Letting your child speak takes the pressure off — and keeps things relaxed.'}]},
      { img:'screens/sim3.png', prompt:'The host is serving from the grill and gestures to the spread on the picnic table: \u201cHelp yourself!\u201d How do you respond?',
        choices:[
          {l:'Thank them and ask what they recommend', f:'Great move. Asking for a recommendation is a friendly, low-stakes way to chat.'},
          {l:'Take a small portion and say thank you', f:'Just right. Accepting a little food is a warm way to say \u201cI\u2019m glad to be here.\u201d'},
          {l:'Politely say you\u2019ll eat a little later', f:'Completely okay. You set your own pace — being here is what counts.'}]},
      { img:'screens/sim4.png', prompt:'A few hours pass and your child is getting tired. Families are starting to pack up and say goodbye. What do you do?',
        choices:[
          {l:'Say a warm goodbye to the people you met', f:'A lovely close. A goodbye by name makes the next time feel familiar.'},
          {l:'Wave generally and head off quietly', f:'Perfectly fine. A friendly wave is enough — you showed up, and that matters.'},
          {l:'Ask if there\u2019ll be another BBQ soon', f:'Brilliant. Asking about next time turns one afternoon into a connection.'}]}
    ];
    var letters=['A','B','C'];
    var i=0;
    var img=$('#sim-img'), prog=$('#sim-progress'), prompt=$('#sim-prompt'),
        choicesEl=$('#sim-choices'), fb=$('#sim-feedback'), next=$('#sim-next'),
        body=$('#sim-body'), result=$('#sim-result'), restart=$('#sim-restart');

    scenes.forEach(function(_,n){ var s=document.createElement('span'); prog.appendChild(s); });
    var dots=$$('#sim-progress span');

    function showImg(src){
      img.style.opacity=0;
      var pre=new Image();
      pre.onload=function(){ img.src=src; img.style.opacity=1; };
      pre.src=src;
    }
    function render(){
      var sc=scenes[i];
      showImg(sc.img);
      dots.forEach(function(d,n){ d.classList.toggle('on', n<=i); });
      prompt.textContent=sc.prompt;
      choicesEl.innerHTML='';
      fb.classList.remove('show'); fb.textContent='';
      next.classList.remove('show');
      sc.choices.forEach(function(ch,n){
        var b=document.createElement('button');
        b.className='sim-choice';
        b.innerHTML='<span class="ck">'+letters[n]+'</span><span>'+ch.l+'</span>';
        b.addEventListener('click', function(){ pick(b, ch); });
        choicesEl.appendChild(b);
      });
    }
    function pick(btn, ch){
      $$('.sim-choice', choicesEl).forEach(function(b){ b.classList.add('dim'); });
      btn.classList.remove('dim'); btn.classList.add('picked');
      fb.textContent=ch.f; fb.classList.add('show');
      next.innerHTML=(i<scenes.length-1)
        ? 'Next scene<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
        : 'See your result<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      next.classList.add('show');
    }
    next.addEventListener('click', function(){
      if(i<scenes.length-1){ i++; render(); }
      else { body.style.display='none'; result.classList.add('show'); }
    });
    restart.addEventListener('click', function(){
      i=0; result.classList.remove('show'); body.style.display=''; render();
    });
    render();
  })();

  /* =========================================================
     2. KIDS STORYBOOK FLIPBOOK
     ========================================================= */
  (function(){
    var flip=$('#flip'); if(!flip) return;
    var pages=$$('.flip-stage img', flip);
    var prev=$('#flip-prev'), next=$('#flip-next'), dotsWrap=$('#flip-dots');
    var idx=0;
    pages.forEach(function(_,n){
      var d=document.createElement('span'); if(n===0) d.className='on';
      d.addEventListener('click', function(){ go(n); });
      dotsWrap.appendChild(d);
    });
    var dots=$$('#flip-dots span');
    function go(n){
      idx=Math.max(0, Math.min(pages.length-1, n));
      pages.forEach(function(p,k){ p.classList.toggle('show', k===idx); });
      dots.forEach(function(d,k){ d.classList.toggle('on', k===idx); });
      prev.disabled=(idx===0); next.disabled=(idx===pages.length-1);
    }
    prev.addEventListener('click', function(){ go(idx-1); });
    next.addEventListener('click', function(){ go(idx+1); });
    go(0);
  })();

  /* =========================================================
     3. LANGUAGE TOGGLE DEMO
     ========================================================= */
  (function(){
    var demo=$('#lang-demo'); if(!demo) return;
    var data={
      en:{ t:'Sunday BBQ Picnic @ Riverside Park', s:'A relaxed family afternoon by the river — no experience needed, just come along.',
           tags:[['green','No English needed'],['blue','Family welcome'],['yellow','Beginner friendly']] },
      zh:{ t:'\u5468\u65e5\u70e7\u70e4\u91ce\u9910 \u00b7 \u6cb3\u6ee8\u516c\u56ed', s:'\u6cb3\u8fb9\u8f7b\u677e\u7684\u5bb6\u5ead\u4e0b\u5348\u2014\u2014\u65e0\u9700\u4efb\u4f55\u7ecf\u9a8c\uff0c\u6765\u5c31\u597d\u3002',
           tags:[['green','\u65e0\u9700\u82f1\u8bed'],['blue','\u6b22\u8fce\u5168\u5bb6'],['yellow','\u65b0\u624b\u53cb\u597d']] },
      hi:{ t:'\u0930\u0935\u093f\u0935\u093e\u0930 \u092c\u0940\u092c\u0940\u0915\u094d\u092f\u0942 \u092a\u093f\u0915\u0928\u093f\u0915 @ \u0930\u093f\u0935\u0930\u0938\u093e\u0907\u0921 \u092a\u093e\u0930\u094d\u0915', s:'\u0928\u0926\u0940 \u0915\u093f\u0928\u093e\u0930\u0947 \u090f\u0915 \u0906\u0930\u093e\u092e\u0926\u093e\u092f\u0915 \u092a\u093e\u0930\u093f\u0935\u093e\u0930\u093f\u0915 \u0926\u094b\u092a\u0939\u0930 \u2014 \u0915\u093f\u0938\u0940 \u0905\u0928\u0941\u092d\u0935 \u0915\u0940 \u091c\u093c\u0930\u0942\u0930\u0924 \u0928\u0939\u0940\u0902\u0964',
           tags:[['green','\u0905\u0902\u0917\u094d\u0930\u0947\u091c\u093c\u0940 \u091c\u093c\u0930\u0942\u0930\u0940 \u0928\u0939\u0940\u0902'],['blue','\u092a\u0930\u093f\u0935\u093e\u0930 \u0938\u094d\u0935\u093e\u0917\u0924'],['yellow','\u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0905\u0928\u0941\u0915\u0942\u0932']] }
    };
    var title=$('#lc-title'), sub=$('#lc-sub'), tagsEl=$('#lc-tags'), card=$('#lang-card');
    function set(lang){
      var d=data[lang];
      title.textContent=d.t; sub.textContent=d.s;
      tagsEl.innerHTML='';
      d.tags.forEach(function(t){ var s=document.createElement('span'); s.className='pill '+t[0]; s.textContent=t[1]; tagsEl.appendChild(s); });
      card.classList.remove('lang-fade'); void card.offsetWidth; card.classList.add('lang-fade');
    }
    $$('#lang-switch button').forEach(function(b){
      b.addEventListener('click', function(){
        $$('#lang-switch button').forEach(function(x){ x.classList.remove('on'); });
        b.classList.add('on'); set(b.getAttribute('data-lang'));
      });
    });
    set('en');
  })();

  /* =========================================================
     4. LIGHTBOX (zoom any screenshot)
     ========================================================= */
  (function(){
    var lb=$('#lightbox'), lbImg=$('#lb-img'), close=$('#lb-close');
    if(!lb) return;
    document.addEventListener('click', function(e){
      var t=e.target;
      if(t.tagName==='IMG' && t.classList.contains('zoomable')){
        lbImg.src=t.src; lbImg.alt=t.alt||''; lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
      } else if(t===lb || t===close || (close && close.contains(t))){
        lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
      }
    });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); } });
  })();

  /* mark report imagery zoomable */
  $$('.shot img, .gallery .g img, .wcard img, .phone img').forEach(function(im){ im.classList.add('zoomable'); });

  /* =========================================================
     5. TWEAKS PANEL  (host protocol)
     ========================================================= */
  (function(){
    var panel=$('#tweaks-panel'); if(!panel) return;
    var defaults={ accent:'#E0A23C', font:'Newsreader', paper:'warm', animations:true };
    var state=Object.assign({}, defaults, window.ROOTA_TWEAKS||{});
    var root=document.documentElement;

    var ACCENTS=[
      {key:'#E0A23C', deep:'#B97F23', wash:'#F7E9CC'},
      {key:'#D9694C', deep:'#B14A30', wash:'#F6DACF'},
      {key:'#2E73B8', deep:'#205A91', wash:'#D7E5F4'},
      {key:'#2E8B57', deep:'#216B41', wash:'#D5E9DC'}
    ];
    var PAPERS={
      warm:  {paper:'#FAF5EC', deep:'#F1E7D6'},
      cool:  {paper:'#F3F5F4', deep:'#E6EAE8'},
      bright:{paper:'#FFFFFF', deep:'#F4F2EC'}
    };

    function applyAccent(v){
      var a=ACCENTS.filter(function(x){return x.key===v;})[0]||ACCENTS[0];
      root.style.setProperty('--amber', a.key);
      root.style.setProperty('--amber-deep', a.deep);
      root.style.setProperty('--amber-wash', a.wash);
    }
    function applyFont(v){ root.style.setProperty('--serif', v + ', Georgia, serif'); }
    function applyPaper(v){
      var p=PAPERS[v]||PAPERS.warm;
      root.style.setProperty('--paper', p.paper);
      root.style.setProperty('--paper-deep', p.deep);
    }
    function applyAnim(on){ document.body.classList.toggle('no-anim', !on); }
    function applyAll(){ applyAccent(state.accent); applyFont(state.font); applyPaper(state.paper); applyAnim(state.animations); }

    /* build accent swatches */
    var accWrap=$('#tw-accent');
    ACCENTS.forEach(function(a){
      var s=document.createElement('button'); s.className='tw-swatch'; s.style.background=a.key; s.setAttribute('aria-label','accent');
      if(a.key===state.accent) s.classList.add('on');
      s.addEventListener('click', function(){
        $$('.tw-swatch', accWrap).forEach(function(x){x.classList.remove('on');}); s.classList.add('on');
        state.accent=a.key; applyAccent(a.key); save({accent:a.key});
      });
      accWrap.appendChild(s);
    });
    /* font seg */
    $$('#tw-font button').forEach(function(b){
      if(b.getAttribute('data-font')===state.font || (state.font==="'Source Serif 4'"&&b.getAttribute('data-font')==="'Source Serif 4'")) b.classList.add('on');
      b.addEventListener('click', function(){
        $$('#tw-font button').forEach(function(x){x.classList.remove('on');}); b.classList.add('on');
        var v=b.getAttribute('data-font'); state.font=v; applyFont(v); save({font:v});
      });
    });
    /* paper seg */
    $$('#tw-paper button').forEach(function(b){
      if(b.getAttribute('data-paper')===state.paper) b.classList.add('on');
      b.addEventListener('click', function(){
        $$('#tw-paper button').forEach(function(x){x.classList.remove('on');}); b.classList.add('on');
        var v=b.getAttribute('data-paper'); state.paper=v; applyPaper(v); save({paper:v});
      });
    });
    /* anim toggle */
    var animSw=$('#tw-anim');
    function reflectAnim(){ animSw.classList.toggle('on', state.animations); animSw.setAttribute('aria-checked', state.animations?'true':'false'); }
    animSw.addEventListener('click', function(){ state.animations=!state.animations; reflectAnim(); applyAnim(state.animations); save({animations:state.animations}); });

    /* sync default-selected seg buttons that weren't pre-marked */
    if(!$('#tw-font button.on')) { var f0=$('#tw-font button'); if(f0) f0.classList.add('on'); }
    if(!$('#tw-paper button.on')){ var p0=$('#tw-paper button[data-paper="warm"]'); if(p0) p0.classList.add('on'); }
    reflectAnim();
    applyAll();

    function save(edits){
      Object.assign(window.ROOTA_TWEAKS, edits);
      try{ window.parent.postMessage({type:'__edit_mode_set_keys', edits:edits}, '*'); }catch(e){}
    }

    /* host protocol — register listener BEFORE announcing */
    window.addEventListener('message', function(e){
      var d=e.data||{};
      if(d.type==='__activate_edit_mode'){ panel.classList.add('show'); }
      else if(d.type==='__deactivate_edit_mode'){ panel.classList.remove('show'); }
    });
    $('#tw-close').addEventListener('click', function(){
      panel.classList.remove('show');
      try{ window.parent.postMessage({type:'__edit_mode_dismissed'}, '*'); }catch(e){}
    });
    try{ window.parent.postMessage({type:'__edit_mode_available'}, '*'); }catch(e){}
  })();

})();
