'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { getSongsAsFiles } from './song'
import { store, useStoreSnapshot } from './store'
import { TAcceptedFormat } from './app/(private)'

async function convertSongFileToOgg(ffmpeg: FFmpeg, song: File) {
  const key = song.size
  const iName = key + '.mp3'
  const oName = key + '.ogg'
  await ffmpeg.writeFile(iName, await fetchFile(song))
  await ffmpeg.exec(['-i', iName, oName])
  const o = (await ffmpeg.readFile(oName)) as Uint8Array
  return new File([o.buffer], song.name, { type: 'audio/ogg' satisfies TAcceptedFormat })
}

export async function convertSongsToOggs(newSongs: File[]) {
  newSongs.forEach(async (newSong) => {
    try {
      const songToReplace = findSongFileBySize(newSong.size)
      if (!songToReplace) return
      const ffmpeg = new FFmpeg()
      ffmpeg.on('progress', ({ progress }) => {
        if (songToReplace && songToReplace.converting) {
          songToReplace.converting.progress = progress
        }
      })
      const baseURL = 'https://unpkg.com/browse/@ffmpeg/core@0.12.6/dist/umd'
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      if (!findSongFileBySize(newSong.size)) {
        ffmpeg.terminate()
        return
      }
      songToReplace.converting = { progress: 0 }
      const ogg = await convertSongFileToOgg(ffmpeg, newSong)
      if (!findSongFileBySize(newSong.size)) {
        ffmpeg.terminate()
        return
      }
      songToReplace.converting = undefined
      const buffer = new DataTransfer()
      getSongsAsFiles().forEach((f) => buffer.items.add(f.size === songToReplace.size ? ogg : f))
      store.songsBufferInput.files = buffer.files
      songToReplace.size = ogg.size
      ffmpeg.terminate()
    } catch (error) {
      console.warn(`File convertion error:\n${(error as Error).name}\nPlease, leave unattended 💀.`)
    }
  })
}

function findSongFileBySize(size: number) {
  return store.songs.find((s) => s.size === size)
}
