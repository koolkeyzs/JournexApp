const Comment = require('../model/comments')
const Journex = require('../model/journex');

module.exports.createComment = async(req, res) => {
    const entries = await Journex.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    comment.author = req.user._id
    entries.comment.push(comment)
    await comment.save()
    await entries.save()
    res.json({ message: 'Comment added successfully!' })
}

module.exports.deleteComment = async (req, res) => {
    const {id, commentId} = req.params
    await Journex.findByIdAndUpdate(id, { $pull: { comment: commentId } })
    await Comment.findByIdAndDelete(commentId)
    res.json({ message: 'Comment deleted successfully!' })
}