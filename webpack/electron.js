const { spawn } = require('child_process');
const electron = require('electron');

let electronProcess = spawn(electron, [path.join(__dirname, '../electron/index.js')])
electronProcess.stdout.on('data', data => {
})
electronProcess.stderr.on('data', data => {

})

electronProcess.on('close', () => {
  process.exit()
})
