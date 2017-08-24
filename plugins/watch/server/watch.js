/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const appwatch = appRequire('services/appwatch');
const iconv=require('iconv-lite');

const Watch = appRequire('plugins/watch/db/watch');
const Telephone = appRequire('plugins/watch/db/telephone');
const User = appRequire('plugins/watch/db/user');
const manager = appRequire('services/manager');

//添加手表联系人
exports.addContact = (req, res) => {

    user = req.body.user;
    contactName = req.body.name;
    telephoneNum = req.body.telephone;
    // type = req.body.type;

    //判空
    if (!contactName || !telephoneNum) {
        return res.json({status: 'error', 'errcode': 3});
    }

    //判断该用户手机号是否绑定过
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 9});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            //判断该联系人手机号是否已添加
            Telephone.findOne({IMEI: watch.IMEI, telephone: telephoneNum, type: '1'}, function (err, telephone) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 5});   //数据库查询出错
                }
                if (telephone) {
                    //该联系人已存在
                    return res.json({status: 'error', 'errcode': 6});   //该手表该联系人已存在
                }
                else {
                    //为手表添加该联系人

                    console.log("watchAddContact:");
                    const time=new Date().getTime();
                    const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
                    const name=contactName;
                    const username=iconv.encode(name,'UTF16-BE').toString('hex');
                    const IMEI = watch.IMEI;
                    const telephone = telephoneNum;
                    const IWBP61=`IWBP61,${IMEI},${time},C|${username}|${telephone}#`;

                    let result = null;
                    let message=null;
                    message=IWBP61;
                    console.log('message: ' + message);
                    appwatch.sendCommand(message).then(success=>{
                        if(success){
                            result=success;
                            // res.send(result);

                            //手表设置成功
                            //数据库新建该联系人
                            let _contact = {
                                IMEI: watch.IMEI,
                                telephone: telephoneNum,
                                name: contactName,
                                avatar: 'http://www.7xsnbz.com2.z0.glb.qiniucdn.com/NARUTO.jpg',
                                type: '1',
                                parentID: user._id
                            };

                            let contact = new Telephone(_contact);
                            console.log('watch.addContact:');
                            console.log(contact);
                            contact.save(function (err) {
                                if (err) {
                                    return res.json({status: 'error', 'errcode': 7});   //数据库保存出错
                                }
                                else {
                                    return res.json({status: 'success'});
                                }
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        // res.status(500).end();
                        return res.json({status: 'error' , 'errcode': 8});  //给手表发命令出错
                    });
                }
            })
        }
    });

    // res.send('This is not implemented now');
};

//用户设置手表主控号码
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
                    const IWBP11=`IWBP11,${IMEI},${time},${controlTelephone}#`;

                    let result = null;
                    let message=null;
                    message=IWBP11;
                    console.log('message: ' + message);
                    appwatch.sendCommand(message).then(success=>{
                        if(success){
                            result=success;
                            // res.send(result);
                            return res.json({status: 'success'});
                        }
                    }).catch(err => {
                        console.log(err);
                        // res.status(500).end();
                        return res.json({status: 'error' , 'errcode': 7});
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
                    return res.json({status: 'error', 'errcode': 6});   //数据库保存出错
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
                            return res.json({status: 'success'});
                        }
                    }).catch(err => {
                        console.log(err);
                        // res.status(500).end();
                        //本地测试要启tcpclient IMEI号为指定的IMEI号
                        return res.json({status: 'error' , 'errcode': 7});
                    });
                    // res.json({status: 'save success'});
                }
            });
        }
    })
    // res.send('This is not implemented now');
};

//获取手表信息--设备绑定
exports.detail = (req, res) => {

    user = req.body.user;

    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        if (!watch) {
            //该手机号码未绑定
            return res.json({status: 'error', 'errcode': 4});   //该手机号码未绑定
        }
        else {
            let _watch = {
                IMEI: watch.IMEI,
                watchTelephone: watch.watchTelephone
            };
            res.json({stauts: 'success', watch: _watch});
        }
    });
    // res.send('This is not implemented now');
};

//设置亲情号码
exports.addFamilyNumber = (req, res) => {

    user = req.body.user;
    const phoneNumber1 = req.body.phoneNumber1;
    const phoneNumber2 = req.body.phoneNumber2;
    const phoneNumber3 = req.body.phoneNumber3;
    const phoneNumber4 = req.body.phoneNumber4;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP13=`IWBP13,${IMEI},${time},${phoneNumber1},${phoneNumber2},${phoneNumber3},${phoneNumber4}#`;

            let result = null;
            let message=null;
            message=IWBP13;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//获取手表电话号码
exports.call = (req, res) => {

    user = req.body.user;

    User.findOne({_id: user._id}, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询错误
        }
        if (!user) {
            return res.json({status: 'error', 'errcode': 4});   //该用户不存在
        }
        else {
            res.json({status: 'success', childrenTelephone: user.childrenTelephone});
        }
    })

};

