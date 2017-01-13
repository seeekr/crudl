import { Joi, defineActions, definePermissions, stringOrReactProperty } from './base'

import field from './field'
import fieldset from './fieldset'

const addView = Joi.formView().provideId().keys({
    // Required
    path: Joi.string().required(),
    title: Joi.string().required(),
    actions: defineActions(['add']).required(),

    // Either fields or fieldsets but not both
    fields: Joi.array().items(field),
    fieldsets: Joi.array().items(fieldset),

    // Optional
    validate: Joi.func().default(() => undefined),
    denormalize: Joi.func().default(data => data),
    permissions: definePermissions('add'),
    id: Joi.string(),

    // before/after optional
    before: stringOrReactProperty(''),
    after: stringOrReactProperty(''),
})
.xor('fields', 'fieldsets')

export default addView
