import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#d6a726',
      },
    },
  },
  plugins: [],
}
export default config
