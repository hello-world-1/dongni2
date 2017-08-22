const mongodb = require('../init/mongodb');
const tableName = 'watchinfo';

const updateWatchInfo = (filter,updatedata) => {
    return new Promise((resolve,reject)=>{
        mongodb.update(tableName,filter,updatedata,{upsert:true},function(err,doc){
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve()
            }
        })
    })
}
//将血压心率数据写入watchinfo表
const pushXX = (filter,pushdata) => {
    return new Promise((resolve,reject)=>{
        mongodb.update(tableName,filter,pushdata,function(err,doc){
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(doc)
            }
        })
    })
}

const findXX = (filter,finddata) => {
    return new Promise((resolve,reject)=>{
        mongodb.find(tableName,filter,finddata,function(err,doc){
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(doc)
            }
        })
    })
}





exports.updateWatchInfo=updateWatchInfo;
exports.pushXX=pushXX;
exports.findXX=findXX;