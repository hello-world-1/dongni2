const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const _ = require('underscore')
const Book = require('../db/book');
const Teacher = require('../db/teacher');
const Message = require('../db/message');
const Reply = require('../db/reply');
const async = require('async');
const push=appRequire('services/push')
const Parent = appRequire('plugins/watch/db/user');

// 书籍详细信息
exports.bookdetail = function(req, res) {
	const id = req.body.bookid

	Book.findById(id, function(err, book) {
		if(err){
			return res.json({"status":"error","errcode":1});
		}
		Teacher.findById(book.teacherID, function(err, teacher) {
			return res.json({"status":"success","book":book,"teacher":teacher});
		})
	})
}

// 添加书籍
exports.addbook = function(req, res) {

    let filestr = uuid.v1();
    console.log("Received file:\n" + JSON.stringify(req.files));
    let fileext = req.files.file.name.split('.');
    let fileExt = fileext[fileext.length - 1];
    let filename = filestr + "." + fileExt;
    let location = path.join(__dirname, '../public') + "/images/avatars/" + filename;
    let readStream = fs.createReadStream(req.files.file.path);
    let writeStream = fs.createWriteStream(location);
    let newavatar = "/images/avatars/" + filename;
    readStream.pipe(writeStream);
    readStream.on('end', function (err) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});
        } else {
            fs.unlinkSync(req.files.file.path);
        }
    });

	const teacherID = req.session.user._id
	const title = req.body.title
    const author = req.body.author
    const publishHouse = req.body.publishHouse
    const introduction = req.body.introduction
    const purchaseLink = req.body.purchaseLink
	let _book = new Book()
	_book.teacherID = teacherID
    _book.title = title
    _book.author = author
    _book.publishHouse = publishHouse
    _book.introduction = introduction
    _book.purchaseLink = purchaseLink
    _book.avatar = newavatar

	// 保存书籍
	_book.save(function(err, book) {
		if (err) {
			return res.json({"status":"error","errcode":1});
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
                    message.type = '3'
                    message.typeID = book._id
                    message.content = ''
                    message.viewedFlag = '0'
                    message.teacherID = teacherID
                    message.save(function(err, message) {
                        if (err) {
                            return res.json({"status":"error","errcode":1});
                        }
                        Parent.findOne({_id: reply.parentID}).exec(function (err, parent) {
                            if (err) {
                                return res.json({"status":"error","errcode":1});
                            }
                            if (parent) {
                            	console.log("parent:" + parent)
                                if(parent.pushID){
                                    push.pushService(parent.pushID + '',message._id + '')
                                }
                            }
                        })
                        callback(null,null)
                    })
                }else{
                    callback(null,null)
				}
            }, function(err,results) {
                Book.findByTeacherId(teacherID, function(err, books) {
                    if (err) {
                        return res.json({"status":"error","errcode":1});
                    }
                    return res.json({"status":"success","books":books});
                })
            });
        })
	})

}

// 书籍列表界面
exports.booklist = function(req, res) {
	const teacherID = req.session.user._id
	// const teacherID = req.body.id

	if (teacherID) {
		Book.findByTeacherId(teacherID, function(err, books) {
            if (err) {
                return res.json({"status":"error","errcode":1});
            }
            return res.json({"status":"success","books":books});
		})
	}
}

// 跳转到更新书籍的界面
// exports.showUpdate = function(req, res) {
// 	var id = req.params.id
//
// 	if (id) {
// 		Book.findById(id, function(err, book) {
// 			res.render('admin', {
// 				title: '书籍更新页',
// 				book: book
// 			})
// 		})
// 	}
// }

// 删除书籍,老师表不用更新?
// exports.delete = function(req, res) {
// 	var id = req.query.id
//
// 	if (id) {
// 		Book.remove({
// 			_id: id
// 		}, function(err, book) {
// 			if (err) {
// 				console.log(err)
// 				res.json({
// 					success: 0
// 				})
// 			} else {
// 				res.json({
// 					success: 1
// 				})
// 			}
// 		})
// 	}
// }