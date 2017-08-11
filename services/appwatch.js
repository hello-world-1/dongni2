const log4js = require('log4js');
const logger = log4js.getLogger('system');

const crypto = require('crypto');
const path = require('path');
const config = appRequire('services/config').all();

const host = config.appwatch.address.split(':')[0];
const port = config.appwatch.address.split(':')[1];

const logicpart = appRequire('services/logicpart');
const watchinfo=appRequire('models/watchinfo');

const net = require('net');

var HashMap = require('hashmap');
var map = new HashMap();

const receiveDatawatch = (receive, data) => {
    receive.data = Buffer.concat([receive.data, data]);
    checkDatawatch(receive);
};



const receiveCommandwatch = async (data,receive) => {
    try {
        const message = data.toString();
        const params=message.split(",");
        switch (params[0]){
            case 'IWAP00':
                receive.imei=params[1];
                map.set(params[1],receive.socket);
                return await logicpart.IWAP00(params);
                break;
            case 'IWAP01':
                //imei=map.search(receive.socket);
                return await logicpart.IWAP01(receive.imei,params);
                break;
            case 'IWAP02':
                return await logicpart.IWAP02(receive.imei,params);
                break;
            case 'IWAP03':
                return await logicpart.IWAP03(receive.imei,params);
                break;
            case 'IWAP04':
                return await logicpart.IWAP04(receive.imei,params);
                break;
            case 'IWAP05':
                return await logicpart.IWAP05(receive.imei,params);
                break;
            case 'IWAP06':
                return await logicpart.IWAP06(receive.imei,params);
                break;
            case 'IWAP07':
                return await logicpart.IWAP07(receive.imei,params);
                break;
            case 'IWAP10':
                return await logicpart.IWAP10(receive.imei,params);
                break;
            case 'IWAP39':
                return await logicpart.IWAP39(receive.imei,params);
                break;
            case 'IWAP42':
                return await logicpart.IWAP42(receive.imei,params);
                break;
            case 'IWAP51':
                return await logicpart.IWAP51(receive.imei,params);
                break;
            case 'IWAP52':
                return await logicpart.IWAP52(receive.imei,params);
                break;
            case 'IWAP53':
                return await logicpart.IWAP53(receive.imei,params);
                break;
            case 'IWAP54':
                return await logicpart.IWAP54(receive.imei,params);
                break;
            default:
                return '';
                break;
        }
    } catch(err) {
        throw err;
    }
};

const packwatch = (message) => {
    console.log("message="+message);
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
            console.log("s="+s);
            receive.socket.write(packwatch(s));
            // receive.socket.close();
        }).catch(e => {
            logger.error(e);
            //receive.socket.end(pack({}));
            // receive.socket.close();
        })
    }
};

const serverwatch = net.createServer(socket => {
    const receive = {
        data: Buffer.from(''),
        socket: socket,
        imei:'',
        pos:0
    };
    socket.on('data', data => {
        console.log(data.toString());
        receiveDatawatch(receive, data);
    });
    socket.on('end', async () => {
        const imei=map.search(socket)
        if(imei)
        {
            logger.error(imei+"socket end");
            await watchinfo.updateWatchInfo({'imei':imei},{'imei':imei,'status':false});
            map.remove(imei)
        }

    });
    socket.on('close', async () => {
        const imei=map.search(socket)
        if(imei)
        {
            await watchinfo.updateWatchInfo({'imei':imei},{'imei':imei,'status':false});
            map.remove(imei)
        }

    });
}).on('error', (err) => {
    logger.error(`socket error: `, err);
});

serverwatch.listen(port, () => {
    logger.info(`server listen on ${ host }:${ port }`);
});

// serverwatch.listen({
//     port,
//     host,
// }, () => {
//     logger.info(`server listen on ${ host }:${ port }`);
// });

const sendCommandwatch = async (message) => {
    try {
        return await sendMessagewatch(message);
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
        client.once('data', data => {
            const aptype=data.toString();
            //if(aptype.includes("AP11")||aptype.includes("AP12"))
            console.log("aptype="+aptype);
            resolve(data.toString());
        });
        client.once('close', () => {
            reject(new Error("client connection close"));
        });
        client.once('error', err => {
            logger.error(err);
            reject(new Error("client connection close"));
        });
    })

    return promise;


};

exports.sendCommand = sendCommandwatch;
