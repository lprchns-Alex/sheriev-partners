(() => {
  const rows = [...document.querySelectorAll('.pub-row')];
  const buttons = [...document.querySelectorAll('[data-topic-filter]')];
  const search = document.querySelector('#pub-search');
  const more = document.querySelector('.pub-more');
  const count = document.querySelector('.pub-count');
  if (!rows.length || !buttons.length || !search || !more || !count) return;
  document.body.classList.add('pub-enhanced');

  let activeTopic = 'all';
  let limit = 12;
  const normalize = (value) => value.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();

  const render = () => {
    const query = normalize(search.value);
    let matched = 0;
    let shown = 0;
    rows.forEach((row) => {
      const topicMatches = activeTopic === 'all' || row.dataset.topic === activeTopic;
      const textMatches = !query || normalize(row.dataset.search).includes(query);
      const matches = topicMatches && textMatches;
      if (matches) matched += 1;
      const visible = matches && shown < limit;
      row.hidden = !visible;
      if (visible) shown += 1;
    });
    count.textContent = matched ? `Показано: ${shown} из ${matched}` : 'По запросу ничего не найдено';
    more.hidden = shown >= matched;
  };

  buttons.forEach((button) => button.addEventListener('click', () => {
    activeTopic = button.dataset.topicFilter;
    limit = 12;
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));
  search.addEventListener('input', () => { limit = 12; render(); });
  more.addEventListener('click', () => { limit += 12; render(); });
  render();
})();
