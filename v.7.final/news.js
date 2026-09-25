(() => {
  const search = document.querySelector('#news-search');
  const year = document.querySelector('#news-year');
  const more = document.querySelector('#news-more');
  if (!search || !year || !more) return;
  const rows = [...document.querySelectorAll('.news-row')];
  let limit = 12;
  const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё','е').trim();
  function render() {
    const query = normalize(search.value);
    const matches = rows.filter(row => (!year.value || (year.value === 'undated' ? !row.dataset.year : row.dataset.year === year.value)) && normalize(row.dataset.search).includes(query));
    const visible = new Set(matches.slice(0,limit));
    rows.forEach(row => { row.hidden = !visible.has(row); });
    more.hidden = matches.length <= limit;
    document.querySelector('#news-empty').hidden = matches.length !== 0;
    document.querySelector('#news-count').textContent = `Найдено: ${matches.length} · показано: ${Math.min(limit,matches.length)}`;
  }
  search.addEventListener('input',()=>{limit=12;render();});
  year.addEventListener('change',()=>{limit=12;render();});
  more.addEventListener('click',()=>{limit+=12;render();});
  render();
})();
