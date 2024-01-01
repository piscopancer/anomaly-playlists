import { TSong } from '@/song'
import { store } from '@/store'
import { useSnapshot } from 'valtio'
import { formatSongName } from '.'
import { TbTrash, TbX } from 'react-icons/tb'

export default function Song(props: { index: number; song: TSong }) {
  const songSnap = useSnapshot(props.song)
  return (
    <article className='p-2 flex gap-2 rounded-md bg-gradient-to-r from-zinc-800/20 to-zinc-800/50'>
      <p className='text-zinc-400 text-xs h-5 w-5 rounded-md flex justify-center items-center bg-zinc-800 self-start'>{props.index}</p>
      <div className='grid grid-cols-[1fr_auto_auto] grid-rows-2 gap-x-4 items-center w-full'>
        <h1 className='text-sm text-zinc-200 text-ellipsis overflow-hidden whitespace-nowrap'>{songSnap.name}</h1>
        <h2 className='text-xs text-zinc-400 text-ellipsis overflow-hidden whitespace-nowrap row-start-2'>
          <span className='text-zinc-500'>Formatted: </span>
          {formatSongName(songSnap.name)}
        </h2>
        <p className='text-xs row-span-2 text-zinc-200'>
          {(props.song.size / 1024 ** 2).toFixed(1)} <span className='text-zinc-400'>Mb</span>
        </p>
        <button
          onClick={() => {
            if (!store.songsBufferInput) return
            store.songs.splice(props.index, 1)
            // delete store.songs[props.index]
            const dt = new DataTransfer()
            const newFiles = Array.from(store.songsBufferInput.files!)
            newFiles.splice(props.index, 1)
            newFiles.forEach((f) => dt.items.add(f))
            store.songsBufferInput.files = dt.files
          }}
          className='bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-md flex items-center justify-center w-7 h-7 row-span-2'
        >
          <TbX />
        </button>
      </div>
    </article>
  )
}
