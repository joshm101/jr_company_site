var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPreferencesSchema = new Schema({
  userId: String,
  itemsPerPage: Number
});

module.exports = mongoose.model(
  'UserPreferences', 
  UserPreferencesSchema
);