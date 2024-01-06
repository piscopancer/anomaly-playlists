'use client'

import { devtools } from 'valtio/utils'
import { TSong } from './song'
import { proxy, ref, useSnapshot } from 'valtio'
import { FFmpeg } from '@ffmpeg/ffmpeg'

const defaultStore = {
  songsBufferInput: null! as ReturnType<typeof ref<HTMLInputElement>>,
  ffmpeg: { state: 'not-ready' } as
    | {
        state: 'not-ready' | 'loading'
      }
    | { state: 'ready'; self: FFmpeg },
  songs: [] as TSong[],
}

export const store = proxy(defaultStore)

export function useStoreSnapshot() {
  return useSnapshot(store)
}

devtools(store)
