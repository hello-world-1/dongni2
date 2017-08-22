const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Teacher = require('../db/teacher');
const Admin = require('../db/admin');
const Child = appRequire('plugins/watch/db/child');
const Parent = appRequire('plugins/watch/db/user');
const Emotion = appRequire('plugins/watch/db/emotion');
const Question = appRequire('plugins/watch/db/question');
const moment = require('moment');

exports.signin = function(req, res) {

    const username = req.body.username
    const password = req.body.password

    Admin.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            console.log(err)
        }
        if (user){
            // if admin contain this username,return username exist
            return res.json({status: 'error', 'errcode': 1});
        }else{
            let user = new Admin()
            user.username = username
            user.password = password
            // user = new Admin(_user)
            user.save(function(err, user) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 2});
                }

                return res.json({status: 'success', 'user': user});
            })
        }

    })
}

// 
exports.login = function(req, res) {
    // >> * username:requested
    // >> * password:requested
    // var _user = req.body.user
    const username = req.body.username
    const password = req.body.password

    console.log(username)

    Teacher.findOne({
        username: username
    }, function(err, user) {

        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }

        if (!user) {
            // if teacher not contain this username,query admin

            Admin.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    res.json({status: 'error', 'errcode': 2});
                }
                if (!user){
                    // if admin not contain this username,return username not exist
                    res.json({status: 'error', 'errcode': 1});
                }else{
                    user.comparePassword(password, function(err, isMatch) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 2});
                        }
                        if (isMatch) {
                            // if admin match
                            req.session.user = user
                            req.session.type = 'admin'
                            Teacher.fetch(function(err, teachers) {
                                return res.json({
                                        "status": "success",
                                        teachers:teachers
                                        });
                            })

                        } else {
                            return res.json({status: 'error', 'errcode': 2});
                        }
                    })
                }

            })
        }else{
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 2});
                }

                if (isMatch) {
                    // req.session.type = 'teacher'
                    // req.session.user = user
                    return res.json({
                        "status": "success",
                        teacher:user
                    });
                } else {
                    return res.json({status: 'error', 'errcode': 2});
                }
            })
        }
    })
}

exports.logout = function(req, res) {
    delete req.session.user
    delete req.session.type

    return res.json({"status":"success"})
}

exports.childinfo = function(req, res) {

    //var s1 = moment().format("YYYY-MM-DD HH:mm:ss");
    const parentID = req.body.parentID
    const firstDay = req.body.firstDay
    // const limit = req.body.limit

    let _child
    let _parent

    //通过家长id获得该id下的所有提问
    Parent.findOne({_id: parentID})
        .exec(function (err, parent) {
            if (err) {
                return res.json({status: 'error', 'errcode': 2});
            }
            if (parent.length === 0) {
                return res.json({status: 'error', 'errcode': 2});
            } else {
                _parent = parent
                //https://jingyan.baidu.com/article/6079ad0ea56db628fe86db61.html
                //判断两个时间差是否为一天
                // var str1 = "2017-02-27 13:00:00";
                // var str2 = "2017-03-05 13:00:00";
                // var t1 = new Date(str1).getTime();
                // var t2 = new Date(str2).getTime();
                //if((t2-t1)>24*3600*1000)
                Child.findOne({_id: parent.childID})
                    .exec(function (err, child) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 2});
                        }
                        if (child){
                            _child = child
                            // day question
                            Question.find({}).exec(function (err, questions) {
                                let questionreply_serialize = [];
                                if (err) {
                                    return res.json({status: 'error', 'errcode': 2});
                                }
                                if (questions.length === 0) {
                                    return res.json({status: 'error', 'errcode': 2});
                                } else {
                                    const firstDateTime = firstDay.getTime()
                                    let questions_serialize = [];
                                    questions.forEach(function (question) {
                                        if ((question.createAt.getTime()-firstDateTime) < 24*3600*1000) {
                                            if ((question.createAt.getTime()-firstDateTime) > 0) {
                                                questions_serialize.push(tmp);
                                            }
                                        }
                                    });
                                    async.map(questions_serialize, function(question, callback1) {
                                        _question = question
                                        if (questionID) {
                                            Reply.findById(questionID, function(err, replys) {

                                                if (replys.length === 0) {
                                                    return res.json({status: 'error', 'errcode': 2});
                                                } else {
                                                    // db.questions.update({"_id":ObjectId("599666e3e1097e36ab8fdb4b")},{$set:{"parentID" : "59965ba9e1097e36ab8fdb47"}})
                                                    let teachers_serialize = [];
                                                    async.map(replys, function(reply, callback2) {
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
                                                            callback2(null,teachers_serialize)
                                                        })
                                                    }, function(err,results) {
                                                        var tmp1 = {
                                                            status: 'success',
                                                            'question': {
                                                                parent:_parent,
                                                                question:_question
                                                            },
                                                            replys:results
                                                        };
                                                        questionreply_serialize.push(tmp1)
                                                        callback1(questionreply_serialize)
                                                    });
                                                }
                                            })
                                        }
                                    }, function(err,results) {
                                        Emotion.find({}).sort({'createAt':-1}).limit(1).exec(function (err, emotion) {
                                            if (err) {
                                                return res.json({status: 'error', 'errcode': 2});
                                            }
                                            Emotion.find({}).sort({'createAt':-1}).exec(function (err, emotions) {
                                                const firstDateTime = firstDay.getTime()
                                                let emotionValue = 0
                                                let emotionCount = 0
                                                emotions.forEach(function (emotion) {
                                                    if ((firstDateTime-question.createAt.getTime()) > 0) {
                                                        if ((firstDateTime-question.createAt.getTime()) < 7*24*3600*1000) {
                                                            emotionValue += emotion.value
                                                            emotionCount += 1
                                                        }
                                                    }
                                                });
                                                res.json({
                                                    status: 'success',
                                                    info: _child,
                                                    parent:_parent,
                                                    emotion:emotion,
                                                    averageEmotion:emotionValue/emotionCount,
                                                    questions:results
                                                });
                                            })

                                        })
                                    })
                                }
                            });
                        }
                    })
            }
    });
}

