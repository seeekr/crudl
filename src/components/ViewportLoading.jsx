import React from 'react'
import LoadingIndicator from './LoadingIndicator'

const ViewportLoading = props => (
    <main id="viewport">
        <header id="viewport-header">
            <h2>{props.title}</h2>
        </header>
        <div id="viewport-content">
            <LoadingIndicator text={props.loadingText} />
        </div>
    </main>
)

ViewportLoading.propTypes = {
    title: React.PropTypes.string.isRequired,
    loadingText: React.PropTypes.string,
}

export default ViewportLoading
