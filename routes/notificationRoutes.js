const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/create', notificationController.createNotification);
router.get('/getAll', notificationController.getAllNotification);
router.get('/getUser/:id', notificationController.getNotificationByUser);
router.get('/:id', notificationController.getNotificationById);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);
router.put('/read/:id', notificationController.readNotification);

module.exports = router;
