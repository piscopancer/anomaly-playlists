import { TSong } from './song'
import { proxy, ref, subscribe, useSnapshot } from 'valtio'

const defaultStore = {
  songsBufferInput: null as ReturnType<typeof ref<HTMLInputElement>> | null,
  songs: [] as TSong[],
}

export const store = proxy(defaultStore)

export function useStoreSnapshot() {
  return useSnapshot(store)
}
