// Рендер страницы кейса по ?id=… из данных CASES (js/cases.js)

const icon = (name, cls = 'h-5 w-5') => `<span data-icon="${name}" class="inline-block shrink-0 ${cls}"></span>`;

// Сроки и теги — одной тихой строкой, без цветных чипов
const meta = (c) => [c.period, ...c.tags].filter(Boolean).join(' · ');

function picture(key, { alt = '', cls = '', zoom = true, eager = false } = {}) {
  const [w, h] = DIMS[key] || [1600, 1000];
  return `<img src="assets/${key}.webp" width="${w}" height="${h}" alt="${alt}" ${eager ? '' : 'loading="lazy"'} decoding="async"
    class="${zoom ? 'zoomable cursor-zoom-in ' : ''}h-auto w-full ${cls}" />`;
}

function figure(key, caption = '', { narrow = false } = {}) {
  return `<figure class="reveal ${narrow ? 'mx-auto max-w-xl' : ''}">
    <div class="rounded-[20px] soft-edge bg-mist-50 p-1.5 sm:p-2">${picture(key, { alt: caption, cls: 'rounded-[13px]' })}</div>
    ${caption ? `<figcaption class="mt-3 text-center text-sm text-ink/75">${caption}</figcaption>` : ''}
  </figure>`;
}

function renderBlock(b) {
  if (b.h) return `<h3 class="reveal mx-auto max-w-2xl pt-8 font-display text-2xl font-medium tracking-tight sm:text-[1.75rem]">${b.h}</h3>`;
  if (b.p) return `<p class="reveal prose-case mx-auto max-w-2xl text-[17px] leading-[1.7] text-ink/75">${b.p}</p>`;
  if (b.label) return `<div class="reveal mx-auto flex max-w-2xl items-center gap-3 pt-2"><span class="rounded-full ${b.label === 'Было' ? 'bg-mist-200 text-ink/80' : 'bg-ink text-white'} px-3 py-1 text-sm font-medium">${b.label}</span><span class="h-px flex-1 bg-line"></span></div>`;
  if (b.ul) return `<ul class="reveal prose-case mx-auto max-w-2xl space-y-2.5 text-[17px] leading-[1.6] text-ink/75">${b.ul.map((li) => `<li class="flex gap-3"><span class="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40"></span><span>${li}</span></li>`).join('')}</ul>`;
  if (b.img) return `<div class="py-2">${figure(b.img, b.caption, { narrow: b.narrow })}</div>`;
  if (b.pair) return `<div class="grid gap-4 py-2 sm:grid-cols-2">${b.pair.map((k, i) => figure(k, b.captions?.[i] || '')).join('')}</div>`;
  return '';
}

function stagesBlock(stages) {
  return `<div class="reveal stages mx-auto max-w-2xl">
    <h3 class="text-sm font-medium text-ink/75">Этапы</h3>
    <ol class="mt-3 flex flex-wrap gap-2">${stages.map((s, i) =>
      `<li class="flex items-center gap-2 rounded-full soft-edge bg-white py-1 pl-1 pr-3.5 text-sm"><span class="stage-dot grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-medium tabular-nums text-white">${i + 1}</span>${s}</li>`).join('')}
    </ol>
  </div>`;
}

// «Задача и итог»: проблема → цель, затем роль и что сделала, в конце — тёмная панель результатов
const badge = (name, cls = 'soft-edge bg-mist-200 text-ink') =>
  `<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full ${cls}">${icon(name, 'h-[18px] w-[18px]')}</span>`;

const labelHead = (s, badgeCls) =>
  `<div class="flex items-center gap-3">${badge(s.icon, badgeCls)}<h3 class="font-display text-lg font-medium tracking-tight">${s.label}</h3></div>`;

