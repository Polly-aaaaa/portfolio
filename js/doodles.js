// Иллюстрации в манере аэрографа: мягкие силуэты без контура, «распылённый» край и зерно,
// голубое свечение снизу, белые блики сверху, огоньки вокруг.
// Вставляются в <span data-doodle="имя"> как inline SVG.
// Классы: .breathe — огоньки и блики, которые медленно «дышат».

const INK = '#1f3d63';

const DEFS = `<defs>
  <linearGradient id="g-white" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f3f9fd"/><stop offset="1" stop-color="#cfe3f2"/></linearGradient>
  <linearGradient id="g-navy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a86b6"/><stop offset=".55" stop-color="${INK}"/><stop offset="1" stop-color="#162d4a"/></linearGradient>
  <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3f0f9"/><stop offset="1" stop-color="#8fb8d6"/></linearGradient>
  <linearGradient id="g-peach" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde6d9"/><stop offset="1" stop-color="#f39472"/></linearGradient>
  <radialGradient id="g-sun" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff7d6"/><stop offset=".55" stop-color="#fbd38f"/><stop offset="1" stop-color="#f5a27f"/></radialGradient>
  <filter id="spray" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur in="SourceGraphic" stdDeviation=".7" result="b"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="n"/>
    <feDisplacementMap in="b" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="2.3" numOctaves="1" seed="9" result="g"/>
    <feColorMatrix in="g" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -5 1.15" result="speck"/>
    <feComposite in="speck" in2="d" operator="in" result="s"/>
    <feMerge><feMergeNode in="d"/><feMergeNode in="s"/></feMerge>
  </filter>
  <filter id="haze" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="7"/>
  </filter>
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
</defs>`;

// огонёк: размытый кружок, который дышит
const orb = (cx, cy, r, color, delay = 0) =>
  `<circle class="breathe" style="--b:${delay}s" cx="${cx}" cy="${cy}" r="${r}" fill="${color}" filter="url(#soft)"/>`;

