'use strict'

const router = require('express').Router()

router.use('/user', require('./userRoutes'))
router.use('/comment', require('./commentRoutes'))
module.exports = router