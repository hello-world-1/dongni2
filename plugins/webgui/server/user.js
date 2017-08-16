const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Teacher = require('../db/teacher');
const Admin = require('../db/admin');
const Child = appRequire('plugins/watch/db/child');
const Parent = appRequire('plugins/watch/db/user');
const Emotion = appRequire('plugins/watch/db/emotion');
const Question = appRequire('plugins/watch/db/question');

// 
exports.login = function(req, res) {
    // >> * username:requested
    // >> * password:requested
    // var _user = req.body.user

    const username = req.body.username
    const password = req.body.password

    Teacher.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            logger.error(err)
            // return
            return res.json({errcode:'500'})
        }

        if (!user) {
            // if teacher not contain this username,query admin

            Admin.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    console.log(err)
                }
                if (!user){
                    // if admin not contain this username,return username not exist
                    return res.json({errcode:'1'})
                }else{
                    user.comparePassword(password, function(err, isMatch) {
                        if (err) {
                            logger.error(err)
                            return res.json({errcode:'500'})
                        }
                        if (isMatch) {
                            // if admin match
                            req.session.user = user
                            req.session.type = 'admin'
                            Admin.fetch(function(err, teachers) {
                                return res.json({
                                        "status": "success",
                                        teachers:teachers
                                        });
                            })

                        } else {
                            return res.json({errcode:'2'});
                        }
                    })
                }

            })
        }else{
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err)
                }

                if (isMatch) {
                    req.session.user = user
                    req.session.type = 'admin'
                    Admin.fetch(function(err, teachers) {
                        return res.json({
                            "status": "success",
                            teachers:teachers
                        });
                    })
                } else {
                    return res.json({errcode:'2'});
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
    const parentID = req.body.parentID

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
                Child.findOne({_id: parent.childID})
                    .exec(function (err, child) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 2});
                        }
                        _child = child
                    })


                let _today_emotion
                let _today_questions
                let _yesterday_emotion
                let _yesterday_questions

                Question.find({}).exec(function (err, questions) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 2});
                    }
                    _today_questions = questions
                })
                Question.find({}).exec(function (err, questions) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 2});
                    }
                    _yesterday_questions = questions
                })
                // find today emtion
                Emotion.find({}).exec(function (err, emotions) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 2});
                    }
                    // today emotion list
                    emotions.forEach(function (emotion) {
                        // TODO caculate
                        _today_emotion = emotion
                    })
                })
                Emotion.find({}).exec(function (err, emotions) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 2});
                    }
                    // yesterday emotion list
                    emotions.forEach(function (emotion) {
                        // TODO caculate
                        _yesterday_emotion = emotion
                    })
                })

                res.json({status: 'success',
                    info: _child,
                    parent:_parent,
                    emotions:[
                        {
                            emotion:_yesterday_emotion,
                            questions:_yesterday_questions
                        },
                        {
                            emotion:_today_emotion,
                            questions:_today_questions
                        }

                    ]
                });
            }
    });
}

