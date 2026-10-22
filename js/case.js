// Рендер страницы кейса по ?id=… из данных CASES (js/cases.js). Стиль — скрапбук:
// огромные заголовки, плашки-маркеры, отпечатки на скотче, записки и стикеры.

const icon = (name, cls = 'h-5 w-5') => `<span data-icon="${name}" class="inline-block shrink-0 ${cls}"></span>`;

// теги — плашками разного цвета
const PILL = { B2E: 'pill-blue', B2C: 'pill-marker', 'Social Media': 'pill-red' };
const pills = (list) => list.map((t, i) => `<span class="pill ${PILL[t] || 'pill-white'}${i === 0 ? ' !ml-0' : ''}">${t}</span>`).join('');

// небольшой разброс углов, чтобы отпечатки лежали «живо», но стабильно
const tilt = (i, a = 1.6) => `${(i % 2 ? 1 : -1) * (a - (i % 3) * 0.4)}deg`;

function picture(key, { alt = '', cls = '', zoom = true, eager = false } = {}) {
  const [w, h] = DIMS[key] || [1600, 1000];
  return `<img src="assets/${key}.webp" width="${w}" height="${h}" alt="${alt}" ${eager ? '' : 'loading="lazy"'} decoding="async"
    class="${zoom ? 'zoomable cursor-zoom-in ' : ''}block h-auto w-full ${cls}" />`;
}

// скриншоты — ровные отпечатки на скотче, чтобы их было удобно читать
function figure(key, caption = '', { narrow = false } = {}) {
  return `<figure class="reveal ${narrow ? 'mx-auto max-w-xl' : ''}">
    <div class="print"><span class="tape" style="--tr:${caption.length % 2 ? 3 : -3}deg"></span>${picture(key, { alt: caption })}</div>
    ${caption ? `<figcaption class="hand mt-3 text-center text-[1.6rem] leading-none">${caption}</figcaption>` : ''}
  </figure>`;
}

function renderBlock(b) {
  if (b.h) return `<h3 class="reveal mx-auto max-w-2xl pt-8 text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-[2rem]">${b.h}</h3>`;
  if (b.p) return `<p class="reveal prose-case mx-auto max-w-2xl text-[18px] leading-[1.65] text-ink/85">${b.p}</p>`;
  if (b.label) return `<div class="reveal mx-auto max-w-2xl pt-2"><span class="pill ${b.label === 'Было' ? 'pill-white' : 'pill-marker'} !ml-0 !text-[13px]">${b.label}</span></div>`;
  if (b.ul) return `<ul class="reveal prose-case mx-auto max-w-2xl space-y-2.5 text-[18px] leading-[1.6] text-ink/85">${b.ul.map((li) => `<li class="flex gap-3"><span class="mt-[.55em] h-2 w-2 shrink-0 rounded-full bg-red"></span><span>${li}</span></li>`).join('')}</ul>`;
  if (b.img) return `<div class="py-4">${figure(b.img, b.caption, { narrow: b.narrow })}</div>`;
  if (b.pair) return `<div class="grid gap-8 py-4 sm:grid-cols-2">${b.pair.map((k, i) => figure(k, b.captions?.[i] || '')).join('')}</div>`;
  return '';
}

function stagesBlock(stages) {
  return `<div class="reveal stages mx-auto max-w-2xl">
    <p class="mono text-[12px] text-ink/70">Этапы</p>
    <ol class="mt-3 flex flex-wrap gap-2">${stages.map((s, i) =>
      `<li class="flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-white py-1 pl-1 pr-3.5 text-[15px]"><span class="stage-dot mono grid h-6 w-6 place-items-center rounded-full border-[1.5px] border-ink !text-[10px] !tracking-normal">${i + 1}</span>${s}</li>`).join('')}
    </ol>
  </div>`;
}

// «Задача и итог»: проблема — записка на листке в линейку, задача — жёлтый стикер
function problemGoal(problem, goal) {
  if (!problem || !goal) return '';
  return `
  <div class="grid gap-10 md:grid-cols-2 md:gap-12">
    <div class="reveal note note-lined" style="--r:-1.5deg">
      <span class="tape" style="--tr:-5deg"></span>
      <p class="hand text-[2.1rem] leading-[32px]">${problem.label}</p>
      <p class="prose-case mt-0 text-[17px] leading-[32px]">${problem.html}</p>
    </div>
    <div class="reveal note note-marker" style="--r:1.5deg;--stagger:120ms">
      <span class="tape" style="--tr:4deg"></span>
      <p class="hand text-[2.1rem] leading-none">${goal.label}</p>
      <p class="prose-case mt-4 text-[1.2rem] font-medium leading-[1.45]">${goal.html}</p>
    </div>
  </div>`;
}

