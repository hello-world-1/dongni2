var net = require('net');
function receiveCommand (data){
    try {
        const message = data.toString()
        console.log(message);

    } catch(err) {
        throw err;
    }
};
var server = net.createServer(function(connection) {
    console.log('client connected');
    const receive = {
        data: new Buffer(''),
        socket: connection,
        pos:0
    };
    connection.on('data',function (da) {
        receive.data=Buffer.concat([receive.data,da])
        var buffer = receive.data;
        var endpos=buffer.indexOf("#",receive.pos,"utf8")
        var data;
        if(endpos==-1)
        {
            return;
        }
        else if(endpos!=-1)
        {
            var start=receive.pos;
            data = buffer.slice(start,endpos);
            receive.pos=endpos+1;
            receiveCommand(data)
        }
    })
    connection.on('end', function() {
        console.log('client connection closed');
    });

    var phone="1390001|1380002";
    var sos="1370001|1360002";
    var time="20170803113233"
    var rep="IWBP00,"+time+",8,zh_CN, Asia/chongqing,"+phone+","+sos+"#";
    connection.write(rep);
    connection.pipe(connection);
});
server.listen(6070, function() {
    console.log('server is listening');
});
