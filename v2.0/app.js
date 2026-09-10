const header=document.querySelector('#header');
function updateHeader(){header.classList.toggle('scrolled',scrollY>32)}
addEventListener('scroll',updateHeader,{passive:true});
addEventListener('pageshow',updateHeader);
updateHeader();
const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('.menu-toggle');
toggle.addEventListener('click',()=>{menu.showModal();document.body.classList.add('menu-open');toggle.setAttribute('aria-expanded','true')});
function closeMenu(){menu.close();document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')}
document.querySelector('.menu-close').addEventListener('click',closeMenu);
menu.addEventListener('close',()=>{document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const practiceTabs=[...document.querySelectorAll('.practice-tabs button')];
function selectPractice(button){practiceTabs.forEach(t=>{const selected=t===button;t.classList.toggle('active',selected);t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).classList.toggle('selected',selected)})}
practiceTabs.forEach((t,i)=>{t.addEventListener('click',()=>selectPractice(t));t.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=practiceTabs[e.key==='Home'?0:e.key==='End'?1:(i+1)%2];selectPractice(next);next.focus()}})});
selectPractice(practiceTabs[0]);
const form=document.querySelector('#contact-form');
form.addEventListener('submit',event=>{event.preventDefault();const phone=form.elements.phone;const digits=phone.value.replace(/\D/g,'');if(digits.length<10||digits.length>15){phone.setCustomValidity('Укажите телефон: от 10 до 15 цифр.');phone.reportValidity();return}phone.setCustomValidity('');document.querySelector('#form-status').textContent='Форма заполнена. Это прототип: обращение не отправлено. Для связи позвоните по номеру 8 (925) 502-40-09.'});
form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
