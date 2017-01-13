import { Joi, stringProperty } from './base'

const connector = Joi.object().nand('url', 'query').keys({
    // Optional
    baseURL: stringProperty(''),
    url: Joi.alternatives().try(Joi.string(), Joi.func()),
    urlQuery: Joi.func(),
    query: Joi.object().keys({
        create: Joi.alternatives().try(Joi.string(), Joi.func()),
        read: Joi.alternatives().try(Joi.string(), Joi.func()),
        update: Joi.alternatives().try(Joi.string(), Joi.func()),
        delete: Joi.alternatives().try(Joi.string(), Joi.func()),
    }),
    use: Joi.string(),
    mapping: Joi.object().keys({
        create: Joi.string().only(['get', 'put', 'post', 'delete', 'options']),
        read: Joi.string().only(['get', 'put', 'post', 'delete', 'options']),
        update: Joi.string().only(['get', 'put', 'post', 'delete', 'options']),
        delete: Joi.string().only(['get', 'put', 'post', 'delete', 'options']),
    }),
    transform: Joi.object().keys({
        readRequestData: Joi.func().arity(1),
        readResponseData: Joi.func().arity(1),
        updateRequestData: Joi.func().arity(1),
        updateResponseData: Joi.func().arity(1),
        createRequestData: Joi.func().arity(1),
        createResponseData: Joi.func().arity(1),
        deleteRequestData: Joi.func().arity(1),
        deleteResponseData: Joi.func().arity(1),
        createRequest: Joi.func().arity(1),
        createResponse: Joi.func().arity(1),
        readRequest: Joi.func().arity(1),
        readResponse: Joi.func().arity(1),
        updateRequest: Joi.func().arity(1),
        updateResponse: Joi.func().arity(1),
        deleteRequest: Joi.func().arity(1),
        deleteResponse: Joi.func().arity(1),
    }),
    pagination: Joi.func().arity(1),
    enableDepagination: Joi.boolean().default(false),
    create: Joi.func().default(() => { throw new Error('Create method not implemented! Check your connectors') }),
    read: Joi.func().default(() => { throw new Error('Read method not implemented! Check your connectors') }),
    update: Joi.func().default(() => { throw new Error('Update method not implemented! Check your connectors') }),
    delete: Joi.func().default(() => { throw new Error('Delete method not implemented! Check your connectors') }),
})

const connectors = Joi.object().pattern(/.+/, connector)

export default connectors
