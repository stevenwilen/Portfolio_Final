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
  var SLUGS=['268-harpers-mill-drive'];
  var i=0,timer=null;
  function type(){
    var target=SLUGS[i],n=0;
    (function step(){
      n++;slugEl.textContent=target.slice(0,n);
      if(n<target.length){timer=setTimeout(step,46)}
      else{timer=setTimeout(function(){
        i=(i+1)%SLUGS.length;
        slugEl.textContent='';type();
      },2600)}
    })();
  }
  if(slugEl&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    timer=setTimeout(type,420);
  }else if(slugEl){slugEl.textContent=SLUGS[0]}

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
     meta:'Open house · Settlers Landing, Ponte Vedra',
     url:'https://open-house-example.vercel.app/',
     frames:[
       {src:'guide-openhouse-home.webp',alt:'The guide’s opening screen: 268 Harper’s Mill Drive over a photo of the home, the sold price below it, and the agent’s call band along the bottom.'},
       {src:'guide-openhouse-photo.webp',alt:'The same guide further down: an aerial shot of the corner lot above 4,252 square feet at $423 per square foot.'}
     ],
     inGuide:['The line','Gallery','The figures','The house','The area'],
     result:'The paper flyer buyers leave in the car.'},
    {title:'After your cataract surgery',
     meta:'Aftercare · Riverside Eye Centre, Bristol',
     url:'https://aftercare-example.vercel.app/',
     frames:[
       {src:'guide-aftercare-home.webp',alt:'The guide’s opening screen: After your cataract surgery, marked right eye, over the red list of reasons to call the clinic.'},
       {src:'guide-aftercare-meds.webp',alt:'The medications screen: each drop, what it is for, how many times a day and for how long, with a four-times-a-day pattern spelled out.'}
     ],
     inGuide:['Call us if','The first 24 hours','Do, and do not','Every drop, and when','Next appointment'],
     result:'The discharge sheet that gets folded into a bag.'},
    {title:'Laurel Fork Cabin',
     meta:'Guest check-in · Gatlinburg, Tennessee',
     url:'https://cabin-example.vercel.app/',
     frames:[
       {src:'guide-checkin-home.webp',alt:'The guide’s opening screen: the cabin’s fireplace over the address, the check-in time and the door code.'},
       {src:'guide-checkin-codes.webp',alt:'The front door keypad above the Wi-Fi network and password, then how the heat and hot water work.'}
     ],
     inGuide:['Door and gate codes','Wi-Fi, heat, hot water','Hot tub, fire pit, grill','Nearby, with drive times','Check-out at 10am'],
     result:'The binder on the kitchen counter nobody opens.'},
    {title:'Woodstock Boulevard',
     meta:'Handover · Northbridge Energy, Portland',
     url:'https://handover-example.vercel.app/',
     frames:[
       {src:'guide-handover-home.webp',alt:'The guide’s opening screen: the finished solar array over Woodstock Boulevard and the installer’s name.'},
       {src:'guide-handover-warranty.webp',alt:'The warranty screen: every unit installed with the date its cover expires, out to 2051 for the modules.'}
     ],
     inGuide:['What was installed','Equipment, model by model','Cover and expiry','What to do, and when','Trades and suppliers'],
     result:'The folder of manuals and warranty cards.'}
  ];
  var tabs=Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var listEl=document.getElementById('in-guide');
  var resultEl=document.getElementById('result');
  var frameEls=[document.getElementById('work-img-a'),document.getElementById('work-img-b')];
  var titleEl=document.getElementById('ex-title');
  var metaEl=document.getElementById('ex-meta');
  var linkEls=[document.getElementById('ex-link'),document.getElementById('work-visual')];
  function show(n){
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',String(k===n));t.tabIndex=k===n?0:-1});
    var e=EXAMPLES[n];
    listEl.innerHTML=e.inGuide.map(function(s){return '<li>'+s+'</li>'}).join('');
    frameEls.forEach(function(img,k){
      var f=e.frames[k];
      if(img&&f){img.src='images/'+f.src;img.alt=f.alt}
    });
    resultEl.textContent=e.result;
    if(titleEl){titleEl.textContent=e.title}
    if(metaEl){metaEl.textContent=e.meta}
    linkEls.forEach(function(a){if(a){a.href=e.url}});
    if(linkEls[1]){linkEls[1].setAttribute('aria-label','Open the '+e.title+' guide')}
  }
  tabs.forEach(function(t,n){t.addEventListener('click',function(){show(n)})});
  if(tabs.length){show(0)}
});
