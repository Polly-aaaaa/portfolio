// Иллюстрации-айдентика в стиле портрета: толстый чёрный контур, растр точками, сиреневая заливка.
// Вставляются в <span data-doodle="имя"> как inline SVG, чтобы линии можно было «прорисовать».
// Классы: .ink — контур (рисуется), .tone — растр/заливка (проявляется), .txt — надписи.

const INK = '#1f1f21';
const LILAC = '#e7dbfb';

const DEFS = `<defs>
  <pattern id="ht" width="4.4" height="4.4" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
    <circle cx="2.2" cy="2.2" r=".95" fill="${INK}" stroke="none"/>
  </pattern>
  <pattern id="ht-dense" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
    <circle cx="1.7" cy="1.7" r="1.15" fill="${INK}" stroke="none"/>
  </pattern>
</defs>`;

const P = (d, k = 0, extra = '') => `<path class="ink" pathLength="1" style="--k:${k}" d="${d}" ${extra}/>`;

const DOODLES = {
  // Знак: кудрявая голова в очках с трубочкой бабл-ти
  mark: `
    <path class="tone" fill="#fff" d="M32 70 Q30 100 60 104 Q90 100 88 70 Q86 50 60 48 Q34 50 32 70 Z"/>
    ${P('M32 70 Q30 100 60 104 Q90 100 88 70', 0)}
    <path class="tone" fill="url(#ht-dense)" d="M24 74 Q8 58 22 44 Q16 24 38 22 Q44 6 62 12 Q80 4 88 20 Q108 22 102 42 Q116 56 98 72 Q96 60 90 56 Q86 66 76 60 Q70 66 62 58 Q54 66 46 58 Q40 66 32 58 Q28 66 24 74 Z"/>
    ${P('M24 74 Q8 58 22 44 Q16 24 38 22 Q44 6 62 12 Q80 4 88 20 Q108 22 102 42 Q116 56 98 72 Q96 60 90 56 Q86 66 76 60 Q70 66 62 58 Q54 66 46 58 Q40 66 32 58 Q28 66 24 74 Z', 1)}
    ${P('M36 72 H56 V84 Q56 88 52 88 H40 Q36 88 36 84 Z', 2)}
    ${P('M64 72 H84 V84 Q84 88 80 88 H68 Q64 88 64 84 Z', 3)}
    ${P('M56 76 Q60 72 64 76', 4)}
    <circle class="tone" cx="51" cy="80" r="3" fill="${INK}" stroke="none"/>
    <circle class="tone" cx="79" cy="80" r="3" fill="${INK}" stroke="none"/>
    ${P('M61 86 Q57 91 61 93', 5, 'stroke-width="2.6"')}
    ${P('M60 96 Q65 98 60 101', 5)}
    ${P('M58 99 L34 109', 6)}
    <path class="tone" fill="url(#ht-dense)" d="M36 103 L14 112 L19 122 L40 113 Z"/>
    ${P('M36 103 L14 112 Q13 119 19 122 L40 113 Q42 106 36 103 Z', 7)}`,

  // Облачко реплики «привет!»
  hello: `
    <path class="tone" fill="url(#ht)" transform="translate(5 5)" d="M14 30 Q14 18 26 18 H96 Q108 18 108 30 V60 Q108 72 96 72 H48 L30 92 L34 72 H26 Q14 72 14 60 Z"/>
    <path class="tone" fill="#fff" d="M14 30 Q14 18 26 18 H96 Q108 18 108 30 V60 Q108 72 96 72 H48 L30 92 L34 72 H26 Q14 72 14 60 Z"/>
    ${P('M14 30 Q14 18 26 18 H96 Q108 18 108 30 V60 Q108 72 96 72 H48 L30 92 L34 72 H26 Q14 72 14 60 Z', 0)}
    <text class="txt" x="61" y="52" text-anchor="middle" font-family="Geologica, Onest, sans-serif" font-size="21" font-weight="600" fill="${INK}" stroke="none" letter-spacing="-.5">привет!</text>`,

  // Стикеры и курсор — проекты
  notes: `
    <g transform="rotate(9 70 46)">
      <rect class="tone" x="44" y="16" width="56" height="56" rx="4" fill="url(#ht)"/>
      <rect class="ink" pathLength="1" style="--k:0" x="44" y="16" width="56" height="56" rx="4"/>
    </g>
    <g transform="rotate(-7 50 58)">
      <rect class="tone" x="20" y="30" width="58" height="58" rx="4" fill="#fff"/>
      <rect class="ink" pathLength="1" style="--k:1" x="20" y="30" width="58" height="58" rx="4"/>
      ${P('M31 48 H66', 2)}${P('M31 59 H60', 3)}${P('M31 70 H52', 4)}
    </g>
    <path class="tone" fill="${LILAC}" d="M80 68 L80 104 L89 95 L96 110 L103 107 L96 92 L108 92 Z"/>
    ${P('M80 68 L80 104 L89 95 L96 110 L103 107 L96 92 L108 92 Z', 5)}`,

  // Карандаш и росчерк — процесс
  pencil: `
    <g transform="rotate(-38 60 56)">
      <rect class="tone" x="26" y="46" width="58" height="20" fill="${LILAC}"/>
      <rect class="tone" x="84" y="46" width="10" height="20" fill="url(#ht)"/>
      ${P('M26 46 H94 V66 H26', 0)}
      ${P('M84 46 V66', 1)}
      ${P('M94 46 H100 Q106 46 106 52 V60 Q106 66 100 66 H94', 2)}
      <path class="tone" fill="#fff" d="M26 46 L8 56 L26 66 Z"/>
      ${P('M26 46 L8 56 L26 66', 3)}
      <path class="tone" fill="${INK}" d="M13.5 53 L8 56 L13.5 59 Z"/>
      ${P('M28 56 H82', 4, 'stroke-width="2"')}
    </g>
    ${P('M10 104 Q20 94 30 104 T50 104 T70 104 T90 104', 5)}`,

  // Очки — исследование, «присмотреться»
  glasses: `
    <path class="tone" fill="${LILAC}" d="M12 46 Q12 38 20 38 H50 Q56 38 56 46 V62 Q56 74 44 74 H24 Q12 74 12 62 Z"/>
    <path class="tone" fill="${LILAC}" d="M64 46 Q64 38 70 38 H100 Q108 38 108 46 V62 Q108 74 96 74 H76 Q64 74 64 62 Z"/>
    <path class="tone" fill="url(#ht)" d="M12 64 H56 Q55 74 44 74 H24 Q13 74 12 64 Z M64 64 H108 Q107 74 96 74 H76 Q65 74 64 64 Z"/>
    ${P('M12 46 Q12 38 20 38 H50 Q56 38 56 46 V62 Q56 74 44 74 H24 Q12 74 12 62 Z', 0)}
    ${P('M64 46 Q64 38 70 38 H100 Q108 38 108 46 V62 Q108 74 96 74 H76 Q64 74 64 62 Z', 1)}
    ${P('M56 48 Q60 42 64 48', 2)}
    ${P('M12 44 L4 38', 3)}${P('M108 44 L116 38', 3)}
    ${P('M22 50 L32 44', 4, 'stroke-width="2.4"')}${P('M74 50 L84 44', 4, 'stroke-width="2.4"')}
    ${P('M38 24 Q42 16 48 20', 5, 'stroke-width="2.4"')}${P('M72 20 Q78 16 82 24', 5, 'stroke-width="2.4"')}`,

  // Звезда — результаты
  star: `
    <path class="tone" fill="${LILAC}" d="M60 20 L71.2 46.6 L99.9 49 L78.1 67.9 L84.7 96 L60 81 L35.3 96 L41.9 67.9 L20.1 49 L48.8 46.6 Z"/>
    <path class="tone" fill="url(#ht)" d="M60 81 L35.3 96 L41.9 67.9 L60 62 L78.1 67.9 L84.7 96 Z"/>
    ${P('M60 20 L71.2 46.6 L99.9 49 L78.1 67.9 L84.7 96 L60 81 L35.3 96 L41.9 67.9 L20.1 49 L48.8 46.6 Z', 0)}
    ${P('M104 16 V30 M97 23 H111', 1)}
    ${P('M16 90 V100 M11 95 H21', 2)}
    ${P('M100 98 l6 4', 3)}`,

  // Бабл-ти — «давайте обсудим за чаем»
  tea: `
    <path class="tone" fill="${LILAC}" d="M33.5 62 Q46 58 60 62 T86.5 62 L83 104 Q60 109 37 104 Z"/>
    <path class="tone" fill="#fff" d="M60 38 L72 6 L80 9 L69 40 Z"/>
    ${P('M60 38 L72 6 L80 9 L69 40', 0)}
    <path class="tone" fill="url(#ht)" d="M26 39 Q60 34 94 39 L92 47 Q60 44 28 47 Z"/>
    ${P('M26 39 Q60 34 94 39 L92 47 Q60 44 28 47 Z', 1)}
    ${P('M30 47 L37 104 Q60 109 83 104 L90 47', 2)}
    ${P('M33.5 62 Q46 58 60 62 T86.5 62', 3)}
    ${[[46, 95], [58, 98], [71, 95], [52, 85], [65, 87], [77, 86]].map(([x, y], i) =>
      `<circle class="tone" cx="${x}" cy="${y}" r="4.6" fill="url(#ht-dense)"/><circle class="ink" pathLength="1" style="--k:${4 + i * 0.3}" cx="${x}" cy="${y}" r="4.6"/>`).join('')}
    ${P('M98 24 l7 -5', 6)}${P('M100 34 l8 1', 6)}`,

  // Бумажный самолётик — дальше
  plane: `
    <path class="tone" fill="#fff" d="M10 58 L110 16 L82 102 L58 78 Z"/>
    <path class="tone" fill="url(#ht)" d="M58 78 L54 102 L70 90 Z"/>
    ${P('M10 58 L110 16 L82 102 L58 78 Z', 0)}
    ${P('M110 16 L58 78', 1)}
    ${P('M58 78 L54 102 L70 90', 2)}
    ${[[8, 106], [19, 103], [27, 96], [32, 87]].map(([x, y]) => `<circle class="tone" cx="${x}" cy="${y}" r="2.4" fill="${INK}" stroke="none"/>`).join('')}`,
};

function doodleSVG(name, label = '') {
  return `<svg viewBox="0 0 120 120" class="doodle" role="${label ? 'img' : 'presentation'}" ${label ? `aria-label="${label}"` : 'aria-hidden="true"'}
    fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${DEFS}${DOODLES[name]}</svg>`;
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
