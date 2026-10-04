(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.result-card[data-category]')];
  const grid = document.querySelector('.results-grid');
  const count = document.querySelector('.results-count');
  if (!filters.length || !cards.length || !grid || !count) return;

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.filter;
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      const visibleCards = [];
      cards.forEach((card) => {
        const show = value === 'all' || card.dataset.category === value;
        card.hidden = !show;
        card.classList.remove('filter-even');
        if (show) visibleCards.push(card);
      });
      grid.classList.toggle('is-filtered', value !== 'all');
      visibleCards.forEach((card, index) => card.classList.toggle('filter-even', index % 2 === 1));
      count.textContent = `Показано: ${visibleCards.length}`;
    });
  });
})();
