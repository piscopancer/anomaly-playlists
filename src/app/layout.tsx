import bg from '@/assets/bg'
import { fonts } from '@/assets/fonts'
import '@/assets/styles/style.scss'
import Toasts from '@/components/toast'
import { project } from '@/project'
import { classes } from '@/utils'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
  openGraph: {
    title: project.name,
    description: project.description,
    images: [bg],
    authors: [project.creator.nickname],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={classes(fonts.inter, 'bg-zinc-900 selection:bg-orange-400 selection:text-zinc-800 [-webkit-tap-highlight-color: transparent] ')}>
        {children}
        <Toasts />
      </body>
    </html>
  )
}
