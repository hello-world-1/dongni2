const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Question = appRequire('plugins/watch/db/question');
const Parent = appRequire('plugins/watch/db/user');
const ObjectId = require('mongodb').ObjectId;
const async = require('async');
// 跳转到显示所有的问题列表
exports.questionlist = function(req, res) {
    Question.find({openFlag: 1}).sort({createAt:-1}).exec(function (err, questions) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        if (questions.length === 0) {
            return res.json({status: 'error', 'errcode': 3});
        } else {
        // db.questions.update({"_id":ObjectId("599666e3e1097e36ab8fdb4b")},{$set:{"parentID" : "59965ba9e1097e36ab8fdb47"}})
        //     let questions_serialize = [];
            async.map(questions, function(question, callback) {
                Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
                    console.log(parent)
                    if(err){
                        return res.json({status: 'error', 'errcode': 2});
                    }
                    let tmp = {
                        question: question,
                        parent: parent
                    };
                    // questions_serialize.push(tmp);
                    // callback(null,questions_serialize)
                    callback(null,tmp)
                })
            }, function(err,results) {
                res.json({status: 'success', 'questions': results});
            });
        }
    });
}