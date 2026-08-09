const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/CatchAsync')
const { isLoggedIn } = require('../middleware')
const notificationController = require('../controllers/notification-controller')

router.get('/', isLoggedIn, catchAsync(notificationController.getNotifications))
router.patch('/:id/read', isLoggedIn, catchAsync(notificationController.markAsRead))
router.patch('/read-all', isLoggedIn, catchAsync(notificationController.markAllAsRead))

module.exports = router
