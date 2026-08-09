


const Journex = require('../model/journex');
const Report = require('../model/report');
const Notification = require('../model/notification');
const User = require('../model/user');

const {cloudinary} = require('../cloudinary/index')



module.exports.createForm = async (req, res, next) => {
  
    try {
        const entryData = req.body.entry || req.body

        if (!entryData?.mood?.trim()) {
            return res.status(400).json({ message: 'Please select a mood for your entry.' })
        }

        entryData.isPublic = entryData.isPublic === 'true'
        entryData.tags = entryData.tags
            ? entryData.tags.split(',').map(t => t.trim()).filter(Boolean)
            : []
        const entries = new Journex(entryData)
        entries.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        entries.author = req.user._id
        await entries.save()

        if (entries.isPublic) {
            const otherUsers = await User.find({ _id: { $ne: req.user._id } }).select('_id')
            const notifications = otherUsers.map(user => ({
                recipient: user._id,
                sender: req.user._id,
                type: 'new_entry',
                entry: entries._id
            }))

            if (notifications.length > 0) {
                await Notification.insertMany(notifications)
            }
        }

        res.json({ id: entries._id, message: 'Entry created!' })
    } catch(e) {
        console.log('error:', e)
        res.status(500).json({ message: e.message })
    }
}

// 



module.exports.showPage = async(req, res) => {
    const entry = await Journex.findById(req.params.id).populate({
        path: 'comment',
        populate: { path: 'author' }
    }).populate('author')

    if(!entry){
        return res.status(404).json({ message: 'Entry not found!' })
    }

    const isOwner = req.user && entry.author._id.toString() === req.user._id.toString()

    if (!entry.isPublic && !isOwner) {
        return res.status(403).json({ message: 'This entry is private!' })
    }

    res.json({ entries: entry, currentUser: req.user })
}
module.exports.editPage = async (req, res) => {
    const {id} = req.params
    const entries = await Journex.findById(id)
    if(!entries){
        return res.status(404).json({ message: 'Cannot find this entry!' })
    }
    res.json({ entries })
}

module.exports.editLogicRoute = async (req, res) => {
    const {id} = req.params
    const entryData = req.body.entry || req.body
    const existingEntry = await Journex.findById(id)

    entryData.isPublic = entryData.isPublic === 'true'

    if (existingEntry && !existingEntry.isPublic && entryData.isPublic) {
        entryData.createdAt = new Date()
    }

    const entries = await Journex.findByIdAndUpdate(id, {...entryData}, {new: true})
    
    if(req.files && req.files.length > 0) {
        if(entries.images.length + req.files.length > 4) {
            return res.status(400).json({ message: 'Maximum 4 images per entry!' })
        }
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        entries.images.push(...imgs)
        await entries.save()
    }

    if (entries.isPublic && existingEntry && !existingEntry.isPublic) {
        const otherUsers = await User.find({ _id: { $ne: req.user._id } }).select('_id')
        const notifications = otherUsers.map(user => ({
            recipient: user._id,
            sender: req.user._id,
            type: 'new_entry',
            entry: entries._id
        }))

        if (notifications.length > 0) {
            await Notification.insertMany(notifications)
        }
    }

    res.json({ id: entries._id, message: 'Successfully updated this entry!' })
}

module.exports.deleteRoute = async (req, res) => {
    const {id} = req.params
    const entries = await Journex.findByIdAndDelete(id)

    if (!entries) {
        return res.status(404).json({ message: 'Entry not found!' })
    }

    await Report.deleteMany({ entry: id })

    entries.images.forEach(function(img){
        cloudinary.uploader.destroy(img.filename)
    })

    res.json({ message: 'Successfully deleted this entry!' })
}

module.exports.deleteImage = async (req, res) => {
    const {id, imageId} = req.params
       const filename = decodeURIComponent(imageId) 
    await Journex.findByIdAndUpdate(id, {
        $pull: {images: {filename: imageId}}
    })
    await cloudinary.uploader.destroy(imageId)
    res.json({ message: 'Image deleted successfully!' })
}


module.exports.searchEntries = async (req, res) => {
    const { q } = req.query   // 1

    if (!q || q.trim() === '') {
        return res.json({ results: [] })   // 2
    }

    const regex = new RegExp(q, 'i')
    const matchingAuthors = await User.find({ username: regex }).select('_id')
    const authorIds = matchingAuthors.map(user => user._id)

    const results = await Journex.find({
        $and: [
            {
                $or: [
                    { author: req.user._id },
                    { isPublic: true }
                ]
            },
            {
                $or: [
                    { title: regex },
                    { content: regex },
                    { tags: regex },
                    { author: { $in: authorIds } }
                ]
            }
        ]
    }).populate({
        path: 'author',
        select: 'username profilePic'
    })

    res.json({ results })
}


module.exports.toggleLike = async (req, res) => {
    const { id } = req.params
    const userId = req.user._id
    const entry = await Journex.findById(id)

    const alreadyLiked = entry.likes.includes(userId)

    if(alreadyLiked) {
        // unlike
        await Journex.findByIdAndUpdate(id, { $pull: { likes: userId } })
        res.json({ message: 'Unliked!', liked: false })
    } else {
        // like
        await Journex.findByIdAndUpdate(id, { $push: { likes: userId } })

        if (entry.author && entry.author.toString() !== userId.toString()) {
            await Notification.create({
                recipient: entry.author,
                sender: userId,
                type: 'like',
                entry: entry._id
            })
        }

        res.json({ message: 'Liked!', liked: true })
    }
}