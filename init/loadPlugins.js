const fs = require('fs');
const path = require('path');
const config = appRequire('services/config').all();

const log4js = require('log4js');
const logger = log4js.getLogger('system');

const loadPlugins = () => {
  if(!config.plugins) {
    return;
  }
  if(config.type !== 'm') {
    return;
  }
  for(const name in config.plugins) {
    if(config.plugins[name].use) {
      logger.info(`Load plugin: ${ name }`);

      Promise.resolve().then(() => {
        logger.info(`Load plugin index: ${ name }/index`);
        appRequire(`plugins/${ name }/index`);
      }).catch(err => {
        logger.error(err);
      });
    }
  }
};
loadPlugins();
