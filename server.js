/**
 * Created by root on 7/25/17.
 */
if(process.env.NODE_ENV !== 'production') {
    console.log('use babel-core/register');
    require('babel-core/register');
}

require('./init/log');
// process.env.TZ = "Asia/Shanghai";

const log4js = require('log4js');
const logger = log4js.getLogger('system');

logger.info('System start.');

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // Raven.captureException(reason);
});

process.on('uncaughtException', (err) => {
    logger.error(`Caught exception: ${err}`);
    // Raven.captureException(err);
});

require('./init/utils');

require('./init/moveConfigFile');
require('./init/checkConfig');

require('./init/mongodb')

Promise.resolve('start tcp server').then((result) => {
    console.log(result);
    require('./init/loadServices');
    require('./init/loadPlugins');
}).catch(err => {
    logger.error(err);
});


// var mongodb=initDb();
// console.log("start")
// setTimeout(function(){
//     var account={user:'aaa',passord:'123456'}
//     mongodb.insert("appwatch",account, {safe: true}, function (err, user) {
//         console.log(err);
//         mongodb.findOne("appwatch",{user:'aaa'},function (err,doc) {
//             console.log(doc);
//         })
//     })
// },2000)

// initDb().then(() => {
//     require('./init/loadServices');
//     require('./init/loadPlugins');
// }).catch(err => {
//     logger.error(err);
// });
//      require('./init/loadServices');
//      require('./init/loadPlugins');


