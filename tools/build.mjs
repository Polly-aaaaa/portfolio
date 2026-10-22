// Собирает статичные страницы кейсов case-<id>.html из шаблона и данных CASES:
// у каждой свой <title>, описание и превью для ссылок, а разметка видна без JS.
// Запуск: npm run build (после него Tailwind собирает css/tw.css).

import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const SITE = 'https://polly-aaaaa.github.io/portfolio/';
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

// cases.js и case.js — обычные браузерные скрипты, исполняем их в одном контексте
const ctx = vm.createContext({});
vm.runInContext(`${read('js/cases.js')}\n${read('js/case.js')}\n;globalThis.out = { CASES, CASE_ORDER, caseHTML };`, ctx);
const { CASES, CASE_ORDER, caseHTML } = ctx.out;

const text = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function describe(c) {
  const problem = c.summary.find((x) => x.label === 'Проблема');
  const s = text(c.lead || problem?.html || c.title);
  return s.length > 200 ? `${s.slice(0, s.lastIndexOf(' ', 197))}…` : s;
}

const template = read('tools/case-template.html');
for (const id of CASE_ORDER) {
  const c = CASES[id];
  const page = template
    .replace(/<!-- Шаблон[^>]*-->/, '<!-- Собрано tools/build.mjs: правьте tools/case-template.html и js/cases.js -->')
    .replaceAll('{{title}}', attr(c.title))
    .replaceAll('{{description}}', attr(describe(c)))
    .replaceAll('{{url}}', `${SITE}case-${id}.html`)
    .replaceAll('{{image}}', `${SITE}assets/og/${id}.jpg`)
    .replace('{{content}}', () => caseHTML(id));
  writeFileSync(new URL(`../case-${id}.html`, import.meta.url), page);
  console.log(`case-${id}.html`);
}
