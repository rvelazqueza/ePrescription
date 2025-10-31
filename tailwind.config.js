/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Medical Design System Colors
        medical: {
          primary: {
            50: 'var(--medical-primary-50)',
            100: 'var(--medical-primary-100)',
            200: 'var(--medical-primary-200)',
            300: 'var(--medical-primary-300)',
            400: 'var(--medical-primary-400)',
            500: 'var(--medical-primary-500)',
            600: 'var(--medical-primary-600)',
            700: 'var(--medical-primary-700)',
            800: 'var(--medical-primary-800)',
            900: 'var(--medical-primary-900)',
          },
          success: {
            50: 'var(--medical-success-50)',
            100: 'var(--medical-success-100)',
            200: 'var(--medical-success-200)',
            300: 'var(--medical-success-300)',
            400: 'var(--medical-success-400)',
            500: 'var(--medical-success-500)',
            600: 'var(--medical-success-600)',
            700: 'var(--medical-success-700)',
            800: 'var(--medical-success-800)',
            900: 'var(--medical-success-900)',
          },
          warning: {
            50: 'var(--medical-warning-50)',
            100: 'var(--medical-warning-100)',
            200: 'var(--medical-warning-200)',
            300: 'var(--medical-warning-300)',
            400: 'var(--medical-warning-400)',
            500: 'var(--medical-warning-500)',
            600: 'var(--medical-warning-600)',
            700: 'var(--medical-warning-700)',
            800: 'var(--medical-warning-800)',
            900: 'var(--medical-warning-900)',
          },
          error: {
            50: 'var(--medical-error-50)',
            100: 'var(--medical-error-100)',
            200: 'var(--medical-error-200)',
            300: 'var(--medical-error-300)',
            400: 'var(--medical-error-400)',
            500: 'var(--medical-error-500)',
            600: 'var(--medical-error-600)',
            700: 'var(--medical-error-700)',
            800: 'var(--medical-error-800)',
            900: 'var(--medical-error-900)',
          },
          neutral: {
            50: 'var(--medical-neutral-50)',
            100: 'var(--medical-neutral-100)',
            200: 'var(--medical-neutral-200)',
            300: 'var(--medical-neutral-300)',
            400: 'var(--medical-neutral-400)',
            500: 'var(--medical-neutral-500)',
            600: 'var(--medical-neutral-600)',
            700: 'var(--medical-neutral-700)',
            800: 'var(--medical-neutral-800)',
            900: 'var(--medical-neutral-900)',
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

