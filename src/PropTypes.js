import React from 'react'
import joiToPropType from './utils/joiToPropType'

import { Joi } from './admin-schema/base'

import adminSchema from './admin-schema/admin'
import viewsSchema from './admin-schema/views'

import addViewSchema from './admin-schema/addView'
import changeViewSchema from './admin-schema/changeView'
import listViewSchema from './admin-schema/listView'

import loginSchema from './admin-schema/login'
import logoutSchema from './admin-schema/logout'
import pageNotFoundSchema from './admin-schema/pageNotFound'

import listViewFieldSchema from './admin-schema/listViewField'
import fieldSchema from './admin-schema/field'
import fieldsetSchema from './admin-schema/fieldset'
import tabSchema from './admin-schema/tab'
import filtersSchema from './admin-schema/filters'

export const activeFiltersShape = React.PropTypes.arrayOf(
    React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.any.isRequired,
        label: React.PropTypes.string.isRequired,
    })
)

export const sortingShape = React.PropTypes.arrayOf(
    React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        sortKey: React.PropTypes.any.isRequired,
        sorted: React.PropTypes.string.isRequired,
    })
)

// validated admin shape
export const adminShape = joiToPropType(adminSchema.keys({ isValidated: Joi.boolean().required().only(true) }))

export const viewsShape = joiToPropType(viewsSchema)

export const addViewShape = joiToPropType(addViewSchema)
export const changeViewShape = joiToPropType(changeViewSchema)
export const listViewShape = joiToPropType(listViewSchema)

export const loginShape = joiToPropType(loginSchema)
export const logoutShape = joiToPropType(logoutSchema)
export const pageNotFoundShape = joiToPropType(pageNotFoundSchema)

export const listViewFieldShape = joiToPropType(listViewFieldSchema)
export const fieldShape = joiToPropType(fieldSchema)
export const fieldsetShape = joiToPropType(fieldsetSchema)


export const tabShape = joiToPropType(tabSchema)
export const pathShape = React.PropTypes.string

export const filtersShape = joiToPropType(filtersSchema)

export const breadcrumbsShape = React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    path: React.PropTypes.string.isRequired,
}))

export const authShape = React.PropTypes.shape({
    loggedIn: React.PropTypes.bool.isRequired,
    requestHeaders: React.PropTypes.object,
    info: React.PropTypes.object,
})

export const viewCallsShape = React.PropTypes.shape({
    fromRelation: React.PropTypes.bool.isRequired,
    enterView: React.PropTypes.func.isRequired,
    enterRelation: React.PropTypes.func.isRequired,
    leaveView: React.PropTypes.func.isRequired,
    switchToView: React.PropTypes.func.isRequired,
    hasReturned: React.PropTypes.bool.isRequired,
    returnValue: React.PropTypes.any,
    storedData: React.PropTypes.any,
})
