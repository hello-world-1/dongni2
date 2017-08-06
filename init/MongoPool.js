const MongoClient = require('mongodb').MongoClient;
const genericPool = require('generic-pool');
const util = require('util');
const config = appRequire('services/config').get('db');


const mongodbUrl = 'mongodb://%s:%s/%s';
//var mongodbUrl ='mongodb://%s:%s@%s:%s/%s?authMechanism=DEFAULT';

function createPool() {
    const {user, password, host, port, database, maxPoolSize, minPoolSize, idleTimeoutMillis} = config;
    //const url = util.format(mongodbUrl, user, password, host, port, database);
    //var connectionUrl = util.format( mongodbUrl, host, port, database);
    //const connectionUrl ='mongodb://localhost:28010,localhost:28011,localhost:28012/test?replicaSet=replset1'
    var url = 'mongodb://localhost:27017/appwatch';
    //var url ='mongodb://root:appwatch2017@localhost:27017/appwatch?authMechanism=DEFAULT';
    var factory = {
        create: function () {
            return new Promise(function (resolve, reject) {
                resolve(MongoClient.connect(url))
            });
        },
        destroy: function (client) {
            return new Promise(function (resolve, reject) {
                client.close();
                resolve()
            })
        }
    }
    var setting = {
        //testOnBorrow:true,
        max: 10,
        min: 1
    }
    return  genericPool.createPool(factory, setting);
}


function MongoPool() {
    this.pool=createPool();
}


const mongoMethods = [
    'insert',
    'insertMany',
    'remove',
    'rename',
    'save',
    'update',
    'updateOne',
    'updateMany',
    'distinct',
    'count',
    'drop',
    'findAndModify',
    'findAndRemove',
    'find',
    'findOne',
    'createIndex',
    'ensureIndex',
    'indexInformation',
    'dropIndex',
    'dropAllIndexes',
    'dropIndexes',
    'reIndex',
    'mapReduce',
    'group',
    'options',
    'isCapped',
    'indexExists',
    'geoNear',
    'geoHaystackSearch',
    'indexes',
    'aggregate',
    'stats',
    'hint'
];

function getFn(method){
     function f(collection){
        var self = this;
        var args = [].slice.call(arguments, 1);
        var origCb = args[ args.length -1 ];
        this.pool.acquire().then(function (db) {
            function cb(){
                self.pool.release(db);
                return origCb.apply(origCb, arguments );
            };
            args[ args.length -1 ] = cb;
            var coll = db.collection(collection);
            coll[method].apply(coll, args );
        }).catch(function (err) {
            if(err) return origCb(err);
        });
    };
    return f;
};

mongoMethods.forEach( (method) => {
    MongoPool.prototype[method] = getFn(method);
});

module.exports = MongoPool;