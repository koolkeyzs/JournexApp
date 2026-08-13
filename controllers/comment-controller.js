const Comment = require('../model/comments')
const Journex = require('../model/journex');
const Notification = require('../model/notification')
const createNotification = require('../utils/createNotification')

// module.exports.createComment = async(req, res) => {
//     const entries = await Journex.findById(req.params.id)
//     const comment = new Comment(req.body.comment)
//     comment.author = req.user._id
//     comment.entry = entries._id 
//     entries.comment.push(comment)
//     await comment.save()
//     await entries.save()

//     if (entries.author && entries.author.toString() !== req.user._id.toString()) {
//         await createNotification({
//             recipient: entries.author,
//             sender: req.user._id,
//             type: 'comment',
//             entry: entries._id,
//             comment: comment._id,
//             title: 'new comment on entry',
//                 body: 'Someone just commented your journex entry'
//         })
//     }

//     res.json({ message: 'Comment added successfully!' })
// }

// module.exports.deleteComment = async (req, res) => {
//     const {id, commentId} = req.params
//     await Journex.findByIdAndUpdate(id, { $pull: { comment: commentId } })
//     await Comment.findByIdAndDelete(commentId)
//     res.json({ message: 'Comment deleted successfully!' })
// }



// module.exports.editComment = async (req, res) => {
//     const { commentId } = req.params
//     const { comment } = req.body
//     await Comment.findByIdAndUpdate(commentId, { text: comment.text })
//     res.json({ message: 'Comment updated!' })
// }




module.exports.createComment = async (req, res) => {
    const entries = await Journex.findById(req.params.id);

    if (!entries) {
        return res.status(404).json({
            message: "Entry not found"
        });
    }

    const comment = new Comment(req.body.comment);

    comment.author = req.user._id;
    comment.entry = entries._id;

    // Check if this is a reply
    if (req.body.comment.parentComment) {
        const parentComment = await Comment.findById(
            req.body.comment.parentComment
        );

        // Make sure the comment being replied to
        // actually belongs to this entry
        if (!parentComment || parentComment.entry.toString() !== entries._id.toString()) {
            return res.status(400).json({
                message: "Invalid parent comment"
            });
        }

        comment.parentComment = parentComment._id;

        // Save the reply
        entries.comment.push(comment);

        await comment.save();
        await entries.save();

        // Notify the person whose comment was replied to
        if (
            parentComment.author &&
            parentComment.author.toString() !== req.user._id.toString()
        ) {
            await createNotification({
                recipient: parentComment.author,
                sender: req.user._id,
                type: "comment_reply",
                entry: entries._id,
                comment: comment._id,
                title: "Someone replied to your comment",
                body: "Someone replied to your comment on a Journex entry"
            });
        }

        return res.json({
            message: "Reply added successfully!"
        });
    }

    // -----------------------------
    // NORMAL COMMENT
    // -----------------------------

    comment.parentComment = null;

    entries.comment.push(comment);

    await comment.save();
    await entries.save();

    // Notify the owner of the entry
    if (
        entries.author &&
        entries.author.toString() !== req.user._id.toString()
    ) {
        await createNotification({
            recipient: entries.author,
            sender: req.user._id,
            type: "comment",
            entry: entries._id,
            comment: comment._id,
            title: "New comment on entry",
            body: "Someone just commented on your Journex entry"
        });
    }

    res.json({
        message: "Comment added successfully!"
    });
};