/**
 * Created by root on 7/26/17.
 */

const mongodb = require('../init/mongodb');
const tableName = 'account';

async function save(){
    const account={user:'root',passord:'123456'}
    await mongodb.insert(tableName,account, {safe: true}, function (err, user) {
        console.log(err);
    })
    await mongodb.findOne(tableName,{user:'root'},function (err,doc) {
        console.log(doc);
    })
    console.log("finish");
};



// const createTable = async() => {
//     // var WatchSchema = new Schema({
//     //     imei:  String,
//     //     type: String,
//     //     language:   String,
//     //     date: { type: Date, default: Date.now }
//     // });
//     // await mongoose.model('Watch', WatchSchema);
//     var mongoose=require('../init/mongoose.js'),Schema = mongoose.Schema;
//     const tableName = 'Watch';
//     var UserSchema = new Schema({
//         username : { type: String },                    //用户账号
//         userpwd: {type: String},                        //密码
//         userage: {type: Number},                        //年龄
//         logindate : { type: Date}                       //最近登录时间
//     });
//     return await mongoose.model('Userone',UserSchema);
// };

exports.save = save;


