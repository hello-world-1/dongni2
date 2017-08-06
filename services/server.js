const log4js = require('log4js');
const logger = log4js.getLogger('system');
const crypto = require('crypto');
const path = require('path');
const config = appRequire('services/config').all();
const password = config.manager.password;
const host = config.manager.address.split(':')[0];
const port = +config.manager.address.split(':')[1];

const appwatch = appRequire('services/appwatch');

const net = require('net');

const receiveData = (receive, data) => {
  receive.data = Buffer.concat([receive.data, data]);
  checkData(receive);
};

const checkCode = (data, password, code) => {
  const time = Number.parseInt(data.slice(0, 6).toString('hex'), 16);
  if(Math.abs(Date.now() - time) > 10 * 60 * 1000) {
    return false;
  }
  const command = data.slice(6).toString();
  const md5 = crypto.createHash('md5').update(time + command + password).digest('hex');
  return md5.substr(0, 8) === code.toString('hex');
};

const receiveCommand = async (data)=> {
  try {
    const time = Number.parseInt(data.slice(0, 6).toString('hex'), 16);
    const message = data.slice(6).toString();
    logger.info(message);
    if(message!='') {
      return  appwatch.sendCommand(message);
    } else {
      return Promise.reject();
    }
  } catch(err) {
    throw err;
  }
};

const pack = (data) => {
  const message = JSON.stringify(data);
  const dataBuffer = Buffer.from(message);
  const length = dataBuffer.length;
  const lengthBuffer = Buffer.from(('0000' + length.toString(16)).substr(-4), 'hex');
  const pack = Buffer.concat([lengthBuffer, dataBuffer]);
  return pack;
};

const checkData = (receive) => {
  const buffer = receive.data;
  let length = 0;
  let data;
  let code;
  if (buffer.length < 2) {
    return;
  }
  length = buffer[0] * 256 + buffer[1];
  if (buffer.length >= length + 2) {
    data = buffer.slice(2, length - 2);
    code = buffer.slice(length - 2);
    // receive.data = buffer.slice(length + 2, buffer.length);
    if(!checkCode(data, password, code)) {
      receive.socket.end();
      // receive.socket.close();
      return;
    }
    receiveCommand(data).then(s => {
      receive.socket.end(pack({code: 0, data: s}));
      // receive.socket.close();
    }, e => {
      logger.error(e);
      receive.socket.end(pack({code: 1}));
      // receive.socket.close();
    });
    if(buffer.length > length + 2) {
      checkData(receive);
    }
  }
};

const server = net.createServer(socket => {
  const receive = {
    data: Buffer.from(''),
    socket: socket
  };
  socket.on('data', data => {
    receiveData(receive, data);
  });
  socket.on('end', () => {
    // console.log('end');
  });
  socket.on('close', () => {
    // console.log('close');
  });
});
server.on('error', (err) => {
  logger.error(`socket error: `, err);
});

server.listen({
  port,
  host,
}, () => {
  logger.info(`server listen on ${ host }:${ port }`);
});