import React from 'react'
import Breadcrumbs from '../components/Breadcrumbs'

const Header = props => (
    <header id="viewport-header">
        <Breadcrumbs {...props} />
        {props.children}
    </header>
)

Header.propTypes = {
    children: React.PropTypes.node,
}

export default Header
