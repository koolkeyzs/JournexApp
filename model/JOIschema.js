
const joi = require('joi')

 const entrySchema = joi.object({
    entry : joi.object({
        title : joi.string().required(),
        content : joi.string().required(),
        tags: joi.string().required(),
        verse: joi.string().required(),
        isPublic: joi.boolean().truthy('on').falsy('off').default(false)

    }).required()
  }).options({ allowUnknown: true })

const commentSchema = joi.object({
    comment: joi.object({
        text : joi.string().required()


    }).required()
  })
  

  module.exports = {entrySchema, commentSchema}