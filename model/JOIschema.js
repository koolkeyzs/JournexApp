

const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)






 const entrySchema = joi.object({
    entry : joi.object({
        title : joi.string().required().escapeHTML(),
        content : joi.string().required().escapeHTML(),
        tags: joi.string().required().escapeHTML(),
        verse: joi.string().required().escapeHTML(),
        isPublic: joi.boolean().truthy('on').falsy('off').default(false)

    }).required()
  }).options({ allowUnknown: true })

const commentSchema = joi.object({
    comment: joi.object({
        text : joi.string().required().escapeHTML()


    }).required()
  })

  

  module.exports = {entrySchema, commentSchema}