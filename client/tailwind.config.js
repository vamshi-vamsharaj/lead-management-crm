/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // DM Sans: clean, geometric — reads beautifully at all weights
        // Pairs with DM Mono for data/code elements
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        // Design system — all surface/text colors as named tokens
        canvas:  '#0C0E14',   // page background — near black, not pure
        surface: '#13151E',   // card/panel background
        raised:  '#1C1F2E',   // elevated elements, hover states
        border:  '#252836',   // subtle borders
        muted:   '#323650',   // disabled, placeholder borders

        // Text hierarchy
        ink: {
          primary:   '#F0F2F8',
          secondary: '#8B90A7',
          muted:     '#4E5368',
        },

        // Brand accent — electric indigo
        accent: {
          DEFAULT: '#7C6AF7',
          dim:     '#7C6AF720',
          hover:   '#6A57E8',
          muted:   '#7C6AF730',
        },

        // Status colors
        status: {
          new:            '#F59E0B',
          'new-dim':      '#F59E0B18',
          interested:     '#10B981',
          'interested-dim': '#10B98118',
          converted:      '#7C6AF7',
          'converted-dim': '#7C6AF718',
          rejected:       '#EF4444',
          'rejected-dim': '#EF444418',
        },

        // Source colors
        source: {
          call:      '#38BDF8',
          'call-dim': '#38BDF815',
          whatsapp:  '#25D366',
          'whatsapp-dim': '#25D36615',
          field:     '#FB923C',
          'field-dim': '#FB923C15',
        },
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        panel: '0 4px 24px rgba(0,0,0,0.5)',
        glow:  '0 0 20px rgba(124,106,247,0.15)',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-in':   'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up':   'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':    'shimmer 1.8s infinite',
        'pulse-dot':  'pulseDot 2s infinite',
        'scale-in':   'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn:  { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}