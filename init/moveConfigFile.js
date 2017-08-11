const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const appwatchPath = path.resolve(os.homedir() + '/.appwatch/');

const configFiles = [
  //'default.yml',
  //'ss.yml',
  'webgui.yml'
];

const log4js = require('log4js');
const logger = log4js.getLogger('system');

try {
  fs.statSync(appwatchPath);
} catch(err) {
  logger.info('~/.appwatch/ not found, make dir for it.');
  fs.mkdirSync(appwatchPath);
}
configFiles.forEach(configFile => {
  try {
    fs.statSync(path.resolve(appwatchPath, configFile));
  } catch(err) {
    logger.info(`~/.appwatch/${ configFile } not found, make file for it.`);
    fse.copySync(path.resolve(`./config/${ configFile }`), path.resolve(appwatchPath, configFile));
  }
});
