(() => {
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const one = (selector) => document.querySelector(selector);
  const normalize = (text) => text.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();
  const pressed = (buttons, current) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === current)));

  const themeButtons = all('[data-kit-theme]');
  themeButtons.forEach((button) => button.addEventListener('click', () => {
    one('#actions-preview').classList.toggle('light', button.dataset.kitTheme === 'light');
    pressed(themeButtons, button);
  }));

  const navLinks = all('.kit-nav a');
  const sections = navLinks.map((link) => one(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      navLinks.forEach((link) => {
        if (link.hash === `#${active.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-10% 0px -55% 0px', threshold: [0, .25, .5] });
    sections.forEach((section) => observer.observe(section));
  }
  one('#kit-search').addEventListener('input', (event) => {
    const query = normalize(event.target.value);
    sections.forEach((section) => { section.hidden = !normalize(section.dataset.storyTitle + ' ' + section.textContent).includes(query); });
    navLinks.forEach((link) => { link.hidden = one(link.hash).hidden; });
    const count = sections.filter((section) => !section.hidden).length;
    one('#kit-search-status').textContent = query ? (count ? `Разделов найдено: ${count}` : 'Ничего не найдено. Измените запрос.') : '';
  });

  const demo = () => { one('.kit-demo-status').textContent = 'Это образец интерфейса. Данные никуда не отправлены.'; };
  one('#kit-demo-button').addEventListener('click', demo);
  one('#kit-demo-form').addEventListener('submit', (event) => { event.preventDefault(); demo(); });
  const formStates = {
    idle: 'Форма готова к заполнению.',
    invalid: 'Проверьте телефон и отметьте согласие на обработку данных.',
    sending: 'Отправляем обращение…',
    success: 'Обращение получено. Мы свяжемся с вами по указанному телефону.',
    failure: 'Не удалось отправить обращение. Попробуйте ещё раз или позвоните нам.'
  };
  const stateButtons = all('[data-form-state]');
  stateButtons.forEach((button) => button.addEventListener('click', () => {
    pressed(stateButtons, button);
    const state = button.dataset.formState;
    one('#kit-form-state').textContent = formStates[state];
    one('#kit-form-state').dataset.state = state;
  }));

  let category = 'all';
  let limit = 2;
  const filterButtons = all('[data-kit-filter]');
  const items = all('[data-kit-category]');
  const updateList = () => {
    const query = normalize(one('#kit-list-search').value);
    const matches = items.filter((item) => (category === 'all' || item.dataset.kitCategory === category) && normalize(item.textContent).includes(query));
    items.forEach((item) => { item.hidden = !matches.slice(0, limit).includes(item); });
    one('#kit-list-count').textContent = `Показано ${Math.min(limit, matches.length)} из ${matches.length}`;
    one('#kit-list-empty').hidden = matches.length > 0;
    one('#kit-list-more').hidden = matches.length <= limit;
  };
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.kitFilter; limit = 2; pressed(filterButtons, button); updateList();
  }));
  one('#kit-list-search').addEventListener('input', () => { limit = 2; updateList(); });
  one('#kit-list-more').addEventListener('click', () => { limit += 2; updateList(); });
  one('#kit-list-reset').addEventListener('click', () => {
    category = 'all'; limit = 2; one('#kit-list-search').value = ''; pressed(filterButtons, filterButtons[0]); updateList(); one('#kit-list-search').focus();
  });
  updateList();

  const frame = one('#kit-site-frame');
  const pageSelect = one('#kit-page-select');
  const widthSelect = one('#kit-width-select');
  const screenStatus = one('#kit-screen-status');
  const sceneButtons = all('[data-scene]');
  let frameReady = false;
  const resizeFrame = () => { frame.style.width = widthSelect.value === 'auto' ? '100%' : `${widthSelect.value}px`; };
  widthSelect.addEventListener('change', () => { resizeFrame(); screenStatus.textContent = `Ширина: ${widthSelect.selectedOptions[0].textContent}.`; });
  pageSelect.addEventListener('change', () => {
    frameReady = false; frame.src = pageSelect.value; one('#kit-open-page').href = pageSelect.value;
    frame.title = `Просмотр: ${pageSelect.selectedOptions[0].textContent}`;
    screenStatus.textContent = 'Загружаем страницу…'; pressed(sceneButtons, null);
  });
  frame.addEventListener('load', () => {
    try {
      const current = frame.contentWindow.location;
      const match = [...pageSelect.options].find((option) => new URL(option.value, location.href).pathname === current.pathname);
      if (match) { pageSelect.value = match.value; one('#kit-open-page').href = current.href; }
      frameReady = true;
      screenStatus.textContent = `Открыто: ${pageSelect.selectedOptions[0].textContent}.`;
    } catch {
      frameReady = false;
      screenStatus.textContent = 'Внешнюю ссылку удобнее смотреть в отдельной вкладке. Выберите страницу из списка, чтобы вернуться.';
    }
  });
  sceneButtons.forEach((button) => button.addEventListener('click', () => {
    if (!frameReady) { screenStatus.textContent = 'Страница ещё загружается. Повторите после загрузки.'; return; }
    const doc = frame.contentDocument;
    const scene = button.dataset.scene;
    pressed(sceneButtons, button);
    doc.querySelector('#mobile-menu[open] .menu-close')?.click();
    if (scene === 'menu') {
      widthSelect.value = '375'; resizeFrame();
      requestAnimationFrame(() => {
        const toggle = doc.querySelector('.menu-toggle');
        if (toggle) { toggle.click(); screenStatus.textContent = 'Мобильное меню открыто · ширина 375 px.'; }
        else screenStatus.textContent = 'На этой странице нет мобильного меню.';
      });
      return;
    }
    if (scene === 'top' || scene === 'scroll') {
      frame.contentWindow.scrollTo({ top: scene === 'top' ? 0 : 700, behavior: 'instant' });
      screenStatus.textContent = scene === 'top' ? 'Начало страницы.' : 'Страница прокручена: проверьте закреплённую строку меню.';
      return;
    }
    const target = doc.querySelector(scene === 'form' ? '#consultation, .contact' : 'footer');
    if (target) { target.scrollIntoView({ behavior: 'instant', block: 'start' }); screenStatus.textContent = scene === 'form' ? 'Блок обращения.' : 'Подвал страницы.'; }
    else screenStatus.textContent = scene === 'form' ? 'На этой странице нет формы обращения.' : 'На этой странице нет подвала.';
  }));
})();
