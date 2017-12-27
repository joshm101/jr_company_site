var express = require('express');
var router = express.Router();
var multer = require('multer');

// middleware for all api requests
router.use(function(req, res, next) {
  next();
});

module.exports = router;
