const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Teacher = require('../db/teacher');
const Admin = require('../db/admin');
const Reply = require('../db/reply');
const Child = appRequire('plugins/watch/db/child');
const Parent = appRequire('plugins/watch/db/user');
const Emotion = appRequire('plugins/watch/db/emotion');
const Question = appRequire('plugins/watch/db/question');
const moment = require('moment');
const ObjectId = require('mongodb').ObjectId;
const async = require('async');

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
                            // req.session.user = user
                            // req.session.type = 'admin'
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
    const firstDateTime = new Date(firstDay).getTime()

    let _child
    let _parent
    let _averageEmotion
    let _emotion

    Promise.resolve().then(() => {
        return new Promise((resolve,reject)=>{
            Parent.findOne({_id: parentID}).exec(function (err, parent) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 1});
                }
                if (!parent) {
                    return res.json({status: 'error', 'errcode': 2});
                }else{
                    _parent = parent
                    resolve(parent)
                }
            })
        })
    }).then((parent)=>{

        return new Promise((resolve,reject)=>{
            console.log("parent:" + _parent)
            //"": ObjectId()
            Child.find({_id:parent.childID}).limit(1).exec(function (err, child) {
                console.log("child:" + child)
                if (err) {
                    return res.json({status: 'error', 'errcode': 3});
                }
                if (!child) {
                    return res.json({status: 'error', 'errcode': 4});
                }else{
                    _child = child[0]
                    resolve()
                }
            })
        })
    }).then(()=>{
        return new Promise((resolve,reject)=>{
            Emotion.find({}).sort({'createAt':-1}).exec(function (err, emotions) {
                if(emotions.length > 0){
                    _emotion = emotions[0]
                    let emotionValue = 0
                    let emotionCount = 0
                    emotions.forEach(function (emotion) {
                        // console.log("firstDateTime:" + firstDateTime)
                        // console.log("firstDay:" + firstDay)
                        // console.log("emotion.createAt.getTime:" + new Date(emotion.createAt).getTime())
                        // console.log(firstDateTime- new Date(emotion.createAt).getTime())
                        // console.log("emotion.createAt:" + emotion.createAt)
                        if ((firstDateTime-emotion.createAt.getTime()) > 0) {
                            if ((firstDateTime-emotion.createAt.getTime()) < 7*24*3600*1000) {
                                emotionValue += emotion.value
                                emotionCount += 1
                            }
                        }
                    });
                    _averageEmotion = emotionValue/emotionCount
                }
                resolve()
            })
    }).then(()=>{
        return new Promise((resolve,reject)=> {
            Question.find({}).exec(function (err, questions) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 6});
                }
                if (questions.length === 0) {
                    // var tmp1 = {
                    //     status: 'success',
                    //     'question': {
                    //         parent:parent,
                    //         question:question
                    //     }
                    // };
                    // questionreply_serialize.push(tmp1)
                    resolve()
                } else {
                    let questions_serialize = [];
                    questions.forEach(function (question) {
                        if ((question.createAt.getTime() - firstDateTime) < 24 * 3600 * 1000) {
                            if ((question.createAt.getTime() - firstDateTime) > 0) {
                                questions_serialize.push(question);
                            }
                        }
                    });

                    async.map(questions_serialize, function (question, callback1) {
                        Promise.resolve().then(() => {
                            return new Promise((resolve, reject) => {
                                Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
                                    if (parent) {
                                        Reply.find({questionID: question._id}, function (err, replys) {

                                            if (replys.length === 0) {
                                                var tmp1 = {
                                                    'question': {
                                                        parent: parent,
                                                        question: question
                                                    }
                                                };
                                                // questionreply_serialize.push(tmp1)
                                                // resolve(questionreply_serialize)
                                                resolve(tmp1)
                                            } else {
                                                // db.questions.update({"_id":ObjectId("599666e3e1097e36ab8fdb4b")},{$set:{"parentID" : "59965ba9e1097e36ab8fdb47"}})
                                                // let teachers_serialize = [];
                                                async.map(replys, function (reply, callback2) {
                                                    Teacher.findOne({_id: reply.teacherID}).exec(function (err, teacher) {
                                                        if (err) {
                                                            return res.json({status: 'error', 'errcode': 4});
                                                        }
                                                        if (teacher) {
                                                            var tmp = {
                                                                teacher: teacher,
                                                                content: reply.content
                                                            };
                                                            // teachers_serialize.push(tmp);
                                                            // console.log("teachers_serialize:" + teachers_serialize)
                                                            // callback2(null,teachers_serialize)
                                                            callback2(null, tmp)
                                                        }
                                                    })
                                                }, function (err, results) {
                                                    if (err) {
                                                        return res.json({status: 'error', 'errcode': 5});
                                                    }
                                                    var tmp1 = {
                                                        'question': {
                                                            parent: parent,
                                                            question: question
                                                        },
                                                        replys: results
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
                        }).then((questionreply_serialize) => {
                            callback1(null, questionreply_serialize)
                        }).catch(err => {
                            logger.error(err);
                        });
                    }, function (err, results) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 6});
                        }
                        resolve(results)
                    })
                }
            });
        })})
    }).then((results)=>{
        res.json({
            status:'success',
            child:_child,
            parent:_parent,
            emotion:_emotion,
            averageEmotion:_averageEmotion,
            questions:results
        })
    }).catch(err => {
        logger.error(err);
    });


    //https://jingyan.baidu.com/article/6079ad0ea56db628fe86db61.html
    //判断两个时间差是否为一天
    // var str1 = "2017-02-27 13:00:00";
    // var str2 = "2017-03-05 13:00:00";
    // var t1 = new Date(str1).getTime();
    // var t2 = new Date(str2).getTime();
    //if((t2-t1)>24*3600*1000)
}

