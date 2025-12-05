/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: 'var(--shadow-soft)'
      },
      borderRadius: {
        xl: '1rem'
      },
      keyframes: {
        orbFloat: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(15px,-20px,0) scale(1.08)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1)' }
        },
        orbFloatMedium: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(-20px,25px,0) scale(0.95)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1)' }
        },
        waveMove: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-10%)' }
        },
        modalIn: {
          '0%': { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
        },
        drawerIn: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        healthBreathe: {
          '0%, 100%': { transform: 'scale(0.96)', opacity: 0.9 },
          '50%': { transform: 'scale(1.03)', opacity: 1 }
        },
        pulseSoft: {
          '0%': { strokeDashoffset: 100 },
          '100%': { strokeDashoffset: 0 }
        },
        slideUpSoft: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        ringSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        orbPulse: {
          '0%': { opacity: 0.4 },
          '50%': { opacity: 0.9 },
          '100%': { opacity: 0.4 }
        }
      },
      animation: {
        'orb-slow': 'orbFloat 18s ease-in-out infinite',
        'orb-medium': 'orbFloatMedium 14s ease-in-out infinite',
        'wave-slow': 'waveMove 22s linear infinite',
        'modal-in': 'modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'drawer-in': 'drawerIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'health-breathe-slow': 'healthBreathe 4s ease-in-out infinite',
        'health-breathe-medium': 'healthBreathe 3s ease-in-out infinite',
        'health-breathe-fast': 'healthBreathe 2.2s ease-in-out infinite',
        'health-breathe-critical': 'healthBreathe 1.6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'slide-up-soft': 'slideUpSoft 0.4s ease-out both',
        'avatar-ring': 'ringSpin 14s linear infinite',
        'avatar-ring-critical': 'ringSpin 6s linear infinite',
        'orb-pulse': 'orbPulse 5s ease-in-out infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
  future: {
    hoverOnlyWhenSupported: true
  }
};
