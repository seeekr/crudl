import { Joi } from './base'

const listViewField = Joi.object().keys({
    // Required
    name: Joi.string().required(),
    label: Joi.string().required(),

    // Optional
    defaultValue: Joi.any(),
    key: Joi.string().default(Joi.ref('name')),
    sortable: Joi.boolean().default(false),
    sorted: Joi.string().only(['ascending', 'descending', 'none']).default('none'),
    sortpriority: Joi.number(),
    sortKey: Joi.string().default(Joi.ref('name')),
    main: Joi.boolean().default(false),
    render: Joi.alternatives().try(
        Joi.func(),
        Joi.string().only(['number', 'boolean', 'string']).default('string')
    ),
})

export default listViewField
