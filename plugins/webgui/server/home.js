const log4js = require('log4js');
const logger = log4js.getLogger('webgui');

const config = appRequire('services/config').all();
const appwatch = appRequire('services/appwatch');
const iconv=require('iconv-lite');

exports.signup = (req,res) => {
  req.checkBody('password','Invalid password').notEmpty();
  let type = 'normal';

};

exports.login = (req,res) => {
  delete req.session.user;
  delete req.session.type;

};

exports.logout = (req,res) => {
  delete req.session.user;
  delete req.session.type;
  res.send('success');
};

exports.status = (req,res) => {
  res.send({ status: req.session.type });
};

exports.sendCode = (req,res) => {

};

exports.sendtcp = (req,res) => {
    console.log("sendtcp");
    const type = req.body.type;
    console.log(type);
    const time=new Date().getTime();
    const timeStr=(new Date()).toFormat("YYYYMMDDHHMISS");
    const IWBP11=`IWBP11,358511020048751,${time},135XXXXXXXX#`;
    const IWBP12=`IWBP12,358511020048751,${time},135XXXXXXXX,135XXXXXXXX,135XXXXXXXX#`
    const IWBP13=`IWBP13,358511020048751,${time},135xxxxxxxxxx,135xxxxxxxxxx,135xxxxxxxxxx,135xxxxxxxxxx#`
    const IWBP14=`IWBP14,358511020048751,${time},D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx,D3590D54|135xxxxxxxxxx#`
    const IWBP15=`IWBP15,358511020048751,${time},300#`
    const IWBP16=`IWBP16,358511020048751,${time}#`
    const IWBP17=`IWBP17,358511020048751,${time}#`
    const IWBP18=`IWBP18,358511020048751,${time}#`
    const IWBP19=`IWBP19,358511020048751,${time},0,115.28.242.3,6070#`
    const IWBP20=`IWBP20,358511020048751,${time},zh_CN,Asia/chongqing,${timeStr}#`
    const IWBP21=`IWBP21,358511020048751,${time},1#`
    const IWBP22=`IWBP22,358511020048751,${time},1#`
    const IWBP23=`IWBP23,358511020048751,${time},1#`
    const IWBP24=`IWBP24,358511020048751,${time},1#`
    const IWBP25=`IWBP25,358511020048751,${time},1,2,0900|135|1,0910|135|1#`
    const IWBP26=`IWBP26,358511020048751,${time},1,2,123|0900@1145,456|1300@1600#`
    const IWBP27=`IWBP27,358511020048751,${time},1#`

//3.18语音下行（下行协议号：BP28，响应：AP28）
    const IWBP28=`IWBP28,358511020048751,${time},1#`

    const IWBP29=`IWBP29,358511020048751,${time},111111#`

    const IWBP30=`IWBP30,358511020048751,${time},1#`
//3.21关机指令（下行协议号：BP31，响应：AP31）
    const IWBP31=`IWBP31,358511020048751,${time}#`

    const IWBP32=`IWBP32,358511020048751,${time},15210807608#`

    const IWBP33=`IWBP33,358511020048751,${time},1#`

//3.24GPS工作时间段（下行协议号：BP34，响应：AP34）
    const IWBP34=`IWBP34,358511020048751,${time},2,0900@1145,1300@1600#`

    const IWBP35=`IWBP35,358511020048751,${time},1234#`
    const IWBP36=`IWBP36,358511020048751,${time}#`
    const IWBP37=`IWBP37,358511020048751,${time},600#`
    const IWBP38=`IWBP38,358511020048751,${time},1#`

    const IWBP40=`IWBP40,358511020048751,${time},xxxx#`
    const IWBP41=`IWBP41,358511020048751,${time},15210807608,xxxxx#`

    const IWBP43=`IWBP43,358511020048751,${time},1#`

    const name='姜西斌';
    const username=iconv.encode(name,'UTF16-BE').toString('hex');
    const IWBP61=`IWBP61,358511020048751,${time},C|${username}|15210807608#`


    const IWBP62=`IWBP62,358511020048751,${time},1#`
    const IWBP63=`IWBP63,358511020048751,${time},1#`
    const IWBP64=`IWBP64,358511020048751,${time},1,60#`
  let result = null;
  Promise.resolve(req).then(req=>{
      let message=null;
      switch (type){
          case '11':
              message=IWBP11;
              break;
          case '12':
              message=IWBP12;
              break;
          case '13':
              message=IWBP13;
              break;
          case '14':
              message=IWBP14;
              break;
          case '15':
              message=IWBP15;
              break;
          case '16':
              message=IWBP16;
              break;
          case '17':
              message=IWBP17;
              break;
          case '18':
              message=IWBP18;
              break;
          case '19':
              message=IWBP19;
              break;
          case '20':
              message=IWBP20;
              break;
          case '21':
              message=IWBP21;
              break;
          case '22':
              message=IWBP22;
              break;
          case '23':
              message=IWBP23;
              break;
          case '24':
              message=IWBP24;
              break;
          case '25':
              message=IWBP25;
              break;
          case '26':
              message=IWBP26;
              break;
          case '27':
              message=IWBP27;
              break;
          case '28':
              message=IWBP28;
              break;
          case '29':
              message=IWBP29;
              break;
          case '30':
              message=IWBP30;
              break;
          case '31':
              message=IWBP31;
              break;
          case '32':
              message=IWBP32;
              break;
          case '33':
              message=IWBP33;
              break;
          case '34':
              message=IWBP34;
              break;
          case '35':
              message=IWBP35;
              break;
          case '36':
              message=IWBP36;
              break;
          case '37':
              message=IWBP37;
              break;
          case '38':
              message=IWBP38;
              break;
          case '40':
              message=IWBP40;
              break;
          case '41':
              message=IWBP41;
              break;
          case '43':
              message=IWBP43;
              break;
          case '61':
              message=IWBP61;
              break;
          case '62':
              message=IWBP62;
              break;
          case '63':
              message=IWBP63;
              break;
          case '64':
              message=IWBP64;
              break;
          default:
              message=""
              break;
      }
      console.log(message);
      return appwatch.sendCommand(message);
  }).then(success=>{
    if(success){
      result=success;
      res.send(result);
    }
  }).catch(err => {
        console.log(err);
        res.status(500).end();
    });

}

// exports.getOneServer = (req,res) => {
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
//             },{
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







