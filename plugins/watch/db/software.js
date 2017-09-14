var mongoose = appRequire('init/mongoose');
var Schema = mongoose.Schema;

var SoftwareSchema = new Schema({

    version:{type: String, default: ""},
    about:{type: String, default: ""}
});

module.exports = mongoose.model('Software',SoftwareSchema);