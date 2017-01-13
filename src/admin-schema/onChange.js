import { Joi } from './base'

// Fields' onChangeItem definition
const onChangeItem = Joi.object().keys({
    // Required
    in: Joi.alternatives(
        Joi.string(),
        Joi.array().items(Joi.string())).required(),
    // Optional
    setProps: Joi.alternatives().try(Joi.object(), Joi.func()).default({}),
    setValue: Joi.any(),
    setInitialValue: Joi.any(),
})

// Fields' onChange definition
const onChange = Joi.alternatives().try(onChangeItem, Joi.array().items(onChangeItem))

export default onChange
