/**
 * 消息信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;
var User = appRequire('plugins/watch/db/user');
var Teacher = require('./teacer');

var MessageSchema = new Schema({

	parentID: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}, //家长id
	type: {
		type: String,
		default: ""
	}, //消息类型：1：问题回复 2：推荐课程 3：推荐书籍
	typeID: {
		type: ObjectId,
		default: null
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

module.exports = mongoose.model('Message', MessageSchema);