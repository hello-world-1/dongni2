/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Teacher = appRequire('plugins/webgui/db/teacher');

exports.add = (req, res) => {
    res.send('This is not implemented now');
};

exports.list = (req, res) => {
    res.send('This is not implemented now');
};

//获取老师信息
exports.detail = (req, res) => {

    let teacherID = req.body.teacherID;

    if (!teacherID) {
        return res.json({status: 'error', 'errcode': 3});   //判空
    }

    Teacher.findOne({_id: teacherID},function (err, teacher) {
        if (err) {
            return res.json({status: 'error', 'errcode': 4});   //数据库查询错误
        }
        if (!teacher) {
            return res.json({status: 'error', 'errcode': 5});   //未有该老师
        }
        else {
            let _teacher = {
                name: teacher.name,
                avatar: teacher.avatar,
                sex: teacher.sex,
                age: teacher.age,
                introduction: teacher.introduction
            };
            console.log("teacher.detail:");
            console.log(_teacher);
            res.json({status: 'success', teacher: _teacher});
        }
    });

    // res.send('This is not implemented now');
};