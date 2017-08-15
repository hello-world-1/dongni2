/**
 * 老师信息
 */
const mongoose = appRequire('init/mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

const TeacherSchema = new Schema({

	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	}, //用户名
	password: {
		type: String,
		required: true
	}, //用户密码
	token: {
		type: String
	}, //用户登录使用的token
	avatar: {
		type: String,
		default: ""
	}, //用户头像
	name: {
		type: String,
		default: ""
	}, //老师姓名
	sex: {
		type: String,
		default: "male"
	}, //老师性别
	introduction: {
		type: String,
		default: ""
	}, //老师个人介绍bcryptjs
	age: {
		type: Number,
		default: 30
	}, //老师的年龄
	meta: {
		createAt: { //老师的创建时间
			type: Date,
			default: Date.now()
		},
		updateAt: { //老师的最近一次登录时间
			type: Date,
			default: Date.now()
		}
	}/*,
	books: [{
		type: ObjectId,
		ref: 'Book'
	}], //老师发布的书籍
	lessons: [{
		type: ObjectId,
		ref: 'Lesson'
	}] //老师发布的课程*/
});

TeacherSchema.pre('save', function(next) {
	var user = this

	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err)

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err)

			user.password = hash
			next()
		})
	})
})

TeacherSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if (err) return cb(err)

			cb(null, isMatch)
		})
	}
}




TeacherSchema.statics = {
    findByQuestionId: function(questionID, cb) {
        return this
            .find({
                questionID: questionID
            })
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb)
    },
    findByTeacherId: function(teacherID, cb) {
        return this
            .find({
                teacherID: teacherID
            })
            .exec(cb)
    },
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	}
}

module.exports = mongoose.model('teacher', TeacherSchema);