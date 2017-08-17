const http = require('http');
const url = require('url');
const qs = require('querystring');
const util = require('util');
const log4js = require('log4js');
const logger = log4js.getLogger('system');

const jizhanService=  (location) => {
  const data = {
    oid: '5607',
    key: '2BD1A1439E5F6351F490230767E007BF',
    hex: '10',
    bs: '460,00,9520,3671,13',
    to: '3',
    output: 'json'
  }
  const content = qs.stringify(data)


  let result = ''

  const options = {
    hostname: 'api.gpsspg.com',
    port: 80,
    path: '/bs/?' + content,
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
                logger.info('响应结束')
                var jsonObj = JSON.parse(result)
                logger.info('BODY: ' + jsonObj.regeocode.addressComponent.province)
                resolve('BODY: ' + jsonObj.result[0].address);
            })
        });
        req.end();
  }).catch((err) => console.log(err))
    return  promise;
}

exports.jizhanService = jizhanService