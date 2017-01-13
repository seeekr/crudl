import { Joi, booleanProperty, stringOrReactProperty, stringProperty } from './base'

import field from './field'
import onChange from './onChange'

const fieldset = Joi.object().keys({
    // Required
    fields: Joi.array().items(field).required(),

    // Optional properties
    title: stringProperty(''),
    hidden: booleanProperty(false),
    description: stringOrReactProperty(''),
    expanded: booleanProperty(true),

    // Misc optional
    onChange,

    // before/after optional
    before: stringOrReactProperty(''),
    after: stringOrReactProperty(''),
})

export default fieldset
