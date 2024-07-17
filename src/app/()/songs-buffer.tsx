import { store } from '@/components/store'
import { useEffect, useRef } from 'react'
import { ref } from 'valtio'

export default function SongsBuffer() {
  const songsBufferInput = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    store.songsBufferInput = ref(songsBufferInput.current)
  }, [])

  return <input ref={songsBufferInput} multiple type='file' className='hidden' />
}
