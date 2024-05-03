const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.get('/getAll', userController.getAllUsers);

module.exports = router;