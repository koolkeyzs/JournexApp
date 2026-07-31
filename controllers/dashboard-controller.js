
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

    res.json({personalEntry , communityEntries , currentUser: req.user})
}


module.exports.privateEntry = async(req , res) =>{
    const entries = await Journex.find({
        author: req.user._id,
        isPublic: false 
    })
    res.json({entries , currentUser: req.user})
}
module.exports.communityFeed = async(req , res) =>{
    const entries = await Journex.find({
          isPublic : true
    }).populate('author')
    res.json({entries, currentUser: req.user})
}