// облако из трёх кругов и прямоугольника — как в уроке
const CLOUD = (x = 0, y = 0, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="38" cy="66" r="20"/><circle cx="60" cy="52" r="25"/><circle cx="83" cy="66" r="19"/>
    <rect x="38" y="62" width="45" height="24" rx="4"/>
  </g>`;

const DOODLES = {
  // Знак: мягкое облако с голубым свечением снизу и бликами сверху
  cloud: `
    <g fill="#8fbfe0" opacity="0.42" filter="url(#haze)" transform="translate(0 7)">${CLOUD()}</g>
    <g fill="url(#g-white)" filter="url(#spray)">${CLOUD()}</g>
    <ellipse cx="62" cy="78" rx="24" ry="9" fill="#a9cbe0" opacity=".55" filter="url(#soft)"/>
    <ellipse class="breathe" cx="52" cy="46" rx="11" ry="7" fill="#fff" filter="url(#soft)"/>
    <ellipse cx="78" cy="60" rx="7" ry="5" fill="#fff" opacity=".9" filter="url(#soft)"/>`,

  // Облачко «привет!»
  hello: `
    <g fill="#8fbfe0" opacity="0.39" filter="url(#haze)" transform="translate(-6 4) scale(1.12)">${CLOUD()}</g>
    <g fill="url(#g-white)" filter="url(#spray)" transform="translate(-6 -2) scale(1.12)">${CLOUD()}</g>
    <ellipse class="breathe" cx="54" cy="44" rx="13" ry="7" fill="#fff" filter="url(#soft)"/>
    <text x="62" y="80" text-anchor="middle" font-family="Geologica, Onest, sans-serif" font-size="17" font-weight="500" fill="${INK}" letter-spacing="-.3">привет!</text>
    ${orb(104, 26, 3.2, '#fbd38f', .4)}${orb(16, 34, 2.4, '#f5a27f', 1.6)}`,

  // Стикеры и курсор — проекты
  notes: `
    <g transform="rotate(9 70 46)"><rect x="46" y="18" width="54" height="54" rx="10" fill="url(#g-peach)" filter="url(#spray)"/></g>
    <rect x="26" y="40" width="58" height="58" rx="12" fill="#8fbfe0" opacity="0.33" filter="url(#haze)" transform="rotate(-7 50 60) translate(0 6)"/>
    <g transform="rotate(-7 50 60)">
      <rect x="22" y="32" width="58" height="58" rx="12" fill="url(#g-white)" filter="url(#spray)"/>
      <g fill="${INK}" opacity=".35" filter="url(#soft)"><rect x="33" y="50" width="34" height="4" rx="2"/><rect x="33" y="61" width="28" height="4" rx="2"/><rect x="33" y="72" width="20" height="4" rx="2"/></g>
    </g>
    <path d="M80 70 L80 104 L89 95 L96 110 L103 107 L96 92 L108 92 Z" fill="url(#g-navy)" filter="url(#spray)"/>
    ${orb(108, 22, 2.6, '#fbd38f', .8)}`,

  // Карандаш — процесс
  pencil: `
    <g transform="rotate(-38 60 58)">
      <rect x="22" y="62" width="84" height="20" rx="10" fill="#8fbfe0" opacity="0.36" filter="url(#haze)"/>
      <rect x="26" y="48" width="74" height="20" rx="10" fill="url(#g-sky)" filter="url(#spray)"/>
      <path d="M28 48 L8 58 L28 68 Z" fill="url(#g-peach)" filter="url(#spray)"/>
      <ellipse cx="12" cy="58" rx="5" ry="4" fill="#f5a27f" filter="url(#soft)"/>
      <ellipse class="breathe" cx="60" cy="52" rx="20" ry="2.6" fill="#fff" filter="url(#soft)"/>
    </g>
    ${orb(20, 96, 3, '#f5a27f', .3)}${orb(98, 98, 2.2, '#a9cbe0', 1.2)}`,

  // Очки — тёмная мягкая масса со светящимися стёклами, как глаза у кота
  glasses: `
    <g fill="url(#g-navy)" filter="url(#spray)">
      <rect x="10" y="38" width="46" height="36" rx="14"/><rect x="64" y="38" width="46" height="36" rx="14"/>
      <rect x="50" y="46" width="20" height="8" rx="4"/>
    </g>
    <ellipse class="breathe" style="--b:.2s" cx="33" cy="56" rx="11" ry="9" fill="#fff" filter="url(#soft)"/>
    <ellipse class="breathe" style="--b:.9s" cx="87" cy="56" rx="11" ry="9" fill="#fff" filter="url(#soft)"/>
    ${orb(60, 20, 2.6, '#fbd38f', .5)}`,

  // Звезда — результаты
  star: `
    <path d="M60 20 L71.2 46.6 L99.9 49 L78.1 67.9 L84.7 96 L60 81 L35.3 96 L41.9 67.9 L20.1 49 L48.8 46.6 Z" fill="#f5a27f" opacity="0.33" filter="url(#haze)" transform="translate(0 6)"/>
    <path d="M60 20 L71.2 46.6 L99.9 49 L78.1 67.9 L84.7 96 L60 81 L35.3 96 L41.9 67.9 L20.1 49 L48.8 46.6 Z" fill="url(#g-sun)" filter="url(#spray)"/>
    <ellipse class="breathe" cx="56" cy="50" rx="10" ry="8" fill="#fff" filter="url(#soft)"/>
    ${orb(104, 22, 3, '#a9cbe0', .2)}${orb(16, 92, 2.4, '#fbd38f', 1.4)}`,

  // Бабл-ти — «обсудим»
  tea: `
    <path d="M30 50 L37 104 Q60 110 83 104 L90 50 Z" fill="#8fbfe0" opacity="0.36" filter="url(#haze)" transform="translate(0 6)"/>
    <path d="M62 44 L73 8 L80 10 L70 46 Z" fill="url(#g-navy)" filter="url(#spray)"/>
    <path d="M30 46 L37 104 Q60 110 83 104 L90 46 Z" fill="url(#g-white)" filter="url(#spray)"/>
    <path d="M33.5 66 Q60 60 86.5 66 L83 104 Q60 110 37 104 Z" fill="url(#g-peach)" filter="url(#spray)"/>
    <g fill="${INK}" filter="url(#soft)">${[[47, 94], [59, 98], [71, 94], [53, 86], [66, 87]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6"/>`).join('')}</g>
    <ellipse class="breathe" cx="46" cy="58" rx="4" ry="12" fill="#fff" filter="url(#soft)"/>`,

  // Бумажный самолётик — дальше
  plane: `
    <path d="M10 58 L110 16 L82 102 L58 78 Z" fill="#8fbfe0" opacity="0.33" filter="url(#haze)" transform="translate(0 6)"/>
    <path d="M10 58 L110 16 L58 78 Z" fill="url(#g-white)" filter="url(#spray)"/>
    <path d="M110 16 L82 102 L58 78 Z" fill="url(#g-sky)" filter="url(#spray)"/>
    <path d="M58 78 L54 102 L70 90 Z" fill="url(#g-navy)" filter="url(#spray)"/>
    ${orb(30, 92, 3, '#a9cbe0', 0)}${orb(18, 100, 2.4, '#a9cbe0', .6)}${orb(8, 106, 1.8, '#f5a27f', 1.2)}`,
};

function doodleSVG(name, label = '') {
  return `<svg viewBox="0 0 120 120" class="doodle" role="${label ? 'img' : 'presentation'}" ${label ? `aria-label="${label}"` : 'aria-hidden="true"'}>${DEFS}${DOODLES[name]}</svg>`;
}

// Маленькие иконки тем же пером: контур 2.2, скруглённые концы, цвет — от текста.
// Вставляются в <span data-icon="имя" class="h-5 w-5">.
const ICONS = {
  'arrow-r': '<path d="M3.5 12.4 Q11.5 11.6 19.5 12"/><path d="M14 6.8 L19.8 12 L14 17.2"/>',
  'arrow-l': '<path d="M20.5 12.4 Q12.5 11.6 4.5 12"/><path d="M10 6.8 L4.2 12 L10 17.2"/>',
  'arrow-ur': '<path d="M6 18.2 L17.6 6.6"/><path d="M8.6 6 H18.2 V15.6"/>',
  close: '<path d="M6 6 L18 18"/><path d="M18 6 L6 18"/>',
  question: '<path d="M8.4 8.6 Q8.6 4.8 12.2 4.8 Q15.8 5 15.6 8.4 Q15.4 10.8 12.4 12 Q11.8 12.4 11.8 14.6"/><circle cx="11.8" cy="18.8" r="1.2" fill="currentColor" stroke="none"/>',
  target: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  person: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.2 Q5.2 13.8 12 13.8 Q18.8 13.8 19.2 20.2"/>',
  check: '<path d="M4.8 12.6 L9.8 17.6 L19.4 6.4"/>',
  star: '<path d="M12 3.2 L14.5 8.7 L20.4 9.3 L16 13.2 L17.3 19.1 L12 16.1 L6.7 19.1 L8 13.2 L3.6 9.3 L9.5 8.7 Z"/>',
  lock: '<rect x="5" y="10.8" width="14" height="9.4" rx="2.2"/><path d="M8.2 10.8 V8 Q8.2 4.2 12 4.2 Q15.8 4.2 15.8 8 V10.8"/>',
};

function iconSVG(name) {
  return `<svg viewBox="0 0 24 24" class="block h-full w-full" aria-hidden="true" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}

function mountDoodles(root = document) {
  root.querySelectorAll('[data-doodle]:not([data-mounted])').forEach((el) => {
    el.innerHTML = doodleSVG(el.dataset.doodle, el.dataset.label || '');
    el.dataset.mounted = '';
  });
  root.querySelectorAll('[data-icon]:not([data-mounted])').forEach((el) => {
    el.innerHTML = iconSVG(el.dataset.icon);
    el.dataset.mounted = '';
  });
}
mountDoodles();
