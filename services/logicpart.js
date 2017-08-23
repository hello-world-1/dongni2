const iconv=require('iconv-lite');
const watchinfo=appRequire('models/watchinfo');
const locationtransefer=appRequire('services/locationtransefer')
const jizhan=appRequire('services/jizhan')
const weather=appRequire('services/weather')
const util = require("util")
const dateutil = require('date-utils')
const log4js = require('log4js');
const logger = log4js.getLogger('system');


const IWAP00 = async (params) => {
    try {
        const imei=params[1];
        //await 根据imei查出sos和主控号码
        const phone="1390001|1380002";
        const sos="1370001|1360002";
        const time=(new Date()).toFormat("YYYYMMDDHHMISS");
        await watchinfo.updateWatchInfo({'imei':imei},{'imei':imei,'status':true});
        return await `IWBP00,${time},8,zh_CN,Asia/beijing,${phone},${sos}`;
    } catch(err) {
        throw new Error(err);
    }
};

const IWAP01 = async (imei,params) => {
    try {
        //AP01消息调用 中间件向手机发送位置信息，也许需要保存地理位置数据
        //await
        console.log(imei)
        console.log(params[2].toString());
        const latitude = params[2].toString()
        // LBS
        if(latitude.indexOf("0000") > 0 ){
            const test = params[12].toString()
            const temp=test.split("|");
            const MCC = temp[0]
            const MNC = temp[1]
            const LAC = temp[2]
            const CID = temp[3]
            const dBm = temp[4]
            const weizhi=await jizhan.jizhanService(MCC+",0"+MNC+","+LAC+","+CID+","+dBm);
            const two = weizhi.split("|");
            const location = two[0]
            const latitude1 = two[1]
            console.log("weizhi:"+weizhi);
            await watchinfo.pushXX({"imei":imei},{ $push: { "locations":{"latitude":latitude1,"time":new Date().getTime() } }});
        }
        return await "IWBP01";
    } catch(err) {
        throw new Error(err);
    }
};


const IWAP02 = async (imei,params) => {
    try {
        //AP01消息调用 中间件向手机发送位置信息，也许需要保存地理位置数据
        //await
        if(params[2]==0)
        {
            return await "IWBP02";
        }
        else if(params[2]==1)
        {
            const MCC = params[4];
            const MNC = params[5];
            const message = params[6];
            const jizhan=message.split("|");
            const LAC = jizhan[0];
            const CID = jizhan[1];
            const qiangdu = jizhan[2];

            let test = MCC+ ',0' + MNC + ',' + LAC + ',' + CID + ',' + qiangdu

            const weizhi=await jizhan.jizhanService(test);
            const two = weizhi.split("|");
            const loc = two[0]
            const latitude = two[1]
            await watchinfo.pushXX({"imei":imei},{ $push: { "locations":{"latitude":latitude,"time":new Date().getTime() } }});
            console.log(weizhi);
            //此处需要调动地理位置解析插件，得到的地址返回
            // const loc='深圳市南山区南海大道1079号';
            const location=iconv.encode(loc,'UTF16-BE').toString('hex');
            console.log(location);
            return await `IWBP02,${location}`;
        }

    } catch(err) {
        throw new Error(err);
    }
};

const IWAP03 = async (imei,params) => {
    try {

        return await "IWBP03";

    } catch(err) {
        throw new Error(err);
    }
};

const IWAP04 = async (imei,params) => {
    try {
        //AP04收到低电量报警上报数据包需要推送消息给app
        //await
        return await "IWBP04";

    } catch(err) {
        throw new Error(err);
    }
};

const IWAP05 = async (imei,params) => {
    try {
        if(params[1]==0)
        {
            //await
            return await "IWBP05,6";
        }
        else if(params[1]==1)
        {
            //await
            return await "IWBP05,6";
        }

    } catch(err) {
        throw new Error(err);
    }
};

