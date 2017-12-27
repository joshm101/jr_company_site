var express = require('express');
var router = express.Router();
var contactInfoController = require('../../controllers/contact-info.controller');

router.route('/')
  .post(contactInfoController.createContactInfo)
  .get(contactInfoController.getContactInfo);

router.route('/:contact_info_id')
  .put(contactInfoController.updateContactInfo);

module.exports = router;
