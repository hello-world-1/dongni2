/**
 * 课程信息
 */
var mongoose = appRequire('init/mongoose')
var Schema = mongoose.Schema;
var Teacher = require('./teacher');

var LessonSchema = new Schema({

    teacherID: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }, //老师id
    description: {
        type: String,
        default: ""
    }, //课程描述
    teacherName: {
        type: String,
        default: ""
    }, //开课老师
    startDate: {
        type: Date,
        default: null
    }, //课程开始日期
    endDate: {
        type: Date,
        default: null
    }, //课程结束日期
    classTime: {
        type: String,
        default: ""
    }, //上课时间
    enrolldeadline: {
        type: Date,
        default: null
    }, //报名截止日期
    studentsLimit: {
        type: Number,
        min: 0,
        default: 0
    }, //限制人数
    classHours: {
        type: String,
        default: ""
    }, //课程周期
    telephone: {
        type: String,
        default: ""
    }, //联系方式
    price: {
        type: Number,
        min: 0,
        default: 0
    }, //课程价格
    enrollNum: {
        type: Number,
        min: 0,
        default: 0
    }, //已报名人数
    state: {
        type: String,
        default: "1"
    }, //课程状态： 1：未开始，2：正在进行中，3：课程已结束
    createAt: {
        type: Date,
        default: Date.now()
    } //添加课程的时间
});

LessonSchema.pre('save', function(next) {
    if (this.isNew) {
        this.createAt = Date.now()
    }

    next()
})

LessonSchema.statics = {
    findByTeacherId: function(id, cb) {
        return this
            .find({
                teacherID: id
            })
            .sort('createAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb)
    },
    fetch: function(cb) {
        return this
            .find({})
            .sort('createAt')
            .exec(cb)
    }
}

module.exports = mongoose.model('Lesson', LessonSchema);