/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Message = appRequire('plugins/webgui/db/message');
const User = appRequire('plugins/watch/db/user');
const Reply = appRequire('plugins/webgui/db/reply');
const Book = appRequire('plugins/webgui/db/book');
const Lesson = appRequire('plugins/webgui/db/lesson');
const async = require('async');
// const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
// const ObjectId = require('mongodb').ObjectId;
// change message status
exports.changeMessageStatus = (req, res) => {
    user = req.body.user;
    const typeID = req.body.typeID + ''

    Message.update({typeID:typeID},{viewedFlag:'1'},function(err,numberAffected, rawResponse) {
        if (err) {
            return res.json({status:'error', 'errcode': 3});
        }else {
            return res.json({status: 'success'});
        }
    });
};

// has red point
exports.redPoint = (req, res) => {
    user = req.body.user;

    Message.find({parentID: user._id,viewedFlag:'0'}).exec(function (err, messages) {
        console.log('mesages:'+messages)
        let reply = false
        let lesson = false
        let book = false

        messages.forEach(function (message) {
            if(message.type == '1'){ //reply
                reply = true
            }else if(message.type == '2'){ //lesson
                lesson = true
            }else if(message.type == '3'){ //book
                book = true
            }
        })
        return res.json({
            status: 'success',
            reply: reply,
            lesson:lesson,
            book:book
        });
    })
};

//view all message
exports.viewAllMessage = (req, res) => {
    user = req.body.user;
    const messageType = req.body.messageType + ''
    console.log('messageType:' + messageType + '||' + typeof messageType)

    Message.find({parentID: user._id,type:messageType}).exec(function (err, messages) {
        console.log('mesages:'+messages)
        if (err) {
            return res.json({status:'error', 'errcode': 3});
        }
        async.map(messages, function(message, callback) {
            if(messageType == '1'){ //reply
                // var id = mongoose.Types.ObjectId(message.typeID);
                // objid=new ObjectId();
                Reply.findOne({_id: message.typeID}).exec(function (err, reply) {
                    if (err) {
                        return res.json({status:'error', 'errcode': 3});
                    }
                    if(reply){
                        callback(null,reply)
                    }
                })
            }else if(messageType == '2'){ //lesson

                Lesson.findOne({_id: message.typeID}).exec(function (err, lesson) {
                    if (err) {
                        return res.json({status:'error', 'errcode': 3});
                    }
                    if(lesson){
                        callback(null,lesson)
                    }
                })
            }else if(messageType == '3'){ //book
                Book.findOne({_id: ObjectId(message.typeID)}).exec(function (err, book) {
                    if (err) {
                        return res.json({status:'error', 'errcode': 3});
                    }
                    if(book){
                        callback(null,book)
                    }
                })
            }


        }, function(err,results) {
            return res.json({
                status: 'success',
                list: results
            });
        });

    })
};