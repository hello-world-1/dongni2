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
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
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
                                    return res.json({status: 'add success', tcpcode: result});
                                }
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        // res.status(500).end();
                        return res.json({status: 'error' , msg: 'sendCommand error'});
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
