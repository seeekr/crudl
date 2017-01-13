
import cloneDeep from 'lodash/cloneDeep'

/**
 * A response object has the following attributes:
 *   data - the response data (any type)
 *   status - the HTTP response code (number)
 *   url - the url the corresponding request was directed at
 */
class Response {

    constructor(variables) {
        const cloned = cloneDeep(variables)
        Object.keys(cloned).forEach((name) => {
            this[name] = cloned[name]
        })
    }

    /**
     * Set the `variable` to a `value`
     */
    set(variable, value) {
        const copy = new Response(this)
        copy[variable] = value
        return copy
    }

    setData(value) {
        return this.set('data', value)
    }

    setMessage(message) {
        return this.set('message', message)
    }
}

export default Response
