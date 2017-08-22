const path = require('path');


// global config
global.appRequire = (filePath) => {
  return require(path.resolve(__dirname, '../' + filePath));
};
