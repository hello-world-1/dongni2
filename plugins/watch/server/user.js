/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();

exports.parentDetails = (req, res) => {
    res.send('This is not implemented now');
};

exports.childrenDetails = (req, res) => {
    res.send('This is not implemented now');
};

exports.allDetails = (req, res) => {
    res.send('This is not implemented now');
};
