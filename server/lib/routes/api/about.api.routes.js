var express = require('express');
var router = express.Router();
var aboutController = require('../../controllers/about.controller');

// /api/about

router.route('/upload')
  .post(aboutController.uploadAboutImage);

router.route('/')
  .post(aboutController.createAboutPage)
  .get(aboutController.getAboutPage);

router.route('/:about_id')
  .put(aboutController.updateAboutPage);

module.exports = router;