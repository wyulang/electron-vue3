const { app, BrowserWindow, ipcMain, Menu } = require('electron');
let envs = process.env.npm_lifecycle_event;
let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  if (envs == 'dev') {
    win.loadURL('http://localhost:3007/');
    // win.webContents.openDevTools();

  } else {
    win.loadFile('./www/index.html')
  }
}

ipcMain.handle('open-dev', (e, data) => {
  win.webContents.openDevTools();
})

ipcMain.handle('win-bar', async (event, data) => {
  if (win) {
    if (data == 'close') {
      win.close();
    } else if (data == 'max') {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    } else if (data == 'min') {
      if (win.isMinimized()) {
        win.restore();
      } else {
        win.minimize();
      }
    }
  }
})

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.allowRendererProcessReuse = false;
require('./vue.load.js');

