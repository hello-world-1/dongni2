const os = require('os');
const path = require('path');
const program = require('commander');
const version = appRequire('package').version;
const log = appRequire('init/log');

const log4js = require('log4js');
const logger = log4js.getLogger('system');

const appwatchPath = path.resolve(os.homedir() + '/.appwatch/');

program
  .version('app-watch ' + version)
  .option('-c, --config [file]', 'config file, default: ~/.appwatch/default.yml')
  .option('--debug', 'show debug message')
  .parse(process.argv);

if(program.config) { global.configFile = program.config; }

if(!program.debug) {
  log.setConsoleLevel('ERROR');
}

const config = appRequire('services/config');
let logName = 'uname';



if (typeof config.get('db') === 'object') {
  logName = config.get('db.database');
} else {
  const dbpath = config.get('db');
  logName = path.basename(dbpath).split('.')[0];
  if (dbpath[0] === '/' || dbpath[0] === '.' || dbpath[0] === '~') {
	  config.set('db', path.resolve(dbpath));
  } else {
	  config.set('db', path.resolve(appwatchPath, dbpath));
  }
}
log.setFileAppenders(logName);


