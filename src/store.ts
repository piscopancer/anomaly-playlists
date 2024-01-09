'use client'

import { devtools } from 'valtio/utils'
import { TSong } from './song'
import { proxy, ref, useSnapshot } from 'valtio'
import { FFmpeg } from '@ffmpeg/ffmpeg'

const defaultStore = {
  songsBufferInput: null! as ReturnType<typeof ref<HTMLInputElement>>,
  songs: [] as TSong[],
}

export const store = proxy(defaultStore)

export function useStoreSnapshot() {
  return useSnapshot(store)
}

devtools(store)
