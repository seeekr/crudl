import React from 'react'

const BottomBar = props => (
    <aside id="bottombar" role="group">
        <div role="listbox" aria-expanded={props.expanded}>
            {props.children}
        </div>
    </aside>
)

BottomBar.propTypes = {
    expanded: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node,
}

export default BottomBar
