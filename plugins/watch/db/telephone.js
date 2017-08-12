/**
 * Created by root on 8/7/17.
 */
/**
 * 手表联系人信息
 */
var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');

var TelephoneSchema = new Schema({

    IMEI: {type: String, required: true},                           //手表IMEI号
    telephone: {type: String, required: true},                      //手表手机号
    name: {type: String, default: ""},                              //联系人姓名
    avatar: {type: String, default: ""},                            //联系人头像
    type: {type: String, default: "1"},                             //1:联系人 2:sos 3:亲情号码
    parentID: {type: Schema.Types.ObjectId, ref: 'User'},           //家长id
    createAt: {type: Date, default: Date.now}
});



module.exports = mongoose.model('Watch',TelephoneSchema);