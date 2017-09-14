const app = appRequire('plugins/watch/index').app;
// const wss = appRequire('plugins/webgui/index').wss;
//const sessionParser = appRequire('plugins/watch/index').sessionParser;
const path = require('path');
const config = appRequire('services/config').all();

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const home = appRequire('plugins/watch/server/home');
const question = appRequire('plugins/watch/server/question');
const emotion = appRequire('plugins/watch/server/emotion');
const watch = appRequire('plugins/watch/server/watch');
const lesson = appRequire('plugins/watch/server/lesson');
const bill = appRequire('plugins/watch/server/bill');
const book = appRequire('plugins/watch/server/book');
const teacher = appRequire('plugins/watch/server/teacher');
const user = appRequire('plugins/watch/server/user');
const message = appRequire('plugins/watch/server/message');


// const isUser = (req, res, next) => {
//   if(req.session.type === 'normal') {
//     // knex('user').update({
//     //   lastLogin: Date.now(),
//     // }).where({ id: req.session.user }).then();
//       // db operation
//     return next();
//   } else {
//     return res.status(401).end();
//   }
// };
// const isAdmin = (req, res, next) => {
//   if(req.session.type === 'admin') {
//     return next();
//   } else {
//     return res.status(401).end();
//   }
// };


// app.post('/api/home/code', home.sendCode);
// app.post('/api/home/signup', home.signup);
// app.post('/api/home/login', isUser,home.login);
// app.post('/api/home/logout', home.logout);

// app.post('/api/home/password/sendEmail', home.sendResetPasswordEmail);
// app.get('/api/home/password/reset', home.checkResetPasswordToken);
// app.post('/api/home/password/reset', home.resetPassword);
//
// app.get('/api/admin/server', isAdmin, adminServer.getServers);
// app.get('/api/admin/server/:serverId(\\d+)', isAdmin, adminServer.getOneServer);
// app.put('/api/admin/account/:accountId(\\d+)/data', isAdmin, admin.changeAccountData);
// app.get('/api/admin/flow/:serverId(\\d+)/:port(\\d+)/lastConnect', isAdmin, adminFlow.getServerPortLastConnect);

//home
//获取验证码
app.post('/api/user/sendCode', home.sendCode);
//注册
app.post('/api/user/signup', home.signup);
//登录
app.post('/api/user/signin', home.signin);
//登出
app.post('/api/user/logout', home.signinRequired, home.logout);
//修改密码
app.post('/api/user/resetPassword', home.signinRequired, home.resetPassword);
//切换设备
app.post('/api/user/switchDevice', home.signinRequired, home.switchDevice);


//显示首页的数据
app.post('/api/user/indexPage', home.signinRequired, home.indexPage);
//添加pushID
app.post('/api/user/addPushID', home.signinRequired, home.addPushID);
//修改用户的个人信息
app.post('/api/user/information/changeInfo', home.signinRequired, home.changeInfo);
//question
//获取相关提问列表(一期为获取全部提问)
app.post('/api/user/question/similar', home.signinRequired, question.similar);
//根据用户id获取提问列表
app.post('/api/user/question/list', home.signinRequired, question.list);
//用户添加新提问
app.post('/api/user/question/new', home.signinRequired, question.add);
//根据提问id获取提问详情
app.post('/api/user/question/detail', home.signinRequired, question.detail);
//所有问题的所有回复
app.post('/api/user/question/replies', home.signinRequired, question.replies);

//emotion
//根据家长id获取最新情绪详情
app.post('/api/user/emotion/latest', home.signinRequired, emotion.latest);
//根据I家长id获取情绪详情列表--成长
// app.post('/api/user/emotion/list', home.signinRequired, emotion.list);

//lesson
//根据课程id查看课程详情
app.post('/api/user/lesson/detail', home.signinRequired, lesson.detail);
//用户报名课程
app.post('/api/user/bill/add', home.signinRequired, bill.add);
//获取该用户报名的课程
app.post('/api/user/lesson/list', home.signinRequired, bill.list);

//book
//根据id查看某一本书籍
app.post('/api/user/book/detail', home.signinRequired, book.detail);

//teacher
//根据老师id查看此老师的详细信息
app.post('/api/user/teacher/detail', home.signinRequired, teacher.detail);

//user_information
//获取用户个人信息--对应app侧滑栏用户信息设置
app.post('/api/user/information/detail', home.signinRequired, user.detail);
//用户填写信息--对应app侧滑栏用户信息设置
app.post('/api/user/information/modify', home.signinRequired, user.modify);
//修改用户头像
app.post('/api/user/information/avatar', multipartMiddleware, home.signinRequired, user.changeAvatar);
// //获取孩子个人信息
// app.get('/api/user/information/child', user.childDetail);
//用户添加孩子以及自己的信息--第一次提问
app.post('/api/user/information/add', home.signinRequired, user.infoAdd);

