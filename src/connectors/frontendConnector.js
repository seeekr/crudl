

/**
 * Creates a frontend connector. The frontend connector is a callable connector object. If called,
 * it returns a new parametrized connector object.
 */
export default function frontendConnectorCreator(connector) {
    const cx = function FrontendConnector(...params) {
        const parametrized = {}

        parametrized.create = function (req) {
            return connector.create(req.withParams(params))
        }

        parametrized.read = function (req) {
            return connector.read(req.withParams(params))
        }

        parametrized.update = function (req) {
            return connector.update(req.withParams(params))
        }

        parametrized.delete = function (req) {
            return connector.delete(req.withParams(params))
        }

        return parametrized
    }

    cx.create = function (req) {
        return connector.create(req)
    }

    cx.read = function (req) {
        return connector.read(req)
    }

    cx.update = function (req) {
        return connector.update(req)
    }

    cx.delete = function (req) {
        return connector.delete(req)
    }

    return cx
}
