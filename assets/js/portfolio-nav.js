document.querySelectorAll('.portfolio-menu').forEach(group => {
  const submenu = group.querySelector('details');
  const portfolioLink = group.querySelector('a');
  const links = Array.from(group.querySelectorAll('.portfolio-dropdown a'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [];
  const setOpen = open => {
    if (submenu.open === open) return;
    animations.forEach(animation => animation.cancel());
    animations = [];
    submenu.open = open;
    portfolioLink.setAttribute('aria-expanded', String(open));
    if (open && !motion.matches) {
      links.forEach((link, index) => {
        if (!link.animate) return;
        animations.push(link.animate([
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 550, delay: index * 130, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' }));
      });
    }
  };
  portfolioLink.setAttribute('aria-expanded', 'false');
  portfolioLink.addEventListener('click', event => {
    if (window.matchMedia('(max-width: 700px), (hover: none)').matches) {
      event.preventDefault(); event.stopPropagation(); setOpen(!submenu.open);
    }
  });
  group.addEventListener('focusin', event => {
    if (event.target === portfolioLink && window.matchMedia('(hover: hover) and (pointer: fine)').matches) setOpen(true);
  });
  group.addEventListener('mouseenter', () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setOpen(true);
  });
  group.addEventListener('mouseleave', () => { if (!group.contains(document.activeElement)) setOpen(false); });
  group.addEventListener('focusout', event => { if (!group.contains(event.relatedTarget)) setOpen(false); });
  group.addEventListener('keydown', event => {
    if (event.key === 'Escape') { portfolioLink.focus(); setOpen(false); event.stopPropagation(); }
  });
  links.forEach(link => link.addEventListener('click', () => setOpen(false)));
  motion.addEventListener('change', () => {
    if (motion.matches) { animations.forEach(animation => animation.cancel()); animations = []; }
  });
});
