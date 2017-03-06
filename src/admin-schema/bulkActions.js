import { Joi } from './base'

const bulkAction = Joi.object().keys({
    before: Joi.func().default(() => undefined),
    action: Joi.func().required(),
    after: Joi.func().default(() => undefined),
    description: Joi.string(),
    modalConfirm: Joi.object({
        message: Joi.string().isRequired,
        labelConfirm: Joi.string(),
        labelCancel: Joi.string(),
        modalType: Joi.string(),
    }),
})

const bulkActions = Joi.object().pattern(/.*/, bulkAction)

export default bulkActions
