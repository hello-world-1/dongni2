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

    telephone: {type: String,unique:false},                          //用户手机号
    password: {type: String},                                           //用户密码
    username:{type: String, default: ""},                               //用户名
    token: {type: String},                                              //用户登录使用的token
    age: {type: Number, min: 0},                                        //用户年龄
    sex: {type: String, default: "male"},                               //用户性别
    character: {type:String, default: ""},                              //用户性格特点
    avatar: {type: String, default: ""},                                //用户头像
    profession:{type:String,default: ""},                               //职业
    pushID:{type:String},                                               //推送ID
    presentChildId:{type: Schema.Types.ObjectId, ref: 'Child'},         //用户切换到的当前的孩子的ID
    childId:{type: Schema.Types.ObjectId, ref: 'Child'},                //孩子的ID
    IMEI: {type: String},                                               //手表IMEI号
    nickname: {type: String},                                           //孩子昵称
    childPhone: {type: String},                                         //孩子手机号
    relation:{type: String},                                            //家长与孩子的关系
    meta: {
        createAt: {type: Date, default: Date.now()},
        updateAT: {type: Date, default: Date.now()}
    }
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
    if(!this.password || this.IMEI){
        return next();
    }else {

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
    }
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