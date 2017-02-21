import React from 'react'

const MenuContainer = props => (
    <ul>
        {props.children}
    </ul>
)

MenuContainer.propTypes = {
    children: React.PropTypes.node,
}

export default MenuContainer
