/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Bill = appRequire('plugins/watch/db/bill');
const Lesson = appRequire('plugins/webgui/db/lesson');

exports.add = (req, res) => {

    user = req.body.user;
    lessonID = req.body.lessonID;

    var _bill = {
        parentID: user._id,
        lessonID: lessonID
    };
    console.log("bill.add:");
    console.log(_bill);

    var bill = new Bill(_bill);
    bill.save(function (err) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //订单保存错误
        }
        else {
            //订单保存成功则修改该课程已报名人数+1
            Lesson.update({_id: lessonID}, {$inc: {enrollNum: 1}}, function (err) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 4});   //课程更新数据错误
                }
                else {
                    //订单保存成功并且课程更新数据成功
                    res.json({status: 'success'});
                }
            });
        }
    });

    // res.send('This is not implemented now');
};

exports.list = (req, res) => {

    user = req.body.user;
    pagestart = req.body.pagestart;

    if (!pagestart) pagestart = 0;

    Bill.find({parentID: user._id}).limit(pagestart*10,10).sort({createAt:-1}).populate('lessonID').exec(function (err, bills) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        //该用户没有提问
        if (bills.length === 0) {
            return res.json({status: 'error', 'errcode': 4});   //该用户没有提问
        }
        //该用户有提问
        else {
            console.log("bill.list:");
            console.log(bills);
            var bills_serialize = [];
            bills.forEach(function (bill) {
                var tmp = {
                    description: bill.lessonID.description,
                    lessonID: bill.lessonID._id,
                    createAt: bill.createAt
                };
                bills_serialize.push(tmp);
            });
            res.json({status: 'success', 'bills': bills_serialize});
        }
    })

}