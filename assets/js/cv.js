(() => {
  const list = document.getElementById('cv-timeline');
  if (!list) return;
  const bilingual = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    node.dataset.ko = text?.ko || '';
    node.dataset.en = text?.en || '';
    node.textContent = node.dataset.ko;
    return node;
  };
  (window.portfolioCV || []).forEach(entry => {
    const row = document.createElement('li');
    row.className = 'cv-entry';
    const content = document.createElement('div');
    content.className = 'cv-entry-content';
    row.append(bilingual('span', 'cv-period', entry.period));
    content.append(bilingual('h3', 'cv-entry-title', entry.title));
    if (entry.organization?.ko || entry.organization?.en) content.append(bilingual('p', 'cv-organization', entry.organization));
    if (entry.description?.ko || entry.description?.en) content.append(bilingual('p', 'cv-description', entry.description));
    row.append(content);
    list.append(row);
  });
})();
