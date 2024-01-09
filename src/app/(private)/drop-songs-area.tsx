import { useRef, useState, useEffect } from 'react'
import { TbMusicPlus } from 'react-icons/tb'
import { inputAcceptedFormats, onSongsInput } from '.'

export default function DropSongsArea() {
  const self = useRef<HTMLInputElement>(null!)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    addEventListener('dragenter', () => {
      setDragging(true)
    })
  }, [])

  function onFilesDrop(e: React.ChangeEvent<HTMLInputElement>) {
    setDragging(false)
    onSongsInput(e)
  }

  return dragging ? (
    <div ref={self} className='bg-orange-400/20 backdrop-brightness-50 fixed z-[1] inset-0 flex items-center justify-center' onDragLeave={() => setDragging(false)}>
      <input multiple type='file' accept={inputAcceptedFormats} onChange={onFilesDrop} className='absolute inset-0 opacity-0' />
      <div>
        <TbMusicPlus className='mx-auto mb-4 w-16 h-16 stroke-zinc-200' />
        <p className='text-2xl text-zinc-200 text-center'>Drop music files</p>
      </div>
    </div>
  ) : null
}
