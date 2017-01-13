import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import messages from '../messages/pageNotFound'

class PageNotFound extends React.Component {

    static propTypes = {
        message: React.PropTypes.string.isRequired,
    };

    render() {
        return (
            <main id="viewport">
                <header id="viewport-header" className="viewport-full-spread">
                    <div className="title">
                        <h2><FormattedMessage {...messages.pageNotFound} /></h2>
                    </div>
                </header>
                <div id="viewport-content">
                    {this.props.message}
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        message: state.frontend.pageNotFound.message,
    }
}

export default connect(mapStateToProps)(PageNotFound)
