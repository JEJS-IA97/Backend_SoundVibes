const express = require('express');
const router = express.Router();
const hashtagController = require('../controllers/hashtagController');

router.post('/create', hashtagController.createHashtag);
router.get('/getAll', hashtagController.getAllHashtags);
router.get('/getByName/:name', hashtagController.getHashtagByName);
router.get('/getById/:id', hashtagController.getHashtagById);
router.get('/search/:search', hashtagController.searchHashtag);
router.put('/:id', hashtagController.updateHashtag);
router.delete('/:id', hashtagController.deleteHashtag);

module.exports = router;
