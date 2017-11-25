var express = require('express');
var router = express.Router();
var configController = require('../../controllers/config.controller');

router.route('/')
  .get(configController.getConfig);

module.exports = router;