//发送立即定位指令
exports.locate = (req, res) => {

    user = req.body.user;

    //判断该用户手机号是否绑定过
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            //发送立即定位指令

            console.log("locate:");
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP16=`IWBP16,${IMEI},${time}#`;

            let result = null;
            let message=null;
            message=IWBP16;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    // res.send(result);
                    return res.json({status: 'success'});   //发送立即定位指令成功
                }
            }).catch(err => {
                console.log(err);
                // res.status(500).end();
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })

};

//设置SOS号码
exports.sos = (req, res) => {
    user = req.body.user;
    const phoneNumber1 = req.body.phoneNumber1;
    const phoneNumber2 = req.body.phoneNumber2;
    const phoneNumber3 = req.body.phoneNumber3;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP12=`IWBP12,${IMEI},${time},${phoneNumber1},${phoneNumber2},${phoneNumber3}#`;

            let result = null;
            let message=null;
            message=IWBP12;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//恢复出厂设置
exports.restoreSettings = (req, res) => {
    user = req.body.user;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP17=`IWBP17,${IMEI},${time}#`;

            let result = null;
            let message=null;
            message=IWBP17;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//重启终端
exports.restartTerminal = (req, res) => {
    user = req.body.user;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP18=`IWBP18,${IMEI},${time}#`;

            let result = null;
            let message=null;
            message=IWBP18;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//设置服务器信息
exports.settingServer = (req, res) => {
    user = req.body.user;
    const address = req.body.address;
    const port = req.body.port;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP19=`IWBP19,${IMEI},${time},0,${address},${port}#`;

            let result = null;
            let message=null;
            message=IWBP19;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//设置计步器开关
exports.pedometer = (req, res) => {
    user = req.body.user;
    const pedometerStatus = req.body.pedometerStatus;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP21=`IWBP21,${IMEI},${time},${pedometerStatus}#`;

            let result = null;
            let message=null;
            message=IWBP21;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//设置短信报警开关
exports.sms = (req, res) => {
    user = req.body.user;
    const smsStatus = req.body.smsStatus;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP24=`IWBP24,${IMEI},${time},${smsStatus}#`;

            let result = null;
            let message=null;
            message=IWBP24;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//设置设备脱落报警开关
exports.fallOff = (req, res) => {
    user = req.body.user;
    const fallOffStatus = req.body.fallOffStatus;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP30=`IWBP30,${IMEI},${time},${fallOffStatus}#`;

            let result = null;
            let message=null;
            message=IWBP30;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//关机
exports.powerOff = (req, res) => {
    user = req.body.user;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP31=`IWBP31,${IMEI},${time}#`;

            let result = null;
            let message=null;
            message=IWBP31;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//拨打电话
exports.phoneCall = (req, res) => {
    user = req.body.user;
    const phoneNumber = req.body.phoneNumber;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP32=`IWBP32,${IMEI},${time},${phoneNumber}#`;

            let result = null;
            let message=null;
            message=IWBP32;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//设置设备工作模式
exports.workModel = (req, res) => {
    user = req.body.user;
    const workModel = req.body.workModel;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP33=`IWBP33,${IMEI},${time},${workModel}#`;

            let result = null;
            let message=null;
            message=IWBP33;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//设置设备验证码
exports.authCode = (req, res) => {
    user = req.body.user;
    const authCode = req.body.authCode;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP35=`IWBP35,${IMEI},${time},${authCode}#`;

            let result = null;
            let message=null;
            message=IWBP35;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

//退出设备验证码显示界面
exports.exitAuthCode = (req, res) => {
    user = req.body.user;
    Watch.findOne({controlTelephone: user.telephone}, function (err, watch) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        if (!watch) {
            //该用户注册手机号没有绑定过
            return res.json({stauts: 'error', 'errcode': 4});   //该用户注册手机号未绑定手表
        }
        else {
            const IMEI = watch.IMEI;
            const time=new Date().getTime();
            const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP36=`IWBP36,${IMEI},${time}#`;

            let result = null;
            let message=null;
            message=IWBP36;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success=>{
                if(success){
                    result=success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    })
};

