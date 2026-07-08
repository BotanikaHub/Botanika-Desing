/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        azul: '#303890',
        'azul-escuro': '#20266B',
        'azul-claro': '#4a52b8',
        'verde-lima': '#D0E088',
        amarelo: '#F8C840',
        preto: '#181010',
        'preto-deep': '#050404',
        creme: '#F8F0E8',
        'creme-claro': '#FCF7EE',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.02em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
