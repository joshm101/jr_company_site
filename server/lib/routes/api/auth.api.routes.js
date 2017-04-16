var express = require('express');
var router = express.Router();
var authController = require('../../controllers/auth.controller');

// api/auth

router.route('/login')
  .post(authController.login);

router.route('/tokenvalid')
  .post(authController.checkTokenValidity);

router.route('/changepassword/:uid')
  .post(authController.changePassword);
module.exports = router;