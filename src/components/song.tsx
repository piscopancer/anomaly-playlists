import { acceptedFormats, allowedExtensions } from '../app/()'
import { fonts } from '../assets/fonts'
import { classes } from '../utils'
import { store } from './store'
import { showToast } from './toast'

export type TSong = {
  name: string
  changedName?: string
  size: number
  converting?: {
    progress: number
  }
}

export function getSongsAsFiles() {
  return [...store.songsBufferInput.files!]
}

const maxFileLength = 24

export function filterOutSongs(files: File[]) {
  return files.filter((f) => {
    const isAcceptedFormat = (acceptedFormats as readonly string[]).includes(f.type)
    if (!isAcceptedFormat) {
      showToast({
        id: crypto.randomUUID(),
        title: 'Wrong file format',
        description: (
          <>
            File <span className='text-white'>{f.name.length > maxFileLength ? `${f.name.slice(0, maxFileLength)}...` : f.name}</span> must have <code className={classes(fonts.roboto, 'text-orange-400')}>{allowedExtensions().join('/')}</code> format!
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
