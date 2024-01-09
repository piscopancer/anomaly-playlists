import { TSong, formatSongName, getSongsAsFiles } from '@/song'
import { store } from '@/store'
import { useSnapshot } from 'valtio'
import { TbRadioactive, TbRotate, TbX } from 'react-icons/tb'
import { forwardRef, useEffect, useRef } from 'react'
import { AnimatePresence, AnimationDefinition, animate, motion, useAnimate, useAnimation } from 'framer-motion'
import { classes } from '@/utils'
import { fonts } from '@/assets/fonts'
import { Tooltip } from '@/components/tooltip'

export const Song = forwardRef<HTMLDivElement, { index: number; song: TSong }>((props, ref) => {
  const songSnap = useSnapshot(props.song)
  const nameInput = useRef<HTMLInputElement>(null!)
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ translateY: -5, opacity: 0 })
    selfAnim.start({ translateY: 0, opacity: 1, transition: { duration: 0.1, layout: { duration: 0.1 } } })
  }, [])

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
      animate={selfAnim}
      exit={{ translateY: -5, opacity: 0, transition: { duration: 0.1 } }}
      className={classes(props.song.converting ? 'outline-orange-400/50 outline-2 from-orange-400/10 h-16' : 'from-zinc-800/20', 'p-2 flex gap-2 rounded-md bg-gradient-to-r to-zinc-800/50 outline outline-0 relative')}
    >
      <output className='text-zinc-400 mt-0.5 text-xs h-5 w-5 rounded-full flex justify-center items-center bg-zinc-800 self-start shrink-0'>{props.index + 1}</output>
      <div className='grid grid-cols-[1fr_auto_auto] grid-rows-2 gap-x-4 items-center w-full'>
        <div className='flex items-center gap-2'>
          <input type='text' spellCheck={false} ref={nameInput} defaultValue={songSnap.name} onChange={changeName} className='text-sm text-zinc-200 rounded-md bg-transparent grow py-0.5' />
          <Tooltip content='Reset name'>
            <button hidden={songSnap.changedName === undefined} onClick={restoreName} className='text-zinc-500 p-1 rounded-full hover:bg-zinc-800 hover:-rotate-180 duration-200 ease-out'>
              <TbRotate />
            </button>
          </Tooltip>
        </div>
        <h2 className='text-xs text-zinc-500 text-ellipsis overflow-hidden whitespace-nowrap row-start-2'>
          Formatted: <output className='text-zinc-400'>{formatSongName(songSnap.changedName ?? songSnap.name)}</output>
        </h2>
        <div className='w-14 row-span-2 text-right'>
          {props.song.converting ? (
            <Tooltip
              content={
                <p className='text-zinc-200 text-sm'>
                  converting file to <code className={classes(fonts.roboto, 'text-orange-400')}>ogg</code>...
                </p>
              }
            >
              <button className='cursor-help bg-orange-400 shadow-lg shadow-orange-400/20 p-1.5 rounded-full'>
                <motion.div
                  animate={{
                    rotate: 360 * 2,
                    transition: {
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'easeInOut',
                      duration: 2,
                    },
                  }}
                >
                  <TbRadioactive className='stroke-zinc-900 h-6' />
                </motion.div>
              </button>
            </Tooltip>
          ) : (
            <output className='text-xs text-zinc-200'>
              {(props.song.size / 1024 ** 2).toFixed(1)} <span className='text-zinc-400'>Mb</span>
            </output>
          )}
        </div>
        <button onClick={deleteSong} className='bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-full flex items-center justify-center w-7 h-7 row-span-2 shrink-0 self-center'>
          <TbX />
        </button>
      </div>
    </motion.article>
  )
})

Song.displayName = 'Song'
