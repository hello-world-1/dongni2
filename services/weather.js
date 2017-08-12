const http = require('http');
const url = require('url');
const qs = require('querystring');
const util = require('util');

function server(cityid,callback) {
    const data = {
        city: cityid,
        key: '196666057e389e7c07ee84fc4c24bb62',
        extensions: 'all'
    }

    const content = qs.stringify(data)

    const result = ''
    const body = []

    const options = {
        hostname: 'restapi.amap.com',
        port: 80,
        path: '/v3/weather/weatherInfo?' + content,
        method: 'GET'
    }
    const req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            result += chunk
            body.push(chunk)
        });
        res.on('error', function(err) {
            util.log('RESPONSE ERROR: ' + err);
        });
        res.on('end', function() {
            util.log('响应结束')
            body = Buffer.concat(body);
            util.log(body.toString());
            const jsonObj = JSON.parse(result)
                /*{
    "status": "1",
    "count": "1",
    "info": "OK",
    "infocode": "10000",
    "forecasts": [
        {
            "city": "东城区",
            "adcode": "110101",
            "province": "北京",
            "reporttime": "2017-08-02 08:00:00",
            "casts": [
                {
                    "date": "2017-08-02",
                    "week": "3",
                    "dayweather": "中雨",
                    "nightweather": "中雨",
                    "daytemp": "29",
                    "nighttemp": "24",
                    "daywind": "东",
                    "nightwind": "北",
                    "daypower": "≤3",
                    "nightpower": "≤3"
                },
                {
                    "date": "2017-08-03",
                    "week": "4",
                    "dayweather": "阴",
                    "nightweather": "晴",
                    "daytemp": "33",
                    "nighttemp": "24",
                    "daywind": "南",
                    "nightwind": "北",
                    "daypower": "≤3",
                    "nightpower": "≤3"
                },
                {
                    "date": "2017-08-04",
                    "week": "5",
                    "dayweather": "多云",
                    "nightweather": "多云",
                    "daytemp": "33",
                    "nighttemp": "25",
                    "daywind": "南",
                    "nightwind": "北",
                    "daypower": "≤3",
                    "nightpower": "≤3"
                },
                {
                    "date": "2017-08-05",
                    "week": "6",
                    "dayweather": "阴",
                    "nightweather": "雷阵雨",
                    "daytemp": "33",
                    "nighttemp": "24",
                    "daywind": "南",
                    "nightwind": "北",
                    "daypower": "≤3",
                    "nightpower": "≤3"
                }
            ]
        }
    ]
}*/
            util.log('BODY: ' + jsonObj.forecasts[0].casts[0].week)
            util.log('Content: ' + content)
            callback(jsonObj)
        });
    });
    req.on('error', function(err) {
        util.log('REQUEST ERROR: ' + err);
    });
    req.end();
}

module.exports = server;