const { ipcMain } = require('electron');
const execa = require('execa');

ipcMain.handle('get-wifi-name', (e, data) => {
  const cmd = 'netsh';
  const args = ['wlan', 'show', 'interface'];
  const stdout = execa.sync(cmd, args).stdout;
  return stdout
})