/**
 * 老师回复人信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;
var Teacher = require('./teacher');
var User = appRequire('plugins/watch/db/user');

var ReplyPersonSchema = new Schema({

	teacherID: {
		type: Schema.Types.ObjectId,
		ref: 'Teacher'
	}, //老师id
	parentID: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}, //家长id
	content: {
		type: String,
		default: ""
	}, //回复内容
});

module.exports = mongoose.model('ReplyPerson', ReplyPersonSchema);