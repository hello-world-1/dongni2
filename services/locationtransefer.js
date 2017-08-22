var http = require('http')
var url = require('url')
var qs = require('querystring')
const log4js = require('log4js');
const logger = log4js.getLogger('system');

const locationService=  (location) => {

	const data = {
		key: '196666057e389e7c07ee84fc4c24bb62',
		location: location,
		radius: 1000,
		extensions: 'all',
		batch: false,
		roadlevel: 0,
		output: 'json'
	}

	const content = qs.stringify(data)

	const options = {
		hostname: 'restapi.amap.com',
		port: 80,
		path: '/v3/geocode/regeo?' + content,
		method: 'GET'
	}

	let result = '';

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
                logger.info('响应结束')
                var jsonObj = JSON.parse(result)
                // logger.info('BODY: ' + jsonObj.regeocode.addressComponent.province)
                console.log("address:" + result)
                resolve(jsonObj.regeocode.addressComponent.adcode);
            })
        });
        req.end();
    }).catch((err) => console.log(err))

    return  promise;
}
exports.locationService = locationService;