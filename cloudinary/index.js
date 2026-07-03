const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Journex',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        transformation: [
            { width: 800, height: 800, crop: 'limit' }, // max dimensions
            { quality: 'auto' },                         // auto compress
            { fetch_format: 'auto' }                     // best format
        ]
    }
})

module.exports = {
cloudinary,
storage
}