//改变消息查看状态
app.post('/api/user/message/changeMessageStatus', home.signinRequired, message.changeMessageStatus);
//查看所有消息
app.post('/api/user/message/viewAllMessage', home.signinRequired, message.viewAllMessage);
//是否显示红点
app.post('/api/user/message/redPoint', home.signinRequired, message.redPoint);

//watch
//获取手表信息
app.post('/api/user/watch/detail', home.signinRequired, watch.detail);
//绑定手表和主控号码XX  --BP11
app.post('/api/user/watch/bind', home.signinRequired, watch.bind);
//设置亲情号码  --BP13
app.post('/api/user/watch/contact/addFamilyNumber', home.signinRequired, watch.addFamilyNumber);
//为手表添加联系人XX  --BP61
app.post('/api/user/watch/contact/add', home.signinRequired, watch.addContact);
//获取手表电话号码--电话
app.post('/api/user/watch/call', home.signinRequired, watch.call);
//GPS定位数据上传时间间隔  -BP15
app.post('/api/user/watch/locationInterval', home.signinRequired, watch.locationInterval);
//发送立即定位指令  --BP16
app.post('/api/user/watch/locate', home.signinRequired, watch.locate);
//恢复出厂设置  --BP17
app.post('/api/user/watch/restoreSettings', home.signinRequired, watch.restoreSettings);
//重启终端  --BP18
app.post('/api/user/watch/restartTerminal', home.signinRequired, watch.restartTerminal);
//设置服务器信息  --BP19
app.post('/api/user/watch/settingServer', home.signinRequired, watch.settingServer);
//设置终端语言与时区 --BP20
app.post('/api/user/watch/languageSetting', home.signinRequired, watch.languageSetting);
//设置计步器开关  --BP21
app.post('/api/user/watch/pedometer', home.signinRequired, watch.pedometer);
//设置体感接听开关  --BP22
app.post('/api/user/watch/bodyInduction', home.signinRequired, watch.bodyInduction);
//设置监听开关  --BP23
app.post('/api/user/watch/monitor', home.signinRequired, watch.monitor);
//设置短信报警开关 --BP24
app.post('/api/user/watch/sms', home.signinRequired, watch.sms);
//设置闹钟 --BP25
app.post('/api/user/watch/alarmClock', home.signinRequired, watch.alarmClock);
//设置设备脱落报警开关  --BP30
app.post('/api/user/watch/fallOff', home.signinRequired, watch.fallOff);
//关机  --BP31
app.post('/api/user/watch/powerOff', home.signinRequired, watch.powerOff);
//拨打电话  --BP32
app.post('/api/user/watch/phoneCall', home.signinRequired, watch.phoneCall);
//设置设备工作模式  --BP33
app.post('/api/user/watch/workModel', home.signinRequired, watch.workModel);
//设置GPS工作时间段  --BP34
app.post('/api/user/watch/GPSTimeSlot', home.signinRequired, watch.GPSTimeSlot);
//设备验证码显示界面  --BP35
app.post('/api/user/watch/authCode', home.signinRequired, watch.authCode);
//退出设备验证码显示界面  --BP36
app.post('/api/user/watch/exitAuthCode', home.signinRequired, watch.exitAuthCode);
//设置休眠检测时间下行  --BP37
app.post('/api/user/watch/sleepDetection', home.signinRequired, watch.sleepDetection);
//设备休眠前主动上传休眠状态  --BP38
app.post('/api/user/watch/sleepStatus', home.signinRequired, watch.sleepStatus);
//文字下发  --BP40
app.post('/api/user/watch/sendWords', home.signinRequired, watch.sendWords);
//设置终端地址，紧急电话  --BP41
app.post('/api/user/watch/emergencyCall', home.signinRequired, watch.emergencyCall);
//开启和关闭上传通话记录  --BP62
app.post('/api/user/watch/callRecords', home.signinRequired, watch.callRecords);
//开启和关闭整点心率测试  --BP63
app.post('/api/user/watch/heartRateSwitch', home.signinRequired, watch.heartRateSwitch);
//开启和关闭实时心率测试  --BP64
app.post('/api/user/watch/realTimeHeartRate', home.signinRequired, watch.realTimeHeartRate);










//message
// //获取消息列表
// app.post('/api/user/message/list', message.list);
// //根据id获取具体某一消息
// app.post('/api/user/message/detail', message.detail);

//warning
// //获取预警信息
// app.post('/api/user/warnning/list', warning.list);

//test
// //获取问答卷
// app.post('/api/user/test/detail', test.detail);
// //添加回答
// app.post('/api/user/test/result/add', test.addResult);


const version = appRequire('package').version;
// const homePage = (req, res) => res.render('index', { version });
// app.get('/', homePage);
// app.get(/^\/home\//, homePage);


// wss.on('connection', function connection(ws) {
//   // console.log(ws);
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   ws.send('ws connected');
// });

// const shell = appRequire('plugins/webgui/server/shell');
// shell.getConnectionIp(10000).then(console.log).catch(err => {
//   console.log('err', err);
// });
