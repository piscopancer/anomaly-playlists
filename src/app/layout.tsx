import { projectInfo } from '@/project'
import type { Metadata } from 'next'
import '@/assets/styles/style.scss'
import { classes } from '@/utils'
import { fonts } from '@/assets/fonts'

export const metadata: Metadata = {
  title: projectInfo.name,
  description: projectInfo.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={classes(fonts.inter, 'bg-zinc-900 selection:bg-zinc-800 selection:text-zinc-200 [-webkit-tap-highlight-color: transparent] ')}>{children}</body>
    </html>
  )
}
