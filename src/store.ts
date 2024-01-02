import { devtools } from 'valtio/utils'
import { TSong } from './song'
import { proxy, ref, useSnapshot } from 'valtio'

const defaultStore = {
  songsBufferInput: null as ReturnType<typeof ref<HTMLInputElement>> | null,
  songs: [] as TSong[],
}

export const store = proxy(defaultStore)

export function useStoreSnapshot() {
  return useSnapshot(store)
}

devtools(store)
