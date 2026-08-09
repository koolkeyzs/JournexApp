const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'new_entry'],
        required: true
    },

    entry: {
        type: Schema.Types.ObjectId,
        ref: 'Journex'
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },

    read: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Notification', notificationSchema)
