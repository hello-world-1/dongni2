/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Book = appRequire('plugins/webgui/db/book');

exports.add = (req, res) => {
    res.send('This is not implemented now');
};

exports.list = (req, res) => {
    res.send('This is not implemented now');
};

exports.detail = (req, res) => {

    bookID = req.body.bookID;

    Book.findOne({_id: bookID}, function (err, book) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        if (!book) {
            //未有该书籍
            return res.json({status: 'error', 'errcode': 4});   //未有该书籍
        }
        else {
            console.log("book.detail:");
            console.log(book);
            res.json({status: 'success', book: book});
        }
    })

    // res.send('This is not implemented now');
};