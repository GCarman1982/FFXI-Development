import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configure logging for auto-updater (optional but helpful)
// autoUpdater.logger = console;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "GearSwap Studio",
    backgroundColor: '#000033', // FFXI Dark Blue
    autoHideMenuBar: true,
    webPreferences: {
      // Points to the preload file we'll create next
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  // Test active server or load index.html
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Check for updates once the window is created
  if (!process.env.VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdatesAndNotify()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})