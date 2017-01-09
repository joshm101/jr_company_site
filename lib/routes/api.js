var express = require('express');
var router = express.Router();

var EmbedPost = require('../models/embedPost');

// middleware for all api requests
router.use(function(req, res, next) {
  console.log("Something is happening on API");
  next();
});


/* GET API */
router.get('/', function(req, res, next) {
  res.json({ message: 'hooray! welcome to our api!' });
});

/* POST embedPost */
router.route('/embedPosts')

  .post(function(req, res) {

    // create new embedPost object
    var embedPost = new EmbedPost(req.body);
    embedPost.edited = embedPost.created;

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
