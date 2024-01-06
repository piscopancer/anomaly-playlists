import { store } from './store'

export type TSong = {
  name: string
  changedName?: string
  size: number
  converting?: true
}

export function getSongsAsFiles() {
  return [...store.songsBufferInput.files!]
}
