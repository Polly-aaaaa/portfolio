/** Цвета и шрифт сайта. Классы ищутся в страницах и в js/case.js, где собирается разметка кейсов. */
module.exports = {
  content: ['./index.html', './tools/case-template.html', './js/*.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['Onest', 'sans-serif'] },
      colors: { ink: '#1e1e1e', paper: '#f5f5f5', line: '#e3e3e3', purple: '#7b3fe4', blue: '#0b72d6', marker: '#ffcd29', sel: '#0d99ff' },
    },
  },
};
