var express = require('express');
var router = express.Router();
var userPreferencesController = require('../../controllers/user-preferences.controller');

// api/userPreferences

router.route('/')
  .get(userPreferencesController.getUserPreferences)
  .put(userPreferencesController.updateUserPreferences);

module.exports = router;