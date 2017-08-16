const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Teacher = require('../db/teacher');
const Admin = require('../db/admin');
const Question = appRequire('plugins/watch/db/question');
const Parent = appRequire('plugins/watch/db/user');

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
    var teacherID = req.body.parentID

    //通过家长id获得该id下的所有提问
    Reply.find({teacherID: user._id}).sort({createAt:-1}).exec(function (err, replys) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        if (replys.length === 0) {
            return res.json({status: 'error', 'errcode': 3});   //该用户没有回复
        } else {
            console.log("question.list:");
            console.log(questions);
            var replys_serialize = [];
            replys.forEach(function (reply) {

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
                    Parent.findOne({_id:question.parentID}, function(err, parent) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 2});
                        }
                        _parent = parent
                    })
                })

                var tmp = {
                    parent: _parent,
                    question: _question,
                    teacher: _teacher,
                    content: content
                };
                replys_serialize.push(tmp);
            });
            res.json({status: 'success', 'replys': replys_serialize});
        }
    });
}

