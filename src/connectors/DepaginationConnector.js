/**
 * Assures a non-paginated result for read operations.
 * If a non-paginated result is requried (i.e. req.pagination === false) but the API still
 * returns a paginated result, this connector depaginates the result by
 * requesting all the pages and combining the results.
 */
class DepaginationConnector {

    constructor(connector) {
        this.id = connector.id
        this.connector = connector
    }

    // Make multiple reads in order to depaginate
    read(req) {
        return this.connector.read(req)

        .then((res) => {
            // Is the response actually paginated and the non-paginated was requested?
            if (res.pagination && !req.pagination) {
                // Make the read calls to all the pages
                const readCalls = []
                for (let i = res.pagination.current + 1; i <= res.pagination.pageCount; i += 1) {
                    readCalls.push(this.connector.read(Object.assign({}, req, {
                        page: {
                            page: i,
                        },
                    })))
                }

                // Synchronize on the readCalls
                return Promise.all(readCalls)

                .then(results => res
                    .set('pagination', undefined)
                    .set('data', res.data.concat(...results.map(r => r.data)))
                )
            }

            return res
        })
    }

    create(req) {
        return this.connector.create(req)
    }

    update(req) {
        return this.connector.update(req)
    }

    delete(req) {
        return this.connector.delete(req)
    }
}

export default DepaginationConnector
