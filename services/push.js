var JPush = require("jpush-sdk/lib/JPush/JPush.js")
var client = JPush.buildClient('be84b71cf631fc11f1b7d855',
    '685ab1c6def89b5b760dc713')
const log4js = require('log4js');
const logger = log4js.getLogger('system');

const pushService =  (registration_id_temp,content) => {

    const promise= new Promise((resolve,reject)=> {
        console.log("registration_id:" + registration_id_temp + "||content:" + content)
        client.push()
            .setPlatform(JPush.ALL) //设置推送平台,包括Android, iOS, Windows Phone
            // .setAudience(JPush.registration_id('160a3797c8300e3864c')) //设置推送目标,别名、标签、注册ID、分群、广播等方式
            .setAudience(JPush.registration_id(registration_id_temp)) //设置推送目标,别名、标签、注册ID、分群、广播等方式
            // .setNotification('notification',
            //     JPush.ios('ios alert'),
            //     JPush.android('content', 'JPush Title', 1)) //设置消息发送的内容
            .setMessage(content) //设置发送消息的内容
            .setOptions(null, 60)
            .send(function (err, res) {
                if (err) {
                    console.log(err.message)
                    reject(err)
                } else {
                    console.log('Sendno: ' + res.sendno)
                    console.log('Msg_id: ' + res.msg_id)
                    resolve(res.msg_id)
                }
            });
    }).catch((err) => console.log(err))

    return  promise;
}
exports.pushService = pushService;

/*client.getReportReceiveds(message_id, function(err, res) {
    if (err) {
        console.log(err.message)
    } else {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].android_received)
            console.log(res[i].ios_apns_sent)
            console.log(res[i].msg_id)
        }
    }
});*/
