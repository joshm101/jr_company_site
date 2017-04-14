var express = require('express');
var router = express.Router();
var embedPostController = require('../../controllers/embed-post.controller');

// api/embedPosts

router.route('/upload')
  .post(embedPostController.upload);

router.route('/')
  .post(embedPostController.createPost)
  .get(embedPostController.getPosts);

router.route('/:post_id')
  .get(embedPostController.getPostById)
  .put(embedPostController.updatePost)
  .delete(embedPostController.deletePost);

module.exports = router;