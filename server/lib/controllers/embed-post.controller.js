var multer = require('multer');
var randomstring = require('randomstring');
var fs = require('fs-extra');
var uuid = require('uuid');
var formidable = require('formidable');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const JRSECRET = process.env.JRSECRET;
const path = require('path');

var EmbedPost = require('../models/embed-post.model');

var pathsOfUploadedImages = [];
var imagesId = '';

var storage = multer.diskStorage({
  destination: function(req, file, cb) {

    imagesId = req.body.imagesid;
    if (imagesId !== undefined) {
      cb(null, path.resolve(__dirname, "../images/posts/" + imagesId));
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
    pathsOfUploadedImages.push('images/posts/' + imagesId + "/" + constructedFilename);
    cb(null, constructedFilename);

  }
});

var upload = multer({ storage: storage }).array('fileUpload');

exports.upload = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      res.status(401).send();
    } else {
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
    }
  });
}

exports.createPost = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      // unauthorized
      res.status(401).send();
    } else {
      // create new embedPost object
      var embedPost = new EmbedPost(req.body);
      embedPost.edited = embedPost.created;
      embedPost.imagesId = randomstring.generate(12);
      fs.mkdir(path.resolve(__dirname, '../images/posts/' + embedPost.imagesId), function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
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
        }
      });
    }
  });
}

exports.getPosts = function(req, res) {
  let sortCreated = parseInt(req.query.created) || -1;
  let limit = parseInt(req.query.limit) || 6;
  let requestedPage = parseInt(req.query.page) || 1;
  let pageBeforeRequested = requestedPage - 1;
  let pageAfterRequested = requestedPage + 1;
  let contentType = req.query.content_type != undefined ? parseInt(req.query.content_type) : undefined;

  const requestedPageQuery = constructPagedQuery({
    sortCreated, 
    limit, 
    page: requestedPage, 
    contentType
  });
  const pageBeforeRequestedQuery = constructPagedQuery({
    sortCreated, 
    limit, 
    page: pageBeforeRequested, 
    contentType
  });
  const pageAfterRequestedQuery = constructPagedQuery({
    sortCreated, 
    limit, 
    page: pageAfterRequested, 
    contentType
  });
  requestedPageQuery.exec()
    .then(posts => {
      return [posts]
    })
    .then(result => {
      if (pageBeforeRequested === 0) {
        result.push([]);
        return result;
      }
      return pageBeforeRequestedQuery.exec()
        .then(previousPagePosts => {
          result.push(previousPagePosts)
          return result;
        });
    })
    .then(result => {
      return pageAfterRequestedQuery.exec()
        .then(afterPagePosts => {
          result.push(afterPagePosts);
          return result;
        })
    })
    .then(result => {
      let requestedPagePosts = result[0];
      let previousPagePosts = result[1];
      let afterPagePosts = result[2];
      res.json({
        hasPreviousPage: previousPagePosts.length > 0,
        data: requestedPagePosts,
        hasNextPage: afterPagePosts.length > 0,
      });
    })
    .then(undefined, function(err) {
      console.log(err);
      res.status(500).send(err);
    });
}

constructPagedQuery = (options) => {
  console.log("options: ", options);
  const {
    page,
    limit,
    contentType,
    sortCreated
  } = options;
  const offset = (page - 1) * limit || 0;
  console.log("offset: ", offset);
  findOptions = Object.assign(
    {},
    contentType != undefined ? { contentType } : null
  );
  return EmbedPost.find(
    findOptions
  ).sort(
    {
      created: sortCreated
    }
  ).skip(
    offset || 0
  ).limit(
    limit
  );
}

exports.getPostById = function(req, res) {
  EmbedPost.findById(req.params.post_id, function (err, post) {
    if (err) {
      res.status(404).send();
    } else {
      res.json({data: post});
    }
  });
}

exports.updatePost = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      // unauthorized
      res.status(401).send();
    } else {
      EmbedPost.findById(req.params.post_id, function (err, post) {
        if (err) {
          res.send(err);
        } else {
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
              fs.unlink(path.resolve(__dirname, '../' + image), function(err) {
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
              res.json( { data: post } );
            }
          })
        }
      });
    }
  });
}

exports.deletePost = function(req, res) {
  var token = req.headers.authorization;
  jwt.verify(token, JRSECRET, function(err, decoded) {
    if (err) {
      // unauthorized
      res.status(401).send();
    } else {
      EmbedPost.findById(req.params.post_id, function (err, post) {
        if (err) {
          console.error(err);
          res.end(404);
        } else {
          fs.remove(path.resolve(__dirname, '../images/posts/' + post.imagesId), function(err) {
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
    }
  });
}

// const cleanEmptyObjectProperties = (obj) => {
//   Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
// }