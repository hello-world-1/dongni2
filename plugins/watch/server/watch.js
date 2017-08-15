/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const appwatch = appRequire('services/appwatch');
const iconv=require('iconv-lite');

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

    //判断该手机号是否绑定过
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
                    //设置手表主控号码

                    console.log("setControlTelephone:");
                    const time=new Date().getTime();
                    const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
                    const IWBP11=`IWBP11,${IMEI},${time},${controlTelephone}`;

                    let result = null;
                    let message=null;
                    message=IWBP11;
                    console.log('message: ' + message);
                    appwatch.sendCommand(message).then(success=>{
                        if(success){
                            result=success;
                            // res.send(result);
                            return res.json({status: 'update success', tcpcode: result});
                        }
                    }).catch(err => {
                        console.log(err);
                        // res.status(500).end();
                        return res.json({status: 'error' , msg: 'sendCommand error'});
                    });
                    // return res.json({status: 'update success'});
                }
            })
        }
        else {
            //没有绑定过则新建
            let _watch = {
                IMEI: IMEI,
                watchTelephone: watchTelephone,
                controlTelephone: controlTelephone,
                parentID: user._id
            };
            console.log("watch.bind(add):");
            console.log(_watch);

            let watch = new Watch(_watch);
            watch.save(function (err) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 6});   //数据库保存出错,该IMEI已被其他账号绑定
                }
                else {
                    //设置手表主控号码

                    console.log("setControlTelephone:");
                    const time=new Date().getTime();
                    const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
                    const IWBP11=`IWBP11,${IMEI},${time},${controlTelephone}`;

                    let result = null;
                    let message=null;
                    message=IWBP11;
                    console.log('message: ' + message);
                    appwatch.sendCommand(message).then(success=>{
                        if(success){
                            result=success;
                            // res.send(result);
                            return res.json({status: 'add success', tcpcode: result});
                        }
                    }).catch(err => {
                        console.log(err);
                        // res.status(500).end();
                        //本地测试要启tcpclient IMEI号为指定的IMEI号
                        return res.json({status: 'error' , msg: 'sendCommand error'});
                    });
                    // res.json({status: 'save success'});
                }
            });
        }
    })
    // res.send('This is not implemented now');
};

exports.details = (req, res) => {
    res.send('This is not implemented now');
};
