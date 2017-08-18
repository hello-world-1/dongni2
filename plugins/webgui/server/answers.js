const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const ReplyPerson = require('../db/replyPerson');
const Reply = require('../db/reply');
const Teacher = require('../db/teacher');
const Question = appRequire('plugins/watch/db/question');
const Parent = appRequire('plugins/watch/db/user');

// 跳转到问题回复的界面
exports.replyview = function(req, res) {
	const questionID = req.params.id
	let _parent
	let _question

    Question.findOne({_id: questionID}).exec(function (err, question) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        if (question.length === 0) {
            return res.json({status: 'error', 'errcode': 2});
        } else {
            _question = question
            Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
                _parent = parent
                if (questionID) {
                    Reply.findById(questionID, function(err, replys) {

                        if (replys.length === 0) {
                            return res.json({status: 'error', 'errcode': 3});
                        } else {
                            // db.questions.update({"_id":ObjectId("599666e3e1097e36ab8fdb4b")},{$set:{"parentID" : "59965ba9e1097e36ab8fdb47"}})
                            let teachers_serialize = [];
                            async.map(replys, function(reply, callback) {
                                let _teacher

                                Teacher.findOne({_id: reply.teacherID}).exec(function (err, teacher) {
                                    if(err){
                                        return res.json({status: 'error', 'errcode': 2});
                                    }
                                    _teacher = teacher
                                    var tmp = {
                                        teacher: _teacher,
                                        content:reply.content
                                    };
                                    teachers_serialize.push(tmp);
                                    callback(null,teachers_serialize)
                                })
                            }, function(err,results) {
                                res.json({
                                    status: 'success',
                                    'question': {
                                        parent:_parent,
                                        question:_question
                                    },
                                    replys:results
                                });
                            });
                        }
                    })
                }
            })
        }
    });
}

// 回复问题
exports.replycommit = function(req, res) {
    // >> * questionID:requested
    // >> * parentID:requested
    // >> * teacherID:requested
    // >> * content:requested

	const questionID = req.body.questionID
    const parentID = req.body.parentID
    const teacherID = req.body.teacherID
	const content = req.body.content
	let replyObj
    replyObj.teacherID = teacherID
    replyObj.questionID = questionID
    replyObj.content = content
    let replyPersonObj
    replyPersonObj.teacherID = teacherID
    replyPersonObj.parentID = parentID
    replyPersonObj.content = content

	let _reply = new reply(replyObj)
    let _replyPerson = new replyPerson(replyPersonObj)

	// 保存回复
	_reply.save(function(err, reply) {
		if (err) {
            return res.json({status: 'error', 'errcode': 2});
		}
	})
    replyPersonObj.save(function(err, replyPerson) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
    })

    let _parent
    let _question

    Question.findOne({_id: questionID}).exec(function (err, question) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        if (question.length === 0) {
            return res.json({status: 'error', 'errcode': 2});
        } else {
            _question = question
            Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
                _parent = parent
                if (questionID) {
                    Reply.findById(questionID, function(err, replys) {

                        if (replys.length === 0) {
                            return res.json({status: 'error', 'errcode': 3});
                        } else {
                            // db.questions.update({"_id":ObjectId("599666e3e1097e36ab8fdb4b")},{$set:{"parentID" : "59965ba9e1097e36ab8fdb47"}})
                            let teachers_serialize = [];
                            async.map(replys, function(reply, callback) {
                                let _teacher

                                Teacher.findOne({_id: reply.teacherID}).exec(function (err, teacher) {
                                    if(err){
                                        return res.json({status: 'error', 'errcode': 2});
                                    }
                                    _teacher = teacher
                                    var tmp = {
                                        teacher: _teacher,
                                        content:reply.content
                                    };
                                    teachers_serialize.push(tmp);
                                    callback(null,teachers_serialize)
                                })
                            }, function(err,results) {
                                res.json({
                                    status: 'success',
                                    'question': {
                                        parent:_parent,
                                        question:_question
                                    },
                                    replys:results
                                });
                            });
                        }
                    })
                }
            })
        }
    });
}

// 我的所有回复
exports.replylist = function(req, res) {
	var teacherID = req.session.user._id

    //通过家长id获得该id下的所有提问
    Reply.find({teacherID: user._id}).sort({createAt:-1}).exec(function (err, replys) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        if (replys.length === 0) {
            return res.json({status: 'error', 'errcode': 3});   //该用户没有回复
        } else {


            let replys_serialize = [];
            async.map(replys, function(reply, callback) {
                let _teacher
                let _question
                let _parent
                const content = reply.content

                Teacher.findById(reply.teacherID, function(err, teacher) {
                    if (err) {
                        return res.json({status:'error','errcode':2});
                    }
                    _teacher = teacher
                })

                Question.findOne({_id:reply.questionID}, function(err, question) {
                    if (err) {
                        return res.json({status:'error','errcode':2});
                    }
                    _question = question
                })

                Parent.findOne({_id:reply.parentID}, function(err, parent) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 2});
                    }
                    _parent = parent
                })

                var tmp = {
                    parent: _parent,
                    question: _question,
                    teacher: _teacher,
                    content: content
                };
                replys_serialize.push(tmp);
                callback(null,replys_serialize)
            }, function(err,results) {
                res.json({status: 'success', 'replys': results});
            });
        }
    });
}