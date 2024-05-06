const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/create', postController.createPost);
router.get('/all', postController.getAllPosts);

router.get("/feed", postController.getFeed);

router.get('/user/:id', postController.getPostByUser);
router.get("/user", postController.getPostByUserLogged);

router.get('/:id', postController.getPostById);
router.put('/update/image/:id', postController.updatePostImage);
router.put('/update/:id', postController.updatePost);
router.delete('/delete/:id', postController.deletePost);



router.post('/like/:postId', postController.setLikePost);

router.get('/like/:id', postController.getLikePost);

router.post('/user-tag/:id', postController.setUserTag);
router.get('/user-tag/:id', postController.getUserTagByPost);

router.post('/hashtag-tag/:id', postController.setHashtagTag);

module.exports = router;
