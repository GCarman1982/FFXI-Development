import { app, BrowserWindow, ipcMain } from 'electron'
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

  // Auto-Updater Event Listeners
  autoUpdater.on('update-available', (info) => {
    win.webContents.send('updater-event', { type: 'update-available', info });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('updater-event', { type: 'download-progress', progress: progressObj });
  });

  autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updater-event', { type: 'update-downloaded', info });
  });

  autoUpdater.on('error', (err) => {
    win.webContents.send('updater-event', { type: 'error', error: err.message });
  });
}

// IPC listener for triggering install
ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})