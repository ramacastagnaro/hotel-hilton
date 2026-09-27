/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF2F8',
          100: '#D7E0EE',
          200: '#AFC2DD',
          300: '#809FC9',
          400: '#4F79B0',
          500: '#2E5791',
          600: '#1E3F73',
          700: '#163057',
          800: '#0F2143',
          900: '#0A1A35',
          950: '#060F22',
        },
        gold: {
          50: '#FBF6E9',
          100: '#F4E7C4',
          200: '#E9D08C',
          300: '#DDBB5A',
          400: '#D0A23E',
          500: '#C9A24B',
          600: '#B0862F',
          700: '#8C6A24',
          800: '#6B521D',
          900: '#4D3B16',
        },
        success: {
          DEFAULT: '#2F7D5B',
          light: '#E3F1EA',
        },
        danger: {
          DEFAULT: '#7B1E3A',
          light: '#F6E4E9',
        },
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        btn: '0.75rem',
        card: '1rem',
      },
      boxShadow: {
        card: '0 4px 16px rgba(10,26,53,0.08)',
        float: '0 18px 40px rgba(10,26,53,0.16)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
