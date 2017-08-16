const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Question = appRequire('plugins/watch/db/question');
const Parent = appRequire('plugins/watch/db/user');

// 跳转到显示所有的问题列表
exports.questionlist = function(req, res) {
    //通过家长id获得该id下的所有提问
    Question.find({replyFlag: 1}).sort({createAt:-1}).exec(function (err, questions) {
        if (err) {
            return res.json({status: 'error', 'errcode': 2});
        }
        if (questions.length === 0) {
            return res.json({status: 'error', 'errcode': 3});
        } else {
            var questions_serialize = [];
            questions.forEach(function (question) {
            	let _parent

				Parent.findOne({_id: question.parentID}).exec(function (err, parent) {
					if(err){
                        return res.json({status: 'error', 'errcode': 2});
					}
                    _parent = parent
                })


                var tmp = {
                    question: question,
                    parent: _parent
                };
                questions_serialize.push(tmp);
            });
            res.json({status: 'success', 'questions': questions_serialize});
        }
    });
}