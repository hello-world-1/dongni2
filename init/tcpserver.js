const iconv=require('iconv-lite');
//const MongoClient = require('mongodb').MongoClient;



// // Connection URL
// var url = 'mongodb://localhost:27017/appwatch';
// // Use connect method to connect to the Server
// var db =  MongoClient.connect(url).then(function (db) {
//     if(db)
//     {
//        var col = db.collection('admin');
//         // Insert a bunch of documents
//         col.insert([{a:1, b:1}
//             , {a:2, b:2}, {a:3, b:3}
//             , {a:4, b:4}], {w:1}, function(err, result) {})
//     }
// },function (err) {
//
// });
require('date-utils')
var st = "20140818064408";
var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
var date = new Date(st.replace(pattern,'$1-$2-$3 $4:$5:$6'));
var time = date.getTime()/1000;//转换成秒；
console.log(time);
const sj=(new Date(time*1000)).toFormat("YYYYMMDDHHMISS");
console.log(sj);


// const xrt=(new Date()).toFormat("YYYYMMDDHHMISS");
// console.log(xrt)
//
// const loc='深圳市南山区南海大道1079号';
// const location=iconv.encode(loc,'UTF16-BE').toString('hex')
// console.log(location);




// const JINBuffer = Buffer.from("0000#","hex");
// console.log(JINBuffer)
// const jj=JINBuffer.toString();
// console.log(jj);
// const message="tttt";
// password="xxx";
// const crypto = require('crypto');
//
// const timeBuffer = Buffer.from('0' + now.toString(16), 'hex');
// const dataBuffer = Buffer.from(message);
// const length = dataBuffer.length + 4 + 6;
// const lengthBuffer = Buffer.from(('0000' + length.toString(16)).substr(-4), 'hex');
// const code = crypto.createHash('md5').update(now + message + password).digest('hex').substr(0, 8);
// const codeBuffer = Buffer.from(code, 'hex');console.log(timeBuffer)
// console.log(codeBuffer)

// var net = require('net');
// function receiveCommand (data){
//     try {
//         const message = data.toString()
//         console.log(message);
//
//     } catch(err) {
//         throw err;
//     }
// };
// var server = net.createServer(function(connection) {
//     console.log('client connected');
//     const receive = {
//         data: new Buffer(''),
//         socket: connection,
//         pos:0
//     };
//     connection.on('data',function (da) {
//         receive.data=Buffer.concat([receive.data,da])
//         var buffer = receive.data;
//         var endpos=buffer.indexOf("#",receive.pos,"utf8")
//         var data;
//         if(endpos==-1)
//         {
//             return;
//         }
//         else if(endpos!=-1)
//         {
//             var start=receive.pos;
//             data = buffer.slice(start,endpos);
//             receive.pos=endpos+1;
//             receiveCommand(data)
//         }
//     })
//     connection.on('end', function() {
//         console.log('client connection closed');
//     });
//
//     const phone="1390001|1380002";
//     var sos="1370001|1360002";
//     var time="20170803113233"
//     var rep="IWBP00,"+time+",8,zh_CN, Asia/chongqing,"+phone+","+sos+"#";
//     connection.write(rep);
//     connection.pipe(connection);
// });
// server.listen(6070, function() {
//     console.log('server is listening');
// });




