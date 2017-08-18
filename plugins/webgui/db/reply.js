/**
 * 老师回复提问信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;
var Teacher = require('./teacher');
var Question = appRequire('plugins/watch/db/question');
var User = appRequire('plugins/watch/db/user');

var ReplySchema = new Schema({

	teacherID: {
		type: Schema.Types.ObjectId,
		ref: 'Teacher'
	}, //老师id
	questionID: {
		type: Schema.Types.ObjectId,
		ref: 'Question'
	}, //问题id
    parentID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

ReplySchema.pre('save', function(next) {
    if (this.isNew) {
        //1502879149135
        this.createAt = Date.now()
    }

    next()
})

ReplySchema.statics = {
    findByTeacherId: function(id, cb) {
        return this
            .find({
                teacherID: id
            })
            .sort('createAt')
            .exec(cb)
    },
    findByQuestionId: function(id, cb) {
        return this
            .find({
                teacherID: id
            })
            .sort('createAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb)
    },
    fetch: function(cb) {
        return this
            .find({})
            .sort('createAt')
            .exec(cb)
    }
}

module.exports = mongoose.model('Reply', ReplySchema);