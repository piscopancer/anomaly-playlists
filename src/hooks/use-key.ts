import { useEffect } from 'react'

type TKeyAction<K extends string> = [key: K, callback: (key: K) => void]

export default function useKey(...events: TKeyAction<string>[]) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      events.forEach((event) => e.key === event[0] && event[1](e.key))
    }
    addEventListener('keypress', registerEventListeners)
    return () => removeEventListener('keypress', registerEventListeners)
  }, [events])
}
