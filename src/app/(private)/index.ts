import { downloadZip } from 'client-zip'

const configText = `
[trx_radio_plyr]
  number_of_playlists = 2
`

export function formatSongName(name: string) {
  let f = name
  f = f.trim().replaceAll(' ', '_')
  while (f.includes('__')) {
    f = f.replaceAll('__', '_')
  }
  return f
}

function formatSongFile(file: File, path?: string): File {
  return new File([file], formatSongName(path + '/' + file.name), { type: file.type })
}

export async function downloadPlaylists(addonName: string, _songs: File[]) {
  const config = new File([configText], 'gamedata/configs/plugins/radio_zone_fm.ltx', { type: 'text/ltx' })
  const formattedSongs = _songs.map((song) => formatSongFile(song, 'gamedata/sounds/radio/_playlist_2'))
  const blob = await downloadZip([config, ...formattedSongs]).blob()

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${addonName}.zip`
  link.click()
  link.remove()
}
