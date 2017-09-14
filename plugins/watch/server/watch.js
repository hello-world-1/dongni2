/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();

const appwatch = appRequire('services/appwatch');
const iconv = require('iconv-lite');

const Watch = appRequire('plugins/watch/db/watch');
const Child = appRequire('plugins/watch/db/child');
const Telephone = appRequire('plugins/watch/db/telephone');
const User = appRequire('plugins/watch/db/user');
const manager = appRequire('services/manager');
const Contact = appRequire('plugins/watch/db/contact');
const async = require('async');


//change contact
exports.changeContact = (req, res) => {
    //save to mongo

    user = req.body.user;
    contactName = req.body.name;
    telephoneNum = req.body.telephone;
    oldContactName = req.body.oldContactName;
    oldTelephoneNum = req.body.oldTelephoneNum;

    Contact.findOne({parentID: user._id,contactPhone:oldTelephoneNum,contactName:oldContactName}, function (err, contact) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3}); //2:数据库查询失败
        }
        if (!contact) {
            res.json({status: 'error', 'errcode': 4});
        }
        else {
            Contact.update({_id: contact._id}, {$set: {contactPhone: telephoneNum, contactName: contactName,}},function (err, contact) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 6});   //数据库更新出错
                }
                return res.json({statuts: 'success'});
            })
        }
    });

    //判空
    if (!contactName || !telephoneNum) {
        return res.json({status: 'error', 'errcode': 3});
    }

    if(user.IMEI){
        Telephone.findOne({IMEI: user.IMEI, telephone: telephoneNum, type: '1',parentID:user._ID}, function (err, telephone) {
            if (err) {
                return res.json({status: 'error', 'errcode': 5});   //数据库查询出错
            }
            if (!telephone) {
                //该联系人已存在
                return res.json({status: 'error', 'errcode': 6});   //该手表该联系人已存在
            }
            else {
                //为手表添加该联系人

                console.log("watchAddContact:");
                const time = new Date().getTime();
                const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
                const name = contactName;
                const username = iconv.encode(name, 'UTF16-BE').toString('hex');
                const IMEI = watch.IMEI;
                const telephone = telephoneNum;
                const IWBP61 = `IWBP61,${IMEI},${time},U|${username}|${telephone}#`;

                let result = null;
                let message = null;
                message = IWBP61;
                console.log('message: ' + message);
                appwatch.sendCommand(message).then(success => {
                    if (success) {
                        result = success;
                        Contact.update({_id: telephone._id}, {$set: {contactPhone: telephoneNum, contactName: contactName,}},function (err, contact) {
                            if (err) {
                                return res.json({status: 'error', 'errcode': 6});   //数据库更新出错
                            }
                            return res.json({statuts: 'success'});
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    // res.status(500).end();
                    return res.json({status: 'error', 'errcode': 8});  //给手表发命令出错
                });
            }
        });
    }
};

//find contact
exports.findContact = (req, res) => {
    //save to mongo

    user = req.body.user;

    Contact.find({parentID: user._id}, function (err, contacts) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3}); //2:数据库查询失败
        }
        if (contacts.length == 0) {
            res.json({status: 'error', 'errcode': 4});
        }
        else {
            async.map(contacts, function (contact, callback) {
                let tmp = {
                    contactName:contact.contactName,
                    contactPhone:contact.contactPhone
                }
                callback(null,tmp);
            }, function (err, results) {
                return res.json({status: 'success', 'contacts': results});
            });
        }
    });
};

//添加手表联系人
exports.addContact = (req, res) => {
    //save to mongo

    user = req.body.user;
    contactName = req.body.name;
    telephoneNum = req.body.telephone;

    //判空
    if (!contactName || !telephoneNum) {
        return res.json({status: 'error', 'errcode': 3});
    }

    Contact.findOne({parentID: user._id,contactPhone:telephoneNum}, function (err, contact) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3}); //2:数据库查询失败
        }
        if (contact) {
            res.json({status: 'error', 'errcode': 4});        //3:该手机号已注册
        }
        else {
            _contact = new Contact({
                contactName: contactName,
                contactPhone: telephoneNum,
                parentID:user._id
            });
            _contact.save(function (err, contact) {
                if (err) {
                    res.json({status: 'error', 'errcode': 5}); //4:保存用户失败
                }
            });
        }
    });

    if(user.IMEI){
        //判断该联系人手机号是否已添加
        Telephone.findOne({IMEI: user.IMEI, telephone: telephoneNum, type: '1'}, function (err, telephone) {
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
                const time = new Date().getTime();
                const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
                const name = contactName;
                const username = iconv.encode(name, 'UTF16-BE').toString('hex');
                const IMEI = watch.IMEI;
                const telephone = telephoneNum;
                const IWBP61 = `IWBP61,${IMEI},${time},C|${username}|${telephone}#`;

                let result = null;
                let message = null;
                message = IWBP61;
                console.log('message: ' + message);
                appwatch.sendCommand(message).then(success => {
                    if (success) {
                        result = success;
                        // res.send(result);

                        //手表设置成功
                        //数据库新建该联系人
                        let _contact = {
                            IMEI: user.IMEI,
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
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    // res.status(500).end();
                    return res.json({status: 'error', 'errcode': 8});  //给手表发命令出错
                });
            }
        });
    }
};

