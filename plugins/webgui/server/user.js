const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Teacher = require('../db/teacher');
const Admin = require('../db/admin');

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
    delete req.session.user
    delete req.session.type

    return res.json({"status":"success"})
}

