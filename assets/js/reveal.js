(() => {
  if (!('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const candidates = Array.from(document.querySelectorAll('main .page-title, main .info-grid, main .work-card, main .project-hero, main .project-images > .visual, main .cv-entry, main .home-media, main > .note, main .section > .split, .site-footer'));
  // Animate only the outermost selected element to avoid nested fading.
  const targets = candidates.filter(element => !candidates.some(parent => parent !== element && parent.contains(element)));
  let observer;
  const show = element => {
    element.classList.remove('is-pending');
    if (observer) observer.unobserve(element);
  };
  const start = () => {
    if (observer) observer.disconnect();
    if (motion.matches) { targets.forEach(show); return; }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => requestAnimationFrame(() => show(entry.target)));
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(element => {
      if (element.dataset.revealSeen === 'true') return;
      element.classList.add('scroll-reveal', 'is-pending');
      observer.observe(element);
    });
  };
  // Completed items remain visible when filtering or navigating with a keyboard.
  const originalShow = show;
  document.addEventListener('focusin', event => {
    targets.forEach(element => { if (element.contains(event.target)) { element.dataset.revealSeen = 'true'; originalShow(element); } });
  });
  targets.forEach(element => element.addEventListener('transitionend', event => {
    if (event.target === element && !element.classList.contains('is-pending')) element.dataset.revealSeen = 'true';
  }));
  motion.addEventListener('change', start);
  window.addEventListener('pageshow', event => { if (event.persisted) targets.forEach(show); });
  start();
})();
