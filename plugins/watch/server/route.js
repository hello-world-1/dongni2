const app = appRequire('plugins/watch/index').app;
// const wss = appRequire('plugins/webgui/index').wss;
//const sessionParser = appRequire('plugins/watch/index').sessionParser;
const home = appRequire('plugins/watch/server/home');
const path = require('path');
const config = appRequire('services/config').all();

const isUser = (req, res, next) => {
  if(req.session.type === 'normal') {
    // knex('user').update({
    //   lastLogin: Date.now(),
    // }).where({ id: req.session.user }).then();
      // db operation
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


app.post('/api/home/code', home.sendCode);
app.post('/api/home/signup', home.signup);
app.post('/api/home/login', isUser,home.login);
app.post('/api/home/logout', home.logout);
// app.post('/api/home/password/sendEmail', home.sendResetPasswordEmail);
// app.get('/api/home/password/reset', home.checkResetPasswordToken);
// app.post('/api/home/password/reset', home.resetPassword);
//
// app.get('/api/admin/server', isAdmin, adminServer.getServers);
// app.get('/api/admin/server/:serverId(\\d+)', isAdmin, adminServer.getOneServer);
// app.put('/api/admin/account/:accountId(\\d+)/data', isAdmin, admin.changeAccountData);
// app.get('/api/admin/flow/:serverId(\\d+)/:port(\\d+)/lastConnect', isAdmin, adminFlow.getServerPortLastConnect);

app.post('/api/home/logout', home.sendtcp);





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
