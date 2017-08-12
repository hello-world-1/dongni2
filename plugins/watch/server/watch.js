/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const Watch = appRequire('plugins/watch/db/watch');
const manager = appRequire('services/manager');

exports.addContact = (req, res) => {

    user = req.body.user;
    name = req.body.name;
    telephone = req.body.telephone;
    type = req.body.type;

    //判空
    if (!name || !telephone || !type) {
        return res.json({status: 'error', 'errcode': 3});
    }



    res.send('This is not implemented now');
};

exports.bind = (req, res) => {

    user = req.body.user;
    IMEI = req.body.IMEI;
    watchTelephone = req.body.watchTelephone;
    controlTelephone = req.body.controlTelephone;

    //判空
    if (!IMEI || !watchTelephone || !controlTelephone) {
        return res.json({status: 'error', 'errcode': 3});   //有空值
    }

    //判断该用户是否绑定过
    Watch.findOne({controlTelephone: controlTelephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 4});   //数据库查询错误
        }
        if (watch) {
            //之前绑定过则更新数据
            console.log("watch.bind(old):");
            console.log(watch);
            Watch.update({_id: watch._id}, {IMEI:IMEI, watchTelephone: watchTelephone, controlTelephone: controlTelephone, parentID: user._id}, function (err) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 5});   //数据库更新错误
                }
                else {
                    //设置手表
                    // manager.send()
                    return res.json({status: 'update success'});
                }
            })
        }
        else {
            //没有绑定过则新建
            var _watch = {
                IMEI: IMEI,
                watchTelephone: watchTelephone,
                controlTelephone: controlTelephone,
                parentID: user._id
            };
            console.log("watch.bind(add):");
            console.log(_watch);

            var watch = new Watch(_watch);
            watch.save(function (err) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 6});   //数据库保存出错,该IMEI已被其他账号绑定
                }
                else {
                    //设置手表
                    // manager.send()
                    res.json({status: 'save success'});
                }
            });
        }
    })

    // res.send('This is not implemented now');
};

exports.details = (req, res) => {
    res.send('This is not implemented now');
};
