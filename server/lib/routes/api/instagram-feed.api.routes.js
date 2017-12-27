var express = require('express');
var router = express.Router();
var instagramFeedController = require('../../controllers/instagram-feed.controller');

router.route('/request_access_token')
  .post(instagramFeedController.requestAccessToken);

router.route('/')
  .get(instagramFeedController.getLatestImages);

module.exports = router;