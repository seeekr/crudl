
class PaginationConnector {

    constructor(connector, pagination) {
        this.id = connector.id
        this.connector = connector
        this.pagination = pagination
    }

    // Add pagination info to the response of read operation
    read(req) {
        return this.connector.read(req)

        .then((res) => {
            return res.set('pagination', this.pagination(res))
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

export default PaginationConnector