function problemGoal(problem, goal) {
  if (!problem || !goal) return '';
  return `
  <div class="reveal"><div class="puff puff-lg rounded-3xl bg-white">
  <div class="relative grid overflow-hidden rounded-[22px] md:grid-cols-2">
    <div class="p-7 sm:p-10">
      ${labelHead(problem, 'soft-edge bg-mist-200 text-ink')}
      <p class="prose-case mt-6 font-display text-[1.25rem] leading-snug tracking-tight text-ink/75 sm:text-[1.375rem]">${problem.html}</p>
    </div>
    <div class="border-t border-white bg-[radial-gradient(120%_120%_at_20%_0%,#ffffff_0%,#d9eaf6_75%)] p-7 sm:p-10 md:border-l md:border-t-0">
      ${labelHead(goal, 'soft-edge bg-white text-ink')}
      <p class="prose-case mt-6 font-display text-[1.25rem] leading-snug tracking-tight text-ink sm:text-[1.375rem]">${goal.html}</p>
    </div>
    <span class="absolute left-1/2 top-1/2 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full soft-edge bg-white md:grid">${icon('arrow-r', 'h-5 w-5')}</span>
  </div></div></div>`;
}

function detailRow(s) {
  const list = s.list
    ? `<ul class="mt-5 grid gap-2.5 sm:grid-cols-2">${s.list.map((li) =>
        `<li class="flex items-start gap-3 rounded-2xl soft-edge bg-white px-4 py-3.5 text-[15px] leading-snug text-ink/80"><span class="grid h-6 w-6 shrink-0 place-items-center rounded-full soft-edge bg-mist-200 text-ink">${icon('check', 'h-3.5 w-3.5')}</span><span>${li}</span></li>`).join('')}</ul>`
    : '';
  return `
  <div class="reveal grid gap-4 border-b border-line py-8 md:grid-cols-[13rem_1fr] md:gap-10">
    <div class="self-start">${labelHead(s)}</div>
    <div><p class="prose-case max-w-[62ch] text-[17px] leading-[1.65] text-ink/80">${s.html}</p>${list}</div>
  </div>`;
}

function resultsPanel(c) {
  if (!c.results) return '';
  const cols = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' }[Math.min(c.results.length, 3)];
  const items = c.results.map((r) =>
    `<li class="border-t border-white/15 pt-5"><p class="font-display text-lg leading-snug tracking-tight text-white/65 sm:text-xl [&_b]:font-medium [&_b]:text-white">${r}</p></li>`).join('');
  const note = c.resultsNote ? `<p class="mt-8 text-sm leading-relaxed text-white/60">* ${c.resultsNote}</p>` : '';
  return `
  <div class="reveal mt-10"><div class="night rounded-3xl p-7 sm:p-10">
    <span aria-hidden="true" class="orb" style="width:10px;height:10px;right:8%;top:14%;background:#fbd38f"></span>
    <span aria-hidden="true" class="orb" style="width:7px;height:7px;right:20%;top:8%;background:#f5a27f;animation-delay:1.4s"></span>
    <div class="flex items-center gap-3">${badge('star', 'bg-white/15 text-white')}<h3 class="font-display text-xl font-medium tracking-tight">Результаты</h3></div>
    <ul class="mt-8 grid gap-x-8 gap-y-6 ${cols}">${items}</ul>
    ${note}
  </div></div>`;
}

function caseCard(id) {
  const c = CASES[id];
  return `<a href="case.html?id=${id}" class="reveal group block"><div class="puff puff-lift puff-lg rounded-2xl bg-white">
    <div class="overflow-hidden rounded-t-[14px]" style="background:${c.coverBg}; view-transition-name: cover-${id}">${picture(c.cover, { alt: c.title, zoom: false, cls: 'aspect-[5/4] object-cover transition-transform duration-700 group-hover:scale-105' })}</div>
    <div class="flex items-center justify-between gap-4 p-5">
      <h4 class="font-display text-lg font-medium leading-snug tracking-tight">${c.title}</h4>
    </div>
  </div></a>`;
}

const h2 = (html, extra = '') => `<h2 class="${extra} font-display text-[2rem] font-medium tracking-[-0.04em] sm:text-5xl">${html}</h2>`;

