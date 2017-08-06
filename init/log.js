const fs = require('fs');
const os = require('os');
const path = require('path');
const appwatchPath = path.resolve(os.homedir() + '/.appwatch');
const logPath = path.resolve(os.homedir() + '/.appwatch/logs');
const log4js = require('log4js');

const category = [
  'system',
  'webgui',
  'express'
];

log4js.configure({
  appenders: [{
    type: 'console',
    category,
  }],
});

const setConsoleLevel = level => {
  log4js.configure({
    appenders: [{
      type: 'logLevelFilter',
      level,
      category,
      appender: {
        type: 'console',
      }
    }]
  });
};

const setFileAppenders = (filename) => {
  try {
    fs.statSync(appwatchPath);
  } catch(err) {
    fs.mkdirSync(appwatchPath);
  }
  try {
    fs.statSync(logPath);
  } catch(err) {
    fs.mkdirSync(logPath);
  }
  try {
    fs.statSync(path.resolve(logPath, filename));
  } catch(err) {
    fs.mkdirSync(path.resolve(logPath, filename));
  }
  log4js.loadAppender('dateFile');
  category.forEach(ctg => {
    log4js.addAppender(log4js.appenderMakers['dateFile']({
      type: 'dateFile',
      filename: path.resolve(logPath, filename + '/' + ctg + '.log'),
      pattern: '-yyyy-MM-dd',
      compress: true,
    }), ctg);
  });
};

exports.setConsoleLevel = setConsoleLevel;
exports.setFileAppenders = setFileAppenders;
