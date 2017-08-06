const log4js = require('log4js');
const logger = log4js.getLogger('webgui');

const config = appRequire('services/config').all();



exports.signup = (req, res) => {
  req.checkBody('password', 'Invalid password').notEmpty();
  let type = 'normal';

};

exports.login = (req, res) => {
  delete req.session.user;
  delete req.session.type;

};

exports.logout = (req, res) => {
  delete req.session.user;
  delete req.session.type;
  res.send('success');
};

exports.status = (req, res) => {
  res.send({ status: req.session.type });
};

exports.sendCode = (req, res) => {

};

// exports.getOneServer = (req, res) => {
//     const serverId = req.params.serverId;
//     const noPort = req.query.noPort;
//     let result = null;
//     knex('server').select().where({
//         id: +serverId,
//     }).then(success => {
//         if(success.length) {
//             result = success[0];
//             if(noPort) { return; }
//             return manager.send({
//                 command: 'list',
//             }, {
//                 host: success[0].host,
//                 port: success[0].port,
//                 password: success[0].password,
//             });
//         }
//         res.status(404).end();
//     }).then(success => {
//         if(success) { result.ports = success; }
//         res.send(result);
//     }).catch(err => {
//         console.log(err);
//         res.status(500).end();
//     });
// };







