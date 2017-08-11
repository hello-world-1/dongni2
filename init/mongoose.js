const config = appRequire('services/config').get('db');

var mongoose;
if(typeof config === 'object') {
    const { host, user, port, password, database } = config;

    let uri = `mongodb://${host}:${port}/${database}`;
    mongoose =require('mongoose').connect(uri);
    /**
     * 连接成功
     */
    mongoose.connection.on('connected', function () {
        console.log('Mongoose connection open to ');
    });

    /**
     * 连接异常
     */
    mongoose.connection.on('error',function (err) {
        console.log('Mongoose connection error: ' + err);
    });

    /**
     * 连接断开
     */
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose connection disconnected');
    });

}
module.exports = mongoose;
