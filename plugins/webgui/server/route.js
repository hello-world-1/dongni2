const app = appRequire('plugins/webgui/index').app;
// const wss = appRequire('plugins/webgui/index').wss;
const sessionParser = appRequire('plugins/webgui/index').sessionParser;
const home = appRequire('plugins/webgui/server/home');
const path = require('path');
const config = appRequire('services/config').all();
const User = appRequire('plugins/webgui/server/user')
const Teacher = appRequire('plugins/webgui/server/teachers')
/*const Book = require('/root/watch/app-watch/plugins/webgui/server/books')*/

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

app.post('/user/login', User.login);
app.post('/admin/addteacher', home.sendCode);
app.post('/api/home/signin', Teacher.signin);
app.post('/api/home/login', home.login);
app.post('/user/logout', User.logout);
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
