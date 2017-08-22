/**
 * Created by root on 8/7/17.
 */
/**
 * 问卷信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var SurveySchema = new Schema({
    surveyName:{type:String,required:true}, //题库名称
    topic:[{
        topicName:String,                   //题目名称
        answer1:String,
        answer2:String,
        answer3:String,
        answer3:String                      //题目答案
    }]
});

module.exports = mongoose.model('Survey',SurveySchema);