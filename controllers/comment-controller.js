const Comment = require('../model/comments')
const Journex = require('../model/journex');
const Notification = require('../model/notification')

module.exports.createComment = async(req, res) => {
    const entries = await Journex.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    comment.author = req.user._id
    comment.entry = entries._id 
    entries.comment.push(comment)
    await comment.save()
    await entries.save()

    if (entries.author && entries.author.toString() !== req.user._id.toString()) {
        await Notification.create({
            recipient: entries.author,
            sender: req.user._id,
            type: 'comment',
            entry: entries._id,
            comment: comment._id
        })
    }

    res.json({ message: 'Comment added successfully!' })
}

module.exports.deleteComment = async (req, res) => {
    const {id, commentId} = req.params
    await Journex.findByIdAndUpdate(id, { $pull: { comment: commentId } })
    await Comment.findByIdAndDelete(commentId)
    res.json({ message: 'Comment deleted successfully!' })
}



module.exports.editComment = async (req, res) => {
    const { commentId } = req.params
    const { comment } = req.body
    await Comment.findByIdAndUpdate(commentId, { text: comment.text })
    res.json({ message: 'Comment updated!' })
}