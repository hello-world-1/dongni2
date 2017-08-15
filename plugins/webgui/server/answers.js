const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const ReplyPerson = require('../db/replyPerson');
const Reply = require('../db/reply');

// 跳转到问题回复的界面
exports.showReply = function(req, res) {
	var id = req.params.id

	if (id) {
		Reply.findById(id, function(err, reply) {
			if (reply.questionID) {
				Reply.find({
						questionID: reply.questionID
					})
					.populate('teacherID', 'username name')
					.exec(function(err, replys) {
						res.render('detail', {
							title: '问题详情页',
							replys: replys
						})
					})
			}
		})

	}
}

// 回复问题
exports.replyQuestion = function(req, res) {
	var replyObj = req.body.reply
	var questionID = req.body.reply.questionID
	var parentID = req.body.parentID

	if (replyObj) {
		var _reply

		if (req.poster) {
			replyObj.poster = req.poster
		}
		_reply = new reply(replyObj)

		// 保存回复
		_reply.save(function(err, reply) {
			if (err) {
				console.log(err)
			}
			var replyPersonObj
			replyPersonObj.teacherID = reply.teacherID
			replyPersonObj.parentID = parentID
			replyPersonObj.content = reply.content

			var _replyPerson = new ReplyPerson(replyPersonObj)

			replyPersonObj.save(function(err, replyPerson) {
				if (err) {
					console.log(err)
				}
				// 跳转到showReply
				res.redirect('/question/' + questionID)
			})
		})
	}
}

// 我的所有回复
exports.myReply = function(req, res) {
	var teacherID = req.body.teacherID
		// 通过老师的id查找该老师的所有回复
	Reply.findByTeacherId(teacherID, function(err, reply) {
		res.render('list', {
			title: '消息回复页',
			reply: reply
		})
	})

	Reply.find({
			teacherID: teacherID
		})
		.populate('questionID', 'title')
		.exec(function(err, replys) {
			res.render('detail', {
				title: '我的回复页',
				replys: replys
			})
		})
}