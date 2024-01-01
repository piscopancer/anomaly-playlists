import { Manrope, Roboto_Mono, Source_Sans_3, Finlandica, Inter } from 'next/font/google'

const robotoInit = Roboto_Mono({ subsets: ['cyrillic', 'latin'] })
const interInit = Inter({ subsets: ['latin', 'cyrillic'] })

export const fonts = {
  inter: interInit.className,
  roboto: robotoInit.className,
}
