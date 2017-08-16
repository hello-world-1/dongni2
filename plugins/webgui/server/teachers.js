const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const _ = require('underscore')

const config = appRequire('services/config').all();
const Teacher = require('../db/teacher');
const uuid = require('node-uuid');

// 跳转到登录界面
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录页面'
	})
}

// 跳转到添加老师界面
exports.showAddTeacher = function(req, res) {
	res.render('addTeacher', {
		title: '添加老师页面'
	})
}

//修改用户头像
exports.changeAvatar = (req, res) => {

    let user = req.session.user;

    let filestr = uuid.v1();
    console.log("Received file:\n" + JSON.stringify(req.files));
    let fileext = req.files.file.name.split('.');
    let fileExt = fileext[fileext.length-1];
    let filename = filestr+"."+fileExt;
    let location = path.join(__dirname,'../public')+"/images/avatars/"+filename;
    let readStream = fs.createReadStream(req.files.file.path)
    let writeStream = fs.createWriteStream(location);
    let newavatar = "/images/avatars/"+filename;
    readStream.pipe(writeStream);
    readStream.on('end',function(err){
        if(err){
            res.json({status:'error','errcode':2});
        } else {
            fs.unlinkSync(req.files.file.path);
            Teacher.update({_id:user._id},{avatar:newavatar},function(err,numberAffected, rawResponse) {
                if (err) {
                    return res.json({status:'error', 'errcode': 3});
                }else {
                	Teacher.findById(function(err, teacher) {
                        if (err) {
                            return res.json({status:'error','errcode':2});
                        }
                        return res.json({status: 'success', teacher: teacher});
                    })
                }
            });
        }
    })
};

// 管理员添加老师
exports.addTeacher = function(req, res) {
	// 传递的参数应该包含的内容:
	// 用户名
	// 密码
	// 头像
	// 姓名
	// 性别
	// 老师的介绍
	// 年龄

	let _user = req.body.user

    let filestr = uuid.v1();
    console.log("Received file:\n" + JSON.stringify(req.files));
    let fileext = req.files.file.name.split('.');
    let fileExt = fileext[fileext.length-1];
    let filename = filestr+"."+fileExt;
    let location = path.join(__dirname,'../public')+"/images/avatars/"+filename;
    let readStream = fs.createReadStream(req.files.file.path)
    let writeStream = fs.createWriteStream(location);
    let newavatar = "/images/avatars/"+filename;
    _user.avatar = newavatar;
    readStream.pipe(writeStream);
    readStream.on('end',function(err){
        if(err){
            return res.json({status:'error','errcode':2});
        } else {
            fs.unlinkSync(req.files.file.path);
        }
    })

	Teacher.findOne({
		username: _user.username
	}, function(err, user) {
		if (err) {
            return res.json({status:'error','errcode':2});
		}
		if (user) {
			return res.json({status:'error','errcode':1});
		} else {
			user = new Teacher(_user)
			user.save(function(err, user) {
				if (err) {
                    return res.json({status:'error','errcode':2});
				}
                Teacher.fetch(function(err, teachers) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 2});
                    }
                    return res.json({status:'success','teachers':teachers});
                })
			})
		}
	})
}
/*
// 管理员删除老师,老师添加的课程/书籍怎么办?
exports.deleteTeacher = function(req, res) {

	var id = req.query.id

	if (id) {
		Teacher.remove({
			_id: id
		}, function(err, user) {
			if (err) {
				console.log(err)
				res.json({
					success: 0
				})
			} else {
				res.json({
					success: 1
				})
			}
		})
	}
}*/

// 老师登录
exports.signin = function(req, res) {
	// var _user = req.body.user
	// var username = _user.username
	// var password = _user.password
    var username = req.body.username
    var password = req.body.password

	Teacher.findOne({
		username: username
	}, function(err, user) {
		if (err) {
			console.log(err)
		}

		//当值是非空字符串和非零数字返回true，当值是空字符串、0或者null返回false。
		if (!user) {
			// 如果没有该用户跳转到用户登录界面
			// return res.redirect('/signin')
			res.json({status:'not regist'});
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}

			if (isMatch) {
				req.session.user = user
					// 登录成功后跳转到老师个人信息界面
				// return res.redirect('/')
                res.json({status:'match'});
			} else {
				// 用户名存在但是密码不正确，跳转到登录界面
				// return res.redirect('/signin')
                res.json({status:'match'});
			}
		})
	})
}

// 老师登出
exports.logout = function(req, res) {
	delete req.session.user
	delete app.locals.user

	res.redirect('/')
}

// 跳转到修改老师个人信息界面,老师的课程
exports.showUpdate = function(req, res) {
	var id = req.params.id

	if (id) {
		Teacher.findById(id, function(err, user) {
			res.render('admin', {
				title: '修改个人信息',
				user: user
			})
		})
	}
}

// 修改老师个人信息
exports.changeinfo = function(req, res) {

    let _user = req.body.user
	let _teacher;

    let filestr = uuid.v1();
    console.log("Received file:\n" + JSON.stringify(req.files));
    let fileext = req.files.file.name.split('.');
    let fileExt = fileext[fileext.length-1];
    let filename = filestr+"."+fileExt;
    let location = path.join(__dirname,'../public')+"/images/avatars/"+filename;
    let readStream = fs.createReadStream(req.files.file.path)
    let writeStream = fs.createWriteStream(location);
    let newavatar = "/images/avatars/"+filename;
    _user.avatar = newavatar;
    readStream.pipe(writeStream);
    readStream.on('end',function(err){
        if(err){
            return res.json({status:'error','errcode':2});
        } else {
            fs.unlinkSync(req.files.file.path);
        }
    })

    Teacher.findById(_user._id, function(err, teacher) {
        if (err) {
            return res.json({status:'error','errcode':2});
        }

        _teacher = _.extend(teacher, _user)
        _teacher.save(function(err, teacher) {
            if (err) {
                return res.json({status:'error','errcode':2});
            }

            return res.json({status:'error','teacher':teacher});
        })
    })
}

// 查看老师个人信息
exports.watch = function(req, res) {
	var id = req.params.id

	if (id) {
		Teacher.findById(id, function(err, user) {
			res.render('admin', {
				title: '个人信息',
				user: user
			})
		})
	}
}

// 显示老师列表
exports.list = function(req, res) {
	Teacher.fetch(function(err, users) {
		if (err) {
			console.log(err)
		}
		res.render('userlist', {
			title: '老师列表页',
			users: users
		})
	})
}

// 查看老师是否登录
exports.signinRequired = function(req, res, next) {
	var user = req.session.user

	if (!user) {
		return res.redirect('/signin')
	}

	next()
}

// 查看管理员是否登录
exports.adminRequired = function(req, res, next) {
	var user = req.session.user

	if (user.role <= 10) {
		return res.redirect('/signin')
	}

	next()
}