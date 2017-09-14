var mongoose = appRequire('init/mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');

var ContactSchema = new Schema({

    parentID: {type: Schema.Types.ObjectId, ref: 'User'},       //家长id,根据家长id能查出孩子id
    contactName: {type: String},
    contactPhone: {type: String},
    meta: {
        createAt: {type: Date, default: Date.now()},
        updateAT: {type: Date, default: Date.now()}
    }
});

ContactSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now();
    }
    else {
        this.meta.updateAT = Date.now();
    }
});

module.exports = mongoose.model('Contact',ContactSchema);