const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Lesson = require('../db/lesson');
const Teacher = require('../db/teacher');

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

// 文件上传
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename

	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp + '.' + type
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster
				next()
			})
		})
	} else {
		next()
	}
}

// 添加课程
exports.addlesson = function(req, res) {
	var lessonObj = req.body.lesson
	var _lesson = new lesson(lessonObj)

	// 保存书籍
	_lesson.save(function(err, lesson) {
        if (err) {
            return res.json({"status":"error","errcode":2});
        }
        Lesson.findByTeacherId(lessonObj.teacherID, function(err, lessons) {
            if (err) {
                return res.json({"status":"error","errcode":2});
            }
            return res.json({"status":"success","lessons":lessons});
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