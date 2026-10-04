(() => {
  const themeButtons = [...document.querySelectorAll('[data-kit-theme]')];
  const preview = document.querySelector('#actions-preview');
  themeButtons.forEach((button) => button.addEventListener('click', () => {
    const light = button.dataset.kitTheme === 'light';
    preview.classList.toggle('light', light);
    themeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  }));

  const navLinks = [...document.querySelectorAll('.kit-nav a')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${active.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-10% 0px -55% 0px', threshold: [0, .25, .5] });
    sections.forEach((section) => observer.observe(section));
  }

  const demoButton = document.querySelector('#kit-demo-button');
  const demoStatus = document.querySelector('.kit-demo-status');
  demoButton?.addEventListener('click', () => {
    demoStatus.textContent = 'Это образец интерфейса. Данные никуда не отправлены.';
  });
})();
