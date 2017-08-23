/**
 * Created by root on 8/7/17.
 */
/**
 * 问卷信息
 */
var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;

var SurveySchema = new Schema({
    surveyName:{type:String,required:true,index: {unique: true}}, //题库名称
    topic:[{
        topicName:String,                   //题目名称
        answer1:String,
        answer2:String,
        answer3:String,
        answer4:String
    }],
    createAt: {type: Date, default: Date.now},
});

SurveySchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Survey',SurveySchema);