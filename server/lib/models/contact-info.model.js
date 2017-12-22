var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactInfo = new Schema({
  alias: String,
  email: String,
  facebookUrl: String,
  instagramUrl: String,
  soundcloudUrl: String,
  twitterUrl: String,
  youtubeUrl: String,
});

module.exports = mongoose.model('ContactInfo', ContactInfo);
