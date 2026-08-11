const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/CatchAsync')
const { isLoggedIn } = require('../middleware')
const notificationController = require('../controllers/notification-controller')

router.get('/', isLoggedIn, catchAsync(notificationController.getNotifications))
router.patch('/:id/read', isLoggedIn, catchAsync(notificationController.markAsRead))
router.patch('/read-all', isLoggedIn, catchAsync(notificationController.markAllAsRead))

router.post('/subscribe' , isLoggedIn, catchAsync(notificationController.subscribeToPush))

router.get('/status',
     isLoggedIn, 
    notificationController.getPushNotificationStatus
)


// router.post(
//     '/test-push',
//     isLoggedIn,
//     catchAsync(notificationController.sendTestPush)
// )


module.exports = router
