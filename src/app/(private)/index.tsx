import { fonts } from '@/assets/fonts'
import { showToast } from '@/components/toast'
import { store } from '@/store'
import { classes } from '@/utils'
import { downloadZip } from 'client-zip'
import { ref } from 'valtio'

const configText = `
[trx_radio_plyr]
  number_of_playlists = 2
`
const maxFileLength = 24
const acceptedFormats = ['audio/ogg', 'audio/mpeg'] as const
export type TAcceptedFormat = (typeof acceptedFormats)[number]

export function getallowedExtensions() {
  return acceptedFormats.map((f) => f.replace('audio/', ''))
}

export function filterOutSongs(files: File[]) {
  return files.filter((f) => {
    const isAcceptedFormat = (acceptedFormats as readonly string[]).includes(f.type)
    console.log(f.type)
    if (!isAcceptedFormat) {
      showToast({
        id: crypto.randomUUID(),
        title: 'Wrong file format',
        description: (
          <>
            File <span className='text-white'>{f.name.length > maxFileLength ? `${f.name.slice(0, maxFileLength)}...` : f.name}</span> must have <code className={classes(fonts.roboto, 'text-orange-400')}>{getallowedExtensions().join('/')}</code> format!
          </>
        ),
        type: 'warning',
      })
      console.warn(`File [${f.name}] must have .ogg format!`)
    }
    const isUnique = !store.songs.some((s) => s.size === f.size)
    if (!isUnique) {
      showToast({
        id: crypto.randomUUID(),
        title: 'Duplicate file',
        description: (
          <>
            File <span className='text-white'>{f.name.length > maxFileLength ? `${f.name.slice(0, maxFileLength)}...` : f.name}</span> already in the list!
          </>
        ),
        type: 'warning',
      })
      console.warn(`File [${f.name}] already in the list!`)
    }
    return isAcceptedFormat && isUnique
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

  showToast({
    id: crypto.randomUUID(),
    title: 'Downloading...',
    description: <>Your addon is gonna be downloaded soon. Have a great day in the Zone, Stalker 🤟</>,
    type: 'success',
  })
}
