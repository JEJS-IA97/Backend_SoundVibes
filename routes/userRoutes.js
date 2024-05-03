const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.get('/getAll', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/password', userController.changePassword);
router.post('/favorites', userController.setFavorite);
router.get('/favorites/:userId', userController.getFavoritesByUser);
router.post('/follows', userController.setFollow);
router.get('/followers/:user_id', userController.getFollowersByUser);
router.put('/:id/update/image', userController.updateUserImage);
router.get('/:id/profile', userController.getUserProfileImage);

module.exports = router;