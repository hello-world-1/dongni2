/**
 * Created by root on 8/3/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Question = appRequire('plugins/watch/db/question');
const Reply = appRequire('plugins/webgui/db/reply');
const Teacher = appRequire('plugins/webgui/db/teacher');
const Parent = appRequire('plugins/watch/db/user');
const async = require('async');

//列出该用户的所有提问
exports.list = (req, res) => {

    user = req.body.user;
    pagestart = req.body.pagestart;

    if (!pagestart) pagestart = 0;

    //通过家长id获得该id下的所有提问
    Question.find({parentID: user._id}).limit(pagestart * 10, 10).sort({createAt: -1}).exec(function (err, questions) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        //该用户没有提问
        if (questions.length === 0) {
            return res.json({status: 'error', 'errcode': 4});   //该用户没有提问
        }
        //该用户有提问
        else {
            console.log("question.list:");
            console.log(questions);
            var questions_serialize = [];
            questions.forEach(function (question) {
                var tmp = {
                    id: question._id,
                    title: question.title,
                    content: question.content,
                    createAt: question.createAt
                };
                questions_serialize.push(tmp);
            });
            res.json({status: 'success', 'questions': questions_serialize});
        }
    });
};

//相关问题
exports.similar = (req, res) => {

    pagestart = req.body.pagestart;
    if (!pagestart) {
        pagestart = 0;
    }

    Question.find().limit(pagestart * 10, 10).sort({createAt: -1}).exec(function (err, questions) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        else {
            console.log("question.similar:");
            console.log(questions);
            var questions_serialize = [];
            questions.forEach(function (question) {
                var _question = {
                    questionID: question._id,
                    title: question.title,
                    content: question.content,
                    createAt: question.createAt
                };
                questions_serialize.push(_question);
            });
            res.json({status: 'success', 'similar': questions_serialize});
        }
    });
};

//用户添加新提问
exports.add = (req, res) => {

    let _question = {
        parentID: req.body.user._id,
        title: req.body.title,
        content: req.body.content,
        openFlag: req.body.openFlag
    };

    question = new Question(_question);
    console.log("question.add:");
    console.log(question);
    question.save(function (err, question) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //提问保存出错
        }
        else {
            res.json({
                status: 'success',
                questionID: question._id,
            });
        }
    });

    // res.send('This is not implemented now');
};

exports.detail = (req, res) => {

    questionID = req.body.questionID;

    Question.findOne({_id: questionID}, function (err, question) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        if (!question) {
            return res.json({statu: 'error', 'errcode': 4});    //未查询到该问题
        } else {
            var _question = {
                title: question.title,
                content: question.content,
                createAt: question.createAt
            };
            Reply.find({questionID: questionID}).sort({createAt: -1}).exec(function (err, replys) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 5});   //数据库查询出错
                }
                else {
                    async.map(replys, function (reply, callback) {
                        Teacher.findOne({_id: reply.teacherID}).exec(function (err, teacher) {
                            if (err) {
                                return res.json({"status": "error", "errcode": 1});
                            }
                            if (teacher) {
                                console.log("parent:" + parent);
                                var tmp = {
                                    teacher: teacher,
                                    content:reply.content
                                };
                                callback(null,tmp)
                            }
                        });
                    },function (err, results) {
                        res.json({status: 'success', 'question': _question, 'replys': results});
                    });
                }


            })
        }
    });
};

exports.replies = function(req, res) {
    parentID = req.body.user._id;

    Question.find({parentID:parentID}).exec(function (err, questions) {
        let questionreply_serialize = [];
        if (err) {
            return res.json({status: 'error', 'errcode': 3});
        }
        if (questions.length === 0) {
            return res.json({status: 'error', 'errcode': 4});
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
                                                    return res.json({status: 'error', 'errcode': 3});
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
                                                return res.json({status: 'error', 'errcode': 3});
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
                    return res.json({status: 'error', 'errcode': 3});
                });
            }, function(err,results) {
                if(err){
                    return res.json({status: 'error', 'errcode': 3});
                }
                return res.json({
                    all:results
                });
            })
        }
    });
}

