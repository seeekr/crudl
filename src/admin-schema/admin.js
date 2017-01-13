import { Joi, stringOrReactProperty } from './base'

import views from './views'
import connectors from './connectors'
import login from './login'
import logout from './logout'
import pageNotFound from './pageNotFound'

const admin = Joi.object().keys({
    title: stringOrReactProperty('crudl.io Demo CMS'),
    connectors: connectors.required(),
    views: views.required(),
    auth: Joi.object().keys({
        login: login.required(),
        logout: logout.default(),
    }).required(),
    custom: Joi.object().keys({
        dashboard: stringOrReactProperty(''),
        pageNotFound: pageNotFound.default(),
        menu: stringOrReactProperty(''),
    }).default(),
    options: Joi.object().keys({
        rootElementId: Joi.string().default('crudl-root'),
        baseURL: Joi.string().default('/'),
        basePath: Joi.string().default('/'),
        debug: Joi.boolean().default(false),
        locale: Joi.string().default('en'),
        requireAuthentication: Joi.boolean().default(true),
    }).default(),
    messages: Joi.object().default(),
    isValidated: Joi.bool().forbidden().default(true),
})

export default admin
