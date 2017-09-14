const log4js = require('log4js');
const logger = log4js.getLogger('watch');
const config = appRequire('services/config').all();

const randomstring = require('randomstring');
const iHuyi = appRequire('plugins/watch/server/ihuyisdk');
const bcrypt = require('bcryptjs');
const User = appRequire('plugins/watch/db/user');
const Emotion = appRequire('plugins/watch/db/emotion');
const Child = appRequire('plugins/watch/db/child');
const Message = appRequire('plugins/webgui/db/message');
const push = appRequire('services/push');
const async = require('async');
const moment = require('moment');
const push=appRequire('services/push')


//用户注册
exports.signup = (req, res) => {

    //telephone和password不能为空
    if (!req.body.telephone || !req.body.password) {
        res.json({status: 'error', 'errcode': 1}); //1:手机号或密码为空
        return;
    }

    User.findOne({telephone: req.body.telephone}, function (err, user) {
        if (err) {
            res.json({status: 'error', 'errcode': 2}); //2:数据库查询失败
            return;
        }

        //用户已存在
        if (user) {
            res.json({status: 'error', 'errcode': 3}); //3:该手机号已注册
        }
        else {
            _user = new User({
                telephone: req.body.telephone,
                password: req.body.password
            });
            _user.save(function (err, user) {
                if (err) {
                    res.json({status: 'error', 'errcode': 4}); //4:保存用户失败
                }
                else {
                    res.json({status: 'success'});
                }
            });
        }
    });

};

//用户登录
exports.signin = (req, res) => {

    if (!req.body.telephone || !req.body.password) {
        return res.json({status: 'error', "errcode": 1}); //手机号码或密码为空
    }

    var telephone = req.body.telephone;
    var password = req.body.password;
    console.log("signin:");
    console.log(req.body);
    var tempToken = "";

    //fetch user and test password verification
    User.find({telephone: telephone}, function (err, users) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});  //数据库查询错误
        }
        //未有该用户
        if (users.length == 0) {
            return res.json({status: 'error', 'errcode': 3});   //未有该用户
        }
        async.map(users, function (user, callback) {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 2});
                }
                if (isMatch) {
                    tempToken = user.token;
                    const crypto = require('crypto');
                    token = crypto.randomBytes(64).toString('hex');

                    User.find({telephone: telephone}).exec(function (err, users) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 2});
                        }
                        async.map(users, function (user, callback) {
                            user.token = token;
                            user.save(function (err, user) {
                                if (err) {
                                    return res.json({status: 'error', 'errcode': 5});   //保存失败
                                }
                                callback(null, null);
                            });
                        }, function (err, results) {
                            isBind = false;
                            if (user.presentChildId) {
                                isBind = true;
                            }
                            //强制其他用户下线
                            if(user.pushID){
                                push.pushService(user.pushID + '',"forceoffline " + tempToken)
                            }

                            return res.json({
                                status: 'success',
                                userID: user._id,
                                token: token,
                                'isBind': isBind
                            });   //保存失败
                        });
                    });
                    //随便挑选一个用户进行登录,成功以后再查找用户名相同的用户

                    /*User.find({telephone: telephone}).exec(function (err, users) {
                     if (err) {
                     return res.json({status: 'error', 'errcode': 2});
                     }
                     async.map(users, function(user, callback) {
                     user.token = token;
                     user.save(function (err,user) {
                     if (err) {
                     return res.json({status: 'error', 'errcode': 5});   //保存失败
                     }
                     if(user) {
                     var tmp = {
                     parentID: user._id,
                     IMEI: user.IMEI,
                     nickname: user.nickname,
                     relation: user.relation
                     };
                     callback(null,tmp)
                     /!*!// cat not view message
                     Message.find({parentID: user._id,viewedFlag:"0"}).exec(function (err, messages) {
                     console.log('mesages:'+messages)

                     async.map(messages, function(message, callback) {
                     push.pushService(user.pushID + '',message._id + '')
                     callback(null,null)
                     }, function(err,results) {
                     return res.json({
                     status: 'success',
                     'user': {'userID': user._id, 'token': user.token}
                     });
                     });

                     })*!/
                     }
                     });
                     }, function(err,results) {
                     res.json({status: 'success', 'replys': results});
                     });
                     });*/
                }
                else{
                    callback(null,null)
                }

            });
        }, function (err, results) {
            return res.json({status: 'error', 'errcode': 6});
        });
    });
};

//用户登出
exports.logout = (req, res) => {

    user = req.body.user;

    const crypto = require('crypto');
    token = crypto.randomBytes(64).toString('hex'); //生成新的token

    User.find({telephone: user.telephone}).exec(function (err, users) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        async.map(users, function (user, callback) {
            user.token = token;
            user.save(function (err, user) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 5});   //保存失败
                }
                if (user) {
                    callback(null, null);
                }
            });
        }, function (err, results) {
            res.json({status: 'success'});
        });
    });
};