const IWAP06 = async (imei,params) => {
    try {
        //此处需要调动地理位置解析插件，得到的地址返回 (需要经纬度)23.11333,113.12333:纬度,经度

        const MCC = params[1];
        const MNC = params[2];
        const LAC = params[3];
        const CID = params[4];

        let test = MCC+ ',0' + MNC + ',' + LAC + ',' + CID

        const weizhi=await jizhan.jizhanService(test);
        const two = weizhi.split("|");
        const loc = two[0]
        const latitude = two[1]
        const lat = latitude.split(",")
        await watchinfo.pushXX({"imei":imei},{ $push: { "locations":{"latitude":latitude,"time":new Date().getTime() } }});
        const location=lat[1] + "," + lat[0];
        return await `IWBP06,${location}`;

    } catch(err) {
        throw new Error(err);
    }
};

const IWAP07 = async (imei,params) => {
    try {

        //await

        return await "IWBP07";

    } catch(err) {
        throw new Error(err);
    }
};

//2.4报警与地址回复包 (上行协议号：AP10，响应：BP10)
const IWAP10 = async (imei,params) => {
    try {
        //AP01消息调用 中间件向手机发送位置信息，也许需要保存地理位置数据
        //await
        const flag=params[2];
        //此处需要调动地理位置解析插件，得到的地址返回
        if(flag.indexOf("0000N")){
            const MCC = params[7];
            const MNC = params[8];
            const LAC = params[9];
            const CID = params[10];

            let test = MCC+ ',0' + MNC + ',' + LAC + ',' + CID

            const weizhi=await jizhan.jizhanService(test);
            const two = weizhi.split("|");
            const loc = two[0]
            const latitude = two[1]
            await watchinfo.pushXX({"imei":imei},{ $push: { "locations":{"latitude":latitude,"time":new Date().getTime() } }});
            console.log(weizhi);
            const location=iconv.encode(loc,'UTF16-BE').toString('hex');
            console.log(location);
            return await `IWBP10,${location}`;
        }
    } catch(err) {
        throw new Error(err);
    }
};

const IWAP39 = async (imei,params) => {
    try {
        //同步天气，空气，老黄历信息(拓展)
        //首先根据IMEI查找地理位置，然后把地理位置传给地图接口查询天气情况
        //await
        console.log(imei)
        // const cursor = await watchinfo.findXX({"imei":imei},{ $sort: { "locations.time" : 1 } });
        const cursor = await watchinfo.findXX({"imei":imei});
        // let templocaiton

        cursor.each(function(err,doc){
            if(doc) {
                // console.log("latitude:" + doc.locations.toString())
                console.log("latitude:" + JSON.stringify(doc))

                console.log("test:" + util.inspect(doc,{depth:null}));
                // templocaiton = JSON.parse(JSON.stringify(doc))

                Promise.resolve().then(() => {
                    return new Promise((resolve,reject)=>{
                        const adcode = locationtransefer.locationService(doc.locations[0].latitude);
                        resolve(adcode)
                    })
                }).then((adcode)=>{
                    console.log("adcode:"+adcode)
                    return new Promise((resolve,reject)=>{
                        const tempweather = weather.weatherService(adcode,"all")
                        resolve(tempweather)
                    })
                }).then((tempweather)=>{
                    return new Promise((resolve,reject)=>{

                        const weather=iconv.encode(tempweather,'UTF16-BE').toString('hex');
                        console.log(tempweather);
                        return `IWBP39,${weather}`;
                    })
                }).catch(err => {
                    logger.error(err);
                });
                // const tempweather="深圳,2016-1-19|星期二|晴转多云|11|6|7|0|北风|微风,2016-1-20|星期三|晴转多云|11|6|7|0|北风|微风";
            }
        })
    } catch(err) {
        throw new Error(err);
    }
};

const IWAP42 = async (imei,params) => {
    try {

        return await `IWBP42`;

    } catch(err) {
        throw new Error(err);
    }
};