function detailRow(s) {
  const list = s.list
    ? `<ul class="mt-5 flex flex-wrap gap-2">${s.list.map((li) => `<li class="rounded-lg border-[1.5px] border-ink bg-white px-3 py-2 text-[15px] leading-snug">${li}</li>`).join('')}</ul>`
    : '';
  return `
  <div class="reveal grid gap-4 border-t-[1.5px] border-ink py-8 md:grid-cols-[13rem_1fr] md:gap-10">
    <p class="mono pt-1 text-[13px]">${s.label}</p>
    <div><p class="prose-case max-w-[62ch] text-[18px] leading-[1.6] text-ink/85">${s.html}</p>${list}</div>
  </div>`;
}

// Результаты — крупным текстом, главное выделено маркером
function resultsBlock(c) {
  if (!c.results) return '';
  const items = c.results.map((r) =>
    `<li class="reveal border-t-[1.5px] border-ink pt-5 text-[1.3rem] leading-[1.45] sm:text-[1.55rem] [&_b]:bg-[linear-gradient(transparent_55%,#c7f45a_55%)] [&_b]:font-semibold">${r}</li>`).join('');
  const note = c.resultsNote ? `<p class="mono mt-8 text-[12px] leading-relaxed text-ink/70">* ${c.resultsNote}</p>` : '';
  return `
  <div class="mt-16">
    <h3 class="reveal display text-[2.6rem] sm:text-[4rem]">Результаты</h3>
    <ul class="mt-8 space-y-6">${items}</ul>
    ${note}
  </div>`;
}

function caseCard(id, i) {
  const c = CASES[id];
  return `<a href="case.html?id=${id}" class="reveal group block">
    <div class="print" style="--r:${tilt(i)}">
      <span class="tape" style="--tr:${i % 2 ? 4 : -4}deg"></span>
      <div class="overflow-hidden" style="background:${c.coverBg}; view-transition-name: cover-${id}">${picture(c.cover, { alt: c.title, zoom: false, cls: 'aspect-[5/4] object-cover' })}</div>
    </div>
    <p class="mono mt-6 text-[12px]">${c.kicker || 'Проект'}</p>
    <h4 class="mt-2 text-[1.4rem] font-bold leading-snug tracking-tight"><span class="link-u">${c.title}</span></h4>
  </a>`;
}

const h2 = (html) => `<h2 class="display text-[2.1rem] sm:text-[4.5rem]">${html}</h2>`;

