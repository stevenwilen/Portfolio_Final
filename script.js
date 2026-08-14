// Steven Wilen · Web Guides
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('year').textContent=new Date().getFullYear();

  // sticky header hairline
  var header=document.querySelector('.site-header');
  var onScroll=function(){header.classList.toggle('past',window.scrollY>120)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // reveal on scroll
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.2});
  document.querySelectorAll('[data-reveal]').forEach(function(el){io.observe(el)});

  // hero: the link types itself, the phone screen follows
  var slugEl=document.getElementById('slug');
  var slots=Array.prototype.slice.call(document.querySelectorAll('.phone-screen .slot'));
  var SLUGS=['guide-name-one','guide-name-two','guide-name-three'];
  var i=0,timer=null;
  function type(){
    var target=SLUGS[i],n=0;
    (function step(){
      n++;slugEl.textContent=target.slice(0,n);
      if(n<target.length){timer=setTimeout(step,46)}
      else{timer=setTimeout(function(){
        i=(i+1)%SLUGS.length;
        slots.forEach(function(s,k){s.classList.toggle('on',k===i)});
        slugEl.textContent='';type();
      },2600)}
    })();
  }
  if(slugEl&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    slots.forEach(function(s,k){s.classList.toggle('on',k===0)});
    timer=setTimeout(type,420);
  }else if(slugEl){slugEl.textContent=SLUGS[0];slots[0]&&slots[0].classList.add('on')}

  // examples: tab switcher
  var EXAMPLES=[
    {inGuide:['Section one','Section two','Section three','Section four','Section five'],
     result:'One line on what changed for the client once the guide was live.'},
    {inGuide:['Section one','Section two','Section three','Section four','Section five'],
     result:'One line on what changed for the client once the guide was live.'},
    {inGuide:['Section one','Section two','Section three','Section four','Section five'],
     result:'One line on what changed for the client once the guide was live.'},
    {inGuide:['Section one','Section two','Section three','Section four','Section five'],
     result:'One line on what changed for the client once the guide was live.'}
  ];
  var tabs=Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var listEl=document.getElementById('in-guide');
  var resultEl=document.getElementById('result');
  function show(n){
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',String(k===n));t.tabIndex=k===n?0:-1});
    var e=EXAMPLES[n];
    listEl.innerHTML=e.inGuide.map(function(s){return '<li>'+s+'</li>'}).join('');
    resultEl.textContent=e.result;
  }
  tabs.forEach(function(t,n){t.addEventListener('click',function(){show(n)})});
  if(tabs.length){show(0)}
});
