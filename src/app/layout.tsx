import { project } from '@/project'
import type { Metadata } from 'next'
import '@/assets/styles/style.scss'
import { classes } from '@/utils'
import { fonts } from '@/assets/fonts'
import background from '@/assets/bg.jpg'

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
  openGraph: {
    title: project.name,
    description: project.description,
    images: [background.src],
    authors: [project.creator.nickname],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={classes(fonts.inter, 'bg-zinc-900 selection:bg-orange-400 selection:text-zinc-800 [-webkit-tap-highlight-color: transparent] ')}>{children}</body>
    </html>
  )
}
