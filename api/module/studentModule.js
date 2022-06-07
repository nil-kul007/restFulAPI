const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  gender: { type: String, required: true },
  rollNo: { type: Number, required: true },
  contact: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  classNo: { type: Number, required: true },
  pic: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
