/**
 * Created by root on 8/5/17.
 */
/**
 * 用户信息
 */
const mongoose = appRequire('init/mongoose');
    Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const Child = require('./child');

let UserSchema = new Schema({

    telephone: {type: String, required: true, index: {unique: true}},   //用户手机号
    password: {type: String, required: true},                           //用户密码
    token: {type: String},                                              //用户登录使用的token
    age: {type: String, default: ""},                                   //用户年龄
    sex: {type: String, default: "male"},                               //用户性别
    character: {type:String, default: ""},                              //用户性格特点
    avatar: {type: String, default: ""},                                //用户头像
    relationship: {type: String, default: "father"},                    //用户与孩子关系
    childrenTelephone: {type:String,default: ""},                       //孩子手机号
    device_token: {type:String},                                        //消息推送手机id
    childID: {type: Schema.Types.ObjectId, ref: 'Child'},               //孩子id
    meta: {
        createAt: {type: Date, default: Date.now()},
        updateAT: {type: Date, default: Date.now()}
    },
    pushID:{type:String,default: ""}
});

//更新登录时间，密码改动后hash新密码
UserSchema.pre('save',function (next) {
    let user = this;

    if (this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now();
    }
    else {
        this.meta.updateAT = Date.now();
    }

    //only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
       if (err) return next(err);

       //hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            //override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//实例方法
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) return next(err);

            cb(null, isMatch);
        })
    }
};

module.exports = mongoose.model('User',UserSchema);