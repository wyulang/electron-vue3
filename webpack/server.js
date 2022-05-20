const webpack = require("webpack");
const webpackConfig = require("./dev.js");
let WebpackDevServer = require('webpack-dev-server');
const path = require('path');

let config = require('./config.js');


const { spawn } = require('child_process');
const electron = require('electron');

function starElectron() {
  let electronProcess = spawn(electron, [path.join(__dirname, '../electron/index.js')])
  electronProcess.stdout.on('data', data => {
  })
  electronProcess.stderr.on('data', data => {

  })

  electronProcess.on('close', () => {
    process.exit()
  })
}


const compiler = webpack(webpackConfig);

const devServerOptions = Object.assign({
  open: false,
  port: config.port,
  host: config.host,
  liveReload: false,
  hot: true
});

// Object.assign(devServerOptions, {
//   proxy: {
//     '/api': {
//       target: 'http://demo.ndky.edu.cn',  // 正式环境
//       changeOrigin: true,
//       pathRewrite: { '^/api': '' }
//     }
//   }
// })

const server = new WebpackDevServer(devServerOptions, compiler);

server.start(config.port, config.host, res => {
  if (res) {
    process.exit(0)
  }
});


compiler.hooks.done.callAsync('run',(err, status) => {
  starElectron()
})







