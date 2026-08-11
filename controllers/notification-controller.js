const Notification = require('../model/notification')
const User = require('../model/user')
const webpush = require('../utils/webPush')

module.exports.getNotifications = async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(15)
        .populate({ path: 'sender', select: 'username profilePic' })
        .populate({ path: 'entry', select: 'title' })
        .populate({ path: 'comment', select: 'text' })

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        read: false
    })

    res.json({ notifications, unreadCount })
}

module.exports.markAsRead = async (req, res) => {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
        return res.status(404).json({ message: 'Notification not found!' })
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to do that' })
    }

    notification.read = true
    await notification.save()

    res.json({ message: 'Notification marked as read!', notification })
}

module.exports.markAllAsRead = async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, read: false },
        { read: true }
    )

    res.json({ message: 'All notifications marked as read!' })
}


module.exports.subscribeToPush = async (req , res) =>{
    const {subscription} = req.body

    if(!subscription){
        return res.status(400).json({message : 'push notification is required'})
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {pushSubscription : subscription}, 
       {new :true} 
    )


    res.status(201).json({message : 'Push notification enabled successfully'})
}


module.exports.getPushNotificationStatus = async (req , res) =>{
    const user = await User.findById(req.user._id).select('pushSubscription')

    res.json({enabled : !!user?.pushSubscription})
}