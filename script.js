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

  // hero: the phone cycles the front page of all four guides and the link
  // types itself to match. One timeline runs both, so the url in the pill
  // always names the guide on screen. The frames after the first carry their
  // image in data-src and are only fetched once the cycle is under way, so
  // the hero still paints on one image.
  var HERO=[
    {slug:'268-harpers-mill-drive'},
    {slug:'673-park-lake-drive'},
    {slug:'209-gull-circle'},
    {slug:'118-vista-lake-circle'}
  ];
  var HERO_HOLD=5200;   // per guide, typing included
  var TYPE_MS=46;       // per character
  var slugEl=document.getElementById('slug');
  var frames=Array.prototype.slice.call(document.querySelectorAll('.phone-screen .frame'));
  var typeTimer=null,cycleTimer=null;

  function typeSlug(text){
    clearTimeout(typeTimer);
    var n=0;
    slugEl.textContent='';
    (function step(){
      n++;
      slugEl.textContent=text.slice(0,n);
      if(n<text.length){typeTimer=setTimeout(step,TYPE_MS)}
    })();
  }
  function loadRest(){
    frames.forEach(function(f){
      var img=f.querySelector('img[data-src]');
      if(img){img.src=img.getAttribute('data-src');img.removeAttribute('data-src')}
    });
  }
  function cycle(n){
    frames.forEach(function(f,k){f.classList.toggle('on',k===n)});
    if(slugEl){typeSlug(HERO[n].slug)}
    cycleTimer=setTimeout(function(){cycle((n+1)%HERO.length)},HERO_HOLD);
  }
  if(slugEl&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    // The first frame is already on screen and already loaded; give it the
    // page's first moments to itself before pulling the other three.
    setTimeout(loadRest,900);
    cycleTimer=setTimeout(function(){cycle(0)},420);
  }else if(slugEl){slugEl.textContent=HERO[0].slug}

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
      var done=function(){form.hidden=true;sent.hidden=false;form.reset();grow()};

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
  // Textarea grows with its content, so there is no resize grabber to drag.
  var ta=document.getElementById('f-details');
  function grow(){if(!ta)return;ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,420)+'px'}
  if(ta){ta.addEventListener('input',grow);grow()}

  var again=document.getElementById('form-again');
  if(again){again.addEventListener('click',function(){sent.hidden=true;form.hidden=false;grow()})}

  // examples: tab switcher. Every one of these is a guide that is actually
  // live, and every visual is a screenshot of it rather than a mockup, so the
  // url below is both what the tab links to and where the image came from.
  var EXAMPLES=[
    {title:'268 Harper’s Mill Drive',
     meta:'Settlers Landing, Nocatee · Sold $1,800,000',
     facts:'5 beds · 5.5 baths · 4,252 sq ft',
     url:'https://268-harpers-mill.vercel.app/',
     frames:[
       {src:'guide-harpersmill-home.webp',alt:'The guide’s opening screen: the address at the top of a photo of the home, the listing agent’s portrait on it, and the sold price with beds, baths and square feet below.'},
       {src:'guide-harpersmill-pool.webp',alt:'Further down the same guide: the screened pool and spa across the full width of the screen, captioned, with the outdoor kitchen starting below it.'}
     ]},
    {title:'673 Park Lake Drive',
     meta:'Lakeside at Town Center, Nocatee · $769,000',
     facts:'4 beds · 3.5 baths · 2,919 sq ft',
     url:'https://673-park-lake-drive.vercel.app/',
     frames:[
       {src:'guide-parklake-home.webp',alt:'The guide’s opening screen: 673 Park Lake Drive over a photo of the house, the price and the beds, baths and square feet under it, with the listing agent’s photo in the corner.'},
       {src:'guide-parklake-figures.webp',alt:'Further down the same guide: the lake across the street, then the figures — 2,919 square feet at $263, the list price and the days on market.'}
     ]},
    {title:'209 Gull Circle',
     meta:'Ponte Vedra Beach · $1,299,000',
     facts:'5 beds · 4 baths · 3,495 sq ft',
     url:'https://209-gull-cir.vercel.app/',
     frames:[
       {src:'guide-gullcir-home.webp',alt:'The guide’s opening screen: 209 Gull Circle, a beach house photographed at sunset, with the price, the beds, the baths and the square feet under it.'},
       {src:'guide-gullcir-pool.webp',alt:'Further down the same guide: the pool at the ground floor, captioned, above an aerial of the street at dusk with the Atlantic beyond it.'}
     ]},
    {title:'118 Vista Lake Circle',
     meta:'Liberty Cove at Crosswater, Nocatee · $599,999',
     facts:'4 beds · 3 baths · 2,187 sq ft',
     url:'https://118-vista-lake-circle.vercel.app/',
     frames:[
       {src:'guide-vistalake-home.webp',alt:'The guide’s opening screen: 118 Vista Lake Circle over a photo of the house, the price and the beds, baths and square feet under it.'},
       {src:'guide-vistalake-kitchen.webp',alt:'Further down the same guide: the kitchen island under pendant lights, captioned, above the dining room.'}
     ]}
  ];
  var tabs=Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var titleEl=document.getElementById('ex-title');
  var metaEl=document.getElementById('ex-meta');
  var factsEl=document.getElementById('ex-facts');
  var linkEls=[document.getElementById('ex-link'),document.getElementById('work-visual')];
  var frameEls=[document.getElementById('work-img-a'),document.getElementById('work-img-b')];
  function show(n){
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',String(k===n));t.tabIndex=k===n?0:-1});
    var e=EXAMPLES[n];
    frameEls.forEach(function(img,k){
      var f=e.frames[k];
      if(img&&f){img.src='images/'+f.src;img.alt=f.alt}
    });
    if(titleEl){titleEl.textContent=e.title}
    if(metaEl){metaEl.textContent=e.meta}
    if(factsEl){factsEl.textContent=e.facts}
    linkEls.forEach(function(a){if(a){a.href=e.url}});
    if(linkEls[1]){linkEls[1].setAttribute('aria-label','Open the '+e.title+' guide')}
  }
  tabs.forEach(function(t,n){t.addEventListener('click',function(){show(n)})});
  if(tabs.length){show(0)}
});
