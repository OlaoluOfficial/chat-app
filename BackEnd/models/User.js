const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
  online: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
