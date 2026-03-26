/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        stone: {
          50: '#faf9f6',
          100: '#f5f3ef',
          200: '#e8e5e0',
          300: '#d0cdc7',
          400: '#c0bdb7',
          500: '#9a958f',
          600: '#5a5550',
          800: '#1a1815',
        },
        indigo: {
          900: '#1a2c5e',
          800: '#2c3e7a',
          700: '#3d52a8',
          100: '#e8ebf5',
          50: '#f0f0fb',
        },
        emerald: {
          700: '#15803d',
          800: '#1a5c3a',
          900: '#145030',
          50: '#e6f2ec',
          100: '#dcfce7',
        },
        rose: {
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          100: '#fee2e2',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,.08)',
        'card-hover': '0 8px 16px rgba(0,0,0,.06), 0 20px 40px rgba(0,0,0,.1)',
        'glow-indigo': '0 4px 12px rgba(44,62,122,.3)',
        'glow-emerald': '0 4px 12px rgba(26,92,58,.1)',
      },
    },
  },
  plugins: [],
}
