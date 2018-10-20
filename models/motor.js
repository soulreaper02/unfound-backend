const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MotorSchema = new Schema({
        fileName        : String,
        filePath        : String,
        vehicalID       : String,
        vehicalType     : String,
        frame           : String,
        powertrain      : String,
        wheelCount      : String,
        wheels          : [],
        uploadTime      : String        
});
const Motor = mongoose.model('motorDetails', MotorSchema);
module.exports = Motor;