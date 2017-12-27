var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_REDIRECT_URI= process.env.INSTAGRAM_REDIRECT_URI;

var ConfigSchema = new Schema({
  instagram: {
    clientId: { 
      type: String, 
      default: INSTAGRAM_CLIENT_ID  
    },
    redirectUri: {
      type: String,
      default: INSTAGRAM_REDIRECT_URI
    }
  },
  itemsPerPage: {
    latestContent: {type: Number, default: 6},
    contentPages: {type: Number, default: 6}
  }
});

module.exports = mongoose.model('Config', ConfigSchema);