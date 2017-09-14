const app = appRequire('plugins/webgui/index').app;
// const wss = appRequire('plugins/webgui/index').wss;
//const sessionParser = appRequire('plugins/webgui/index').sessionParser;
const home = appRequire('plugins/webgui/server/home');
const path = require('path');
const config = appRequire('services/config').all();

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const User = appRequire('plugins/webgui/server/user')
const Teacher = appRequire('plugins/webgui/server/teachers')
const Book = appRequire('plugins/webgui/server/books');
const Question = appRequire('plugins/webgui/server/questions');
const Home = appRequire('plugins/webgui/server/home');
const Answer = appRequire('plugins/webgui/server/answers');
const Lesson = appRequire('plugins/webgui/server/lessons');
const Message = appRequire('plugins/webgui/server/messages');
const Survey = appRequire('plugins/webgui/server/survey');

var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('sessiontest'));
app.use(session({
    secret: 'sessiontest',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));

const isUser = (req, res, next) => {
    if(req.session.type === 'normal') {
        knex('user').update({
            lastLogin: Date.now(),
        }).where({ id: req.session.user }).then();
        return next();
    } else {
        return res.status(401).end();
    }
};
const isAdmin = (req, res, next) => {
    if(req.session.type === 'admin') {
        return next();
    } else {
        return res.status(401).end();
    }
};

app.post('/user/signin', User.signin);//管理员添加老师
app.post('/user/login', User.login);//管理员或者老师登录
app.post('/user/logout', Home.signinRequired,User.logout);//用户登出
app.post('/teacher/changeavatar', multipartMiddleware, Home.signinRequired, Teacher.changeAvatar);
app.post('/admin/addteacher', multipartMiddleware, Home.signinRequired,Teacher.addTeacher);
app.post('/teacher/changeinfo',multipartMiddleware, Home.signinRequired,Teacher.changeinfo);
app.post('/teacher/booklist', Home.signinRequired,Book.booklist);
app.post('/teacher/bookdetail', Home.signinRequired,Book.bookdetail);
app.post('/teacher/addbook', multipartMiddleware,Home.signinRequired,Book.addbook);
app.post('/teacher/lessondetail', Home.signinRequired,Lesson.lessondetail);
app.post('/teacher/lessonlist', Home.signinRequired,Lesson.lessonlist);
app.post('/teacher/addlesson', multipartMiddleware,Home.signinRequired,Lesson.addlesson);
app.post('/teacher/replylist', Home.signinRequired,Answer.replylist);
//change method code
app.post('/teacher/questionlist', Home.signinRequired,Question.questionlist);
app.post('/teacher/replyview', Home.signinRequired,Answer.replyview);
app.post('/teacher/replycommit', Home.signinRequired,Answer.replycommit);
app.post('/teacher/allquestionreply', Home.signinRequired,Answer.allquestionreply);
app.post('/child/childinfo', Home.signinRequired,User.childinfo);
// 根据某个题库名生成考题
app.post('/survey/productSurvey', Survey.productSurvey);// product question
//向某个题库中插入问题
app.post('/survey/insertQuestion', Home.signinRequired,require('body-parser').json(), Survey.insertQuestion);// insert question
//向某个题库中插入答案
app.post('/survey/insertAnswer', require('body-parser').json(), Survey.insertAnswer);// insert answer
//家长所填写的全部问卷的历史记录
app.post('/survey/historyScore', Survey.historyScore);
//家长所填写的全部问卷的最新答案
app.post('/survey/newestScore', Survey.newestScore);
//全部问卷
app.post('/survey/allSurvey', Survey.allSurvey);

app.post('/api/home/sendtcp',home.sendtcp);
const version = appRequire('package').version;
const homePage = (req, res) => res.render('index', { version });
app.get('/', homePage);
app.get(/^\/home\//, homePage);


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
