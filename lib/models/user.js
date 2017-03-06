var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
