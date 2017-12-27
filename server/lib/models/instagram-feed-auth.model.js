const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const InstagramFeedAuthSchema = new Schema({
  access_token: String,
  user: {
    id: String,
    username: String,
    full_name: String,
    profile_picture: String
  }
});

module.exports = mongoose.model('InstagramFeedAuth', InstagramFeedAuthSchema);