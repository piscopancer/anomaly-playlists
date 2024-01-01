'use client'

import { store, useStoreSnapshot } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import DropSongsArea from './(private)/drop-songs-area'
import Song from './(private)/song'
import { downloadPlaylists, filterOutSongs } from './(private)'
import anomaly from '@/assets/anomaly.png'
import background from '@/assets/bg.jpg'
import Image from 'next/image'
import { assignObject, classes } from '@/utils'
import { fonts } from '@/assets/fonts'
import { TbBrandGithub, TbDownload, TbMusic, TbMusicPlus, TbPlaylist } from 'react-icons/tb'
import { ref } from 'valtio'
import { project } from '@/project'

export default function HomePage() {
  const snap = useStoreSnapshot()
  const totalSizeMb = (snap.songs.map((s) => s.size).reduce((prev, next) => prev + next, 0) / 1024 ** 2).toFixed(1)
  const songsBufferInput = useRef<HTMLInputElement>(null!)
  const [addonName, setAddonName] = useState('')

  useEffect(() => {
    store.songsBufferInput = ref(songsBufferInput.current)
  }, [])

  function onSongsAddInput(e: React.ChangeEvent<HTMLInputElement>) {
    const dt = new DataTransfer()
    const filteredFiles = filterOutSongs(Array.from(e.target.files!))
    const files = [...songsBufferInput.current.files!, ...filteredFiles]
    Array.from(files).forEach((f) => dt.items.add(f))
    songsBufferInput.current.files = dt.files
    store.songs = files.map((f) => ({
      name: f.name,
      size: f.size,
    }))
    songsBufferInput.current.dispatchEvent(new Event('change', { bubbles: true }))
  }

  function onDownloadClick() {
    console.log(Array.from(songsBufferInput.current.files!))
    downloadPlaylists(addonName, Array.from(songsBufferInput.current.files!))
  }

  return (
    <main className='max-w-screen-lg mx-auto max-lg:mx-4 pt-8 pb-16'>
      <input ref={songsBufferInput} multiple type='file' accept='audio/ogg' className='opacity-0 absolute pointer-events-none' />
      <DropSongsArea />
      <section className='fixed inset-0'>
        <Image alt='background' priority src={background} className='object-center h-full w-full object-cover' />
        <div className='absolute inset-0 h-full opacity-80 [background:radial-gradient(transparent,theme(colors.zinc.950))]' />
        <div className='absolute inset-0 h-full bg-gradient-to-b from-transparent via-zinc-950 via-70% to-zinc-950 opacity-80' />
      </section>
      <a target='_blank' href={project.links.github} className='h-10 w-10 p-3 rounded-full hover:bg-zinc-800 duration-100 text-zinc-200 fixed right-8 bottom-8'>
        <TbBrandGithub />
      </a>
      <section className='relative'>
        <Image alt='anomaly' src={anomaly} className='h-24 w-auto mx-auto' />
        <h1 className='text-center mt-6 text-xl text-zinc-200 font-medium'>
          {project.name} <span className='text-zinc-400'>(beta)</span>
        </h1>
        <h2 className='text-center text-zinc-400 text-sm mb-6'>
          Upload your <code className={classes(fonts.roboto, 'bg-black/20 text-orange-400 px-1 rounded-md')}>.ogg</code> tracks to create a PDA music addon
        </h2>
        <fieldset className='flex mb-6 items-center'>
          <label htmlFor='addon-name' className='text-zinc-200 flex-1'>
            Name of addon <span className='text-orange-400'>*</span>
          </label>
          <div className='flex relative'>
            <input
              id='addon-name'
              type='text'
              value={addonName}
              spellCheck={false}
              placeholder='my-pda-music-addon'
              onChange={(e) => {
                setAddonName(e.target.value)
              }}
              className={classes(fonts.roboto, 'w-[40ch] bg-black/30 text-zinc-200 placeholder-zinc-500 placeholder:italic py-1 pl-[1ch] pr-[7ch] rounded-md')}
            />
            <p className={classes(fonts.roboto, 'rounded-r-md px-[1ch] text-zinc-500 bg-black/20 py-1 absolute right-0')}>.zip</p>
          </div>
        </fieldset>
        <ul className='flex items-center justify-end mb-6'>
          <div className='flex items-center gap-2 mr-8'>
            <TbPlaylist className='stroke-zinc-400' />
            <p className='text-sm text-zinc-200'>{snap.songs.length}</p>
          </div>
          <p className='text-zinc-200 text-sm mr-8'>
            {totalSizeMb} <span className='text-zinc-400'>Mb</span>
          </p>
          <li className='text-zinc-200 bg-zinc-800 rounded-md py-2 px-4 relative hover:bg-zinc-700 duration-100 flex items-center gap-3'>
            <input title='' multiple type='file' onChange={onSongsAddInput} accept='audio/ogg' className='absolute inset-0 opacity-0' />
            <TbMusicPlus />
            Import songs
          </li>
          <button
            onClick={onDownloadClick}
            disabled={snap.songs.length === 0 || !addonName}
            className='text-zinc-900 ml-4 rounded-md h-10 disabled:!bg-black/20 disabled:text-zinc-600 enabled:bg-orange-400 hover:enabled:brightness-125 enabled:shadow-xl enabled:shadow-orange-400/30 group p-2.5 duration-200'
          >
            <TbDownload className='h-full group-hover:scale-110 duration-200 ease-out' />
          </button>
        </ul>
        {snap.songs.length > 0 ? (
          <ul className='flex flex-col gap-2'>
            {snap.songs.map((song, i) => (
              <Song key={song.size} index={i} song={store.songs[i]} />
            ))}
          </ul>
        ) : (
          <div className='py-24 bg-black/20 rounded-md'>
            <TbMusic className='text-zinc-500 h-6 mb-2 mx-auto' />
            <p className='text-zinc-500 text-center'>Songs will populate this area</p>
          </div>
        )}
      </section>
    </main>
  )
}
