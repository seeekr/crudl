import React from 'react'
import { Link } from 'react-router'
import { resolvePath } from '../Crudl'
import { breadcrumbsShape } from '../PropTypes'

const Breadcrumbs = ({ breadcrumbs }) => (
    <ol id="breadcrumbs">
        {breadcrumbs.map((item, index) => (
            <li key={index}>
                {item.path && index < breadcrumbs.length - 1 ?
                    <Link to={resolvePath(item.path)}>{item.name}</Link>
                    :
                    <span>{item.name}</span>
                }
            </li>
        ))}
    </ol>
)

Breadcrumbs.propTypes = {
    breadcrumbs: breadcrumbsShape.isRequired,
}

export default Breadcrumbs
