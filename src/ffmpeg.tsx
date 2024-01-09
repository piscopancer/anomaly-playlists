'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { ref } from 'valtio'
import { fonts } from './assets/fonts'
import { Toast } from './components/toast'
import { getSongsAsFiles } from './song'
import { store } from './store'
import { classes } from './utils'
import { TAcceptedFormat } from './app/(private)'

const v = '0.12.6'

export async function loadFfmpeg() {
  store.ffmpeg.state = 'loading'
  const baseURL = `https://unpkg.com/@ffmpeg/core@${v}/dist/umd`
  const ffmpeg = new FFmpeg()
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })
  store.ffmpeg = {
    state: 'ready',
    self: ffmpeg,
  }
}

async function convertSongToOgg(ffmpeg: FFmpeg, song: File) {
  const key = song.size
  const iName = key + '.mp3'
  const oName = key + '.ogg'
  await ffmpeg.writeFile(iName, await fetchFile(song))
  await ffmpeg.exec(['-i', iName, oName])
  const o = (await ffmpeg.readFile(oName)) as Uint8Array
  return new File([o.buffer], song.name, { type: 'audio/ogg' satisfies TAcceptedFormat })
}

export async function convertSongsToOggs(ffmpeg: FFmpeg, newSongs: File[]) {
  for (let i = 0; i < newSongs.length; i++) {
    // function onProgress(e: Progress) {
    //   console.log(i, e.progress)
    // }

    try {
      // ffmpeg.on('progress', console.log)
      const songToReplace = findSongFileBySize(newSongs[i].size)
      if (songToReplace) {
        songToReplace.converting = true
        const ogg = await convertSongToOgg(ffmpeg, newSongs[i])
        // ffmpeg.off('progress', console.log)
        const existentSongToReplace = findSongFileBySize(newSongs[i].size)
        if (existentSongToReplace) {
          existentSongToReplace.converting = undefined
          const buffer = new DataTransfer()
          getSongsAsFiles().forEach((f) => buffer.items.add(f.size === existentSongToReplace.size ? ogg : f))
          store.songsBufferInput.files = buffer.files
          existentSongToReplace.size = ogg.size
        }
      }
    } catch (error) {
      console.warn(`File convertion error:\n${(error as Error).message}\nPlease, leave unattended 💀.`)
    }
  }
}

function findSongFileBySize(size: number) {
  return store.songs.find((s) => s.size === size)
}

export function FfmpegLoadingToast() {
  return (
    <Toast
      toast={{
        id: crypto.randomUUID(),
        type: 'warning',
        title: 'Ogg converter is loading...',
        description: ref(() => (
          <>
            It will automatically convert your songs files into <code className={classes(fonts.roboto, 'text-orange-400')}>ogg</code> format 😉
          </>
        )),
      }}
    />
  )
}

export function FfmpegConvertingToast() {
  return (
    <Toast
      toast={{
        id: crypto.randomUUID(),
        type: 'warning',
        title: 'Files are converting...',
        description: ref(() => <>Wait as your files get converted. Not converted files won't be included in the addon</>),
      }}
    />
  )
}
