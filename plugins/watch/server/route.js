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
const User = appRequire('plugins/watch/db/user');


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

//question
//获取相关提问列表(一期为获取全部提问)
app.post('/api/user/question/similar', home.signinRequired, question.similar);
//根据用户id获取提问列表
app.post('/api/user/question/list', home.signinRequired, question.list);
//用户添加新提问
app.post('/api/user/question/new', home.signinRequired, question.add);
//根据提问id获取提问详情
app.post('/api/user/question/detail', home.signinRequired, question.detail);

//emotion
//根据家长id获取最新情绪详情详情
app.post('/api/user/emotion/latest', home.signinRequired, emotion.latest);
// //根据I家长id获取情绪详情列表--成长
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

//watch
//获取手表信息
app.post('/api/user/watch/detail', home.signinRequired, watch.detail);
//绑定手表和主控号码XX
app.post('/api/user/watch/bind', home.signinRequired, watch.bind);
// //为手表添加联系人XX
app.post('/api/user/watch/contact/add', home.signinRequired, watch.addContact);
//获取手表电话号码--电话
app.post('/api/user/watch/call', home.signinRequired, watch.call);
//立即定位XXX
app.post('/api/user/watch/locate', home.signinRequired, watch.locate);

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
