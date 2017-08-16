/**
 * Created by root on 8/7/17.
 */
/**
 * 课程订单信息
 */
var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');
var Lesson = appRequire('plugins/webgui/db/lesson');

var BillSchema = new Schema({

    parentID: {type: Schema.Types.ObjectId, ref: 'User'},       //家长id
    lessonID: {type: Schema.Types.ObjectId, ref: 'Lesson'},     //课程id
    createAt: {type: Date, default: Date.now}                   //订单创建时间
});

BillSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Bill',BillSchema);