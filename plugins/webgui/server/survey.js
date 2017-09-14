const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const ReplyPerson = require('../db/replyPerson');
const Reply = require('../db/reply');
const Teacher = require('../db/teacher');
const Survey = appRequire('plugins/watch/db/survey');
const SurveyAnswer = appRequire('plugins/watch/db/surveyAnswer');
const Parent = appRequire('plugins/watch/db/user');
const async = require('async');
const ObjectId = require('mongodb').ObjectId;

//根据某个题库名生成考题
exports.productSurvey = function(req, res) {

    const surveyName = req.body.surveyName

    console.log("surveyName:" + surveyName)
    Survey.findOne({surveyName:surveyName}).exec(function (err, survey) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});
        }
        if(!survey){
            return res.json({status: 'error', 'errcode': 2});//survey not exist
        }else{
            return res.json({
                status:'success',
                survey:survey
            })
        }
    })

}


// insert question
exports.insertQuestion = function(req, res) {
    if(req.session.type == 'teacher'){
        return res.json({status: 'error', 'errcode': 6});
    }

    console.log(req.body)
    // const survey = JSON.parse(req.body);
    const survey = req.body

    //if survey exist
    Survey.findOne({surveyName:survey.surveyName}).exec(function (err, survey) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});
        }
        if (survey) {
            return res.json({status: 'error', 'errcode': 2});
        }
    })

    const _survey = new Survey(survey);
    _survey.save(function (err,survey) {
        if (err) {
            return res.json({stauts: 'error', 'errcode': 1});   //数据库保存出错
        }
        return res.json({
            stauts: 'success',
            survey: survey
        })
    })
}

//insert answer
exports.insertAnswer = function(req, res) {
    const surveyAnswer = req.body

    let score = 0
    surveyAnswer.answer.forEach(function (item) {
        score += parseInt(item.answerIndex);
    })

    const _surveyAnswer = new SurveyAnswer(surveyAnswer);

    _surveyAnswer.score = score

    _surveyAnswer.save(function (err,surveyAnswer) {
        if (err) {
            return res.json({stauts: 'error', 'errcode': 1});   //数据库保存出错
        }
        return res.json({
            stauts: 'success'
        })
    })
}

//家长所填写的全部问卷的历史记录
exports.historyScore = function(req, res) {
    const relationID = req.body.relationID
    let _parent

    Promise.resolve().then(() => {
        return new Promise((resolve,reject)=>{
            Parent.findOne({_id:parentID}).exec(function (err, parent) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 1});
                }
                if (!parent) {
                    return res.json({status: 'error', 'errcode': 2}); //not calculate survey
                }
                _parent = parent
                resolve()
            })

        })
    }).then(()=>{
        SurveyAnswer.find({userID:parentID}).exec(function (err, surveyAnswers) {
            if (err) {
                return res.json({status: 'error', 'errcode': 1});
            }
            if (surveyAnswers.length === 0) {
                return res.json({status: 'error', 'errcode': 3}); //not calculate survey
            }else{
                async.map(surveyAnswers, function(surveyAnswer, callback) {
                    Survey.findOne({_id:surveyAnswer.surveyID}, function(err, survey) {
                        if (err) {
                            return res.json({status:'error','errcode':1});
                        }
                        if (survey) {
                            let tmp = {
                                surveyName: survey.surveyName,
                                surveyTime:surveyAnswer.createAt,
                                answer:surveyAnswer.answer
                            };
                            callback(null,tmp)
                        }

                    })
                }, function(err,results) {
                    res.json({
                        status: 'success',
                        parent: _parent,
                        surveyAnswer: results
                    });
                });
            }
        })
    }).catch(err => {
        return res.json({status:'error','errcode':1});
    });
}

//家长所填写的全部问卷的最新答案
exports.newestScore = function(req, res) {
    const parentID = req.body.parentID
    let _parent
    let surveys = []
    let contain = false

    Promise.resolve().then(() => {
        return new Promise((resolve,reject)=>{
            Parent.findOne({_id:parentID}).exec(function (err, parent) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 1});
                }
                if (!parent) {
                    return res.json({status: 'error', 'errcode': 2}); //not calculate survey
                }
                _parent = parent
                resolve()
            })

        })
    }).then(()=>{
        SurveyAnswer.find({userID:parentID}).sort({createAt:-1}).exec(function (err, surveyAnswers) {
            if (err) {
                return res.json({status: 'error', 'errcode': 1});
            }
            if (surveyAnswers.length === 0) {
                return res.json({status: 'error', 'errcode': 3}); //not calculate survey
            }else{
                async.map(surveyAnswers, function(surveyAnswer, callback) {
                    Survey.findOne({_id:surveyAnswer.surveyID}, function(err, survey) {
                        if (err) {
                            return res.json({status:'error','errcode':1});
                        }
                        if(!survey){
                            return res.json({status:'error','errcode':4});
                        }
                        if(surveys.length > 0){
                            surveys.forEach(function (tempsurvey) {
                                if(tempsurvey.surveyName == survey.surveyName){
                                    contain = true
                                }
                            })
                        }
                        if(!contain){
                            surveys.push(survey)
                            contain = false
                            let tmp = {
                                surveyName: survey.surveyName,
                                surveyTime:surveyAnswer.createAt,
                                answer:surveyAnswer.answer
                            };
                            callback(null,tmp)
                        }else{
                            callback(null,null)
                        }
                    })
                }, function(err,results) {
                    res.json({
                        status: 'success',
                        parent: _parent,
                        surveyAnswer: results
                    });
                });
            }
        })
    }).catch(err => {
        logger.error(err);
        return res.json({status: 'error', 'errcode': 1});
    });
}

//全部问卷
exports.allSurvey = function(req, res) {
    Survey.find({}).exec(function (err, surveys) {
        if (err) {
            return res.json({status: 'error', 'errcode': 1});
        }
        if (surveys.length === 0) {
            return res.json({status: 'error', 'errcode': 2}); //not calculate survey
        }else{
            async.map(surveys, function(survey, callback) {
                callback(null,survey)
            }, function(err,results) {
                res.json({
                    status: 'success',
                    surveys: results
                });
            });
        }
    })

}