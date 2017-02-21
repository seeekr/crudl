import React from 'react'

const MenuGroup = props => (
    <ul>
        <span>{props.label}</span>
        {props.children}
    </ul>
)

MenuGroup.propTypes = {
    children: React.PropTypes.node,
    label: React.PropTypes.node,
}

export default MenuGroup
