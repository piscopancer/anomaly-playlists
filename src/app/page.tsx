'use client'

import anomaly from '@/assets/anomaly'
import bg from '@/assets/bg'
import { fonts } from '@/assets/fonts'
import { getSongsAsFiles } from '@/components/song'
import { store, useStoreSnapshot } from '@/components/store'
import { Tooltip } from '@/components/tooltip'
import { project } from '@/project'
import { classes } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { TbBrandGithub, TbDownload, TbDragDrop, TbExclamationCircle, TbMusic, TbMusicPlus, TbPlaylist } from 'react-icons/tb'
import { downloadPlaylists, inputAcceptedFormats, onSongsInput } from './()'
import DropSongsArea from './()/drop-songs-area'
import { Song } from './()/song'
import SongsBuffer from './()/songs-buffer'

export default function HomePage() {
  const snap = useStoreSnapshot()
  const readySongs = snap.songs.filter((s) => !s.converting)
  const totalSizeMb = (readySongs.map((s) => s.size).reduce((prev, next) => prev + next, 0) / 1024 ** 2).toFixed(1)
  const addonNameInput = useRef<HTMLInputElement>(null!)
  const [addonName, setAddonName] = useState('')
  const areSongsPresent = !!readySongs.length

  function onDownloadClick() {
    console.log(store.songsBufferInput.files)
    downloadPlaylists(addonName, getSongsAsFiles())
  }

  return (
    <main className='max-w-screen-lg mx-auto max-lg:mx-4 pt-8 pb-16'>
      <SongsBuffer />
      <DropSongsArea />
      <section className='fixed inset-0'>
        <Image data-credit='https://www.moddb.com/mods/stalker-anomaly/addons/rays-of-anomalous-worlds-weathers-reshade' alt='background' fill quality={75} priority src={bg} className='object-center h-full w-full object-cover brightness-75' />
        <div className='absolute inset-0 h-full opacity-80 [background:radial-gradient(transparent,theme(colors.zinc.950))]' />
        <div className='absolute inset-0 h-full bg-gradient-to-b from-transparent via-zinc-950 via-70% to-zinc-950 opacity-80' />
      </section>
      <Tooltip
        content={
          <>
            Support this project on <span className='text-orange-400'>Github</span>
          </>
        }
      >
        <a target='_blank' href={project.links.github} className='h-10 w-10 p-3 rounded-full hover:bg-zinc-800 duration-100 text-zinc-200 fixed right-8 top-8 z-[1] max-md:hidden'>
          <TbBrandGithub />
        </a>
      </Tooltip>
      <section className='relative'>
        <Image width={256} height={256} alt='anomaly' src={anomaly} className='h-24 w-auto mx-auto mb-6' />
        <h1 className='text-center mb-1 text-xl text-zinc-200 font-light'>
          {project.name} <span className='text-zinc-400'>(beta)</span>
        </h1>
        <h2 className='text-center text-zinc-400 text-sm mb-6'>
          Upload your <code className={classes(fonts.roboto, 'text-orange-400')}>ogg/mp3</code> tracks to create a PDA music addon
        </h2>
        <fieldset className='flex mb-6 items-center max-md:block'>
          <label htmlFor='addon-name' className='text-zinc-200 block max-md:mb-1 max-md:text-sm'>
            Name of addon <span className='text-orange-400'>*</span>
          </label>
          <div className='flex relative w-[40ch] max-md:w-auto ml-auto'>
            <input
              id='addon-name'
              type='text'
              autoComplete='none'
              ref={addonNameInput}
              value={addonName}
              spellCheck={false}
              placeholder='my_songs_addon'
              onChange={(e) => {
                setAddonName(e.target.value)
              }}
              className={classes('grow bg-black/30 border border-zinc-700 text-zinc-200 placeholder:text-zinc-500 px-4 pr-14 rounded-md hover:placeholder:text-zinc-700 focus:placeholder:text-zinc-700 py-1.5')}
            />
            <p className={classes('rounded-r-md px-3 text-zinc-500 bg-black/20 py-1.5 absolute right-0')}>.zip</p>
          </div>
        </fieldset>
        <ul className='flex items-center justify-end mb-6'>
          <div className='flex items-center gap-2 mr-8'>
            <TbPlaylist className='stroke-zinc-400' />
            <output className='text-sm text-zinc-200'>{readySongs.length}</output>
          </div>
          <output className='text-zinc-200 text-sm mr-8'>
            {totalSizeMb} <span className='text-zinc-400'>Mb</span>
          </output>
          <li className='text-zinc-200 bg-zinc-700/50 rounded-md py-2 px-4 relative flex items-center gap-3 group border border-transparent hover:border-zinc-700 duration-200 ease-out'>
            <div className='absolute -top-px inset-x-2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent' />
            <div className='absolute -bottom-px inset-x-2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent' />
            <input multiple type='file' onChange={onSongsInput} accept={inputAcceptedFormats} className='absolute inset-0 opacity-0' />
            <TbMusicPlus />
            Import songs
          </li>
          <Tooltip
            hidden={!!addonName && areSongsPresent}
            content={
              <ul className='list-disc list-inside marker:text-zinc-600'>
                <li hidden={!!addonName}>
                  Give your addon a <span className='text-orange-400'>name</span> first
                </li>
                <li hidden={!!areSongsPresent}>
                  Add at least <span className='text-orange-400'>1</span> song
                </li>
              </ul>
            }
          >
            <button
              onMouseOver={() => {
                if (!addonName) addonNameInput.current.focus()
              }}
              onClick={onDownloadClick}
              disabled={!areSongsPresent || !addonName}
              className='text-zinc-900 ml-4 rounded-md h-10 disabled:!bg-black/20 disabled:text-zinc-600 enabled:bg-orange-400 hover:enabled:brightness-125 enabled:shadow-xl enabled:shadow-orange-400/30 group p-2.5 duration-200'
            >
              <TbDownload className='h-full group-hover:scale-110 duration-200 ease-out' />
            </button>
          </Tooltip>
        </ul>
        {snap.songs.length > 0 ? (
          <ul className='flex flex-col gap-2'>
            <AnimatePresence mode='popLayout'>
              {snap.songs.map((song, i) => (
                <Song key={song.size} index={i} song={store.songs[i]} />
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <motion.div initial={{ opacity: 0, translateY: 5 }} animate={{ opacity: 1, translateY: 0 }} className='py-12 bg-black/30 rounded-md'>
            <p className='text-zinc-400 text-center'>
              <TbMusic className='inline-block -translate-y-0.5' /> Songs will appear here
            </p>
            <div className='w-56 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto my-4' />
            <p className='text-center text-zinc-400 mb-8'>
              You can{' '}
              <span className='text-zinc-200 inline-block'>
                <TbDragDrop className='inline-block mr-1 -translate-y-0.5' />
                drag & drop
              </span>{' '}
              files onto the page btw ngl
            </p>
            <div className='text-zinc-500 text-center text-sm border relative w-fit mx-auto px-8 py-4 rounded-lg border-zinc-700'>
              <TbExclamationCircle className='size-8 p-1 absolute top-0 rounded-full -translate-y-1/2 bg-black  left-1/2 -translate-x-1/2' />
              <p className='mb-1 mt-1'>Some songs cannot be converted due to an ffmpeg issue</p>
              <p className=''>If your convertion did not start automatically, converter may be still downloading</p>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  )
}
