// Иконки сайта: тонкий контур со скруглёнными концами, цвет — от текста.
// Рисованные иллюстрации прежних версий убраны вместе со сменой стиля.

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
  root.querySelectorAll('[data-icon]:not([data-mounted])').forEach((el) => {
    el.innerHTML = iconSVG(el.dataset.icon);
    el.dataset.mounted = '';
  });
}
mountDoodles();
