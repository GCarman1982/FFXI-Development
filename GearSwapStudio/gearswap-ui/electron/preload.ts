import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  onUpdaterEvent: (callback: (event: any, data: any) => void) => {
    // Deliberately strip event as it includes `sender` 
    ipcRenderer.on('updater-event', (event, data) => callback(event, data));
  },
  checkForUpdates: () => {
    ipcRenderer.send('check-for-updates');
  },
  downloadUpdate: () => {
    ipcRenderer.send('download-update');
  },
  installUpdate: () => {
    ipcRenderer.send('install-update');
  }
})