(() => {
  const translations = window.portfolioTranslations || {};
  let language = 'ko';
  try {
    const saved = localStorage.getItem('portfolio-language');
    if (saved === 'en' || saved === 'ko') language = saved;
  } catch { /* Language selection still works when storage is unavailable. */ }

  const applyLanguage = value => {
    document.documentElement.lang = value;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const entry = translations[element.dataset.i18n];
      if (entry && typeof entry[value] === 'string') element.textContent = entry[value];
    });
    // New portfolio descriptions can also contain both versions directly in HTML.
    document.querySelectorAll('[data-ko][data-en]').forEach(element => {
      element.textContent = element.dataset[value];
    });
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === value));
    });
    const toggle = document.querySelector('.menu-toggle');
    if (toggle) toggle.setAttribute('aria-label', value === 'ko' ? '메뉴 열기/닫기' : 'Toggle navigation');
    const nav = document.querySelector('.nav');
    if (nav) nav.setAttribute('aria-label', value === 'ko' ? '주 메뉴' : 'Main navigation');
  };
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
      language = button.dataset.language;
      applyLanguage(language);
      try { localStorage.setItem('portfolio-language', language); } catch { /* Optional storage. */ }
    });
  });
  applyLanguage(language);
})();
