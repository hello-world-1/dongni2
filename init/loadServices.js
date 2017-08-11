const path = require('path');
const config = appRequire('services/config').all();

const appwatch = () => {
  appRequire('services/appwatch');
  appRequire('services/server');
};
const manager = () => {
  //appRequire('services/manager');
    appRequire('services/appwatch');
};
if(config.type === 's') {
    appwatch();
} else if (config.type === 'm') {
  manager();
}
