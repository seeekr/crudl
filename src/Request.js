
import cloneDeep from 'lodash/cloneDeep'

class Request {

    constructor(variables = {}) {
        const cloned = cloneDeep(variables)
        this.data = cloned.data || {}
        this.page = cloned.page
        this.filters = cloned.filters || {}
        this.headers = cloned.headers || {}
        this.sorting = cloned.sorting || []
        this.params = cloned.params || []
    }

    getPage(pageCursor) {
        const req = new Request(this)
        if (pageCursor) {
            req.page = pageCursor
        }
        return req
    }

    /**
     * Set a filter on the result.
     */
    filter(variable, value) {
        const req = new Request(this)
        req.filters[variable] = value
        return req
    }

    /**
     * Set the filters on the result.
     */
    withFilters(filters) {
        const req = new Request(this)
        req.filters = filters
        return req
    }

    /**
     * Switch on/off pagination.
     * @param limit an integer specifying the limit of results per page. If
     * `limit` is a false-like value (e.g. `0`, `false`, etc.), then the result
     * must not be paginated.
     */
    paginate(limit) {
        const req = new Request(this)
        /* FIXME (Vaclav): good idea to call that paginate and pagination? */
        req.pagination = limit
        if (!limit) {
            req.page = undefined
        }
        return req
    }

    sort(array) {
        const req = new Request(this)
        req.sorting = array
        return req
    }

    withParams(params) {
        const req = new Request(this)
        req.params = params
        return req
    }
}

export default Request
