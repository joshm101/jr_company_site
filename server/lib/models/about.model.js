var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AboutSchema = new Schema({
  header: String,
  description: String,
  image: String,
  imageId: String
});

module.exports = mongoose.model('About', AboutSchema);
