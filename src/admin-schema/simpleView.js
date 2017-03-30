import { Joi } from './base'

import field from './field'

const simpleForm = Joi.object().keys({
    // Required
    fields: Joi.array().items(field).required(),
    onSubmit: Joi.func().required(),
    id: Joi.string().required(),
    // Optional
    title: Joi.string(),
    onCancel: Joi.func().default(() => undefined),
    denormalize: Joi.func().default(data => data),
})

export default simpleForm
