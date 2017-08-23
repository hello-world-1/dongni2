const log4js = require('log4js');
const logger = log4js.getLogger('donni');

const config = appRequire('services/config').all();
const ReplyPerson = require('../db/replyPerson');
const Reply = require('../db/reply');
const Teacher = require('../db/teacher');
const Survey = appRequire('plugins/watch/db/survey');
const SurveyAnswer = appRequire('plugins/watch/db/surveyAnswer');
const async = require('async');
const ObjectId = require('mongodb').ObjectId;

//根据某个题库名生成考题
exports.productSurvey = function(req, res) {

    const surveyName = req.body.surveyName

    console.log("surveyName:" + surveyName)
    // Survey.findOne({surveyName:surveyName}).exec(function (err, survey) {
    Survey.find({surveyName:surveyName}).exec(function (err, survey) {
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


exports.insertQuestion = function(req, res) {
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

exports.insertAnswer = function(req, res) {
    const surveyAnswer = req.body

    const _surveyAnswer = new SurveyAnswer(surveyAnswer);
    _surveyAnswer.save(function (err,surveyAnswer) {
        if (err) {
            return res.json({stauts: 'error', 'errcode': 1});   //数据库保存出错
        }
        return res.json({
            stauts: 'success'
        })
    })
}

exports.replylist = function(req, res) {

}