import { Joi } from './base'

const bulkAction = Joi.object().keys({
    action: Joi.func().required(),
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
