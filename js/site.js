// Общее поведение для всех страниц: появление, заголовки, навбар, цифры, прогресс чтения.
// Подключается последним — после того, как case.js отрисовал страницу кейса.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Заголовок по словам: каждое слово в маске, задержка нарастает по порядку
function splitWords(root, startDelay = 120, step = 55) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const wi = document.createElement('span');
          wi.className = 'wi';
          wi.textContent = part;
          wi.style.setProperty('--d', `${startDelay + i++ * step}ms`);
          w.append(wi);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.classList?.contains('avatar-pop')) {
        child.style.setProperty('--d', `${startDelay + i++ * step}ms`);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(root);
  root.classList.add('split-done');
}
document.querySelectorAll('[data-split]').forEach((el) => splitWords(el));

// Задержка по очереди — только внутри списков [data-stagger]
document.querySelectorAll('[data-stagger]').forEach((group) => {
  group.querySelectorAll(':scope > .reveal').forEach((el, i) => {
    el.style.setProperty('--stagger', `${Math.min(i, 5) * 80}ms`);
  });
});
document.querySelectorAll('.stages li').forEach((li, i) => li.style.setProperty('--i', i));

// Цифры досчитывают до своего значения
function countUp(el) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) return;
  const dur = 1100;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(2, -10 * p);
    el.textContent = `${prefix}${Math.round(target * (p === 1 ? 1 : eased))}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = `${prefix}0${suffix}`;
  requestAnimationFrame(tick);
}

// Появление при скролле
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

document.documentElement.classList.add('motion-ready');

// Навбар: плотнее после начала прокрутки
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('nav-scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Меню в pill-навбаре
const btn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const [l1, l2] = btn.querySelectorAll('span');
menu.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i));
function toggleMenu(open) {
  btn.setAttribute('aria-expanded', open);
  menu.style.gridTemplateRows = open ? '1fr' : '0fr';
  nav.classList.toggle('open', open);
  l1.style.transform = open ? 'translateY(3.75px) rotate(45deg)' : '';
  l2.style.transform = open ? 'translateY(-3.75px) rotate(-45deg)' : '';
}
btn.addEventListener('click', () => toggleMenu(btn.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

// Прогресс чтения (страницы кейсов)
const bar = document.querySelector('.read-progress');
if (bar) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
