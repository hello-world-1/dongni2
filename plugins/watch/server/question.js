/**
 * Created by root on 8/3/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Question = appRequire('plugins/watch/db/question');
const Reply = appRequire('plugins/webgui/db/reply');

//列出该用户的所有提问
exports.list = (req, res) => {

    user = req.body.user;
    pagestart = req.body.pagestart;

    if (!pagestart) pagestart = 0;

    //通过家长id获得该id下的所有提问
    Question.find({parentID: user._id}).limit(pagestart*10,10).sort({createAt:-1}).exec(function (err, questions) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        //该用户没有提问
        if (questions.length === 0) {
            return res.json({status: 'error', 'errcode': 4});   //该用户没有提问
        }
        //该用户有提问
        else {
            console.log("question.list:");
            console.log(questions);
            var questions_serialize = [];
            questions.forEach(function (question) {
                var tmp = {
                    title: question.title,
                    content: question.content,
                    createAt: question.createAt
                };
                questions_serialize.push(tmp);
            });
            res.json({status: 'success', 'questions': questions_serialize});
        }
    });
};

exports.similar = (req, res) => {

    pagestart = req.body.pagestart;
    if (!pagestart) {
        pagestart = 0;
    }

    Question.find().limit(pagestart*10, 10).sort({createAt: -1}).exec(function (err, questions) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        else {
            console.log("question.similar:");
            console.log(questions);
            var questions_serialize = [];
            questions.forEach(function (question) {
                var _question = {
                    questionID: question._id,
                    title: question.title,
                    content: question.content
                };
                questions_serialize.push(_question);
            });
            res.json({status: 'success', 'similar': questions_serialize});
        }
    })
};

//用户添加新提问
exports.add = (req, res) => {

    var _question = {
        parentID: req.body.user._id,
        title: req.body.title,
        content: req.body.content,
        openFlag: req.body.openFlag
    };

    question = new Question(_question);
    console.log("question.add:");
    console.log(question);
    question.save(function (err,question) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //提问保存出错
        }
        else {
            res.json({status: 'success'});
        }
    });

    // res.send('This is not implemented now');
};

exports.detail = (req, res) => {

    questionID = req.body.questionID;

    Question.findOne({_id: questionID}, function (err, question) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        //查询不到该question
        if (!question) {
            return res.json({statu: 'error', 'errcode': 4});    //未查询到该问题
        }
        else {

            console.log("question.detail:");
            console.log(question);
            var _question = {
                title: question.title,
                content: question.content,
                createAt: question.createAt
            };

            Reply.find({questionID: questionID}).sort({createAt:-1}).populate('teacherID', 'name').exec(function (err, replys) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 5});   //数据库查询出错
                }
                else {
                    var replys_serialize = [];
                    replys.forEach(function (reply) {
                        var tmp = {
                            teacherName:reply.teacherID.name,
                            content:reply.content
                        };
                        replys_serialize.push(tmp);
                    });
                    console.log("replys_serialize:");
                    console.log(replys_serialize);
                    res.json({status: 'success', 'question': _question, 'replys': replys_serialize});
                }
            });

            // //test
            // var reply = new Reply ({
            //     teacherID: '598d194a416bfc9331706117',
            //     questionID: '598c379949f5412215bdc42c',
            //     content: 'This is a test2 reply'
            // });
            // reply.save(function (err) {
            //     if (err) {
            //         res.json('error')
            //     }
            //     else {
            //         res.json('success')
            //     }
            // })
        }
    });
    // res.send('This is not implemented now');
};

