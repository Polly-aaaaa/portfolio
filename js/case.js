// Рендер страницы кейса по ?id=… из данных CASES (js/cases.js)

const ARROW = (color = 'currentColor', w = 'w-8') =>
  `<span class="flex items-center"><span class="arrow-line block h-px ${w}" style="background:${color}"></span><svg width="8" height="10" viewBox="0 0 8 10" class="-ml-1"><path d="M1 1l5 4-5 4" fill="none" stroke="${color}" stroke-width="1.2"/></svg></span>`;

const TAG_COLORS = {
  'B2E': 'bg-violet-100 text-violet-700', 'B2C': 'bg-sky-100 text-sky-700',
  'Web': 'bg-orange-100 text-orange-700', 'PWA': 'bg-pink-100 text-pink-700',
  'Social Media': 'bg-blue-100 text-blue-700',
};
const tag = (t) => `<span class="rounded-md px-2 py-0.5 ${TAG_COLORS[t] || 'bg-emerald-100 text-emerald-700'}">${t}</span>`;
const tags = (list) => `<div class="flex flex-wrap gap-1.5 font-mono text-[11px] uppercase tracking-wide">${list.map(tag).join('')}</div>`;

function picture(key, { alt = '', cls = '', zoom = true, eager = false } = {}) {
  const [w, h] = DIMS[key] || [1600, 1000];
  return `<img src="assets/${key}.webp" width="${w}" height="${h}" alt="${alt}" ${eager ? '' : 'loading="lazy"'} decoding="async"
    class="${zoom ? 'zoomable cursor-zoom-in ' : ''}h-auto w-full ${cls}" />`;
}

