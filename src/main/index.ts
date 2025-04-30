import { app, shell, BrowserWindow, ipcMain,globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    frame: false, // 移除标准框架
    transparent: true, // 启用窗口透明
    // titleBarStyle: 'hidden',
    titleBarStyle: 'hiddenInset', // Changed from 'hidden' to 'hiddenInset'
    trafficLightPosition: { x: 10, y: 10 }, // Position window controls (for macOS)
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true, // Enable webview tag
    },
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
function registerShortCut() {
  globalShortcut.register('CommandOrControl+H', () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.hide();
    }
  });
  globalShortcut.register('CommandOrControl+S', () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

function RegeisterPinFunction() {
  ipcMain.handle('toggle-pin-to-desktop', (_, shouldPin) => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(shouldPin);
      return mainWindow.isAlwaysOnTop();
    }
    return false;
  });

  ipcMain.handle('get-pin-status', () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    return mainWindow ? mainWindow.isAlwaysOnTop() : false;
  });
}

// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // pin function
  RegeisterPinFunction();
  createWindow()
  registerShortCut();
  app.on('will-quit', () => {
    // 注销所有快捷键
    globalShortcut.unregisterAll()
  })
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



