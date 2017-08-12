/**
 * Created by root on 8/7/17.
 */
/**
 * 接口类型：互亿无线触发短信接口，支持发送验证码短信、订单通知短信等。
 * 账户注册：请通过该地址开通账户http://sms.ihuyi.com/register.html
 * 注意事项：
 *（1）调试期间，请用默认的模板进行测试，默认模板详见接口文档；
 *（2）请使用 用户名 及 APIkey来调用接口，APIkey在会员中心可以获取；
 *（3）该代码仅供接入互亿无线短信接口参考使用，客户可根据实际需要自行编写；
 */

const request = require('request');
const crypto = require('crypto');
const format = require('string-format');
const querystring = require('querystring');

function IHuyi() {

}

var iHuyi = IHuyi.prototype;

const _baseUri = "http://106.ihuyi.com/webservice/sms.php?method=Submit";
const account = "C79524663";
const password = "b31c12e40928413306686758bad8800d";

iHuyi.send = (mobile, content, callback) => {
    let queryMap = {
        account: account,
        password: password,
        mobile: mobile,
        content: content,
        format: "json"
    };

    let querystr = querystring.stringify(queryMap);
    console.log("querystr: " + querystr);
    let url = _baseUri + "&" + querystr;
    console.log("url: " + url);

    request({url: url}, (err, response, body) => {
        if (err) {
            console.log(err);
            return;
        }

        callback(body);
    });
};

module.exports = iHuyi;