'use client'

import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { store } from './store'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Toast, showToast } from './components/toast'
import { ref } from 'valtio'
import { fonts } from './assets/fonts'
import { classes } from './utils'

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

export async function convertMp3ToOgg(ffmpeg: FFmpeg, song: File) {
  // const ffmpeg = store.ffmpeg.self
  // if (!ffmpeg) {
  //   showToast({
  //     id: crypto.randomUUID(),
  //     type: 'warning',
  //     title: 'Wait a little bro',
  //     description: ref(() => <>Converter is not available yet</>),
  //   })
  //   return
  // }
  await ffmpeg.writeFile('i.mp3', await fetchFile(song))
  await ffmpeg.exec(['-i', 'i.mp3', 'o.ogg'])
  const o = (await ffmpeg.readFile('o.ogg')) as Uint8Array
  return new File([o.buffer], song.name, { type: 'audio/ogg' })
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
