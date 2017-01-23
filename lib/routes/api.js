var express = require('express');
var router = express.Router();
var multer = require('multer');
var randomstring = require('randomstring');
const fs = require('fs');
var uuid = require('uuid');
var formidable = require('formidable');

var EmbedPost = require('../models/embedPost');

var dir = "./api";

var app = require('../../app.js');

var imagesId = '';

var pathsOfUploadedImages = [];

var storage = multer.diskStorage({
  destination: function(req, file, cb) {

    imagesId = req.body.imagesid;
    console.log("imagesId: ", imagesId);
    if (imagesId !== undefined) {
      cb(null, "./src/static/" + imagesId);
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
    pathsOfUploadedImages.push(imagesId + "/" + constructedFilename);
    cb(null, constructedFilename);

  }
});

var upload = multer({ storage: storage }).array('fileUpload');

// middleware for all api requests
router.use(function(req, res, next) {
  console.log("Something is happening on API");
  next();
});


/* GET API */
router.get('/', function(req, res, next) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/upload')

  .post(function(req, res) {
    upload(req, res, function(err) {
      imagesId = req.body.imagesid;
      if (err) {
        console.error(err);
        return res.status(401).end(err.toString());
      }

      // get recently created post by finding it with
      // the generated image id at post creation. This
      // id is apart of the multi part form
      // that handles uploading the images.
      EmbedPost.findOne({ 'imagesId': imagesId }, function(err, post) {
        if (err) {
          console.error(err);
          res.status(404).end(err.toString());
        } else {
          // array concatenation to handle
          // the cases where no images existed
          // for the post as well as when images
          // previously existed for the post (post edits).
          post.images = post.images.concat(pathsOfUploadedImages);
          post.save(function(err) {
            if (err) {
              res.status(500).end(err.toString());
            } else {
              pathsOfUploadedImages = [];
              res.json(post);
            }
          });
        }
      });
    });
  });

/* POST embedPost */
router.route('/embedPosts')

  .post(function(req, res) {

    // create new embedPost object
    var embedPost = new EmbedPost(req.body);
    embedPost.edited = embedPost.created;
    embedPost.imagesId = randomstring.generate(12);
    fs.mkdir('./src/static/' + embedPost.imagesId);
    // save the newly created
    // embedPost object to the DB
    embedPost.save(function(err) {
      if (err) {
        // handle any possible errors
        // that may have occurred during
        // the DB save. Send back response.
        res.send(err);
      } else {
        // successful save to DB, send response.
        res.json( { message: 'embedPost created!', data: embedPost} );
      }
    });
  })

  .get(function(req, res) {
    EmbedPost.find(function(err, posts) {
      if (err) {
        res.send(err);
      } else {
        res.json(posts);
      }
    });
  });

router.route('/embedPosts/:post_id')

  // GET by ID
  .get(function(req, res) {
    EmbedPost.findById(req.params.post_id, function (err, post) {
      if (err) {
        res.send(err);
      } else {
        res.json(post);
      }
    });
  })

  // update (PUT) by ID
  .put(function(req, res) {
    EmbedPost.findById(req.params.post_id, function (err, post) {
      if (err) {
        res.send(err);
      } else {
        console.log("req.body: ", req.body);
        console.log(req.body.title);
        post.title = req.body.title;
        post.description = req.body.description;
        post.embedContent = req.body.embedContent;
        post.edited = Date.now();
        post.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            console.log(post);
            res.json(post);
          }
        })
      }
    });
  })

  // DELETE by ID
  .delete(function(req, res) {
    EmbedPost.remove({
      _id: req.params.post_id
    }, function(err, post) {
      if (err) {
        // handle any possible errors
        // that may have occurred during
        // the deletion from DB. Send back response.
        res.send(err);
      } else {
        // successful deletion from DB. Send back response.
        res.json( {message: "Successfully removed post!"} );
      }
    })
  });

module.exports = router;
