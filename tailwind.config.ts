import type { Config } from 'tailwindcss';
const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;
export default { content: ['./src/**/*.{ts,tsx}'], theme: { extend: {
  colors: { navy: { DEFAULT: v('navy'), 800: v('navy-800'), 50: v('navy-50') }, gold: { DEFAULT: v('gold') }, flagred: v('red') },
  fontFamily: { serif: ['Georgia', 'Cambria', 'serif'] } } }, plugins: [] } satisfies Config;