//用户绑定设备
exports.bind = (req, res) => {

    outUser = req.body.user;
    IMEI = req.body.IMEI;
    watchTelephone = req.body.watchTelephone;
    nickname = req.body.nickname;

    //判空
    if (!IMEI || !watchTelephone || !nickname) {
        return res.json({status: 'error', 'errcode': 3});   //有空值
    }

    //判断家长和孩子是否绑定过设备
    User.findOne({IMEI: IMEI, token: outUser.token}, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 4});   //数据库查询错误
        }
        if (user) {
            //当前用户绑定过该IMEI号码
            return res.json({status: 'error', 'errcode': 8});
        }
        else {
            //当前用户没有绑定过该设备
            const tempUser = new User({
                telephone:outUser.telephone,
                password:outUser.password,
                token:outUser.token,
                IMEI:IMEI,
                childPhone:watchTelephone,
                nickname:nickname
            })

            tempUser.save(function (err, user) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 6});   //数据库保存出错
                }
                if(user) {
                    let _child = {
                        nickname: nickname,
                        childrenTelephone: watchTelephone,
                        parentID: user._id
                    };
                    let child = new Child(_child);
                    child.save(function (err, child) {
                        if (err) {
                            return res.json({status: 'error', 'errcode': 6});   //数据库保存出错
                        }
                        else {
                            //设置手表主控号码
                            User.update({_id: user._id}, {
                                $set: {
                                    presentChildId: child._id,
                                    childId: child._id
                                }
                            }, function (err) {
                                if (err) {
                                    return res.json({status: 'error', 'errcode': 5});   //数据库更新出错
                                }
                                User.update({token: user.token}, {
                                    $set: {
                                        presentChildId: child._id
                                    }
                                }, function (err) {
                                    if (err) {
                                        return res.json({status: 'error', 'errcode': 5});   //数据库更新出错
                                    }
                                    return res.json({status: 'success',userID:user._id});
                                });
                            });
                        }
                    });
                }
            });
        }
    })
    // res.send('This is not implemented now');
};

//用户修改绑定设备的信息
exports.changeBind = (req, res) => {

    user = req.body.user;
    IMEI = req.body.IMEI;
    watchTelephone = req.body.watchTelephone;
    nickname = req.body.nickname;

    //判空
    if (!IMEI || !watchTelephone || !nickname) {
        return res.json({status: 'error', 'errcode': 3});   //有空值
    }

    //判断家长和孩子是否绑定过设备
    User.findOne({IMEI: IMEI, token: user.token}, function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 4});   //数据库查询错误
        }
        if (!user) {
            //当前用户未绑定过该IMEI号码
            return res.json({status: 'error', 'errcode': 8});
        } else {
            User.update({_id: user._id}, {
                $set: {
                    childPhone: watchTelephone,
                    nickname: nickname
                }
            }, function (err, user) {
                if (err) {
                    return res.json({status: 'error', 'errcode': 5});   //数据库更新出错
                }
                Child.update({_id: user.childId}, {
                    $set: {
                        childrenTelephone: watchTelephone,
                        nickname: nickname
                    }
                }, function (err, user) {
                    if (err) {
                        return res.json({status: 'error', 'errcode': 5});   //数据库更新出错
                    }
                    return res.json({status: 'success'});
                });

            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP13 = `IWBP13,${IMEI},${time},${phoneNumber1},${phoneNumber2},${phoneNumber3},${phoneNumber4}#`;

            let result = null;
            let message = null;
            message = IWBP13;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
    });

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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP16 = `IWBP16,${IMEI},${time}#`;

            let result = null;
            let message = null;
            message = IWBP16;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    // res.send(result);
                    return res.json({status: 'success'});   //发送立即定位指令成功
                }
            }).catch(err => {
                console.log(err);
                // res.status(500).end();
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });

};

