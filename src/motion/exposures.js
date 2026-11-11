// "Four Exposures" Easter egg: which marks the visitor has found. Tiny store, kept in localStorage when allowed.
import { useSyncExternalStore } from 'react'

export const MARKS = ['will', 'loyalty', 'intensity', 'restart']
const KEY = 'ik-exposures'
const NONE = new Set()

let found = NONE
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())
// Even reading window.localStorage throws when storage is blocked.
const browserStorage = () => { try { return window.localStorage } catch { return null } }

// Storage can be missing, blocked (private mode) or corrupt; the egg still works for the session.
export function load(storage = browserStorage()) {
  try {
    found = new Set(JSON.parse(storage?.getItem(KEY) ?? '[]').filter((m) => MARKS.includes(m)))
  } catch {
    found = NONE
  }
  emit()
}

export function develop(mark, storage = browserStorage()) {
  if (!MARKS.includes(mark) || found.has(mark)) return
  found = new Set(found).add(mark)
  try {
    storage?.setItem(KEY, JSON.stringify([...found]))
  } catch {
    // keep the in-memory state only
  }
  emit()
}

export const getFound = () => found
const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn))

// The server (and the hydration pass) always sees "none found", so markup matches.
export const useExposures = () => useSyncExternalStore(subscribe, getFound, () => NONE)
