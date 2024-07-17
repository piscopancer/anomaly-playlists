import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: `var(--font-geist-sans)`,
        mono: `var(--font-geist-mono)`,
      },
      colors: {
        accent: '#d6a726',
      },
    },
  },
  plugins: [],
}
export default config
