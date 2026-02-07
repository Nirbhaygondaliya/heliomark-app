/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm sunset brand palette
        helio: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fad6a5',
          300: '#f6b96d',
          400: '#f19533',
          500: '#ee7a11',
          600: '#df6108',
          700: '#b94909',
          800: '#933a0f',
          900: '#773210',
        },
        sand: {
          50: '#fdfbf7',
          100: '#faf5eb',
          200: '#f3e8d3',
          300: '#e9d5b3',
          400: '#dbb888',
        },
        ink: {
          50: '#f6f5f4',
          100: '#e7e5e2',
          200: '#d1ccc6',
          300: '#b3aba2',
          400: '#948a7e',
          500: '#7a7064',
          600: '#625a50',
          700: '#504a42',
          800: '#3d3833',
          900: '#2c2824',
          950: '#1a1714',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.06), 0 10px 20px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 0 0 1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.04)',
        'warm': '0 4px 20px -4px rgba(241, 149, 51, 0.25)',
        'glow': '0 0 30px -5px rgba(241, 149, 51, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-warm': 'pulseWarm 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseWarm: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(241, 149, 51, 0.2)' },
          '50%': { boxShadow: '0 0 0 12px rgba(241, 149, 51, 0)' },
        },
      },
    },
  },
  plugins: [],
}