var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create our EmbedPost schema
// which describes how an EmbedPost is
// modeled in our DB.
var EmbedPostSchema = new Schema({
  title: String,
  description: String,
  embedContent: [String],
  created: { type: Date, default: Date.now },
  edited: Date
});

module.exports = mongoose.model('EmbedPost', EmbedPostSchema);
