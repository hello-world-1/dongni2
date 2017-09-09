/**
 * 书籍信息
 */
const mongoose = appRequire('init/mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({

    teacherID: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }, //老师id
    title: {
        type: String,
        default: ""
    }, //书名
    author: {
        type: String,
        default: ""
    }, //作者
    avatar: {
        type: String,
        default: ""
    }, //头像
    publishHouse: {
        type: String,
        default: ""
    }, //出版社
    introduction: {
        type: String,
        default: ""
    }, //内容简介
    purchaseLink: {
        type: String,
        deault: ""
    }, //购买链接
    createAt: {
        type: Date,
        default: Date.now()
    } //添加书籍的时间
});

BookSchema.pre('save', function (next) {
    // 如果是第一次添加该课程
    // 如何判断this.isNew为true,应该是根据隐藏字段_id判断
    if (this.isNew) {
        this.createAt = Date.now();
    }

    next();
});

BookSchema.statics = {
    findByTeacherId: function (id, cb) {
        return this
            .find({
                teacherID: id
            })
            .sort('createAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb);
    },
    fetch: function (cb) {
        return this
            .find({})
            .sort('createAt')
            .exec(cb);
    }
};

module.exports = mongoose.model('Book', BookSchema);