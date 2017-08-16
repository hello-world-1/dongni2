const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const _ = require('underscore')
const Book = require('../db/book');
const Teacher = require('../db/teacher');

// 书籍详细信息
exports.bookdetail = function(req, res) {
	const id = req.body.bookid

	Book.findById(id, function(err, book) {
		if(err){
			return res.json({"status":"error","errcode":2});
		}
		Teacher.findById(book.teacherID, function(err, teacher) {
			return res.json({"status":"success","book":book,"teacher":teacher});
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

// 添加书籍
exports.addbook = function(req, res) {
	const bookObj = req.body.book
	let _book = new Book(bookObj)

	// 保存书籍
	_book.save(function(err, book) {
		if (err) {
			return res.json({"status":"error","errcode":2});
		}
        Book.findByTeacherId(bookObj.teacherID, function(err, books) {
            if (err) {
                return res.json({"status":"error","errcode":2});
            }
            return res.json({"status":"success","books":books});
        })
	})

}

// 书籍列表界面
exports.booklist = function(req, res) {
	const teacherID = req.session.user._id

	if (teacherID) {
		Book.findByTeacherId(teacherID, function(err, books) {
            if (err) {
                return res.json({"status":"error","errcode":2});
            }
            return res.json({"status":"success","books":books});
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