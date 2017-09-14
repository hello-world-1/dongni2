/**
 * Created by root on 8/7/17.
 */
/**
 * 手表信息
 */
var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');
var Child = require('./child');

var WatchSchema = new Schema({
    IMEI: {type: String, required: true},                           //手表IMEI号
    watchTelephone: {type: String, required: true},                 //手表手机号
    controlTelephone: {type: String,required: true},                //主控号码
    parentID: {type: Schema.Types.ObjectId, ref: 'User'},           //家长id
    childID: {type: Schema.Types.ObjectId, ref: 'Child'},           //child id
});

module.exports = mongoose.model('Watch',WatchSchema);