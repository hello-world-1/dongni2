/**
 * 管理员信息
 */
const mongoose = appRequire('init/mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const AdminSchema = new Schema({

	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	}, //管理员用户名
	password: {
		type: String,
		required: true
	}, //管理员用户密码
	token: {
		type: String
	}, //管理员用户登录使用的token
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});


AdminSchema.pre('save', function(next) {
    var user = this

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    	if (err) return next(err)

    	bcrypt.hash(user.password, salt, function(err, hash) {
    		if (err) return next(err)

    		user.password = hash
    		next()
    	})
    })
})

AdminSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
        	if (err) return cb(err)

        	cb(null, isMatch)
        })
    }
}




AdminSchema.statics = {
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
            .sort('meta.updateAt')
            .exec(cb)
    }
}

module.exports = mongoose.model('Admin', AdminSchema);
