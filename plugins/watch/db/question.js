/**
 * Created by root on 8/7/17.
 */
/**
 * 用户提问信息
 */
var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');

var QuestionSchema = new Schema({

    parentID: {type: Schema.Types.ObjectId, ref: 'User'},           //家长id
    title: {type: String, default: "提问"},
    content: {type: String, default: ""},
    openFlag: {type: String, default: "1"},                         //是否公开标志位，1:公开，0:不公开
    replyFlag: {type: String ,default: "0"},                        //是否被回复标志位，1:被回复，0:未被回复
    createAt: {type: Date, default: Date.now},                      //提问时间
    // reply: [{type: Schema.Types.ObjectId, ref: 'Reply'}]            //所有回复id
});

QuestionSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Question',QuestionSchema);