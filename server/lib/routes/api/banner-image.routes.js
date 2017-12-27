const express = require('express');
const router = express.Router();

const bannerImageController = require('../../controllers/banner-image.controller');

// api/bannerImage

router.route('/upload')
  .post(bannerImageController.uploadBannerImage);

router.route('/')
  .post(bannerImageController.createBannerImage)
  .get(bannerImageController.getBannerImage);

router.route('/:banner_image_id')
  .put(bannerImageController.updateBannerImage);

module.exports = router;