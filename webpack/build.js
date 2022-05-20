
const webpack = require('webpack') // 加载 webpack
const webpackConfig = require("./prod.js");
const chalk = require('chalk');
const fs=require('fs-extra')
//删除dist文件
fs.remove('./dist')
process.stderr.write(chalk.blueBright.bold(` build start ..... \n\n`));
webpack(webpackConfig, (err, state) => {
  if (err) throw err
});