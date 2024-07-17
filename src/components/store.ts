'use client'

import { proxy, ref, useSnapshot } from 'valtio'
import { devtools } from 'valtio/utils'
import { TSong } from './song'

const defaultStore = {
  songsBufferInput: null! as ReturnType<typeof ref<HTMLInputElement>>,
  songs: [] as TSong[],
}

export const store = proxy(defaultStore)

export function useStoreSnapshot() {
  return useSnapshot(store)
}

devtools(store)
