var express = require('express');
var router = express.Router();
var multer = require('multer');
var randomstring = require('randomstring');
var fs = require('fs-extra');
var uuid = require('uuid');
var formidable = require('formidable');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

var EmbedPost = require('../models/embedPost');
var About = require('../models/about');
var User = require('../models/user');

var dir = "./api";

const JRSECRET = process.env.JRSECRET;

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

router.route('/embed-post/upload')

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

router.route('/about/upload')
  .post(function(req, res) {
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
          console.log("pathsOfUploadedImages: ", pathsOfUploadedImages);
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
  });

router.route('/about')
  .post(function(req, res) {
    var about = new About(req.body);
    about.imageId = randomstring.generate(12);
    fs.mkdir('./src/static/' + about.imageId);
    about.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.json( { message: 'about page creation saved.', data: about } );
      }
    })
  })
  .get(function(req, res) {
    console.log("about get");
    About.find(function(err, about) {
      console.log("about find");
      console.log("about: ", about);
      console.log("error: ", err);
      if (err) {
        console.log('err: ', err);
        res.send(err);
      } else {
        if (about[0]) {
          console.log("about: ", about);
          res.json(about);
        } else {
          res.json([]);
        }
      }
    })
  });

router.route('/about/:about_id')
  .put(function(req, res) {
    About.findById(req.params.about_id, function (err, about) {
      if (err) {
        res.send(err);
      } else {
        about.header = req.body.header;
        about.description = req.body.description;
        if (req.body.image !== about.image) {
          // image has been replaced/removed, purge about images directory
          fs.remove('./src/static/' + about.image, function(err) {
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
  });

router.route('/login')
  .post(function(req, res) {
    var _res = res;

    // retrieve credentials passed
    // in request body
    var credentials = req.body;
    console.log("credentials is: ", credentials);
    if (credentials !== null) {
      if ((credentials.username && credentials.username !== '') &&
        (credentials.password && credentials.password !== '')) {
        // attempt the login only if credntials are actually provided.
        User.findOne({username: credentials.username}, function(err, user) {
          if (err || user === null) {
            res.status(401).send();
          } else {
            console.log("user: ", user);
            bcrypt.compare(credentials.password, user.password, function(err, res) {
              if (err) {
                // error other than incorrect password
                _res.status(500).send();
              } else {
                if (res) {
                  // res is true, correct password, successful login.
                  // sign a JWT and send as response to client.
                  console.log("success: ", res);
                  _res.json(jwt.sign(
                    {
                      admin: user.admin,
                      iat: Math.floor(Date.now() / 1000) - 30,
                      iss: 'jrsite'
                    }, JRSECRET, { expiresIn: '2h' }
                    )
                  ).send();
                } else {
                  // incorrect password
                  _res.status(401).send();
                }
              }
            });
          }
        });
      } else {
        // no credentials were provided on login attempt.
        res.status(401).send();
      }
    } else {
      res.status(401).send();
    }

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
        console.log("sending: ", posts);
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

        // update the post's fields
        post.title = req.body.title;
        post.description = req.body.description;
        post.embedContent = req.body.embedContent;
        post.thumbnailIndex = req.body.thumbnailIndex;

        // create an object that will function
        // as a hashed lookup. 'Hash' each of the
        // images from the request. Iterate over
        // the post's (DB version) images and
        // any image paths that have not been
        // hashed from the request's images
        // will be images that have been removed/deleted
        // by the user, so they should be deleted from the filesystem.
        var hashObject = {};
        req.body.images.forEach(function(image, index) {
          hashObject[image] = true;
        });
        post.images.forEach(function(image, index) {
          if (!hashObject.hasOwnProperty(image)) {
            fs.unlink('./src/static/' + image, function(err) {
              if (err) {
                console.error(err);
                //res.end(400);
              }
            });
          }
        });

        post.images = req.body.images;
        post.edited = Date.now();
        post.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            console.log(post);
            res.json( { data: post } );
          }
        })
      }
    });
  })

  // DELETE by ID
  .delete(function(req, res) {
    EmbedPost.findById(req.params.post_id, function (err, post) {
      if (err) {
        console.error(err);
        res.end(404);
      } else {
        fs.remove('./src/static/' + post.imagesId, function(err) {
          if (err) {
            console.error(err);
          }
          EmbedPost.remove({
            _id: req.params.post_id
          }, function (err, post) {
            if (err) {

              // handle any possible errors
              // that may have occurred during
              // the deletion from DB. Send back response.
              res.send(err);
            } else {
              // successful deletion from DB. Send back response.
              res.json({message: "Successfully removed post!"});
            }
          })
        })
      }
    });

  });

module.exports = router;
