/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Emotion = appRequire('plugins/watch/db/emotion');

exports.latest = (req, res) => {

    var user = req.body.user;

    Emotion.findOne({parentID: user._id}).sort({createAt: -1}).exec(function (err, emotion) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        if (!emotion) {
            return res.json({status: 'error', 'errcode': 4});   //未查询到情绪数据
        }
        else {
            var _emotion = {
                value: emotion.value,
                calm: emotion.calm,
                happy: emotion.happy,
                angry: emotion.angry,
                sad: emotion.sad,
                report: emotion.report
            };

            res.json({status: 'success', emotion: _emotion})
        }
    });

    // res.send('This is not implemented now');
};

exports.list = (req, res) => {
    res.send('This is not implemented now');
};
