const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BannerImage = new Schema({
  image: String,
  imageId: String
});

module.exports = mongoose.model('BannerImage', BannerImage);