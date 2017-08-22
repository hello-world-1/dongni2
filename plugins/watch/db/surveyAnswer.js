/**
 * Created by root on 8/7/17.
 */
/**
 * 问卷信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var SurveyAnswerSchema = new Schema({
    surveyID: {type: Schema.Types.ObjectId, ref: 'Survey'},
    answer:[{
        topicName:String,                   //题目名称
        answer:String
    }]
});

module.exports = mongoose.model('SurveyAnswer',SurveyAnswerSchema);