function figure(key, caption = '', { narrow = false } = {}) {
  return `<figure class="reveal ${narrow ? 'mx-auto max-w-xl' : ''}">
    <div class="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">${picture(key, { alt: caption })}</div>
    ${caption ? `<figcaption class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">${caption}</figcaption>` : ''}
  </figure>`;
}

function renderBlock(b) {
  if (b.h) return `<h3 class="reveal mx-auto max-w-2xl pt-6 font-display text-2xl font-medium tracking-tight sm:text-[1.75rem]">${b.h}</h3>`;
  if (b.p) return `<p class="reveal prose-case mx-auto max-w-2xl text-[16px] leading-[1.7] text-ink/70">${b.p}</p>`;
  if (b.label) return `<div class="reveal mx-auto flex max-w-2xl items-center gap-3 pt-2"><span class="rounded-full ${b.label === 'Было' ? 'bg-black/5 text-muted' : 'bg-ink text-white'} px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]">${b.label}</span><span class="h-px flex-1 bg-line"></span></div>`;
  if (b.ul) return `<ul class="reveal prose-case mx-auto max-w-2xl space-y-2.5 text-[16px] leading-[1.6] text-ink/70">${b.ul.map((li) => `<li class="flex gap-3"><span class="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30"></span><span>${li}</span></li>`).join('')}</ul>`;
  if (b.img) return `<div class="py-2">${figure(b.img, b.caption, { narrow: b.narrow })}</div>`;
  if (b.pair) return `<div class="grid gap-4 py-2 sm:grid-cols-2">${b.pair.map((k, i) => figure(k, b.captions?.[i] || '')).join('')}</div>`;
  return '';
}

function stagesBlock(stages) {
  return `<div class="reveal stages mx-auto max-w-2xl">
    <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">⚡️ Этапы</p>
    <ol class="mt-4 flex flex-wrap gap-2">${stages.map((s, i) =>
      `<li class="flex items-center gap-2 rounded-full border border-black/5 bg-white py-1.5 pl-1.5 pr-3.5 text-sm shadow-sm"><span class="stage-dot grid h-6 w-6 place-items-center rounded-full bg-ink font-mono text-[10px] text-white">${String(i + 1).padStart(2, '0')}</span>${s}</li>`).join('')}
    </ol>
  </div>`;
}

function summaryCard(s, wide) {
  return `<div class="reveal rounded-3xl border border-black/5 bg-white p-7 shadow-card ${wide ? 'md:col-span-2' : ''}">
    <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"><span class="mr-1.5 text-base not-italic">${s.icon}</span>${s.label}</p>
    <p class="prose-case mt-4 text-[16px] leading-[1.65] text-ink/80">${s.html}</p>
    ${s.list ? `<ul class="mt-4 grid gap-2 sm:grid-cols-2">${s.list.map((li) => `<li class="rounded-xl bg-paper px-4 py-3 text-sm leading-snug text-ink/80">${li}</li>`).join('')}</ul>` : ''}
  </div>`;
}

function resultsCard(c) {
  if (!c.results) return '';
  return `<div class="reveal relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-xl sm:p-9 ${c.metric ? 'md:col-span-1' : 'md:col-span-2'}">
    <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/40 to-sky-400/20 blur-3xl"></div>
    <p class="relative font-mono text-[11px] uppercase tracking-[0.18em] text-white/50"><span class="mr-1.5 text-base">🏅</span>Результаты</p>
    <ul class="relative mt-5 space-y-4">${c.results.map((r) => `<li class="flex gap-3 text-[16px] leading-[1.6] text-white/70 [&_b]:font-medium [&_b]:text-white"><span class="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"></span><span>${r}</span></li>`).join('')}</ul>
    ${c.resultsNote ? `<p class="relative mt-6 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/45">* ${c.resultsNote}</p>` : ''}
  </div>`;
}

function metricCard(m) {
  if (!m) return '';
  const [, prefix, num, suffix] = m.value.match(/^(\D*)(\d+)(.*)$/);
  return `<div class="reveal flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-7 shadow-card sm:p-9">
    <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Главная метрика</p>
    <div class="mt-8">
      <p class="font-display text-6xl font-medium tracking-[-0.05em] sm:text-7xl" data-count="${num}" data-prefix="${prefix}" data-suffix="${suffix}">${m.value}</p>
      <p class="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">${m.text}</p>
    </div>
  </div>`;
}

function caseCard(id, label) {
  const c = CASES[id];
  return `<a href="case.html?id=${id}" class="reveal group press flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
    <div class="overflow-hidden" style="background:${c.coverBg}; view-transition-name: cover-${id}">${picture(c.cover, { alt: c.title, zoom: false, cls: 'aspect-[5/4] object-cover transition-transform duration-700 group-hover:scale-105' })}</div>
    <div class="flex items-start justify-between gap-4 p-5">
      <div>
        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">${label || c.kicker || 'Проект'}</p>
        <h4 class="mt-1.5 font-display text-lg font-medium leading-snug tracking-tight">${c.title}</h4>
      </div>
      <span class="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">↗</span>
    </div>
  </a>`;
}

function render(id) {
  const c = CASES[id];
  const parent = c.parent && CASES[c.parent];
  document.title = `${c.title} — Полина Артамонова`;

  const backLink = (href, text) =>
    `<a href="${href}" class="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"><span class="nudge-left inline-block">←</span>${text}</a>`;
  const back = parent ? backLink(`case.html?id=${c.parent}`, parent.title) : backLink('index.html#work', 'Все проекты');

  const badge = c.kicker || c.period;

  const hero = `
  <section class="relative px-4 pb-16 pt-36 text-center sm:px-8 sm:pb-20 sm:pt-44">
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_30%,#ffffff_0%,#fafafa_70%)]"></div>
    <div class="reveal">${back}</div>
    ${badge ? `<div class="reveal mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-1.5 text-[13px] font-medium text-white shadow-lg">${badge}${c.kicker && parent ? `<span class="rounded-full border border-white/70 px-1.5 text-[10px] leading-4">${parent.title}</span>` : ''}</div>` : ''}
    <h1 data-split class="mx-auto mt-6 max-w-3xl font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.04em] sm:text-6xl">${c.title}</h1>
    ${c.lead ? `<p style="--stagger:480ms" class="reveal prose-case mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">${c.lead}</p>` : ''}
    <div style="--stagger:600ms" class="reveal mt-6 flex justify-center">${tags(c.tags)}</div>
  </section>
  <div class="px-4 pb-20 sm:px-8 sm:pb-28">
    <div class="overflow-hidden rounded-3xl border border-black/5 shadow-card" style="background:${c.coverBg}; view-transition-name: cover-${id}">${picture(c.cover, { alt: c.title, eager: true })}</div>
  </div>`;

  const summary = `
  <section class="cross relative border-t border-line px-4 py-20 sm:px-8 sm:py-28">
    <div class="reveal text-center">
      <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Коротко о проекте</p>
      <h2 class="mt-3 font-display text-[2rem] font-medium tracking-[-0.04em] sm:text-5xl">Задача и итог</h2>
    </div>
    <div data-stagger class="mt-12 grid gap-4 md:grid-cols-2">
      ${c.summary.map((s, i) => summaryCard(s, s.list || (c.summary.length % 2 === 1 && i === c.summary.length - 1))).join('')}
      ${resultsCard(c)}
      ${metricCard(c.metric)}
    </div>
  </section>`;

  const multi = c.sections.filter((s) => s.title).length > 1;
  let fn = 0;
  const sections = c.sections.map((s) => {
    if (s.title) fn++;
    const head = s.title ? `
      <div class="reveal mb-10 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">${multi ? `✏️ Функционал № ${fn}` : '✏️ Функционал'}</p>
        <h2 class="mt-3 font-display text-[2rem] font-medium tracking-[-0.04em] sm:text-5xl">${s.title}</h2>
      </div>` : (s.stages ? `
      <div class="reveal mb-10 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Процесс</p>
        <h2 class="mt-3 font-display text-[2rem] font-medium tracking-[-0.04em] sm:text-5xl">Как шла работа</h2>
      </div>` : '');
    const note = s.note ? `<div class="reveal mx-auto flex max-w-2xl gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900"><span>🔒</span><span>${s.note}</span></div>` : '';
    return `
    <section class="cross relative border-t border-line px-4 py-20 sm:px-8 sm:py-28">
      ${head}
      <div class="space-y-6">
        ${note}
        ${s.stages ? stagesBlock(s.stages) : ''}
        ${s.blocks.map(renderBlock).join('\n')}
      </div>
    </section>`;
  }).join('');

  const subcases = c.subcases ? `
    <section class="px-4 pb-20 sm:px-8 sm:pb-28">
      <div data-stagger class="grid gap-6 sm:grid-cols-2">${c.subcases.map((k) => caseCard(k)).join('')}</div>
    </section>` : '';

  const next = CASE_ORDER[(CASE_ORDER.indexOf(id) + 1) % CASE_ORDER.length];
  const nc = CASES[next];
  // одно имя перехода на странице может быть только у одного элемента
  const nextVT = c.subcases?.includes(next) ? '' : `; view-transition-name: cover-${next}`;
  const nextBlock = `
  <section class="cross relative border-t border-line px-4 py-20 sm:px-8 sm:py-28">
    <a href="case.html?id=${next}" class="reveal group grid items-center gap-8 md:grid-cols-2">
      <div class="overflow-hidden rounded-2xl border border-black/5 shadow-card transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl" style="background:${nc.coverBg}${nextVT}">
        ${picture(nc.cover, { alt: nc.title, zoom: false, cls: 'aspect-[5/3] object-cover transition-transform duration-700 group-hover:scale-[1.03]' })}
      </div>
      <div>
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Следующий ${nc.kicker ? 'кейс' : 'проект'}</p>
        <h2 class="mt-3 font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.04em] sm:text-5xl">${nc.title}</h2>
        <div class="mt-5 flex items-center gap-3 font-display text-[15px] font-medium">Смотреть ${ARROW('#0a0a0a', 'w-12')}</div>
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
