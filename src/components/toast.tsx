'use client'

import * as RToast from '@radix-ui/react-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { TbAlertHexagon } from 'react-icons/tb'
import { proxy, ref, useSnapshot } from 'valtio'

type TToast = {
  title: string
  description: ReturnType<typeof ref<() => ReactNode>>
  type: 'warning' | 'success'
}

export const toastStore = proxy<{ toast: TToast | null }>({
  toast: null,
})

export function showToast(toast: TToast) {
  toastStore.toast = toast
}

export default function Toasts() {
  const toastSnap = useSnapshot(toastStore)

  return (
    <RToast.Provider>
      <AnimatePresence>
        {!!toastStore.toast && (
          <RToast.Root asChild open={true} onOpenChange={(open) => !open && (toastStore.toast = null)} className='border-2 border-zinc-800 rounded-md bg-zinc-900 px-4 py-2 max-w-[64ch] grid grid-cols-[auto_1fr] grid-rows-[auto_auto]'>
            <motion.div initial={{ opacity: 0, x: '-10%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}>
              <TbAlertHexagon className='h-8 stroke-orange-400 row-span-2 mr-4 self-center' />
              <RToast.Title className='text-zinc-400 text-sm mb-2'>{toastSnap.toast?.title}</RToast.Title>
              <RToast.Description className='text-zinc-200 text-sm'>{toastSnap.toast?.description()}</RToast.Description>
            </motion.div>
          </RToast.Root>
        )}
      </AnimatePresence>
      <RToast.Viewport className='fixed inset-0 z-[1000] pointer-events-none flex items-end justify-end p-4' />
    </RToast.Provider>
  )
}
