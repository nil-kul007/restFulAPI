const mongoose = require("mongoose");

const clientsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  clientName: { type: String, required: true },
  client_TIN: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, require: true}
});

module.exports = mongoose.model("Clients", clientsSchema);