function render(id) {
  const c = CASES[id];
  const parent = c.parent && CASES[c.parent];
  document.title = `${c.title} — Полина Артамонова`;

  const backLink = (href, text) =>
    `<a href="${href}" class="group inline-flex items-center gap-2 text-sm text-ink/75 transition-colors hover:text-ink"><span class="nudge-left inline-block">${icon('arrow-l', 'h-4 w-4')}</span>${text}</a>`;
  const back = parent ? backLink(`case.html?id=${c.parent}`, parent.title) : backLink('index.html#work', 'Все проекты');

  const hero = `
  <section class="relative isolate px-4 pb-16 pt-36 text-center sm:px-8 sm:pb-20 sm:pt-44">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span class="haze" style="width:24rem;height:16rem;left:50%;top:8%;transform:translateX(-80%);background:#cfe3f2;opacity:.8"></span>
      <span class="haze" style="width:20rem;height:14rem;left:50%;top:24%;transform:translateX(0%);background:#fcdccb;opacity:.7"></span>
      <span class="orb" style="width:9px;height:9px;left:16%;top:40%;background:#fbd38f"></span>
      <span class="orb" style="width:11px;height:11px;right:17%;top:30%;background:#f5a27f;animation-delay:1s"></span>
    </div>
    <div class="reveal">${back}</div>
    <h1 data-split class="mx-auto mt-8 max-w-3xl font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.04em] sm:text-6xl">${c.title}</h1>
    ${c.lead ? `<p style="--stagger:480ms" class="reveal prose-case mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink/80 sm:text-base">${c.lead}</p>` : ''}
    <p style="--stagger:600ms" class="reveal mt-5 text-sm text-ink/75">${meta(c)}</p>
  </section>
  <div class="px-4 pb-20 sm:px-8 sm:pb-28">
    <div class="puff puff-lg rounded-3xl" style="background:${c.coverBg}"><div class="overflow-hidden rounded-[22px]" style="view-transition-name: cover-${id}">${picture(c.cover, { alt: c.title, eager: true })}</div></div>
  </div>`;

  const problem = c.summary.find((x) => x.label === 'Проблема');
  const goal = c.summary.find((x) => x.label === 'Задача' || x.label === 'Цель');
  const details = c.summary.filter((x) => x !== problem && x !== goal);

  const summary = `
  <section class="cross relative border-t border-line px-4 py-20 sm:px-8 sm:py-28">
    <div class="reveal text-center">
      <span data-doodle="glasses" class="doodle-slot mb-5 h-20 w-20 sm:h-24 sm:w-24"></span>
      ${h2('Задача и итог')}
    </div>
    <div class="mx-auto mt-12 max-w-5xl">
      ${problemGoal(problem, goal)}
      ${details.length ? `<div class="mt-6 border-t border-line">${details.map(detailRow).join('')}</div>` : ''}
      ${resultsPanel(c)}
    </div>
  </section>`;

  const multi = c.sections.filter((s) => s.title).length > 1;
  let fn = 0;
  let pencil = `<span data-doodle="pencil" class="doodle-slot mb-5 h-20 w-20 sm:h-24 sm:w-24"></span>`;
  const usePencil = () => { const p = pencil; pencil = ''; return p; };
  const sections = c.sections.map((s) => {
    if (s.title) fn++;
    // номер нужен только когда частей несколько — порядок здесь несёт смысл
    const num = multi ? `<span class="tabular-nums text-ink/45">${fn}.</span> ` : '';
    const head = s.title
      ? `<div class="reveal mb-10 text-center">${usePencil()}${h2(num + s.title)}</div>`
      : (s.stages ? `<div class="reveal mb-10 text-center">${usePencil()}${h2('Как шла работа')}</div>` : '');
    const note = s.note
      ? `<div class="reveal mx-auto flex max-w-2xl items-start gap-3 rounded-2xl soft-edge bg-mist-50 px-5 py-4 text-[15px] leading-relaxed text-ink/80">${icon('lock', 'mt-0.5 h-5 w-5 text-ink')}<span>${s.note}</span></div>`
      : '';
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
      <div class="puff puff-lift puff-lg rounded-2xl" style="background:${nc.coverBg}">
        <div class="overflow-hidden rounded-[14px]" style="${nextVT.replace('; ', '')}">${picture(nc.cover, { alt: nc.title, zoom: false, cls: 'aspect-[5/3] object-cover transition-transform duration-700 group-hover:scale-[1.03]' })}</div>
      </div>
      <div>
        <span data-doodle="plane" class="doodle-slot mb-4 h-16 w-16"></span>
        ${h2(nc.title, 'leading-[1.1]')}
        <div class="link-u mt-5 inline-block font-display text-[15px] font-medium">${nc.parent ? 'Следующий кейс' : 'Следующий проект'}</div>
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
