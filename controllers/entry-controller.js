const Journex = require ('../model/journex');
 
// module.exports.entryPage = async (req , res) =>{
//     const entries = await Journex.find({})
    
//     res.render('entry' , {entries})
    
// }

module.exports.newFormRender = (req , res) =>{
 res.render ('new')
}


module.exports.createForm = async (req , res , next) =>{
    const entryData = req.body.entry
    entryData.isPublic = entryData.isPublic === 'on' // 👈 convert 'on' to true
    const entries = new Journex(entryData)
entries.images = req.files.map(f=>({url: f.path , filename: f.filename}))
    entries.author = req.user._id
    await entries.save()
    
     req.flash('success' , 'succesfully made a new entry')

    res.redirect (`/entries/${entries._id}`)
    
}


module.exports.showPage = async(req , res) =>{
    const entries = await Journex.findById(req.params.id).populate({
        path:'comment',
        populate:{
            path:'author'
        }}
    ).populate('author')

    if(!entries){
        req.flash('error' , 'Cannot find this campground')
       return res.redirect('/entries')
    }
    res.render('show' , {entries})
}


module.exports.editPage = async (req , res) =>{
      const {id} = req.params
         const entries = await Journex.findById(id)
     if(!entries ){
        req.flash('error' , 'Cannot find this campground')
       return res.redirect('/entries')
    }

    res.render('edit' , {entries})

}


module.exports.editLogicRoute = async (req, res) => {
    const {id} = req.params
    const entryData = req.body.entry
    entryData.isPublic = entryData.isPublic === 'on'
    const entries = await Journex.findByIdAndUpdate(id, {...entryData} )
    
    if(req.files && req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        entries.images.push(...imgs)
        await entries.save()
         console.log('saved images:', entries.images)
    }

    req.flash('success', 'Successfully updated this entry')
    res.redirect(`/entries/${entries._id}`)
}

module.exports.deleteRoute =async (req , res) =>{
    const {id} = req.params
    const entries = await Journex.findByIdAndDelete(id)

     req.flash('success' , 'succesfully deleted this entry')
     res.redirect ('/dashboard');
}