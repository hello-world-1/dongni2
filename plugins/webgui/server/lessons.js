const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Lesson = require('../db/lesson');
const Teacher = require('../db/teacher');

// 课程详细信息
exports.detail = function(req, res) {
	var id = req.params.id

	Lesson.findById(id, function(err, lesson) {
		res.render('detail', {
			title: '课程详情页',
			lesson: lesson
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

// 添加或者更新课程
exports.save = function(req, res) {
	// 查看提交数据中是否已经有书籍的_id
	var id = req.body.lesson._id
	var lessonObj = req.body.lesson
	var _lesson

	if (req.poster) {
		lessonObj.poster = req.poster
	}

	// 如果已经存在该课程
	if (id) {
		lesson.findById(id, function(err, lesson) {
			if (err) {
				console.log(err)
			}

			// 更新书籍
			_lesson = _.extend(lesson, lessonObj)
			_lesson.save(function(err, lesson) {
				if (err) {
					console.log(err)
				}

				res.redirect('/lesson/' + lesson._id)
			})
		})
	} else { // 如果没有添加过该课程
		_lesson = new lesson(lessonObj)
		// 保存书籍
		_lesson.save(function(err, lesson) {
			if (err) {
				console.log(err)
			}
			// 跳转到老师的所有图书列表
			res.redirect('/teacher/' + teacher._id)
		})
	}
}

// 课程列表界面
exports.lessonList = function(req, res) {
	var teacherID = req.params.teacherID

	if (teacherID) {
		Lesson.findByTeacherId(teacherID, function(err, lesson) {
			res.render('admin', {
				title: '全部课程',
				lesson: lesson
			})
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