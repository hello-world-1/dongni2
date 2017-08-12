/**
 * Created by root on 8/7/17.
 */
/**
 * 预警信息
 */
var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');

var AlertSchema = new Schema({

    parentID: {type: Schema.Types.ObjectId, ref: 'User'},       //家长id
    content: {type: String, default: ""},                       //警示内容
    viewedFlag: {type: String, default: "0"},                   //是否被查看标志位： 0：未被查看 1： 已查看
    date: {type: Date, default: Date.now},                      //预警发布的时间
});

module.exports = mongoose.model('Alert',AlertSchema);