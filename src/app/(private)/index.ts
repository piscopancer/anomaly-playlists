import { store } from '@/store'
import { downloadZip } from 'client-zip'

const configText = `
[trx_radio_plyr]
  number_of_playlists = 2
`

export function filterOutSongs(files: File[]) {
  return files.filter((f) => {
    const isOgg = f.type === 'audio/ogg'
    if (!isOgg) console.warn(`File named [${f.name}] must have .ogg format!`)
    const isUnique = !store.songs.some((s) => s.size === f.size)
    if (!isUnique) console.warn(`File named [${f.name}] already exists!`)
    return isOgg && isUnique
  })
}

export function formatSongName(name: string) {
  let f = name
  f = f.trim().replaceAll(' ', '_')
  while (f.includes('__')) {
    f = f.replaceAll('__', '_')
  }
  if (!f.endsWith('.ogg')) f += '.ogg'
  return f
}

export async function downloadPlaylists(addonName: string, _songs: File[]) {
  const config = new File([configText], 'gamedata/configs/plugins/radio_zone_fm.ltx', { type: 'text/ltx' })
  const formattedSongs = _songs.map((_song, i) => {
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
}
