const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/create', postController.createPost);
router.get('/all', postController.getAllPosts);
router.get('/feed', postController.getFeedPosts);
router.post('/hashtags', postController.getPostByHashtags);

router.get('/user/:id', postController.getPostByUser);
router.get('/:id', postController.getPostById);
router.put('/update/image/:id', postController.updatePostImage);
router.put('/update/:id', postController.updatePost);
router.delete('/delete/:id', postController.deletePost);



router.post('/like/:id', postController.setLikePost);
router.get('/like/:id', postController.getLikePost);

router.post('/user-tag/:id', postController.setUserTag);
router.get('/user-tag/:id', postController.getUserTagByPost);

router.post('/hashtag-tag/:id', postController.setHashtagTag);
router.get('/hashtag-tag/:id', postController.getHashtagTagByPost);

module.exports = router;
