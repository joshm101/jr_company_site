var express = require('express');
var router = express.Router();
var multer = require('multer');

// middleware for all api requests
router.use(function(req, res, next) {
  console.log("Something is happening on API");
  next();
});

module.exports = router;
