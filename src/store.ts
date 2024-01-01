import { useProxy } from 'valtio/utils'
import { TSong } from './song'
import { proxy, useSnapshot } from 'valtio'

export const store = proxy<{ songs: TSong[] }>({
  songs: [],
})

export function useStoreSnapshot() {
  return useSnapshot(store)
}
