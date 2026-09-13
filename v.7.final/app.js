const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const updateHeaderHeight = () => document.documentElement.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
new ResizeObserver(updateHeaderHeight).observe(header);
updateHeaderHeight();
toggle.addEventListener('click',()=>{menu.showModal();document.body.classList.add('menu-open');toggle.setAttribute('aria-expanded','true')});
function closeMenu(){menu.close();document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')}
document.querySelector('.menu-close').addEventListener('click',closeMenu);
menu.addEventListener('close',()=>{document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
function wireTabs(selector,onSelect){const tabs=[...document.querySelectorAll(selector)];function select(tab){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;onSelect(t,selected)})}tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));t.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(tabs[n]);tabs[n].focus()}})});if(tabs.length)select(tabs[0])}
wireTabs('.practice-tabs [role=tab]',(tab,selected)=>{document.getElementById(tab.getAttribute('aria-controls')).classList.toggle('selected',selected)});
document.querySelectorAll('.inquiry-form').forEach(form => {
  const phone = form.elements.phone;
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      phone.setCustomValidity('Укажите телефон: от 10 до 15 цифр.');
      phone.reportValidity();
      return;
    }
    phone.setCustomValidity('');
    status.textContent = 'Это прототип: обращение не отправлено. Для связи позвоните по номеру 8 (925) 502-40-09.';
  });
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  form.addEventListener('input', () => { status.textContent = ''; });
});

document.querySelectorAll('a[href="#consultation"]').forEach(link => {
  link.addEventListener('click', () => {
    // Wait for the native anchor jump and mobile dialog to close before focusing.
    requestAnimationFrame(() => document.querySelector('#contact-name').focus({preventScroll: true}));
  });
});
