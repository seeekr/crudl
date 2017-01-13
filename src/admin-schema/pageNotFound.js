import { Joi } from './base'

const pageNotFound = Joi.object().provideId('404').keys({
    // Optional
    path: Joi.string().default('404'),
    title: Joi.string().default('Page not found'),
    id: Joi.string(),
})

export default pageNotFound
