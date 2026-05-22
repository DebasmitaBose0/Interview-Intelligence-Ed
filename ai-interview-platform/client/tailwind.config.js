/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          deep: '#0b0f19',
          card: 'rgba(15, 23, 42, 0.65)',
          neonBlue: '#06b6d4',
          neonPurple: '#a855f7',
          neonIndigo: '#6366f1',
          accent: '#10b981',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
        'glow-purple': 'glowPurple 2.5s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2), 0 0 10px rgba(6, 182, 212, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.6), 0 0 25px rgba(6, 182, 212, 0.3)' },
        },
        glowPurple: {
          '0%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.2), 0 0 10px rgba(168, 85, 247, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(168, 85, 247, 0.6), 0 0 25px rgba(168, 85, 247, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
