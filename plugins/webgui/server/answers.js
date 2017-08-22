const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const ReplyPerson = require('../db/replyPerson');
const Reply = require('../db/reply');
const Teacher = require('../db/teacher');
const Question = appRequire('plugins/watch/db/question');
const Parent = appRequire('plugins/watch/db/user');
const async = require('async');
const ObjectId = require('mongodb').ObjectId;


exports.allquestionreply = function(req, res) {

    Question.find({}).exec(function (err, questions) {
        let questionreply_serialize = [];
        if (err) {
            return res.json({status: 'error', 'errcode': 1});
        }
        if (questions.length === 0) {
            return res.json({status: 'error', 'errcode': 2});
        } else {
            async.map(questions, function(question, callback1) {
                Promise.resolve().then(() => {
                    return new Promise((resolve,reject)=>{
                        Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
                            if (parent) {
                                Reply.find({questionID:question._id}, function(err, replys) {

                                    if (replys.length === 0) {
                                        var tmp1 = {
                                            'question': {
                                                parent:parent,
                                                question:question
                                            }
                                        };
                                        // questionreply_serialize.push(tmp1)
                                        // resolve(questionreply_serialize)
                                        resolve(tmp1)
                                    } else {
                                        // db.questions.update({"_id":ObjectId("599666e3e1097e36ab8fdb4b")},{$set:{"parentID" : "59965ba9e1097e36ab8fdb47"}})
                                        // let teachers_serialize = [];
                                        async.map(replys, function(reply, callback2) {
                                            Teacher.findOne({_id: reply.teacherID}).exec(function (err, teacher) {
                                                if(err){
                                                    return res.json({status: 'error', 'errcode': 4});
                                                }
                                                if(teacher){
                                                    var tmp = {
                                                        teacher: teacher,
                                                        content:reply.content
                                                    };
                                                    // teachers_serialize.push(tmp);
                                                    // console.log("teachers_serialize:" + teachers_serialize)
                                                    // callback2(null,teachers_serialize)
                                                    callback2(null,tmp)
                                                }
                                            })
                                        }, function(err,results) {
                                            if(err){
                                                return res.json({status: 'error', 'errcode': 5});
                                            }
                                            var tmp1 = {
                                                'question': {
                                                    parent:parent,
                                                    question:question
                                                },
                                                replys:results
                                            };
                                            // questionreply_serialize.push(tmp1)
                                            // resolve(questionreply_serialize)
                                            resolve(tmp1)
                                        });
                                    }
                                })
                            }
                        })
                    })
                }).then((questionreply_serialize)=>{
                    callback1(null,questionreply_serialize)
                }).catch(err => {
                    logger.error(err);
                });
            }, function(err,results) {
                if(err){
                    return res.json({status: 'error', 'errcode': 6});
                }
                return res.json({
                    all:results
                });
            })
        }
    });
}

// 跳转到问题回复的界面
exports.replyview = function(req, res) {
	const questionID = req.body.id
	let _parent
	let _question

    // Question.findOne({_id: questionID}).exec(function (err, question) {
    Question.findOne({_id: ObjectId(questionID)}).exec(function (err, question) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        if(question){
            _question = question
            Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
                _parent = parent
                if (questionID) {
                    Reply.findByQuestionId(questionID, function(err, replys) {

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
                                    question: {
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
	let replyObj = {
        teacherID:teacherID,
        questionID:questionID,
        parentID:parentID,
        content:content
    }
    let replyPersonObj = {
        teacherID:teacherID,
        parentID:parentID,
        content:content
    }
	let _reply = new Reply(replyObj)
    let _replyPerson = new ReplyPerson(replyPersonObj)

	// 保存回复
	_reply.save(function(err, reply) {
		if (err) {
            return res.json({status: 'error', 'errcode': 2});
		}
		if (reply){
            _replyPerson.save(function(err, replyPerson) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 2});
                }
                if (replyPerson) {
                    let _parent
                    let _question

                    Question.findOne({_id: questionID}).exec(function (err, question) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 2});
                        }

                        _question = question
                        Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
                            _parent = parent
                            if (questionID) {
                                Reply.findByQuestionId(questionID, function(err, replys) {

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
                    });
                }
            })
        }
	})
}

// 我的所有回复
exports.replylist = function(req, res) {
	// var teacherID = req.session.user._id

    let teacherID = req.body.id
    //通过家长id获得该id下的所有提问
    Reply.find({teacherID: teacherID}).sort({createAt:-1}).exec(function (err, replys) {
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
                    if (teacher) {
                        _teacher = teacher
                        Question.findOne({_id:reply.questionID}, function(err, question) {
                            if (err) {
                                return res.json({status:'error','errcode':2});
                            }
                            if (question) {
                                _question = question
                                Parent.findOne({_id:reply.parentID}, function(err, parent) {
                                    if (err) {
                                        return res.json({status: 'error', 'errcode': 2});
                                    }
                                    if (parent) {
                                        _parent = parent
                                        var tmp = {
                                            parent: _parent,
                                            question: _question,
                                            teacher: _teacher,
                                            content: content
                                        };
                                        replys_serialize.push(tmp);
                                        callback(null,replys_serialize)
                                    }

                                })
                            }

                        })
                    }

                })
            }, function(err,results) {
                res.json({status: 'success', 'replys': results});
            });
        }
    });
}