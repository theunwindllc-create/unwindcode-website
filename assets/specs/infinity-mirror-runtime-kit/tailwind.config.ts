import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mirror: {
          void: '#030307',
          graphite: '#090B12',
          reflection: '#B9F7EF',
          proof: '#D6A84F',
          boundary: '#13B8A6',
          organism: '#7D53FF',
        },
      },
      borderRadius: {
        mirror: '8px',
      },
      transitionTimingFunction: {
        mirror: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'mirror-inner': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
} satisfies Config;
