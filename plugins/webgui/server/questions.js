const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const Question = appRequire('plugins/watch/db/question');

// 跳转到显示所有的问题列表
exports.showAllQuestion = function(req, res) {
	// resQuestion.findAllPublicQuestion(function(err, question) {
	// 	title: '所有问题',
	// 	question: question
	// })
}

exports.list = (req, res) => {
	res.send('This is not implemented now');
};

exports.userList = (req, res) => {
	res.send('This is not implemented now');
};

exports.add = (req, res) => {
	res.send('This is not implemented now');
};

exports.details = (req, res) => {
	res.send('This is not implemented now');
};