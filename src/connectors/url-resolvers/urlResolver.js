
import url from 'url'
import { formatPattern, getParamNames } from 'react-router/lib/PatternUtils'
import { options } from '../../Crudl'

function defaultURLQuery(req) {
    return Object.assign({}, req.filters, req.page && { page: req.page })
}

function paramsAsObject(params, pattern) {
    if (params.hasOwnProperty('length')) {
        const paramsObject = {}
        getParamNames(pattern).forEach((name, i) => {
            paramsObject[name] = params[i]
        })
        return paramsObject
    }
    return params
}

function urlResolver(basePattern = '', urlQuery = defaultURLQuery, baseURL) {
    const pattern = url.resolve(baseURL || options.baseURL, basePattern)

    // The resolver function itself
    return (req) => {
        try {
            const params = paramsAsObject(req.params, pattern)
            const parsed = url.parse(pattern, true)
            parsed.pathname = formatPattern(parsed.pathname, params)
            parsed.search = undefined
            parsed.query = Object.assign({}, parsed.query, urlQuery(req))
            return url.format(parsed)
        } catch (e) {
            throw new Error(`Could not resolve the url pattern '${pattern}'. (${e}).`)
        }
    }
}

export default urlResolver
