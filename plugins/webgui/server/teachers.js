const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Teacher = require('../db/teacher');

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

    user = req.session.user;

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
                    res.json({status: 'success', user: {'userID': user._id, 'avatar': newavatar}});}
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
	var _user = req.body.user

	Teacher.findOne({
		username: _user.username
	}, function(err, user) {
		if (err) {
			console.log(err)
		}

		if (user) { //如果为true说明存在该用户名的老师
			// 已经存在该老师,跳转到添加老师界面
			return res.redirect('/addTeacher')
		} else {
			user = new Teacher(_user)
			user.save(function(err, user) {
				if (err) {
					console.log(err)
				}
				// 添加老师成功,跳转到老师列表界面
				res.redirect('/teacherList')
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
exports.update = function(req, res) {
	var id = req.body.user._id
	var userObj = req.body.user
	var _user

	if (req.poster) {
		userObj.poster = req.poster
	}

	if (id) { // 用户已存在,修改信息
		user.findById(id, function(err, user) {
			if (err) {
				console.log(err)
			}

			_user = _.extend(user, userObj)
			_user.save(function(err, user) {
				if (err) {
					console.log(err)
				}
				// 
				res.redirect('/user/' + user._id)
			})
		})
	}
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