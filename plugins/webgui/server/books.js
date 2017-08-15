const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Book = require('../db/book');
const Teacher = require('../db/teacher');

// 书籍详细信息
exports.detail = function(req, res) {
	var _book = req.body.book
	var id = req.body.book.bookid
	var teacherID = req.body.book.teacherID

	Book.findById(id, function(err, book) {
		Teacher.findById(teacherID, function(err, teacher) {
			res.render('detail', {
				title: '书籍详情页',
				book: book,
				teacher: teacher
			})
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

// 添加或者更新书籍
exports.save = function(req, res) {
	// 查看提交数据中是否已经有书籍的_id
	var id = req.body.book._id
	var bookObj = req.body.book
	var _book

	if (req.poster) {
		bookObj.poster = req.poster
	}

	// 如果已经存在该书籍
	if (id) {
		Book.findById(id, function(err, book) {
			if (err) {
				console.log(err)
			}

			// 更新书籍
			_book = _.extend(book, bookObj)
			_book.save(function(err, book) {
				if (err) {
					console.log(err)
				}

				res.redirect('/book/' + book._id)
			})
		})
	} else { // 如果没有添加过该书籍
		_book = new Book(bookObj)

		// 保存书籍
		_book.save(function(err, book) {
			if (err) {
				console.log(err)
			}
			// 跳转到老师的所有书籍列表
			res.redirect('/teacher/' + teacher._id)
		})
	}
}

// 书籍列表界面
exports.bookList = function(req, res) {
	var teacherID = req.params.teacherID

	if (teacherID) {
		Book.findByTeacherId(teacherID, function(err, book) {
			res.render('admin', {
				title: '全部书籍',
				book: book
			})
		})
	}
}

// 跳转到更新书籍的界面
exports.showUpdate = function(req, res) {
	var id = req.params.id

	if (id) {
		Book.findById(id, function(err, book) {
			res.render('admin', {
				title: '书籍更新页',
				book: book
			})
		})
	}
}

// 删除书籍,老师表不用更新?
exports.delete = function(req, res) {
	var id = req.query.id

	if (id) {
		Book.remove({
			_id: id
		}, function(err, book) {
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