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

app.post('/user/signin', User.signin);
app.post('/user/login', User.login);
app.post('/user/logout', User.logout);
app.post('/teacher/changeavatar', multipartMiddleware, Home.signinRequired, Teacher.changeAvatar);
app.post('/admin/addteacher', multipartMiddleware, Home.signinRequired,Teacher.addTeacher);
app.post('/teacher/changeinfo',multipartMiddleware, Home.signinRequired,Teacher.changeinfo);
app.post('/teacher/booklist', Home.signinRequired,Book.booklist);
app.post('/teacher/bookdetail', Home.signinRequired,Book.bookdetail);
app.post('/teacher/addbook', Home.signinRequired,Book.addbook);
app.post('/teacher/lessondetail', Home.signinRequired,Lesson.lessondetail);
app.post('/teacher/lessonlist', Home.signinRequired,Lesson.lessonlist);
app.post('/teacher/addlesson', Home.signinRequired,Lesson.addlesson);


// app.post('/teacher/replylist', Home.signinRequired,Answer.replylist);


//change method code
app.post('/teacher/replylist', Answer.replylist);





// app.post('/teacher/questionlist', Home.signinRequired,Question.questionlist);
app.post('/teacher/questionlist', Question.questionlist);
// app.post('/teacher/replyview', Home.signinRequired,Answer.replyview);
app.post('/teacher/replyview', Answer.replyview);
// app.post('/teacher/replycommit', Home.signinRequired,Answer.replycommit);

app.post('/teacher/replycommit', Answer.replycommit);
// app.post('/teacher/allquestionreply', Home.signinRequired,Answer.allquestionreply);
app.post('/teacher/allquestionreply', Answer.allquestionreply);


// not test
// app.post('/child/childinfo', Home.signinRequired,User.childinfo);
app.post('/child/childinfo', User.childinfo);

app.post('/api/home/login', home.login);
// app.post('/api/home/password/sendEmail', home.sendResetPasswordEmail);
// app.get('/api/home/password/reset', home.checkResetPasswordToken);
// app.post('/api/home/password/reset', home.resetPassword);
//
// app.get('/api/admin/server', isAdmin, adminServer.getServers);
// app.get('/api/admin/server/:serverId(\\d+)', isAdmin, adminServer.getOneServer);
// app.put('/api/admin/account/:accountId(\\d+)/data', isAdmin, admin.changeAccountData);
// app.get('/api/admin/flow/:serverId(\\d+)/:port(\\d+)/lastConnect', isAdmin, adminFlow.getServerPortLastConnect);


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
