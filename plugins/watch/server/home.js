const log4js = require('log4js');
const logger = log4js.getLogger('watch');
const config = appRequire('services/config').all();

const randomstring = require('randomstring');
const iHuyi = appRequire('plugins/watch/server/ihuyisdk');
const bcrypt = require('bcryptjs');
const User = appRequire('plugins/watch/db/user');

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
            res.json({status: 'error', 'errcode': 3}) //3:该手机号已注册
        }
        else {
            _user = new User({
                telephone: req.body.telephone,
                password: req.body.password
            });
            _user.save(function (err, user) {
                if (err) {
                    res.json({status: 'error', 'errcode': 4}) //4:保存用户失败
                }
                else {
                    res.json({status: 'success', user: {"userID": user.id}});
                    console.log(user);
                }
            })
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

    //fetch user and test password verification
    User.findOne({telephone: telephone}, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});  //数据库查询错误
        }
        //未有该用户
        if (!user) {
            return res.json({status: 'error', 'errcode': 3});   //未有该用户
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return res.json({status: 'error', 'errcode': 4});   //密码匹配错误
            }
            if (isMatch) {
                const crypto = require('crypto');
                token = crypto.randomBytes(64).toString('hex');
                user.token = token;
                user.save(function (err) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 5});   //保存失败
                    }
                    else {
                        res.json({
                            status: 'success',
                            'user': {'userID': user.id, 'token': user.token}
                        });
                    }
                });
            }
            else {
                res.json({status: 'error', 'errcode': 6});  //密码不正确
            }
        });
    });
};

//用户登出
exports.logout = (req, res) => {

    user = req.body.user;
    console.log('logout:' + user);

    const crypto = require('crypto');
    token = crypto.randomBytes(64).toString('hex'); //生成新的token

    user.token = token;
    user.save(function (err) {
        if (err) {
            res.json({status: 'error', 'errcode': 3});  //数据库保存出错
        }
        else {
            res.json({
                status: 'success',
                'user': {
                    'userID': user.id,
                    'token': user.token
                }
            });
        }
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
//                         'userID': user.id,
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

    iHuyi.send(telephone,content, a => {
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
    })
};

//检测用户登录状态
exports.signinRequired = (req, res, next) => {

    console.log("signinRequired:");
    console.log(req.body);
    // console.log(req.body.userID);
    // console.log(req.body.token);
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
    if(!req.body.userID || !req.body.password || !req.body.newpassword || !req.body.re_newpassword) {
        return res.json({status: 'error', 'errcode': 3});   //有空值
    }

    user.comparePassword(password, function (err, isMatch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 4});   //密码匹配错误
        }
        if (isMatch) {

            if (newpassword == re_newpassword) {
                //保存新密码
                user.password = newpassword;
                console.log("resetPassword:");
                console.log(user);
                user.save(function (err) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 7});   //新密码保存错误
                    }
                    else {
                        return res.json({status: 'success', user: {'userID': userID}});
                    }
                })
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







