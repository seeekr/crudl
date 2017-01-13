
const passFunc = x => x

export const defaultTransforms = {
    // Data transforms
    readRequestData: passFunc,
    readResponseData: passFunc,
    updateRequestData: passFunc,
    updateResponseData: passFunc,
    createRequestData: passFunc,
    createResponseData: passFunc,
    deleteRequestData: passFunc,
    deleteResponseData: passFunc,
    // Request and Response transforms
    createRequest: passFunc,
    createResponse: passFunc,
    readRequest: passFunc,
    readResponse: passFunc,
    updateRequest: passFunc,
    updateResponse: passFunc,
    deleteRequest: passFunc,
    deleteResponse: passFunc,
}

class TransformConnector {

    constructor(connector, transforms = {}) {
        this.id = connector.id
        this.connector = connector
        this.transforms = Object.assign({}, defaultTransforms, transforms)
    }

    create(request) {
        const req = this.transforms.createRequest(request)
        req.data = this.transforms.createRequestData(req.data)

        return this.connector.create(req)
        .then((response) => {
            const res = this.transforms.createResponse(response)
            res.data = this.transforms.createResponseData(res.data)
            return res
        })
    }

    read(request) {
        const req = this.transforms.readRequest(request)
        req.data = this.transforms.readRequestData(req.data)

        return this.connector.read(req)
        .then((response) => {
            const res = this.transforms.readResponse(response)
            res.data = this.transforms.readResponseData(res.data)
            return res
        })
    }

    update(request) {
        const req = this.transforms.updateRequest(request)
        req.data = this.transforms.updateRequestData(req.data)

        return this.connector.update(req)
        .then((response) => {
            const res = this.transforms.updateResponse(response)
            res.data = this.transforms.updateResponseData(res.data)
            return res
        })
    }

    delete(request) {
        const req = this.transforms.deleteRequest(request)
        req.data = this.transforms.deleteRequestData(req.data)

        return this.connector.delete(req)
        .then((response) => {
            const res = this.transforms.deleteResponse(response)
            res.data = this.transforms.deleteResponseData(res.data)
            return res
        })
    }
}

export default TransformConnector