// //用户登出
// exports.logout = (req, res) => {
//
//     console.log(req.body);
//     console.log(req.body.userID);
//     console.log(req.body.token);
//     if (!req.body.userID || !req.body.token) {
//         return res.json({status: 'error', 'errcode': 0});   //userID或token为空
//     }
//
//     userID = req.body.userID;
//     token = req.body.token;
//     console.log(req.body);
//
//     User.findOne({_id: userID, token: token}, function (err, user) {
//         if (err) {
//             return res.json({status: 'error', 'errcode': 1});   //数据库查询失败
//         }
//         if (!user) {
//             return res.json({status: 'error', 'errcode': 2});   //该用户不存在
//         }
//
//         const crypto = require('crypto');
//         token = crypto.randomBytes(64).toString('hex'); //生成新的token
//
//         user.token = token;
//         user.save(function (err) {
//             if (err) {
//                 res.json({status: 'error', 'errcode': 3});  //数据库保存出错
//             }
//             else {
//                 res.json({
//                     status: 'success',
//                     'user': {
//                         'userID': user._id,
//                         'token': user.token
//                     }
//                 });
//             }
//         });
//     });
//
// };

//发送短信验证码
exports.sendCode = (req, res) => {

    if (!req.body.telephone) {
        return res.json({status: 'error', "errcode": 1}); //手机号码为空
    }

    let telephone = req.body.telephone;
    let code = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
    console.log(code);
    let content = "您的验证码是：" + code + "。请不要把验证码泄露给其他人。";
    console.log(content);

    iHuyi.send(telephone, content, a => {
        console.log("callback body: " + a); //打印body
        a = JSON.parse(a);  //解析出json对象
        console.log("a.code: " + a.code);
        console.log("a.msg: " + a.msg);
        if (a.code == 2) {
            console.log("成功发送验证码");
            res.json({status: "success", code: code});
            return;
        }
        else {
            res.json({status: "error", code: a.code, msg: a.msg});
        }
    });
};

//检测用户登录状态
exports.signinRequired = (req, res, next) => {

    if (!req.body.userID || !req.body.token) {
        return res.json({status: 'error', 'errcode': 0});   //userID或token为空
    }

    userID = req.body.userID;
    token = req.body.token;
    // console.log(req.body);

    User.findOne({_id: userID, token: token}, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});   //数据库查询失败
        }
        if (!user) {
            return res.json({status: 'error', 'errcode': 2});   //该用户不存在
        }
        req.body.user = user;
        next();
    });
};

//用户修改密码
exports.resetPassword = (req, res) => {
    user = req.body.user;
    password = req.body.password;
    newpassword = req.body.newpassword;
    re_newpassword = req.body.re_newpassword;

    //判空
    if (!req.body.userID || !req.body.password || !req.body.newpassword || !req.body.re_newpassword) {
        return res.json({status: 'error', 'errcode': 3});   //有空值
    }

    User.findOne({token: user.token,IMEI:null}, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});   //数据库查询错误
        }
        if (user) {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 4});   //密码匹配错误
                }
                if (isMatch) {

                    if (newpassword == re_newpassword) {
                        //保存新密码
                        User.find({telephone: user.telephone}).exec(function (err, users) {
                            if (err) {
                                return res.json({status: 'error', 'errcode': 1});
                            }
                            async.map(users, function (user, callback) {
                                user.password = newpassword;
                                user.save(function (err, user) {
                                    if (err) {
                                        return res.json({status: 'error', 'errcode': 7});   //保存失败
                                    }
                                    if (user) {
                                        callback(null, null);
                                    }
                                });
                            }, function (err, results) {
                                res.json({status: 'success'});
                            });
                        });
                    }
                    //两次输入的新密码不匹配
                    else {
                        return res.json({status: 'error', 'errcode': 6});   //两次输入的密码不匹配
                    }
                }
                //密码不匹配
                else {
                    return res.json({status: 'error', 'errcode': 5});   //原密码不正确
                }
            });
        }else{
            return res.json({status: 'error', 'errcode': 2});
        }
    })
};

//切换设备
exports.switchDevice = (req, res) => {
    user = req.body.user;

    User.update({token: user.token}, {
        $set: {
            presentChildId: user.childId
        }
    }, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 5});   //数据库更新出错
        }
        return res.json({status: 'success'});
    });
};

