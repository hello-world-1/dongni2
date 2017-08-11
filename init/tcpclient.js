var net = require('net');
// var client = net.connect({host:'115.28.242.3',port: 6070},function() {
//     console.log('连接到服务器！');
// });
// var client = net.connect(6070,'115.28.242.3',function() {
//     console.log('连接到服务器！');
// });
var client = net.connect(6070,function() {
    console.log('连接到服务器！');
});
client.on('data',function(data) {
    const recieveMsg=data.toString();
    console.log(recieveMsg);
    var params=data.toString().split(",");

    switch (params[0])
    {
        case "IWBP11":
        case "IWBP12":
        case "IWBP13":
        case "IWBP14":
        case "IWBP15":
        case "IWBP16":
        case "IWBP17":
        case "IWBP18":
        case "IWBP19":
        case "IWBP20":
        case "IWBP21":
        case "IWBP22":
        case "IWBP23":
        case "IWBP24":
        case "IWBP25":
        case "IWBP26":
        case "IWBP27":
        case "IWBP28":
        case "IWBP29":
        case "IWBP30":
        case "IWBP31":
        case "IWBP32":
        case "IWBP33":
        case "IWBP34":
        case "IWBP35":
        case "IWBP36":
        case "IWBP37":
        case "IWBP38":
        case "IWBP40":
        case "IWBP41":
        case "IWBP43":
        case "IWBP61":
        case "IWBP62":
        case "IWBP63":
        case "IWBP64":
            client.write(Buffer.from(data.toString(),"utf8"));
            //client.write(Buffer.from(`${params[0]},${params[2]},${params[3]}}`,"utf8"));
            break;
        default:
            break;
    }

    //client.end();
});


const IWAP00="IWAP00,358511020048751,ggg,zh_CN#";
const IWAP01="IWAP01,170803,V-0.0000N-0.0000E,000.0,113235,000.00,05000006900102,460,1,4295,53753,0050004d004f0053|f4:83:cd:a6:58:89|-51&0053004f004e00490043004f004d|48:7a:da:22:5d:a3|-60&004e|48:7a:da:22:5d:a2|-60&004e00450054002d0076006f00690070|e8:fc:af:a4:6b:0e|-61&004e00450054002d0076006f00690070002d00740065007300740030|ea:fc:af:a4:6b:0f|-70&0077006900660069002d0031003900340039|b0:d5:9d:4a:f9:c9|-77,460|1|4295|53753|-72,460|1|4295|61226|-69,460|1|4295|59393|-70,460|1|4295|28682|-71,460|1|4295|25302|-69,460|1|4295|53751|-79#"
const IWAP02="IWAP02,zh_cn,0,7,460,0,9520|3671|13,9520|3672|12,9520|3673|11,9520|3674|10,9520|3675|9,9520|3676|8,9520|3677|7#"
const IWAP03="IWAP03,06000908000102,5555,30#"
const IWAP04="IWAP04,075#"
const IWAP05="IWAP05,0#"
const IWAP06="IWAP06,460,0,9520,3671#"
const IWAP07=""
const IWAP10="IWAP10,080524,A2232.9806N11404.9355E,000.1,061830,323.87,06000908000502,460,0,9520,3671,00,zh-cn,00,HOME|74-DE-2B-44-88-8C|97&HOME1|74-DE-2B-44-88-8C|97&HOME2|74-DE-2B-44-88-8C|97&HOME3|74-DE-2B-44-88-8C|97,460|0|9520|3671|10,460|0|9520|3672|20#"
const IWAP39="IWAP39#"
const IWAP42=""
const IWAP51="IWAP51,20140818064408,78|98,1#"
const IWAP52="IWAP52,20140818064408,20150818064408,100000,78|100,89|99#"
const IWAP53="IWAP53,20140818064408|20150818064408|13873xxxxxx|I|139xxxxx,20140818064408|20150818064408|13873xxxxxx|O|139xxxxx#"
const IWAP54="IWAP54,20140818064408,60,78|98,70|90#"

client.write(new Buffer(IWAP00))
setInterval(()=>{
    client.write(new Buffer(IWAP03))
},60000)

/*setTimeout(()=>{
    client.write(new Buffer(IWAP01))
},60000)

setTimeout(()=>{
    client.write(new Buffer(IWAP02))
},90000)

setTimeout(()=>{
    client.write(new Buffer(IWAP03))
},120000)

setTimeout(()=>{
    client.write(new Buffer(IWAP04))
},150000)

setTimeout(()=>{
    client.write(new Buffer(IWAP05))
},180000)

setTimeout(()=>{
    client.write(new Buffer(IWAP06))
},210000)

setTimeout(()=>{
    client.write(new Buffer(IWAP10))
},240000)

setTimeout(()=>{
    client.write(new Buffer(IWAP39))
},270000)

setTimeout(()=>{
    client.write(new Buffer(IWAP51))
},30000)

setTimeout(()=>{
    client.write(new Buffer(IWAP52))
},33000)

setTimeout(()=>{
    client.write(new Buffer(IWAP53))
},36000)

setTimeout(()=>{
    client.write(new Buffer(IWAP54))
},39000)*/

