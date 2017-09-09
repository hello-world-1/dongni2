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
const Survey = appRequire('plugins/watch/db/survey');
const SurveyAnswer = appRequire('plugins/watch/db/surveyAnswer');
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
            return res.json({status: 'error', 'errcode': 1});
        }
        if (user){
            // if admin contain this username,return username exist
            return res.json({status: 'error', 'errcode': 1});
        }else{
            // let user = new Admin()
            let user = new Teacher()
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
            return res.json({status: 'error', 'errcode': 1});
        }

        if (!user) {
            // if teacher not contain this username,query admin

            Admin.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    res.json({status: 'error', 'errcode': 1});
                }
                if (!user){
                    // if admin not contain this username,return username not exist
                    res.json({status: 'error', 'errcode': 2});
                }else{
                    user.comparePassword(password, function(err, isMatch) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 1});
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
                            return res.json({status: 'error', 'errcode': 3});
                        }
                    })
                }

            })
        }else{
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 1});
                }

                if (isMatch) {
                    req.session.type = 'teacher'
                    req.session.user = user
                    return res.json({
                        "status": "success",
                        teacher:user
                    });
                } else {
                    return res.json({status: 'error', 'errcode': 3});
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
    let _survey

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
            Child.findOne({_id:parent.childID}).limit(1).exec(function (err, child) {
                console.log("child:" + child)
                if (err) {
                    return res.json({status: 'error', 'errcode': 1});
                }
                if (!child) {
                    // return res.json({status: 'error', 'errcode': 4});
                    resolve(parent)
                }else{
                    _child = child
                    resolve(parent)
                }
            })
        })
    }).then((parent)=>{

        let surveys = []
        let contain = false

        return new Promise((resolve,reject)=>{
            SurveyAnswer.find({userID:parent._id}).exec(function (err, surveyAnswers) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 1});
                }
                if (surveyAnswers.length === 0) {
                    resolve()
                    // return res.json({status: 'error', 'errcode': 3}); //not calculate survey
                }else{
                    async.map(surveyAnswers, function(surveyAnswer, callback) {
                        Survey.findOne({_id:surveyAnswer.surveyID}, function(err, survey) {
                            if (err) {
                                return res.json({status:'error','errcode':1});
                            }
                            if(!survey){
                                return res.json({status:'error','errcode':2});
                            }
                            if(surveys.length > 0){
                                surveys.forEach(function (tempsurvey) {
                                    if(tempsurvey.surveyName == survey.surveyName){
                                        contain = true
                                    }
                                })
                            }
                            if(!contain){
                                surveys.push(survey)
                                contain = false
                                let tmp = {
                                    surveyName: survey.surveyName,
                                    answer:surveyAnswer.answer
                                };
                                callback(null,tmp)
                            }else{
                                callback(null,null)
                            }
                        })
                    }, function(err,results) {
                        _survey = results
                        resolve()
                    });
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
                    console.log("_averageEmotion:" + _averageEmotion)
                }
                resolve()
            })
    }).then(()=>{
        return new Promise((resolve,reject)=> {
            Question.find({}).exec(function (err, questions) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 1});
                }
                if (questions.length === 0) {
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
                                                resolve(tmp1)
                                            } else {
                                                // db.questions.update({"_id":ObjectId("599666e3e1097e36ab8fdb4b")},{$set:{"parentID" : "59965ba9e1097e36ab8fdb47"}})
                                                async.map(replys, function (reply, callback2) {
                                                    Teacher.findOne({_id: reply.teacherID}).exec(function (err, teacher) {
                                                        if (err) {
                                                            return res.json({status: 'error', 'errcode': 1});
                                                        }
                                                        if (teacher) {
                                                            var tmp = {
                                                                teacher: teacher,
                                                                content: reply.content
                                                            };
                                                            callback2(null, tmp)
                                                        }
                                                    })
                                                }, function (err, results) {
                                                    if (err) {
                                                        return res.json({status: 'error', 'errcode': 1});
                                                    }
                                                    var tmp1 = {
                                                        'question': {
                                                            parent: parent,
                                                            question: question
                                                        },
                                                        replys: results
                                                    };
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
                            return res.json({status: 'error', 'errcode': 1});
                        });
                    }, function (err, results) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 1});
                        }
                        resolve(results)
                    })
                }
            });
        })})
    }).then((results)=>{
        return res.json({
            status:'success',
            child:_child,
            parent:_parent,
            emotion:_emotion,
            averageEmotion:_averageEmotion,
            survey:_survey,
            questions:results
        })
    }).catch(err => {
        logger.error(err);
        return res.json({status: 'error', 'errcode': 1});
    });


    //https://jingyan.baidu.com/article/6079ad0ea56db628fe86db61.html
    //判断两个时间差是否为一天
    // var str1 = "2017-02-27 13:00:00";
    // var str2 = "2017-03-05 13:00:00";
    // var t1 = new Date(str1).getTime();
    // var t2 = new Date(str2).getTime();
    //if((t2-t1)>24*3600*1000)
}

