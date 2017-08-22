const http = require('http');
const url = require('url');
const qs = require('querystring');
// const util = require('util');

const weatherService=  (cityid,extensions) => {

    const data = {
        city: cityid,
        key: '196666057e389e7c07ee84fc4c24bb62',
        extensions: extensions
    }

    const content = qs.stringify(data)

    let result = ''
    let body = []

    const options = {
        hostname: 'restapi.amap.com',
        port: 80,
        path: '/v3/weather/weatherInfo?' + content,
        method: 'GET'
    }

    const promise= new Promise((resolve,reject)=> {
        let req = http.request(options, function (res) {
            res.setEncoding('utf8')
            res.on('data', function (chunk) {
                /*util.log(typeof chunk)*/
                result += chunk
            })
            res.on('error', function (err) {
                logger.error('RESPONSE ERROR: ' + err)
                reject(new Error("client connection close"));
            })
            res.on('end', function () {
                body = Buffer.concat(body);
                const jsonObj = JSON.parse(result)
                let chineseWeek = ''

                if(jsonObj.forecasts[0].casts[0].week == '1'){
                    chineseWeek = '星期一'
                }else if(jsonObj.forecasts[0].casts[0].week == '2'){
                    chineseWeek = '星期二'
                }else if(jsonObj.forecasts[0].casts[0].week == '3'){
                    chineseWeek = '星期三'
                }else if(jsonObj.forecasts[0].casts[0].week == '4'){
                    chineseWeek = '星期四'
                }else if(jsonObj.forecasts[0].casts[0].week == '5'){
                    chineseWeek = '星期五'
                }else if(jsonObj.forecasts[0].casts[0].week == '6'){
                    chineseWeek = '星期六'
                }else if(jsonObj.forecasts[0].casts[0].week == '7'){
                    chineseWeek = '星期七'
                }
                let retValue = ''
                retValue = jsonObj.forecasts[0].province+jsonObj.forecasts[0].city + ',' +
                    jsonObj.forecasts[0].casts[0].date + '|' + chineseWeek + '|' +
                    jsonObj.forecasts[0].casts[0].dayweather + '|' + jsonObj.forecasts[0].casts[0].daytemp + '|' +
                    jsonObj.forecasts[0].casts[0].nighttemp + '|' + '3' + '|' + '0' + '|' +
                    jsonObj.forecasts[0].casts[0].daywind + '|' + jsonObj.forecasts[0].casts[0].daypower


                resolve(retValue);
            })
        });
        req.end();
    })
    //     .then((adcode)=>{
    //     console.log("adcode:"+adcode)
    //     return new Promise((resolve,reject)=>{
    //         const tempweather = weather.weatherService(adcode)
    //         resolve(tempweather)
    //     })
    // })
        .catch((err) => console.log(err))

    return  promise;
}

// {
//     "status": "1",
//     "count": "1",
//     "info": "OK",
//     "infocode": "10000",
//     "forecasts": [
//     {
//         "city": "东城区",
//         "adcode": "110101",
//         "province": "北京",
//         "reporttime": "2017-08-02 08:00:00",
//         "casts": [
//             {
//                 "date": "2017-08-02",
//                 "week": "3",
//                 "dayweather": "中雨",
//                 "nightweather": "中雨",
//                 "daytemp": "29",
//                 "nighttemp": "24",
//                 "daywind": "东",
//                 "nightwind": "北",
//                 "daypower": "≤3",
//                 "nightpower": "≤3"
//             },
//             {
//                 "date": "2017-08-03",
//                 "week": "4",
//                 "dayweather": "阴",
//                 "nightweather": "晴",
//                 "daytemp": "33",
//                 "nighttemp": "24",
//                 "daywind": "南",
//                 "nightwind": "北",
//                 "daypower": "≤3",
//                 "nightpower": "≤3"
//             },
//             {
//                 "date": "2017-08-04",
//                 "week": "5",
//                 "dayweather": "多云",
//                 "nightweather": "多云",
//                 "daytemp": "33",
//                 "nighttemp": "25",
//                 "daywind": "南",
//                 "nightwind": "北",
//                 "daypower": "≤3",
//                 "nightpower": "≤3"
//             },
//             {
//                 "date": "2017-08-05",
//                 "week": "6",
//                 "dayweather": "阴",
//                 "nightweather": "雷阵雨",
//                 "daytemp": "33",
//                 "nighttemp": "24",
//                 "daywind": "南",
//                 "nightwind": "北",
//                 "daypower": "≤3",
//                 "nightpower": "≤3"
//             }
//         ]
//     }
// ]
// }

exports.weatherService = weatherService;