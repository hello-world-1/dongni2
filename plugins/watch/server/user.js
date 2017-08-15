/**
 * Created by root on 8/4/17.
 */
const log4js = require('log4js');
const logger = log4js.getLogger('donni');
const config = appRequire('services/config').all();
const uuid = require('node-uuid');
const fs = require('fs');
const path = require('path');

const User = appRequire('plugins/watch/db/user');
const Child = appRequire('plugins/watch/db/child');

//获取用户信息
exports.detail = (req, res) => {

    user = req.body.user;

    if (!user) {
        return res.json({status: 'error', 'errcode': 3});   //用户为空
    }

    User.findOne({_id: user._id}).populate('childID').exec(function (err, user) {
        if (err) {
            return res.json({status: 'error', 'errcode': 3});   //数据库查询出错
        }
        let _user = {
            avatar: user.avatar,
            nickname: user.childID.nickname,
            relationship: user.relationship,
            childrenTelephone: user.childrenTelephone,
            birthday: user.childID.birthday
        };
        console.log("user.detail:");
        console.log(_user);
        res.json({status: 'success', user:_user});
    });

    // res.send('This is not implemented now');
};

//用户信息设置
exports.modify = (req, res) => {

    user = req.body.user;

    nickname = req.body.nickname;
    relationship = req.body.relationship;
    childrenTelephone = req.body.childrenTelephone;
    birthday = req.body.birthday;

    if (!nickname || !relationship || !childrenTelephone || !birthday) {
        return res.json({stauts: 'error', 'errcode': 3});   //有空值
    }

    //用户第一次设置
    if (!user.childID) {
        let _child = new Child({
            nickname: nickname,
            birthday: birthday,
            parentID: user._id
        });
        _child.save(function (err,child) {
            if (err) {
                return res.json({stauts: 'error', 'errcode': 4});   //数据库保存出错
            }
            user.childID = child._id;
            user.relationship = relationship;
            user.childrenTelephone = childrenTelephone;
            console.log("use.modify(new):");
            console.log(user);
            user.save(function (err) {
                if (err) {
                    return res.json({stauts: 'error', 'errcode': 5});   //数据库保存出错
                }
                res.json({statuts: 'success'});
            })
        })
    }
    //用户更新数据
    else {
        Child.update({_id: user.childID}, {$set: {nickname: nickname, birthday: birthday,}},function (err, child) {
            if (err) {
                return res.json({status: 'error', 'errcode': 6});   //数据库更新出错
            }
            user.relationship = relationship;
            user.childrenTelephone = childrenTelephone;
            console.log("user.modify(update):");
            console.log(child);
            console.log(user);
            user.save(function (err) {
                if (err) {
                    return res.json({stauts: 'error', 'errcode': 7});   //数据库保存出错
                }
                res.json({statuts: 'success'});
            })
        })
    }
};

//修改用户头像
exports.changeAvatar = (req, res) => {

    user = req.body.user;

    let filestr = uuid.v1();
    console.log("Received file:\n" + JSON.stringify(req.files));
    let fileext = req.files.file.name.split('.');
    let fileExt = fileext[fileext.length-1];
    let filename = filestr+"."+fileExt;
    let location = path.join(__dirname,'../public')+"/images/avatars/"+filename;
    let readStream = fs.createReadStream(req.files.file.path)
    let writeStream = fs.createWriteStream(location);
    let newavatar = "/images/avatars/"+filename;
    readStream.pipe(writeStream);
    readStream.on('end',function(err){
        if(err){
            res.json({status:'error','errcode':2});
        } else {
            fs.unlinkSync(req.files.file.path);
            User.update({_id: user._id},{avatar:newavatar},function(err,numberAffected, rawResponse) {
                if (err) {
                    return res.json({status:'error', 'errcode': 3});
                }else {
                    res.json({status: 'success', user: {'userID': user._id, 'avatar': newavatar}});}
            });
        }
    })
};

exports.childrenDetails = (req, res) => {
    res.send('This is not implemented now');
};

exports.allDetails = (req, res) => {
    res.send('This is not implemented now');
};
