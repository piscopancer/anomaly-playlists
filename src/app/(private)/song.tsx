import { TSong, getSongsAsFiles } from '@/song'
import { store } from '@/store'
import { useSnapshot } from 'valtio'
import { formatSongName } from '.'
import { TbRotate, TbX } from 'react-icons/tb'
import { forwardRef, useRef } from 'react'
import { motion } from 'framer-motion'

export const Song = forwardRef<HTMLDivElement, { index: number; song: TSong }>((props, ref) => {
  const songSnap = useSnapshot(props.song)
  const nameInput = useRef<HTMLInputElement>(null!)

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    props.song.changedName = e.target.value === songSnap.name ? undefined : e.target.value
  }

  function restoreName() {
    props.song.changedName = undefined
    nameInput.current.value = songSnap.name
  }

  function deleteSong() {
    store.songs.splice(props.index, 1)
    const newSongsBuffer = new DataTransfer()
    getSongsAsFiles().forEach((f, i) => props.index !== i && newSongsBuffer.items.add(f))
    store.songsBufferInput.files = newSongsBuffer.files
  }

  return (
    <motion.article
      ref={ref}
      layout={'position'}
      initial={{
        translateY: -5,
        opacity: 0,
      }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: -5, opacity: 0, transition: { duration: 0.1 } }}
      transition={{ layout: { duration: 0.1 } }}
      className='p-2 flex gap-2 rounded-md bg-gradient-to-r from-zinc-800/20 to-zinc-800/50'
    >
      <p className='text-zinc-400 mt-0.5 text-xs h-5 w-5 rounded-full flex justify-center items-center bg-zinc-800 self-start shrink-0'>{props.index + 1}</p>
      {props.song.converting ? (
        <p className='text-zinc-200'>converting...</p>
      ) : (
        <div className='grid grid-cols-[1fr_auto_auto] grid-rows-2 gap-x-4 items-center w-full'>
          <div className='flex items-center gap-2'>
            <input type='text' ref={nameInput} defaultValue={songSnap.name} onChange={changeName} className='text-sm text-zinc-200 rounded-md bg-transparent grow py-0.5' />
            <button hidden={songSnap.changedName === undefined} onClick={restoreName} className='text-zinc-500 p-1 rounded-full hover:bg-zinc-800 hover:-rotate-180 duration-200 ease-out'>
              <TbRotate />
            </button>
          </div>
          <h2 className='text-xs text-zinc-400 text-ellipsis overflow-hidden whitespace-nowrap row-start-2'>
            <span className='text-zinc-500'>Formatted: </span>
            {formatSongName(songSnap.changedName ?? songSnap.name)}
          </h2>
          <p className='text-xs row-span-2 text-zinc-200'>
            {(props.song.size / 1024 ** 2).toFixed(1)} <span className='text-zinc-400'>Mb</span>
          </p>
        </div>
      )}
      <button onClick={deleteSong} className='bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-full flex items-center justify-center w-7 h-7 row-span-2 shrink-0 self-center'>
        <TbX />
      </button>
    </motion.article>
  )
})

Song.displayName = 'Song'
