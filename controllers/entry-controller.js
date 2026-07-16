// const Journex = require ('../model/journex');
// const {cloudinary} = require('../cloudinary/index')
 


// // module.exports.newFormRender = (req , res) =>{
// //  res.render ('new')
// // }


// module.exports.createForm = async (req , res , next) =>{
//     const entryData = req.body.entry
//     entryData.isPublic = entryData.isPublic === 'on' // 👈 convert 'on' to true
//     const entries = new Journex(entryData)
// entries.images = req.files.map(f=>({url: f.path , filename: f.filename}))
//     entries.author = req.user._id
//     await entries.save()
    
//      req.json({message : 'succesfully made a new entry'})
    
// }


// module.exports.showPage = async(req , res) =>{
//     const entries = await Journex.findById(req.params.id).populate({
//         path:'comment',
//         populate:{
//             path:'author'
//         }}
//     ).populate('author')

//     if(!entries){
//        res.json({ message:'Entry not found!'})
     
//     }
//     res.json({entries, currentUser:req.user})
// }


// module.exports.editPage = async (req , res) =>{
//       const {id} = req.params
//          const entries = await Journex.findById(id)
//      if(!entries ){
//         req.flash('error' , 'Cannot find this campground')
//        return res.redirect('/entries')
//     }

//     res.json({entries})

// }


// module.exports.editLogicRoute = async (req, res) => {
//     const {id} = req.params
//     const entryData = req.body.entry
//     entryData.isPublic = entryData.isPublic === 'on'
//     const entries = await Journex.findByIdAndUpdate(id, {...entryData}, {new: true})
    
//     if(req.files && req.files.length > 0) {
//         // check total won't exceed 4
//         if(entries.images.length + req.files.length > 4) {
//             req.flash('error', 'Maximum 4 images per entry!')
//             return res.redirect(`/entries/${id}/edit`)
//         }
//         const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
//         entries.images.push(...imgs)
//         await entries.save()
//     }

//     req.flash('success', 'Successfully updated this entry')
//     res.redirect(`/entries/${entries._id}`)
// }



// module.exports.deleteRoute = async (req , res) =>{
//     const {id} = req.params
//     const entries = await Journex.findByIdAndDelete(id)
//     entries.images.forEach(function(img){
//         cloudinary.uploader.destroy(img.filename)
//     })

//      req.flash('success' , 'succesfully deleted this entry')
//      res.redirect ('/dashboard');
// }

// module.exports.deleteImage = async (req, res) => {
//     const {id, imageId} = req.params
   
    
//     // remove image from MongoDB array
//     await Journex.findByIdAndUpdate(id, {
//         $pull: {images: {filename: imageId}}
//     })
    
//     // delete image from Cloudinary
//     await cloudinary.uploader.destroy(imageId)

//     req.flash('success', 'Image deleted successfully')
//     res.redirect(`/entries/${id}`)
// }



const Journex = require('../model/journex');
const {cloudinary} = require('../cloudinary/index')



module.exports.createForm = async (req, res, next) => {
    try {
        console.log('body:', req.body)  // check body
        console.log('files:', req.files) // check files
        const entryData = req.body.entry
        entryData.isPublic = entryData.isPublic === 'true'
        const entries = new Journex(entryData)
        entries.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        entries.author = req.user._id
        await entries.save()
        res.json({ id: entries._id, message: 'Entry created!' })
    } catch(e) {
        console.log('error:', e) // log the error
        res.status(500).json({ message: e.message })
    }
}
module.exports.showPage = async(req, res) => {
    const entries = await Journex.findById(req.params.id).populate({
        path: 'comment',
        populate: { path: 'author' }
    }).populate('author')

    if(!entries){
        return res.status(404).json({ message: 'Entry not found!' })
    }
    res.json({ entries, currentUser: req.user })
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
    const entryData = req.body.entry
    entryData.isPublic = entryData.isPublic === 'true'
    const entries = await Journex.findByIdAndUpdate(id, {...entryData}, {new: true})
    
    if(req.files && req.files.length > 0) {
        if(entries.images.length + req.files.length > 4) {
            return res.status(400).json({ message: 'Maximum 4 images per entry!' })
        }
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        entries.images.push(...imgs)
        await entries.save()
    }

    res.json({ id: entries._id, message: 'Successfully updated this entry!' })
}

module.exports.deleteRoute = async (req, res) => {
    const {id} = req.params
    const entries = await Journex.findByIdAndDelete(id)
    entries.images.forEach(function(img){
        cloudinary.uploader.destroy(img.filename)
    })
    res.json({ message: 'Successfully deleted this entry!' })
}

module.exports.deleteImage = async (req, res) => {
    const {id, imageId} = req.params
    await Journex.findByIdAndUpdate(id, {
        $pull: {images: {filename: imageId}}
    })
    await cloudinary.uploader.destroy(imageId)
    res.json({ message: 'Image deleted successfully!' })
}