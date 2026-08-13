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
        },
        richText: {
            validate(value, helpers) {
                // allow only safe formatting tags, strip everything else (e.g. <script>)
                const clean = sanitizeHtml(value, {
                    allowedTags: ['p', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'blockquote', 'br'],
                    allowedAttributes: {},
                });
                return clean; // always return the sanitized version, don't reject — just clean it
            }
        }
    }
});

const joi = BaseJoi.extend(extension)

const entrySchema = joi.object({
    entry: joi.object({
        title: joi.string().required().escapeHTML(),
        content: joi.string().required().richText(),
        tags: joi.string().allow('').escapeHTML(),
        verse: joi.string().allow('').escapeHTML(),
        isPublic: joi.boolean().truthy('on').falsy('off').default(false)
    }).required()
}).options({ allowUnknown: true })

const commentSchema = joi.object({
    comment: joi.object({
        text: joi.string().required().escapeHTML(),

        parentComment: joi.string()
            .allow(null)
            .optional()
    }).required()
})

module.exports = { entrySchema, commentSchema }