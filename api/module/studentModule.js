const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    gender: String,
    rollNo:Number,
    contact: Number,
    email:String,
    address: String,
    classNo: Number
})

module.exports = mongoose.model('Student', studentSchema);