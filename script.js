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

  // inquiry form. No backend on a static host: point FORM_ENDPOINT at a form
  // service (Formspree, Basin, Vercel serverless route). With it left empty the
  // form opens a pre-filled email instead, so it never silently drops a message.
  var FORM_ENDPOINT='https://formspree.io/f/xjgzyady';
  var form=document.getElementById('inquiry');
  var sent=document.getElementById('form-sent');
  function invalid(el,msg){
    var field=el.closest('.field');
    field.classList.add('invalid');
    field.querySelector('.err').textContent=msg;
  }
  function clearErrors(){
    form.querySelectorAll('.field.invalid').forEach(function(f){f.classList.remove('invalid')});
  }
  if(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      clearErrors();
      var name=form.querySelector('#f-name');
      var email=form.querySelector('#f-email');
      var details=form.querySelector('#f-details');
      var ok=true;
      if(!name.value.trim()){invalid(name,'Your name, so I know who I\u2019m replying to.');ok=false}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){invalid(email,'A working email address.');ok=false}
      if(!details.value.trim()){invalid(details,'A sentence or two about the project.');ok=false}
      if(!ok){form.querySelector('.field.invalid input, .field.invalid textarea').focus();return}

      var data={name:name.value.trim(),email:email.value.trim(),details:details.value.trim()};
      var done=function(){form.hidden=true;sent.hidden=false;form.reset()};

      if(FORM_ENDPOINT){
        var btn=form.querySelector('button[type="submit"]');
        btn.disabled=true;btn.textContent='Sending\u2026';
        fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)})
          .then(function(r){if(!r.ok)throw new Error('bad status');done()})
          .catch(function(){btn.disabled=false;btn.textContent='Send';invalid(details,'That didn\u2019t send. Email steven.wilen@gmail.com instead.')});
      }else{
        var body='Name: '+data.name+'\nEmail: '+data.email+'\n\n'+data.details;
        window.location.href='mailto:steven.wilen@gmail.com?subject='+encodeURIComponent('Guide project inquiry - '+data.name)+'&body='+encodeURIComponent(body);
        done();
      }
    });
  }
  var again=document.getElementById('form-again');
  if(again){again.addEventListener('click',function(){sent.hidden=true;form.hidden=false})}

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
