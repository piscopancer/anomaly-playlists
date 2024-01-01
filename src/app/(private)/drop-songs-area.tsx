import { store, useStoreSnapshot } from '@/store'
import { useRef, useState, useEffect } from 'react'
import { TbMusicPlus, TbPlaylistAdd } from 'react-icons/tb'

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
    const files = [...snap.songsBufferInput.files, ...e.target.files]
    if (files.some((file) => file.type !== 'audio/ogg')) {
      console.log('ALL FILES MUST BE OGG!')
      return
    }
    Array.from(files).forEach((file) => {
      dt.items.add(file)
    })
    snap.songsBufferInput.files = dt.files
    store.songs = files.map((file) => ({
      name: file.name,
      size: file.size,
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