//2.12上报心率/血氧（上行协议号：AP51，响应：BP51）
const IWAP51= async (imei,params) => {
    try {
        const time=params[1];
        const xx=params[2].split("|");
        const heartRate=xx[0];
        const bloodOxygen=xx[1];
        if(params[3]==1)
        {
            await watchinfo.pushXX({'imei':imei},{ $push: { "scores": { "time":time,"heartRate":heartRate,"bloodOxygen":bloodOxygen} } });
        }
        else if(params[3]==0)
        {

        }
        return await "IWBP51";

    } catch(err) {
        throw new Error(err);
    }
};

const IWAP52= async (imei,params) => {
    try {
        const startTime=params[1];
        const endTime=params[2];
        const stepNumber=params[3];
        const startxx=params[4].split("|");
        const startHeartRate=startxx[0];
        const startBloodOxygen=startxx[1];
        const endxx=params[5].split("|");
        const endHeartRate=endxx[0];
        const endBloodOxygen=endxx[1];

        await watchinfo.pushXX({'imei':imei},{ $push: { "sportScores": {
            "startTime":startTime,"endTIme":endTime,
            "stepNumber":stepNumber,
            "startHeartRate":startHeartRate,"startBloodOxygen":startBloodOxygen,
            "endHeartRate":endHeartRate,"endBloodOxygen":startBloodOxygen
        } } });
        return await "IWBP52";

    } catch(err) {
        throw new Error(err);
    }
};
//2.14上报通话记录：（上行协议号：AP53，响应：BP53）
const IWAP53= async (imei,params) => {
    try {
        const callLog=params.slice(1);
        const callScores=[];
        for (let i=0;i<callLog.length;i++)
        {
            const callArray=callLog[i].split("|");
            const startTime=callArray[0];
            const endTime=callArray[1];
            const peer=callArray[2];
            const flag=callArray[3];
            const local=callArray[4];
            callScores.push({"startTime":startTime,"endTime":endTime,"peer":peer,"flag":flag,"local":local})
        }
        await watchinfo.pushXX({'imei':imei},{ $push: { "callScores": {
            $each: callScores
        } } });

        return await "IWBP53";

    } catch(err) {
        throw new Error(err);
    }
};

//2.15 上报连续测试心率/血氧结果（上行协议号：AP54，响应：BP54）
const IWAP54= async (imei,params) => {
    try {

        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var date = new Date(params[1].replace(pattern,'$1-$2-$3 $4:$5:$6'));
        var startTime = date.getTime()/1000;
        const frequency=params[2];
        const xxArray=params.slice(3);
        const scores=[];
        for(let i=0;i<xxArray.length;i++)
        {
            const timeSec=startTime+(i*frequency);
            const time=(new Date(timeSec*1000)).toFormat("YYYYMMDDHHMISS");
            const heartRate=xxArray[i].split("|")[0];
            const bloodOxygen=xxArray[i].split("|")[1];
            scores.push({"time":time,"heartRate":heartRate,"bloodOxygen":bloodOxygen})
        }
        await watchinfo.pushXX({'imei':imei},{ $push: { "scores": {
            $each: scores
        } } });

        return await "IWBP54";

    } catch(err) {
        throw new Error(err);
    }
};

exports.IWAP00=IWAP00;
exports.IWAP01=IWAP01;
exports.IWAP02=IWAP02;
exports.IWAP03=IWAP03;
exports.IWAP04=IWAP04;
exports.IWAP05=IWAP05;
exports.IWAP06=IWAP06;
exports.IWAP07=IWAP07;
exports.IWAP10=IWAP10;
exports.IWAP39=IWAP39;
exports.IWAP42=IWAP42;
exports.IWAP51=IWAP51;
exports.IWAP52=IWAP52;
exports.IWAP53=IWAP53;
exports.IWAP54=IWAP54;