//设置GPS定位数据上传时间间隔
exports.locationInterval = (req, res) => {
    user = req.body.user;
    const interval = req.body.interval;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP15 = `IWBP15,${IMEI},${time},${interval}}#`;

            let result = null;
            let message = null;
            message = IWBP15;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP17 = `IWBP17,${IMEI},${time}#`;

            let result = null;
            let message = null;
            message = IWBP17;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP18 = `IWBP18,${IMEI},${time}#`;

            let result = null;
            let message = null;
            message = IWBP18;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP19 = `IWBP19,${IMEI},${time},0,${address},${port}#`;

            let result = null;
            let message = null;
            message = IWBP19;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设置终端语言与时区
exports.languageSetting = (req, res) => {
    user = req.body.user;
    const languageCode = req.body.languageCode;
    const timeZone = req.body.timeZone;
    const UTCTime = req.body.UTCTime;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP20 = `IWBP20,${IMEI},${time},${languageCode},${timeZone},${UTCTime}#`;

            let result = null;
            let message = null;
            message = IWBP20;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP21 = `IWBP21,${IMEI},${time},${pedometerStatus}#`;

            let result = null;
            let message = null;
            message = IWBP21;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设置体感接听开关
exports.bodyInduction = (req, res) => {
    user = req.body.user;
    const bodyInductionStatus = req.body.bodyInductionStatus;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP22 = `IWBP22,${IMEI},${time},${bodyInductionStatus}#`;

            let result = null;
            let message = null;
            message = IWBP22;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设置监听开关
exports.monitor = (req, res) => {
    user = req.body.user;
    const monitorStatus = req.body.monitorStatus;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP23 = `IWBP23,${IMEI},${time},${monitorStatus}#`;

            let result = null;
            let message = null;
            message = IWBP23;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP24 = `IWBP24,${IMEI},${time},${smsStatus}#`;

            let result = null;
            let message = null;
            message = IWBP24;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设置闹钟
exports.alarmClock = (req, res) => {
    user = req.body.user;
    const alarmClockStatus = req.body.alarmClockStatus;
    const alarmClock = req.body.alarmClock;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP25 = `IWBP25,${IMEI},${time},${alarmClockStatus},1,${alarmClock}#`;

            let result = null;
            let message = null;
            message = IWBP25;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP30 = `IWBP30,${IMEI},${time},${fallOffStatus}#`;

            let result = null;
            let message = null;
            message = IWBP30;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP31 = `IWBP31,${IMEI},${time}#`;

            let result = null;
            let message = null;
            message = IWBP31;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP32 = `IWBP32,${IMEI},${time},${phoneNumber}#`;

            let result = null;
            let message = null;
            message = IWBP32;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP33 = `IWBP33,${IMEI},${time},${workModel}#`;

            let result = null;
            let message = null;
            message = IWBP33;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设置GPS工作时间段
exports.GPSTimeSlot = (req, res) => {
    user = req.body.user;
    const timeSlot = req.body.timeSlot;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP34 = `IWBP34,${IMEI},${time},1,${timeSlot}#`;

            let result = null;
            let message = null;
            message = IWBP34;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP35 = `IWBP35,${IMEI},${time},${authCode}#`;

            let result = null;
            let message = null;
            message = IWBP35;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP36 = `IWBP36,${IMEI},${time}#`;

            let result = null;
            let message = null;
            message = IWBP36;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设置休眠检测时间下行
exports.sleepDetection = (req, res) => {
    user = req.body.user;
    const sleepDetectionTime = req.body.sleepDetectionTime;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP37 = `IWBP37,${IMEI},${time},${sleepDetectionTime}#`;

            let result = null;
            let message = null;
            message = IWBP37;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设备休眠前主动上传休眠状态
exports.sleepStatus = (req, res) => {
    user = req.body.user;
    const sleepStatus = req.body.sleepStatus;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP38 = `IWBP38,${IMEI},${time},${sleepStatus}#`;

            let result = null;
            let message = null;
            message = IWBP38;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//文字下发
exports.sendWords = (req, res) => {
    user = req.body.user;
    const sendWords = req.body.sendWords;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const tempSendWords = iconv.encode(sendWords, 'UTF16-BE').toString('hex');
            const IWBP40 = `IWBP40,${IMEI},${time},${tempSendWords}#`;

            let result = null;
            let message = null;
            message = IWBP40;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//设置终端地址，紧急电话
exports.emergencyCall = (req, res) => {
    user = req.body.user;
    const emergencyCall = req.body.emergencyCall;
    const terminalAddress = req.body.terminalAddress;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const tempTerminalAddress = iconv.encode(terminalAddress, 'UTF16-BE').toString('hex');
            const IWBP41 = `IWBP41,${IMEI},${time},${emergencyCall},${tempTerminalAddress}#`;

            let result = null;
            let message = null;
            message = IWBP41;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//开启和关闭上传通话记录
exports.callRecords = (req, res) => {
    user = req.body.user;
    const callRecordsStatus = req.body.callRecordsStatus;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP62 = `IWBP62,${IMEI},${time},${callRecordsStatus}#`;

            let result = null;
            let message = null;
            message = IWBP62;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//开启和关闭整点心率测试
exports.heartRateSwitch = (req, res) => {
    user = req.body.user;
    const heartRateStatus = req.body.heartRateStatus;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP63 = `IWBP63,${IMEI},${time},${heartRateStatus}#`;

            let result = null;
            let message = null;
            message = IWBP63;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};

//开启和关闭实时心率测试
exports.realTimeHeartRate = (req, res) => {
    user = req.body.user;
    const heartRateStatus = req.body.heartRateStatus;
    const heartRateInterval = req.body.heartRateInterval;
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
            const time = new Date().getTime();
            const timeStr = (new Date()).toFormat("YYYYMMDDHHMISS");
            const IWBP64 = `IWBP64,${IMEI},${time},${heartRateStatus},${heartRateInterval}#`;

            let result = null;
            let message = null;
            message = IWBP64;
            console.log('message: ' + message);
            appwatch.sendCommand(message).then(success => {
                if (success) {
                    result = success;
                    return res.json({status: 'success'});
                }
            }).catch(err => {
                console.log(err);
                return res.json({status: 'error', 'errcode': 5});
            });
        }
    });
};





