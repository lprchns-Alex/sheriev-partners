(() => {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const rows = [...document.querySelectorAll('.media-row[data-category]')];
  const count = document.querySelector('.media-count');
  if (!buttons.length || !rows.length || !count) return;
  buttons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    rows.forEach((row) => {
      const show = filter === 'all' || row.dataset.category === filter;
      row.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = `Показано: ${visible}`;
  }));
})();

