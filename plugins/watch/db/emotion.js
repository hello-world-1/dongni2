/**
 * Created by root on 8/7/17.
 */
/**
 * 心情信息
 */
var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');

var EmotionSchema = new Schema({

    value: {type: Number, min: 0, default: 0},                      //情绪指数
    calm: {type: Number, min: 0, default: 0},                       //平静指数
    happy: {type: Number, min: 0, default: 0},                      //愉悦指数
    angry: {type: Number, min: 0, default: 0},                      //愤怒指数
    sad: {type: Number, min: 0, default: 0},                        //悲伤指数
    report: {type: String, default: ""},                            //心情分析报告
    time: {type: Date, default: Date.now},                          //时间
    IMEI: {type: String, required: true},                           //手表IMEI号
    parentID: {type: Schema.Types.ObjectId, ref: 'User'},           //家长id
    createAt: {type: Date, default: Date.now}                       //该情绪数据的创建时间
});

module.exports = mongoose.model('Emotion',EmotionSchema);