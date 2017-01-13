import { Joi } from './base'

const logout = Joi.object().provideId('logout').keys({
    // Optional
    path: Joi.string().default('logout'),
    title: Joi.string().default('Logout'),
    id: Joi.string(),
})

export default logout
