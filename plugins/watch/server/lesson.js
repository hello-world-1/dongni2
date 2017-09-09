/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Lesson = appRequire('plugins/webgui/db/lesson');
const Bill = appRequire('plugins/watch/db/bill');

exports.add = (req, res) => {
    res.send('This is not implemented now');
};

exports.list = (req, res) => {
    res.send('This is not implemented now');
};

exports.detail = (req, res) => {

    user = req.body.user;
    lessonID = req.body.lessonID;

    Lesson.findOne({_id: lessonID}).exec(function (err, lesson) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        if (!lesson) {
            return res.json({status: 'error', 'errcode': 4});   //该课程不存在
        }
        else {
            // var _lesson = {
            //     teacherID: lesson.teacherID,
            //     teacherName: lesson.teacherID.name,
            //     description: lesson.description,                           //课程描述
            //     teacherName: lesson.teacherName,                           //开课老师
            //     startDate: lesson.startDate,                               //课程开始日期
            //     endDate: lesson.endDate,                                   //课程结束日期
            //     classTime: lesson.classTime,                               //上课时间
            //     enrolldeadline: lesson.enrolldeadline,                     //报名截止日期
            //     studentsLimit: lesson.studentsLimit,                       //限制人数
            //     classHours: lesson.classHours,                             //课程周期
            //     telephone: lesson.telephone,                               //联系方式
            //     price: lesson.price,                                       //课程价格
            //     enrollNum: lesson.enrollNum,                               //已报名人数
            //     state: lesson.state                                        //课程状态： 1：未开始，2：正在进行中，3：课程已结束
            // }
            console.log("lesson.detail:");
            console.log(lesson);

            //判断该课程该用户是否已经报名
            Bill.findOne({parentID: user._id, lessonID: lessonID}, function (err, bill) {

                var enroll = false;

                if (err) {
                    return res.json({status: 'error', 'errcode': 5});   //订单查询错误
                }
                if (!!bill) {
                    //该用户已经报名
                    console.log("lesson.detail(bill):");
                    console.log(bill);
                    enroll = true;
                }

                res.json({status: 'success', 'lesson': lesson, 'enroll': enroll});
            });
        }
    });
};