function render(id) {
  const c = CASES[id];
  const parent = c.parent && CASES[c.parent];
  document.title = `${c.title} — Полина Артамонова`;

  const backLink = (href, text) =>
    `<a href="${href}" class="mono group inline-flex items-center gap-2 text-[12px]"><span class="nudge-left inline-block">${icon('arrow-l', 'h-4 w-4')}</span><span class="link-u">${text}</span></a>`;
  const back = parent ? backLink(`case.html?id=${c.parent}`, parent.title) : backLink('index.html#work', 'Все проекты');
  const sticker = c.kicker || c.period;

  const hero = `
  <section class="pb-14 pt-32 sm:pb-20 sm:pt-40">
    <div class="reveal">${back}</div>
    <div class="relative mt-14 max-w-5xl">
      ${sticker ? `<span class="drop sticker pill ${c.kicker ? 'pill-red' : 'pill-blue'} absolute -left-1 -top-8 !text-[12px] sm:-top-7 sm:!text-[13px]" style="--r:-8deg;--d:250ms">${sticker}</span>` : ''}
      <h1 data-split class="display text-[1.95rem] sm:text-[4.5rem] lg:text-[6rem]">${c.title}</h1>
    </div>
    ${c.lead ? `<p style="--stagger:450ms" class="reveal prose-case mt-8 max-w-3xl text-[1.2rem] leading-[1.5] sm:text-[1.45rem]">${c.lead}</p>` : ''}
    <p style="--stagger:550ms" class="reveal mt-6 text-[22px] leading-[1.9]">${pills(c.tags)}</p>
  </section>
  <div class="pb-20 sm:pb-28">
    <div class="print" style="--r:-.8deg">
      <span class="tape" style="--tr:-3deg"></span>
      <div class="overflow-hidden" style="background:${c.coverBg}; view-transition-name: cover-${id}">${picture(c.cover, { alt: c.title, eager: true })}</div>
    </div>
  </div>`;

  const problem = c.summary.find((x) => x.label === 'Проблема');
  const goal = c.summary.find((x) => x.label === 'Задача' || x.label === 'Цель');
  const details = c.summary.filter((x) => x !== problem && x !== goal);

  const summary = `
  <section class="py-16 sm:py-24">
    <div class="reveal">${h2('Задача и итог')}</div>
    <div class="mt-12">
      ${problemGoal(problem, goal)}
      ${details.length ? `<div class="mt-14">${details.map(detailRow).join('')}</div>` : ''}
      ${resultsBlock(c)}
    </div>
  </section>`;

  const multi = c.sections.filter((s) => s.title).length > 1;
  let fn = 0;
  const sections = c.sections.map((s) => {
    if (s.title) fn++;
    // номер нужен только когда частей несколько — порядок здесь несёт смысл
    const num = multi ? `<span class="text-ink/35">${fn}.</span> ` : '';
    const head = s.title
      ? `<div class="reveal mb-12">${h2(num + s.title)}</div>`
      : (s.stages ? `<div class="reveal mb-12">${h2('Как шла работа')}</div>` : '');
    const note = s.note
      ? `<div class="reveal note note-red mx-auto max-w-md" style="--r:-2deg"><span class="tape" style="--tr:5deg"></span><p class="hand text-[1.6rem] leading-[1.1]">${s.note}</p></div>`
      : '';
    return `
    <section class="border-t-[1.5px] border-ink py-16 sm:py-24">
      ${head}
      <div class="space-y-7">
        ${note}
        ${s.stages ? stagesBlock(s.stages) : ''}
        ${s.blocks.map(renderBlock).join('\n')}
      </div>
    </section>`;
  }).join('');

  const subcases = c.subcases ? `
    <section class="pb-20 sm:pb-28">
      <div data-stagger class="grid gap-x-12 gap-y-14 sm:grid-cols-2">${c.subcases.map((k, i) => caseCard(k, i)).join('')}</div>
    </section>` : '';

  const next = CASE_ORDER[(CASE_ORDER.indexOf(id) + 1) % CASE_ORDER.length];
  const nc = CASES[next];
  // одно имя перехода на странице может быть только у одного элемента
  const nextVT = c.subcases?.includes(next) ? '' : `view-transition-name: cover-${next}`;
  const nextBlock = `
  <section class="border-t-[1.5px] border-ink py-16 sm:py-24">
    <a href="case.html?id=${next}" class="reveal group grid items-center gap-10 md:grid-cols-2">
      <div class="print" style="--r:1.5deg">
        <span class="tape" style="--tr:-4deg"></span>
        <div class="overflow-hidden" style="background:${nc.coverBg};${nextVT}">${picture(nc.cover, { alt: nc.title, zoom: false, cls: 'aspect-[5/3] object-cover' })}</div>
      </div>
      <div>
        <span class="pill pill-marker !ml-0 !text-[12px]">${nc.parent ? 'Следующий кейс' : 'Следующий проект'}</span>
        <h2 class="display mt-5 text-[1.7rem] sm:text-[3.6rem]"><span class="link-u">${nc.title}</span></h2>
      </div>
    </a>
  </section>`;

  document.getElementById('app').innerHTML = hero + summary + sections + subcases + nextBlock;
}

const id = new URLSearchParams(location.search).get('id');
if (CASES[id]) {
  render(id);
} else {
  location.replace('index.html#work');
}

// Увеличение картинок: картинка вырастает из миниатюры и возвращается в неё
const lb = document.getElementById('lightbox');
const lbImg = document.createElement('img');
lbImg.className = 'max-h-full max-w-full rounded-xl object-contain shadow-2xl';
lb.prepend(lbImg);
const lbReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lbThumb = null;

function flipFrom(thumb) {
  const a = thumb.getBoundingClientRect();
  const b = lbImg.getBoundingClientRect();
  return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width})`;
}

async function openLb(thumb) {
  lbThumb = thumb;
  lbImg.src = thumb.currentSrc || thumb.src;
  lbImg.alt = thumb.alt;
  lb.classList.remove('hidden-lb');
  if (lbReduce) return;
  await lbImg.decode().catch(() => {});
  lbImg.animate([{ transform: flipFrom(thumb), opacity: 0.6 }, { transform: 'none', opacity: 1 }],
    { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}

function closeLb() {
  if (lb.classList.contains('hidden-lb')) return;
  lb.classList.add('hidden-lb');
  if (lbReduce || !lbThumb) return;
  lbImg.animate([{ transform: 'none' }, { transform: flipFrom(lbThumb) }],
    { duration: 260, easing: 'cubic-bezier(0.4, 0, 1, 1)' });
}

document.addEventListener('click', (e) => {
  const img = e.target.closest('img.zoomable');
  if (img) openLb(img);
});
lb.addEventListener('click', closeLb);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
