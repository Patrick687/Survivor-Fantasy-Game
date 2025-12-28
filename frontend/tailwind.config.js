/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Safelist all palette color classes for bg, text, border
    ...[
      'pearl-aqua',
      'pacific-blue',
      'dusty-grape',
      'dark-amethyst',
      'midnight-violet',
    ].flatMap((color) =>
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].flatMap(
        (shade) => [
          `bg-${color}-${shade}`,
          `text-${color}-${shade}`,
          `border-${color}-${shade}`,
        ]
      )
    ),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600 (accent)
          light: '#60a5fa', // blue-400
          dark: '#1e40af', // blue-800
        },
        background: {
          DEFAULT: '#f8fafc', // neutral-50 (light background)
          dark: '#18181b', // neutral-900 (dark background)
        },
        surface: {
          DEFAULT: '#fff', // white (light surface)
          dark: '#27272a', // neutral-800 (dark surface)
        },
        border: {
          DEFAULT: '#e5e7eb', // neutral-200
          dark: '#3f3f46', // neutral-700
        },
        text: {
          DEFAULT: '#18181b', // neutral-900 (light text)
          dark: '#f4f4f5', // neutral-100 (dark text)
          secondary: '#71717a', // neutral-500
        },
        'pearl-aqua': {
          50: '#edf8f5',
          100: '#dbf0ec',
          200: '#b7e1d9',
          300: '#92d3c6',
          400: '#6ec4b3',
          500: '#4ab5a0',
          600: '#3b9180',
          700: '#2c6d60',
          800: '#1e4840',
          900: '#0f2420',
          950: '#0a1916',
        },
        'pacific-blue': {
          50: '#f0f4f5',
          100: '#e0e9eb',
          200: '#c2d3d6',
          300: '#a3bdc2',
          400: '#85a7ad',
          500: '#669199',
          600: '#52747a',
          700: '#3d575c',
          800: '#293a3d',
          900: '#141d1f',
          950: '#0e1415',
        },
        'dusty-grape': {
          50: '#f0eff5',
          100: '#e0dfec',
          200: '#c2bfd9',
          300: '#a39fc6',
          400: '#8580b3',
          500: '#66609f',
          600: '#524d80',
          700: '#3d3960',
          800: '#292640',
          900: '#141320',
          950: '#0e0d16',
        },
        'dark-amethyst': {
          50: '#f1eef7',
          100: '#e2ddee',
          200: '#c6bbdd',
          300: '#a998cd',
          400: '#8c76bc',
          500: '#7054ab',
          600: '#594389',
          700: '#433267',
          800: '#2d2244',
          900: '#161122',
          950: '#100c18',
        },
        'midnight-violet': {
          50: '#fde7f6',
          100: '#fccfee',
          200: '#f99fdc',
          300: '#f66fcb',
          400: '#f33fba',
          500: '#f00fa9',
          600: '#c00c87',
          700: '#900965',
          800: '#600643',
          900: '#300322',
          950: '#220218',
        },
      },
    },
  },
  plugins: [],
};
