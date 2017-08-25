const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Lesson = require('../db/lesson');
const Teacher = require('../db/teacher');
const moment = require('moment');
const async = require('async');
const push=appRequire('services/push')
const Parent = appRequire('plugins/watch/db/user');

// 课程详细信息
exports.lessondetail = function(req, res) {
    const id = req.body.lessonid

    Lesson.findById(id, function(err, lesson) {
        if(err){
            return res.json({"status":"error","errcode":2});
        }
        Teacher.findById(lesson.teacherID, function(err, teacher) {
            return res.json({"status":"success","lesson":lesson,"teacher":teacher});
        })
    })
}


// 添加课程
exports.addlesson = function(req, res) {
    //https://jingyan.baidu.com/article/6079ad0ea56db628fe86db61.html
    const teacherID = req.session.user._id
    const title = req.body.title
    const description = req.body.description
    const teacherName = req.body.teacherName
    const startDate = new Date(req.body.startDate + '').getTime();
    // a.valueOf(); // 1360002924000
    const endDate = new Date(req.body.endDate + '').getTime();
    const classTime = req.body.classTime
    const enrolldeadline = new Date(req.body.enrolldeadline + '').getTime();
    const studentsLimit = req.body.studentsLimit
    const classHours = req.body.classHours
    const telephone = req.body.telephone
    const price = req.body.price
    const enrollNum = req.body.enrollNum
    const state = req.body.state
    let _lesson = new Lesson()
    _lesson.teacherID = teacherID
    _lesson.title = title
    _lesson.description = description
    _lesson.teacherName = teacherName
    _lesson.endDate = endDate
    _lesson.startDate = startDate
    _lesson.classTime = classTime
    _lesson.enrolldeadline = enrolldeadline
    _lesson.studentsLimit = studentsLimit
    _lesson.classHours = classHours
    _lesson.telephone = telephone
    _lesson.price = price
    _lesson.enrollNum = enrollNum
    _lesson.state = state

	_lesson.save(function(err, lesson) {
        if (err) {
            return res.json({"status":"error","errcode":2});
        }

        let parents = []
        let contain = false
        // create a new message
        Reply.find({teacherID: teacherID}).exec(function (err, replys) {

            async.map(replys, function(reply, callback) {

                if(parents.length > 0){

                    parents.forEach(function (tempReply) {
                        if(tempReply.parentID+'' == reply.parentID+''){
                            contain = true
                        }
                    })
                }
                if(!contain){
                    parents.push(reply)
                    contain = false
                    let message = new Message()
                    message.parentID = reply.parentID
                    message.type = '2'
                    message.typeID = lesson._id
                    message.content = ''
                    message.viewedFlag = '0'
                    message.teacherID = teacherID
                    message.save(function(err, message) {
                        if (err) {
                            return res.json({"status":"error","errcode":2});
                        }
                        Parent.findOne({_id: reply.parentID}).exec(function (err, parent) {
                            if (err) {
                                return res.json({"status":"error","errcode":2});
                            }
                            if (parent) {
                                console.log("parent:" + parent)
                                if(parent.pushID){
                                    push.pushService(parent.pushID,message._id)
                                }
                            }
                        })
                        callback(null,null)
                    })
                }else{
                    callback(null,null)
                }
            }, function(err,results) {
                Lesson.findByTeacherId(teacherID, function(err, lessons) {
                    if (err) {
                        return res.json({"status":"error","errcode":2});
                    }
                    return res.json({"status":"success","lessons":lessons});
                })
            });
        })
	})
}

// 课程列表界面
exports.lessonlist = function(req, res) {
	const teacherID = req.sesson.user._id

	if (teacherID) {
		Lesson.findByTeacherId(teacherID, function(err, lessons) {
            if (err) {
                return res.json({"status":"error","errcode":2});
            }

			return res.json({"status":"success","lessons":lessons});

        })
	}
}

// 跳转到更新课程的界面
exports.showUpdate = function(req, res) {
	var id = req.params.id
	if (id) {
		Lesson.findById(id, function(err, lesson) {
			res.render('admin', {
				title: '课程更新页',
				lesson: lesson
			})
		})
	}
}

// 删除课程,老师表不用更新?
exports.delete = function(req, res) {
	var id = req.query.id

	if (id) {
		Lesson.remove({
			_id: id
		}, function(err, lesson) {
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
}