//显示首页的数据
exports.indexPage = (req, res) => {
    const firstDateTime = new Date().getTime();
    user = req.body.user;

    //用户未添加过设备
    if (!user.presentChildId) {
        return res.json({status: 'error', 'errcode': 3});
    }

    User.findOne({childId: user.presentChildId, token: user.token}, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});   //数据库查询失败
        }
        if (!user) {
            return res.json({status: 'error', 'errcode': 2});   //该用户不存在
        }
        Emotion.find({parentID: user._id}).sort({'createAt': -1}).exec(function (err, emotions) {
            if (emotions.length > 0) {
                _emotion = emotions[0];
                let emotionValue = 0;
                let emotionCount = 0;
                emotions.forEach(function (emotion) {
                    if ((firstDateTime - emotion.createAt.getTime()) > 0) {
                        if ((firstDateTime - emotion.createAt.getTime()) < 7 * 24 * 3600 * 1000) {
                            emotionValue += emotion.value;
                            emotionCount += 1;
                        }
                    }
                });
                _averageEmotion = emotionValue / emotionCount;
                console.log("_averageEmotion:" + _averageEmotion);
                User.find({telephone: user.telephone}).exec(function (err, users) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 1});
                    }
                    async.map(users, function (user, callback) {
                        if (user) {
                            if(user.IMEI){
                                var tmp = {
                                    parentID: user._id,
                                    IMEI: user.IMEI,
                                    nickname: user.nickname,
                                    relation: user.relation
                                };
                                callback(null, tmp);
                            }else{
                                callback(null, null);
                            }

                        }
                    }, function (err, results) {
                        res.json({
                            status: 'success',
                            nickname: user.nickname,
                            userID: user._id,
                            device: results,
                            emotion: _emotion,
                            averageEmotion: _averageEmotion,
                            childPhone: user.childPhone
                        });
                    });
                });
            }
        });
    });
};

//用户添加pushID,为每个用户添加pushID
exports.addPushID = (req, res) => {
    user = req.body.user;
    const pushID = req.body.pushID;

    User.find({telephone: user.telephone}).exec(function (err, users) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});
        }
        async.map(users, function (user, callback) {
            user.pushID = pushID;
            user.save(function (err, user) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 3});   //保存失败
                }
                if (user) {
                    callback(null, null);
                }
            });
        }, function (err, results) {
            res.json({status: 'success'});
        });
    });
};


// exports.resetPassword = (req, res) => {
//     req.checkBody('token', 'Invalid token').notEmpty();
//     req.checkBody('password', 'Invalid password').notEmpty();
//     req.getValidationResult().then(result => {
//         if(result.isEmpty) { return; }
//         return Promise.reject('invalid body');
//     }).then(() => {
//         const token = req.body.token;
//         const password = req.body.password;
//         return user.edit({
//             resetPasswordId: token,
//         }, {
//             password,
//             resetPasswordId: null,
//             resetPasswordTime: null,
//         });
//     }).then(success => {
//         res.send('success');
//     }).catch(err => {
//         logger.error(err);
//         res.status(403).end();
//     });
// };

// exports.getOneServer = (req, res) => {
//     const serverId = req.params.serverId;
//     const noPort = req.query.noPort;
//     let result = null;
//     knex('server').select().where({
//         id: +serverId,
//     }).then(success => {
//         if(success.length) {
//             result = success[0];
//             if(noPort) { return; }
//             return manager.send("", {
//                 host: 127.0.0.1,
//                 port: 6001,
//                 password: 'YOURPASSWD',
//             });
//         }
//
//     }).then(success => {
//         if(success) { result.ports = success; }
//         res.send(result);
//     }).catch(err => {
//         console.log(err);
//         res.status(500).end();
//     });
// };

//修改新增用户个人信息
exports.changeInfo = (req, res) => {
    const user = req.body.user;

    const parentAge = req.body.parentAge;
    const parentSex = req.body.parentSex;
    const relation = req.body.relation;
    const parentTelephone = req.body.parentTelephone;
    const parentCharacter = req.body.parentCharacter;
    const username = req.body.parentUsername;
    const profession = req.body.profession;

    const childAge = req.body.childAge;
    const childNickname = req.body.childNickname;
    const childSexStr = req.body.childSexStr;
    const childGrade = req.body.childGrade;
    const childBirth = req.body.childBirth;
    const childCharacter = req.body.childCharacter;
    const chilPhone = req.body.chilPhone;

    //用户没有绑定过设备
    if (!user.childID) {
        return res.json({stauts: 'error', 'errcode': 7});   //数据库保存出错
    }
    //用户更新数据
    else {
        const momentBirthday = new Date(childBirth).getTime();
        Child.update({_id: user.childID}, {
            $set: {
                birthday: momentBirthday,
                sex: childSexStr,
                age: childAge,
                grade: childGrade,
                character: childCharacter,
                nickname:childNickname,
                childrenTelephone:chilPhone
            }
        }, function (err, child) {
            if (err) {
                return res.json({status: 'error', 'errcode': 6});   //数据库更新出错
            }
            user.age = parentAge;
            user.sex = parentSex;
            user.character = parentCharacter;
            user.relationship = relation;
            user.telephone = parentTelephone;
            user.childrenTelephone = chilPhone;
            user.profession = profession;
            user.username = username;
            user.nickname = childNickname;
            user.save(function (err) {
                if (err) {
                    return res.json({stauts: 'error', 'errcode': 7});   //数据库保存出错
                }
                res.json({statuts: 'success'});
            });
        });
    }
};








