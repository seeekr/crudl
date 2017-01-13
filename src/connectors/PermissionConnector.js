import get from 'lodash/get'
import { permissions } from '../actions/core'

class PermissionConnector {

    constructor(connector, admin, dispatch) {
        this.id = connector.id
        this.admin = admin
        this.connector = connector
        this.dispatch = dispatch
        this.processPermissions = this.processPermissions.bind(this)
    }

    processPermissions(response) {
        if (response.permissions) {
            const translatedPermissions = {}
            // Translate the keys into view IDs
            Object.keys(response.permissions).forEach((key) => {
                const path = `views.${key}`
                const view = get(this.admin, `${path}`)
                if (view) {
                    translatedPermissions[view.id] = response.permissions[key]
                } else {
                    console.warn(`Invalid permission specification. Couldn't find the view '${path}'`)
                }
            })
            this.dispatch(permissions.setPermissions(translatedPermissions))
        }
        return response
    }

    create(req) {
        return this.connector.create(req).then(this.processPermissions)
    }

    read(req) {
        return this.connector.read(req).then(this.processPermissions)
    }

    update(req) {
        return this.connector.update(req).then(this.processPermissions)
    }

    delete(req) {
        return this.connector.delete(req).then(this.processPermissions)
    }
}

export default PermissionConnector
