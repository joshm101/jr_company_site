var multer = require('multer');
var randomstring = require('randomstring');
var fs = require('fs-extra');
var uuid = require('uuid');
var formidable = require('formidable');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const JRSECRET = process.env.JRSECRET;

var About = require('../models/about.model');

var pathsOfUploadedImages = [];

var storage = multer.diskStorage({
  destination: function(req, file, cb) {

    imagesId = req.body.imagesid;
    console.log("imagesId: ", imagesId);
    if (imagesId !== undefined) {
      cb(null, "./client/static/images/about/" + imagesId);
    } else {
      cb(new Error("The upload handshake failed."));
    }

  },
  filename: function(req, file, cb) {

    // create datetime stamp of format MMDDYYYYhhmmss
    var dateTimeUploaded = new Date().toLocaleString().slice(-24).replace(/\D/g,'').slice(0, 14);

    // generate random string as part of filename
    var randomlyGeneratedString = randomstring.generate(7);

    // regex to be used to find all non alphanumeric sequences (except for period)
    // and replace them with dashes.
    var regex = /[^a-zA-Z0-9.]+/;
    var originalNameNormalized = file.originalname.replace(new RegExp('[^a-zA-Z0-9.]+', 'g'), '-');

    // construct the final filename and call callback
    var constructedFilename = dateTimeUploaded + "-" + randomlyGeneratedString + "-" + originalNameNormalized;
    pathsOfUploadedImages.push('images/about/' + imagesId + "/" + constructedFilename);
    cb(null, constructedFilename);

  }
});

var upload = multer({ storage: storage }).array('fileUpload');

exports.uploadAboutImage = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      res.status(401).send();
    } else {
      upload(req, res, function(err) {
        if (err) {
          console.error(err);
          return res.status(401).end(err.toString());
        }
        var imagesId = req.body.imagesid;
        About.findOne({ 'imageId': imagesId }, function(err, about) {
          if (err) {
            res.send(err);
          } else {
            about.image = pathsOfUploadedImages[0];
            about.save(function(err) {
              if (err) {
                res.status(500).end(err.toString());
              } else {
                pathsOfUploadedImages = [];
                res.json(about);
              }
            });
          }
        });
      });
    }
  });
}

exports.createAboutPage = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      res.status(401).send();
    } else {
      var about = new About(req.body);
      about.imageId = randomstring.generate(12);
      fs.mkdir('./client/static/images/about/' + about.imageId);
      about.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.json( { message: 'about page creation saved.', data: about } );
        }
      });
    }
  });
}

exports.updateAboutPage = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      // unauthorized
      res.status(401).send();
    } else {
      About.findById(req.params.about_id, function (err, about) {
        if (err) {
          res.send(err);
        } else {
          about.header = req.body.header;
          about.description = req.body.description;
          if (req.body.image !== about.image) {
            // image has been replaced/removed, purge about images directory
            fs.remove('./client/static/images/about/' + about.image, function(err) {
              if (err) {
                res.send(err);
              } else {
                about.image = '';
                about.save(function(err) {
                  if (err) {
                    res.send(err);
                  } else {
                    res.json({ data: about });
                  }
                });
              }
            });
          } else {
            about.save(function(err) {
              if (err) {
                res.send(err);
              } else {
                res.json({ data: about });
              }
            });
          }
        }
      });
    }
  });
}

exports.getAboutPage = function(req, res) {
  About.find(function(err, about) {
    if (err) {
      res.send(err);
    } else {
      if (about[0]) {
        res.json(about);
      } else {
        res.json([]);
      }
    }
  })
}

