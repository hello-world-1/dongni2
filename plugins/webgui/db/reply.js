/**
 * 老师回复提问信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;
var Teacher = require('./teacher');
var Question = appRequire('plugins/watch/db/question');

var ReplySchema = new Schema({

	teacherID: {
		type: Schema.Types.ObjectId,
		ref: 'Teacher'
	}, //老师id
	questionID: {
		type: Schema.Types.ObjectId,
		ref: 'Question'
	}, //问题id
	content: {
		type: String,
		default: ""
	}, //回复内容
	createAt: {
		type: Date,
		default: Date.now
	}
});


module.exports = mongoose.model('Reply', ReplySchema);