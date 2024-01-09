import { showToast } from '@/components/toast'
import { convertSongsToOggs } from '@/ffmpeg'
import { filterOutSongs, formatSongName, getSongsAsFiles } from '@/song'
import { store } from '@/store'
import { deleteExtension } from '@/utils'
import { downloadZip } from 'client-zip'

const configText = `
[trx_radio_plyr]
  number_of_playlists = 2
`
export const acceptedFormats = ['audio/ogg', 'audio/mpeg'] as const
export const inputAcceptedFormats = acceptedFormats.join(',')
export type TAcceptedFormat = (typeof acceptedFormats)[number]

export function getallowedExtensions() {
  return acceptedFormats.map((f) => f.replace('audio/', ''))
}

export function onSongsInput(e: React.ChangeEvent<HTMLInputElement>) {
  e.preventDefault()
  e.stopPropagation()
  const files = [...e.target.files!]
  e.target.files = new DataTransfer().files
  const newSongs = filterOutSongs(store.ffmpeg.state === 'ready' ? files : files.filter((f) => (f.type as TAcceptedFormat) === 'audio/ogg'))
  store.songs = store.songs.concat(
    newSongs.map((f) => ({
      name: deleteExtension(f.name),
      size: f.size,
    }))
  )

  const allSongsBuffer = new DataTransfer()
  getSongsAsFiles()
    .concat(newSongs)
    .forEach((f) => allSongsBuffer.items.add(f))
  store.songsBufferInput.files = allSongsBuffer.files

  if (store.ffmpeg.state === 'ready') {
    const newSongsNotOggs = newSongs.filter((f) => (f.type as TAcceptedFormat) !== 'audio/ogg')
    convertSongsToOggs(store.ffmpeg.self, newSongsNotOggs)
  } else {
    showToast({
      id: crypto.randomUUID(),
      type: 'warning',
      title: 'Be patient',
      description: 'Converter is not ready yet',
    })
  }
}

export async function downloadPlaylists(addonName: string, _songs: File[]) {
  const config = new File([configText], 'gamedata/configs/plugins/radio_zone_fm.ltx', { type: 'text/ltx' })
  const formattedSongs = _songs
    .filter((_, i) => !store.songs[i].converting)
    .map((_song, i) => {
      let song = _song
      let songName = store.songs[i].changedName ?? store.songs[i].name
      songName = formatSongName(songName)
      song = new File([song], formatSongName('gamedata/sounds/radio/_playlist_2/' + songName), { type: song.type })
      return song
    })
  const blob = await downloadZip([config, ...formattedSongs]).blob()

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${addonName}.zip`
  link.click()
  link.remove()

  showToast({
    id: crypto.randomUUID(),
    title: 'Downloading...',
    description: <>Your addon is gonna be downloaded soon. Have a great day in the Zone, Stalker 🤟</>,
    type: 'success',
  })
}
