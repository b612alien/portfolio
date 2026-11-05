const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
}

const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
const applyFilter = category => {
  filters.forEach(filter => {
    filter.classList.toggle('selected', filter.dataset.filter === category);
    filter.setAttribute('aria-pressed', String(filter.dataset.filter === category));
  });
  cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
  const empty = document.querySelector('.filter-empty');
  if (empty) empty.hidden = Array.from(cards).some(card => !card.hidden);
};
filters.forEach(button => {
  button.addEventListener('click', () => { applyFilter(button.dataset.filter); });
});
if (filters.length) {
  const category = new URLSearchParams(window.location.search).get('category');
  applyFilter(Array.from(filters).some(filter => filter.dataset.filter === category) ? category : 'all');
}
