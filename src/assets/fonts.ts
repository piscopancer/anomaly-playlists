import { Inter, Roboto_Mono } from 'next/font/google'

const robotoInit = Roboto_Mono({ subsets: ['cyrillic', 'latin'] })
const interInit = Inter({ subsets: ['latin', 'cyrillic'] })

export const fonts = {
  inter: interInit.className,
  roboto: robotoInit.className,
}
