
const Journex = require ('../model/journex');

module.exports.dashHome = async (req , res) =>{
    const personalEntry = await Journex.find({
        author: req.user._id,
        isPublic: false
    })

    const communityEntries = await Journex.find
({
        isPublic : true
    }).populate('author')

    res.render('dashboard' , {personalEntry , communityEntries})
}


module.exports.privateEntry = async(req , res) =>{
    const entries = await Journex.find({
        author: req.user._id,
        isPublic: false 
    })
    res.render('privateEntry' , {entries})
}
module.exports.communityFeed = async(req , res) =>{
    const entries = await Journex.find({
          isPublic : true
    }).populate('author')
    res.render('community' , {entries})
}
