const router = require('express').Router();
const commentController = require('../controllers/commentController');

router.post('/create', commentController.createComment);
router.get('/getAll', commentController.getAllComments);
router.get('/getPost/:postId', commentController.getCommentsByPost);
router.get('/:id', commentController.getCommentById);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;