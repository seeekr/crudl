import React from 'react'

const LoadingIndicator = props => (
    <div className="loading-indicator">
        <div />
        {props.text && <span>{props.text}</span>}
    </div>
)

LoadingIndicator.propTypes = {
    text: React.PropTypes.string.isRequired,
}

export default LoadingIndicator
