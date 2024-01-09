'use client'

import { useStoreSnapshot } from '@/store'
import { TRedefineObject } from '@/utils'
import * as RToast from '@radix-ui/react-toast'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { Fragment, ReactNode, forwardRef, useEffect, useMemo, useState } from 'react'
import { IconType } from 'react-icons'
import { TbAlertHexagon, TbCircleCheck } from 'react-icons/tb'
import { proxy, ref, useSnapshot } from 'valtio'

type TToast = {
  id: string
  title: string
  description: ReturnType<typeof ref<() => ReactNode>>
  type: 'warning' | 'success'
}

export const toastsStore = proxy<{ toasts: TToast[] }>({
  toasts: [],
})

export function showToast(toast: TRedefineObject<TToast, { description: ReactNode }>) {
  const description = ref(() => toast.description)
  toastsStore.toasts.push({ ...toast, description })
}

export default function Toasts() {
  const toastsSnap = useSnapshot(toastsStore)

  return (
    <RToast.Provider>
      <AnimatePresence>
        {toastsSnap.toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
      <FfmpegConvertingToast />
      <RToast.Viewport className='fixed inset-0 z-[1000] pointer-events-none flex items-end justify-start p-4 flex-col-reverse gap-2' />
    </RToast.Provider>
  )
}

export const Toast = forwardRef<HTMLDivElement, { toast: TToast }>(({ toast }, ref) => {
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0, x: '-10%' })
    selfAnim.start({ opacity: 1, x: 0 })
  }, [selfAnim])

  function Icon({ type }: { type: TToast['type'] }) {
    const IconForType: IconType = (
      {
        success: TbCircleCheck,
        warning: TbAlertHexagon,
      } satisfies Record<TToast['type'], IconType>
    )[type]
    return <IconForType className='stroke-orange-400 h-8 row-span-2 mr-4 self-center' />
  }

  return (
    <RToast.Root
      key={toast.id}
      asChild
      open={true}
      onOpenChange={(open) => {
        !open && (toastsStore.toasts = toastsStore.toasts.filter((t) => t.id !== toast.id))
      }}
      className='relative border-2 border-zinc-800 rounded-md bg-zinc-900 px-4 py-2 max-w-[64ch] grid grid-cols-[auto_1fr] grid-rows-[auto_auto]'
    >
      <motion.div layout='position' ref={ref} animate={selfAnim} exit={{ opacity: 0, x: '100%' }}>
        <div className='absolute top-[-2px] inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent' />
        <div className='absolute bottom-[-2px] inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent' />
        <Icon type={toast.type} />
        <RToast.Title className='text-zinc-400 text-sm mb-1'>{toast.title}</RToast.Title>
        <RToast.Description className='text-zinc-200 text-sm'>{toast.description()}</RToast.Description>
      </motion.div>
    </RToast.Root>
  )
})

Toast.displayName = 'Toast'

function FfmpegConvertingToast() {
  const storeSnap = useStoreSnapshot()
  const songsConverting = storeSnap.songs.filter((s) => s.converting).map((s) => s.converting!)
  const totalProgress = songsConverting.reduce((prev, next) => prev + next.progress, 0) / songsConverting.length

  return (
    <AnimatePresence>
      {songsConverting.length && (
        <Toast
          key={'songs-converting-toast'}
          toast={{
            id: crypto.randomUUID(),
            type: 'warning',
            title: 'Files are converting...',
            description: ref(() => (
              <div>
                <p className='mb-1'>
                  Wait as your <code className='text-orange-400'>{songsConverting.length}</code> files are converting to <code className='text-orange-400'>.ogg</code>
                </p>
                <div className='h-2 rounded-full bg-zinc-700 overflow-hidden'>
                  <div className='h-full bg-orange-400 origin-left' style={{ scale: `${totalProgress} 1` }} />
                </div>
              </div>
            )),
          }}
        />
      )}
    </AnimatePresence>
  )
}
