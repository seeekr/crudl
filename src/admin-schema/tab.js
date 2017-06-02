import { Joi, defineActions, stringOrReactProperty } from './base'

import field from './field'
import fieldset from './fieldset'

const tab = Joi.formView().provideId().keys({
    // Required
    title: Joi.string().required(),
    actions: defineActions(['save', 'list', 'delete', 'add']).required(),

    // Either fields or fieldsets but not both
    fields: Joi.array().items(field),
    fieldsets: Joi.array().items(fieldset),

    // Optional
    itemTitle: Joi.string().default('{ord}'),
    validate: Joi.func().default(() => undefined),
    id: Joi.string(),
    normalize: Joi.func().default(data => data),
    denormalize: Joi.func().default(data => data),

    // before/after optional
    before: stringOrReactProperty(''),
    after: stringOrReactProperty(''),
})
.xor('fields', 'fieldsets')

export default tab
