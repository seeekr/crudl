import { Joi } from './base'

import field from './field'

const filters = Joi.object().provideId().keys({
    denormalize: Joi.func().default(data => data),
    fields: Joi.array().items(field).required(),
    id: Joi.string(),
})

export default filters
