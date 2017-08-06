

var User = require("../models/user.js");
/**
 * 插入
 */
async function insert() {

    var user = new User({
        username : 'Tracytrtr McGrady',                 //用户账号
        userpwd: 'abcd',                            //密码
        userage: 37,                                //年龄
        logindate : new Date()                      //最近登录时间
    });

    await user.save();
}

var p=new Promise(function (resolve,reject) {
    resolve(insert())
})

module.exports=p;


