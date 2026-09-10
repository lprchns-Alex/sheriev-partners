(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 901px) and (min-height: 651px)');
  const hero = document.querySelector('.hero');
  const portrait = document.querySelector('.hero-portrait');
  const title = hero.querySelector('h1');
  const cards = [...document.querySelectorAll('.case-panel')];
  const nav = [...document.querySelectorAll('.case-tabs a')];
  const progress = document.querySelector('.deck-progress>span');
  const statement = document.querySelector('.statement');
  const statementHeading = statement.querySelector('h2');
  const animations = [];
  const ease = 'cubic-bezier(.2,.7,.2,1)';
  const clamp = n => Math.min(1, Math.max(0, n));
  const play = (el, frames, options) => {
    if (reduced.matches) return;
    animations.push(el.animate(frames, {duration:700,easing:ease,fill:'backwards',...options}));
  };

  if (hero.getBoundingClientRect().bottom > 0) {
    [...hero.querySelectorAll('.hero-kicker,h1,.hero-subtitle,.hero-description,.hero-actions')].forEach((el,i) => {
      play(el,[{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:i*85});
    });
    play(portrait,[{opacity:0,transform:'translateY(55px) rotate(4deg)'},{opacity:1,transform:'translateY(0) rotate(0deg)'}],{duration:1150,delay:150});
  }

  statementHeading.setAttribute('aria-label', statementHeading.innerText.replace(/\s+/g,' ').trim());
  const walker = document.createTreeWalker(statementHeading, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while(walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part => {
      if(!part) return;
      if(/^\s+$/.test(part)) fragment.append(document.createTextNode(part));
      else {const word=document.createElement('span');word.className='statement-word';word.setAttribute('aria-hidden','true');word.textContent=part;fragment.append(word);}
    });
    node.replaceWith(fragment);
  });
  const words = [...statementHeading.querySelectorAll('.statement-word')];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el=entry.target;
      const isPortrait=el.classList.contains('person-photo');
      const i=isPortrait?[...document.querySelectorAll('.person-photo')].indexOf(el):0;
      const tilt=isPortrait&&wide.matches?(i%2?-3:3):0;
      play(el,[{opacity:0,transform:`translateY(${isPortrait?65:35}px) rotate(${tilt}deg)`},{opacity:1,transform:'translateY(0) rotate(0deg)'}],{duration:isPortrait?1000:750,delay:isPortrait?i*65:0});
      observer.unobserve(el);
    });
  },{threshold:.12});
  document.querySelectorAll('.section-top,.split-heading,.credential-copy,.contact-intro,.person-photo,.publication-list>a').forEach(el=>observer.observe(el));

  let queued=false;
  function update() {
    queued=false;
    const height=innerHeight;
    const animated=!reduced.matches;
    const desktop=wide.matches;
    const heroP=clamp(Math.max(0,-hero.getBoundingClientRect().top)/hero.offsetHeight);
    portrait.style.transform=animated&&desktop?`translateY(${heroP*58}px) rotate(${heroP*-4}deg)`:'';
    title.style.transform=animated&&desktop?`translateY(${heroP*-25}px)`:'';

    const rects=cards.map(card=>card.getBoundingClientRect());
    let active=0;
    rects.forEach((r,i)=>{if(r.top<=height*.53) active=i;});
    cards.forEach((card,i)=>{
      const next=rects[i+1];
      const p=next?clamp((height-next.top)/(height-88)):0;
      card.style.transform=animated&&desktop?`translateY(${-p*16}px) scale(${1-p*.045})`:'';
    });
    nav.forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
    if(progress) progress.style.transform=`scaleX(${(active+1)/Math.max(1,cards.length)})`;

    const reveal=clamp((height*.9-statementHeading.getBoundingClientRect().top)/(height*.52));
    words.forEach((word,i)=>{word.style.opacity=animated?String(.22+.78*clamp(reveal*words.length-i)):'';});
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  reduced.addEventListener('change',()=>{animations.forEach(animation=>animation.cancel());schedule();});
  wide.addEventListener('change',schedule);

  function layoutTop(element){let top=0;for(let el=element;el;el=el.offsetParent)top+=el.offsetTop;return top;}
  nav.forEach(a=>a.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
    event.preventDefault();
    const target=document.querySelector(a.getAttribute('href'));
    history.replaceState(null,'',a.getAttribute('href'));
    scrollTo({top:layoutTop(target)-(wide.matches?100:24),behavior:reduced.matches?'instant':'smooth'});
  }));
  schedule();
})();
