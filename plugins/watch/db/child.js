/**
 * Created by root on 8/7/17.
 */
/**
 * 孩子信息
 */
var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');

var ChildSchema = new Schema({

    nickname: {type: String, default: "baby"},              //孩子昵称
    birthday: {type: Date},                                 //孩子生日
    sex: {type: String, default: "male"},                   //孩子性别
    age: {type: String, default: ""},                       //孩子年龄
    grade: {type: String, default: ""},                     //孩子年级
    character: {type: String, default: ""},                 //孩子性格特点
    parentID: {type: Schema.Types.ObjectId, ref: 'User'},   //家长id
});

module.exports = mongoose.model('Child',ChildSchema);