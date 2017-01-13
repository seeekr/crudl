

/**
 * Get all parameter names contained in the query.
 * A parameter is defined as $<ParamName>, e.g. the id parameter is '$id' and the
 * name parameter is '$name'.
 * @return an array of the query's parameter names. The array may contain duplicates.
 */
function getParamNames(query) {
    const re = /%(\w+)/g
    let m = re.exec(query)
    const names = []
    while (m) {
        names.push(m[1])
        m = re.exec(query)
    }
    return names
}

function paramsAsObject(params, query) {
    if (params.hasOwnProperty('length')) {
        const paramsObject = {}
        getParamNames(query).forEach((name, i) => {
            paramsObject[name] = params[i]
        })
        return paramsObject
    }
    return params
}

/**
 * Each occurrence of the parameter `name` in the query, will be replaced with the `value`.
 */
function resolveParam(query, name, value) {
    const re = new RegExp(`%${name}`, 'g')
    return query.replace(re, `${value}`)
}

/**
 * Resolves the given query against the given parameters. Throws an error if there
 * is a parameter left unresolved.
 */
function resolveQuery(query, params) {
    const paramNames = getParamNames(query)
    let resolved = query
    // Replace each parameter
    paramNames.forEach((name) => {
        const value = params[name]
        if (typeof value === 'undefined') {
            throw new Error(`Missing parameter ${name}`)
        }
        resolved = resolveParam(resolved, name, value)
    })
    return resolved
}

function graphQLResolver(query) {
    // The resolver function itself
    return (req) => {
        try {
            const params = paramsAsObject(req.params, query)
            const resolved = resolveQuery(query, params)
            return resolved
        } catch (e) {
            throw new Error(`Could not resolve the GraphQL query '${query}'. (${e}).`)
        }
    }
}

export default graphQLResolver
