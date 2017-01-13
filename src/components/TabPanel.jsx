import React from 'react'

const TabPanel = ({ children, index, hidden }) => (
    <div id={`panel${index}`} role="tabpanel" aria-labelledby={`tab${index}`} aria-hidden={hidden}>
        {children}
    </div>
)

TabPanel.propTypes = {
    index: React.PropTypes.number.isRequired,
    hidden: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node,
}

export default TabPanel
