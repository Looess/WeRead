// import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    togglePinToDesktop: (shouldPin: boolean) => ipcRenderer.invoke('toggle-pin-to-desktop', shouldPin),
    getPinStatus: () => ipcRenderer.invoke('get-pin-status')
  })
} catch (error) {
  console.error(error)
}
