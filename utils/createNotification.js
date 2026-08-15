const Notification = require('../model/notification')
const User = require('../model/user')
const webpush = require('./webPush')

module.exports = async function createNotification({
    recipient,
    sender,
    type,
    entry = null,
    comment = null,
    title,
    body
}) {
    // Don't notify yourself
    if (recipient.toString() === sender.toString()) {
        return null
    }

    // 1. Save notification in MongoDB
    const notification = await Notification.create({
        recipient,
        sender,
        type,
        entry,
        comment
    })

    // 2. Find recipient's push subscription
    const user = await User.findById(recipient).select('pushSubscription')
    // console.log('receipient' , recipient)
    // console.log('push sub' , user?.pushSubcription)
    // console.log('user' , user)

    // 3. If they don't have push notifications enabled,
    //    the in-app notification still exists.
    if (!user?.pushSubscription) {
        return notification
    }

    // 4. Send browser push notification
   const payload = JSON.stringify({
    title: title || 'Journex',
    body: body || 'You have a new notification',
    data: {
        url: entry ? `https://journex-app.vercel.app/entries/${entry}` : 'https://journex-app.vercel.app/'
    }
})

    try {
        await webpush.sendNotification(
            user.pushSubscription,
            payload
        )
    } catch (error) {
        console.error('Push notification error:', error.message)

        // Subscription expired or is no longer valid
        if (error.statusCode === 404 || error.statusCode === 410) {
            await User.findByIdAndUpdate(recipient, {
                $unset: { pushSubscription: 1 }
            })
        }
    }

    return notification
}