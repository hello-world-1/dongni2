const log4js = require('log4js');
const logger = log4js.getLogger('system');

const crypto = require('crypto');
const path = require('path');
const config = appRequire('services/config').all();

const host = config.appwatch.address.split(':')[0];
const port = config.appwatch.address.split(':')[1];

const logicpart = appRequire('services/logicpart');


const net = require('net');

var HashMap = require('hashmap');
var map = new HashMap();

const receiveDatawatch = (receive, data) => {
    receive.data = Buffer.concat([receive.data, data]);
    checkDatawatch(receive);
};



const receiveCommandwatch = async (data,receive) => {
    try {
        const message = data.toString()
        logger.info(message);
        const params=message.split(",");
        /*switch (params[0]){
            case 'IWAP00':
                let imei=params[1];
                map.put(imei,receive.socket)
                logicpart.IWAP00(params);
            // case 'IWAP01':
            //     logicpart.IWAP01(params);
            // case 'IWAP02':
            //     logicpart.IWAP02(params);
            // case 'IWAP03':
            //     logicpart.IWAP03(params);
            // case 'IWAP04':
            //     logicpart.IWAP04(params);
            // case 'IWAP05':
            //     logicpart.IWAP05(params);
            // case 'IWAP06':
            //     logicpart.IWAP06(params);
            // case 'IWAP07':
            //     logicpart.IWAP07(params);
            // case 'IWAP08':
            //     logicpart.IWAP08(params);

            default:
                return Promise.reject('error');
        }*/

        // if(message.command === 'add') {
        //     return appwatch.addAccount(message);
        // } else {
        //     return Promise.reject();
        // }
    } catch(err) {
        throw err;
    }
};

const packwatch = (message) => {
    const dataBuffer = Buffer.from(message);
    const endBuffer = Buffer.from("#");
    const pack = Buffer.concat([dataBuffer, endBuffer]);
    return pack;
};

const checkDatawatch = (receive) => {
    const buffer = receive.data;
    const endpos=buffer.indexOf("#",receive.pos,"utf8")
    let data;
    if(endpos==-1)
    {
        return;
    }
    else if(endpos!=-1)
    {
        let start=receive.pos;
        data = buffer.slice(start,endpos);
        receive.pos=endpos+1;
        receiveCommandwatch(data,receive).then(s => {
            //receive.socket.write(packwatch(s));
            // receive.socket.close();
        }, e => {
            logger.error(e);
            //receive.socket.end(pack({}));
            // receive.socket.close();
        });
    }
};

const serverwatch = net.createServer(socket => {
    const receive = {
        data: Buffer.from(''),
        socket: socket,
        pos:0
    };

    socket.on('data', data => {
        console.log("socket 1");
        receiveDatawatch(receive, data);
    });
    socket.on('end', () => {
        const imei=map.search(socket)
        map.remove(imei)
        console.log(imei+'end');
    });
    socket.on('close', () => {
        const imei=map.search(socket)
        map.remove(imei)
        console.log(imei+'close');
    });
}).on('error', (err) => {
    logger.error(`socket error: `, err);
});

serverwatch.listen({
    port,
    host,
}, () => {
    logger.info(`server listen on ${ host }:${ port }`);
});

const sendCommandwatch = async (message) => {
    try {
        await sendMessagewatch(message);
        return ;
    } catch(err) {
        return Promise.reject('error');
    }
};
const sendMessagewatch =  (message) => {
    const params=message.split(",");
    const promise = new Promise((resolve, reject) => {
        const client=map.get(params[1]);
        const receive = {
            data: Buffer.from(''),
            socket: client,
        };
        client.write(message,"utf8");
        client.on('data', data => {
            console.log("client 2")
            receiveDatawatch(receive, data).then(message => {
                if(!message) {
                    // reject(new Error(`empty message from ssmgr[s] [${ options.host || host }:${ options.port || port }]`));
                } else if(message.code === 0) {
                    resolve(message.data);
                } else {
                    logger.error(message);
                    reject(new Error("client2 error"));
                }
                //client.end();
            }).catch(err => {
                logger.error(err);
                //client.end();
            });
        });
        client.on('close', () => {
            reject(new Error("client connection close"));
        });
        client.on('error', err => {
            logger.error(err);
            reject(new Error("client connection close"));
        });
    })


};

exports.sendCommand = sendCommandwatch;
