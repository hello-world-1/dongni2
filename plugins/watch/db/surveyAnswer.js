/**
 * Created by root on 8/7/17.
 */
/**
 * 问卷信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var Survey = require('./survey');

var SurveyAnswerSchema = new Schema({
    surveyID: {type: Schema.Types.ObjectId, ref: 'Survey'},
    userID:{type: Schema.Types.ObjectId, ref: 'User'},
    answer:[{
        topicName:String,                   //题目名称
        answer:String,
        answerIndex:{type: Number, min: 0}
    }],
    score:{type: Number, min: 0},
    createAt: {type: Date, default: Date.now}
});

SurveyAnswerSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('SurveyAnswer',SurveyAnswerSchema);