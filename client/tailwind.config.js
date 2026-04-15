import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy colors (kept for compatibility)
        cream: '#F5F3EE',
        'bg-primary': '#EDF1E8',
        'bg-dark': '#3D4F2F',
        'bg-medium-green': '#8B9E7B',
        'bg-light-sage': '#D5DCCC',
        'accent-green': '#5C7045',
        'accent-green-light': '#7B8F6B',
        'font-primary': '#1A1A1A',
        'font-secondary': '#4A4A4A',
        'font-tertiary': '#7A7A7A',
        'font-green': '#3D4F2F',
        'font-light': '#FFFFFF',
        'border-dark': '#3D4F2F',
        'border-light': '#C5CDB9',

        // shadcn CSS variable colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        hero: ['64px', { lineHeight: '1.1' }],
        section: ['40px', { lineHeight: '1.2' }],
        subsection: ['28px', { lineHeight: '1.3' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        body: ['16px', { lineHeight: '1.6' }],
        sm: ['14px', { lineHeight: '1.5' }],
        xs: ['12px', { lineHeight: '1.5' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        full: '999px',
      },
    },
  },
  plugins: [animate],
}
