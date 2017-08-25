/**
 * 消息信息
 */
const mongoose = appRequire('init/mongoose');
const Schema = mongoose.Schema;
const User = appRequire('plugins/watch/db/user');
const Teacher = require('./teacher');

const MessageSchema = new Schema({

	parentID: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}, //家长id
	type: {
		type: String,
		default: ""
	}, //消息类型：1：问题回复 2：推荐课程 3：推荐书籍
	typeID: {
        type: String,
		default: ""
	}, //消息来源id
	content: {
		type: String,
		default: ""
	}, //消息内容
	viewedFlag: {
		type: String,
		default: "0"
	}, //消息是否被查看标志位： 0：未被查看 1： 已查看
	date: {
		type: Date,
		default: Date.now
	}, //消息发布的时间
	teacherID: {
		type: Schema.Types.ObjectId,
		ref: 'Teacher'
	}, //老师id
});

MessageSchema.pre('save', function (next) {
    if (this.isNew) {
        this.date = Date.now();
    }
    next();
});

module.exports = mongoose.model('Message', MessageSchema);