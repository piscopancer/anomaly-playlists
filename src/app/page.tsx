'use client'

import { store, useStoreSnapshot } from '@/store'
import React, { useRef, useState } from 'react'
import DropSongsArea from './(private)/drop-songs-area'
import Song from './(private)/song'
import { downloadPlaylists } from './(private)'
import anomaly from '@/assets/anomaly.png'
import background from '@/assets/bg.jpg'
import Image from 'next/image'
import { classes } from '@/utils'
import { fonts } from '@/assets/fonts'
import { TbDownload, TbMusicPlus, TbPlaylist } from 'react-icons/tb'

export default function HomePage() {
  const snap = useStoreSnapshot()
  const totalSizeMb = (snap.songs.map((s) => s.size).reduce((prev, next) => prev + next, 0) / 1024 ** 2).toFixed(1)
  const songsBufferInput = useRef<HTMLInputElement>(null!)
  const [addonName, setAddonName] = useState('')

  function onSongsBufferInput(e: React.ChangeEvent<HTMLInputElement>) {}

  function onSongsAddInput(e: React.ChangeEvent<HTMLInputElement>) {
    const dt = new DataTransfer()
    const files = [...songsBufferInput.current.files!, ...e.target.files!]
    if (files.some((file) => file.type !== 'audio/ogg')) {
      console.log('ALL FILES MUST BE OGG!')
      return
    }
    Array.from(files).forEach((file) => {
      dt.items.add(file)
    })
    songsBufferInput.current.files = dt.files
    store.songs = files.map((file) => ({
      name: file.name,
      size: file.size,
    }))
    songsBufferInput.current.dispatchEvent(new Event('change', { bubbles: true }))
  }

  function onDownloadClick() {
    console.log(Array.from(songsBufferInput.current.files!))
    downloadPlaylists(addonName, Array.from(songsBufferInput.current.files!))
  }

  return (
    <main className='max-w-screen-lg mx-auto max-lg:mx-4'>
      <input ref={songsBufferInput} multiple type='file' onChange={onSongsBufferInput} accept='audio/ogg' className='opacity-0 absolute pointer-events-none' />
      <DropSongsArea songsBufferInput={songsBufferInput.current} />
      <section className='fixed inset-0'>
        <Image alt='background' src={background} className='object-center h-full w-full object-cover' />
        <div className='absolute inset-0 h-full opacity-80 [background:radial-gradient(transparent,theme(colors.zinc.950))]' />
        <div className='absolute inset-0 h-full bg-gradient-to-b from-transparent via-zinc-950 via-70% to-zinc-950 opacity-80' />
      </section>
      <section className='relative pt-8'>
        <Image alt='anomaly' src={anomaly} className='h-24 w-auto mx-auto' />
        <h1 className='text-center mt-6 text-xl text-zinc-200 font-medium'>Anomaly Playlists</h1>
        <h2 className='text-center text-zinc-400 text-sm mb-6'>
          Upload your <code className={classes(fonts.roboto, 'bg-black/20 text-orange-400 px-1 rounded-md')}>.ogg</code> tracks to create a PDA music addon
        </h2>
        <fieldset className='flex mb-6 items-center'>
          <label htmlFor='addon-name' className='text-zinc-200 flex-1'>
            Name of addon
          </label>
          <input id='addon-name' value={addonName} spellCheck={false} onChange={(e) => setAddonName(e.target.value)} placeholder='my-pda-music-addon' type='text' className='flex-1 bg-black/40 text-zinc-200 placeholder-zinc-500 placeholder:italic py-1 px-3 rounded-l-md' />
          <p className='inline-block rounded-r-md px-2 text-zinc-500 bg-black/20 py-1'>.zip</p>
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
            <input title='🎵' multiple type='file' onChange={onSongsAddInput} accept='audio/ogg' className='absolute inset-0 opacity-0' />
            <TbMusicPlus />
            Import songs
          </li>
          <button onClick={onDownloadClick} disabled={snap.songs.length === 0 || !addonName} className='text-zinc-200 ml-4 rounded-md h-10 enabled:bg-gradient-to-t disabled:!bg-black/20 disabled:text-zinc-600 enabled:from-orange-500 enabled:to-orange-400/20 hover:scale-110 duration-100 p-2.5'>
            <TbDownload className='h-full' />
          </button>
        </ul>
        <ul className='flex flex-col gap-2'>
          {snap.songs.map((_, i) => (
            <Song key={i} index={i} song={store.songs[i]} />
          ))}
        </ul>
      </section>
    </main>
  )
}
