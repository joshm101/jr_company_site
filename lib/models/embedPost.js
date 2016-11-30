var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmbedPostSchema = new Schema({
  title: String,
  description: String,
  embedContent: [String],
  created: { type: Date, default: Date.now },
  edited: Date
});

module.exports = mongoose.model('EmbedPost', EmbedPostSchema);