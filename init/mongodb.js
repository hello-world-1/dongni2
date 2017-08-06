const MongoPool = appRequire('init/MongoPool');

const mongodb=new MongoPool();

module.exports =  mongodb;
