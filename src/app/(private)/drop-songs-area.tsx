import { store, useStoreSnapshot } from '@/store'
import { useRef, useState, useEffect } from 'react'
import { TbMusicPlus } from 'react-icons/tb'
import { TAcceptedFormat, filterOutSongs } from '.'
import { convertMp3ToOgg as convertSongToOgg } from '@/ffmpeg'
import { showToast } from '@/components/toast'
import { getSongsAsFiles } from '@/song'

export default function DropSongsArea() {
  const self = useRef<HTMLInputElement>(null!)
  const snap = useStoreSnapshot()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    addEventListener('dragenter', () => {
      setDragging(true)
    })
  }, [])

  function onFilesDrop(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const files = [...e.target.files!]
    e.target.files = new DataTransfer().files
    const newSongs = filterOutSongs(files)
    const allSongs = [...getSongsAsFiles(), ...newSongs]
    store.songs = allSongs.map((f) => ({
      name: f.name,
      size: f.size,
    }))

    const allSongsBuffer = new DataTransfer()
    allSongs.forEach((f) => allSongsBuffer.items.add(f))
    store.songsBufferInput.files = allSongsBuffer.files

    newSongs.forEach(async (newSongFile) => {
      if ((newSongFile.type as TAcceptedFormat) !== 'audio/ogg') {
        if (store.ffmpeg.state !== 'ready') {
          showToast({
            id: crypto.randomUUID(),
            type: 'warning',
            title: 'Be patient',
            description: 'Converter is not ready yet',
          })
          return
        }
        const songToReplace = findSongFileBySize(newSongFile.size)
        if (songToReplace) {
          songToReplace.converting = true
          const ogg = await convertSongToOgg(store.ffmpeg.self, newSongFile)
          songToReplace.converting = undefined
          const thatSongToReplace = findSongFileBySize(newSongFile.size)
          if (thatSongToReplace) {
            const buffer = new DataTransfer()
            getSongsAsFiles().forEach((f) => buffer.items.add(f.size === thatSongToReplace.size ? ogg : f))
            store.songsBufferInput.files = buffer.files
          }
        }
      }
    })
  }

  function findSongFileBySize(size: number) {
    return store.songs.find((s) => s.size === size)
  }

  return dragging ? (
    <div ref={self} className='bg-orange-400/20 backdrop-brightness-50 fixed z-[1] inset-0 flex items-center justify-center' onDragLeave={() => setDragging(false)}>
      <input multiple type='file' accept='audio/ogg' onChange={onFilesDrop} className='absolute inset-0 opacity-0' />
      <div>
        <TbMusicPlus className='mx-auto mb-4 w-16 h-16 stroke-zinc-200' />
        <p className='text-2xl text-zinc-200 text-center'>Drop music files</p>
      </div>
    </div>
  ) : null
}
