import { store, useStoreSnapshot } from '@/store'
import { useRef, useState, useEffect } from 'react'
import { TbMusicPlus } from 'react-icons/tb'
import { filterOutSongs } from '.'

export default function DropSongsArea() {
  const self = useRef<HTMLInputElement>(null!)
  const snap = useStoreSnapshot()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    addEventListener('dragenter', () => {
      setDragging(true)
    })
  }, [])

  function onSongsDrop(e: React.ChangeEvent<HTMLInputElement>) {
    if (!snap.songsBufferInput) return
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const dt = new DataTransfer()
    if (!snap.songsBufferInput.files || !e.target.files) {
      console.log('no files')
      return
    }
    const filteredFiles = filterOutSongs(Array.from(e.target.files))
    const files = [...snap.songsBufferInput.files, ...filteredFiles]
    Array.from(files).forEach((f) => dt.items.add(f))
    snap.songsBufferInput.files = dt.files
    store.songs = files.map((f) => ({
      name: f.name,
      size: f.size,
    }))
    snap.songsBufferInput.dispatchEvent(new Event('change', { bubbles: true }))
  }

  return dragging ? (
    <div ref={self} className='bg-orange-400/20 backdrop-brightness-50 fixed z-[1] inset-0 flex items-center justify-center' onDragLeave={() => setDragging(false)}>
      <input multiple type='file' accept='audio/ogg' onChange={onSongsDrop} className='absolute inset-0 opacity-0' />
      <div>
        <TbMusicPlus className='mx-auto mb-4 w-16 h-16 stroke-zinc-200' />
        <p className='text-2xl text-zinc-200 text-center'>Drop music files</p>
      </div>
    </div>
  ) : null
}
