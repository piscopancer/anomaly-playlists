'use client'

import * as RTooltip from '@radix-ui/react-tooltip'

type TTooltip = {
  children?: React.ReactNode
  content: React.ReactNode
  arrow?: boolean
  delay?: number
  open?: boolean
} & Omit<RTooltip.TooltipContentProps, 'content'>

export function Tooltip({ children, content, arrow, delay, open, ...htmlProps }: TTooltip) {
  return (
    <RTooltip.Provider delayDuration={delay || 100} disableHoverableContent>
      <RTooltip.Root open={open}>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Content {...htmlProps} className='relative z-[2] rounded-md border-2 border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-200'>
          <div className='absolute top-[-2px] inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent' />
          <div className='absolute bottom-[-2px] inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent' />
          {content}
          {(arrow === undefined || arrow) && <RTooltip.Arrow className='fill-zinc-600' />}
        </RTooltip.Content>
      </RTooltip.Root>
    </RTooltip.Provider>
  )
}
