import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import { auth as authActions } from '../actions/core'
import { resolvePath } from '../Crudl'
import { hideNavigation } from '../actions/frontend'
import { pathShape } from '../PropTypes'
import messages from '../messages/logout'

class Logout extends React.Component {

    static propTypes = {
        loginPath: pathShape.isRequired,
        loggedIn: React.PropTypes.bool.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    };

    componentWillMount() {
        if (this.props.loggedIn) {
            // Hide menu
            this.props.dispatch(hideNavigation())
            // Log out with delay to be able to visually hide menu
            window.clearTimeout(this.timerClear)
            this.timerClear = window.setTimeout(() => {
                this.doLogout()
            }, 250)
        }
    }

    componentDidMount() {
        // Add page specific className
        document.getElementById('app').classList.add('logout')
    }

    componentWillUnmount() {
        // Remove page specific className
        document.getElementById('app').classList.remove('logout')
    }

    doLogout() {
        this.props.dispatch(authActions.logout())
    }

    render() {
        const { loggedIn, loginPath } = this.props
        return (
            <main id="viewport">
                <header id="viewport-header" className="viewport-full-spread">
                    <div id="header-toolbar" className="toolbar">
                        <div className="tools">
                            <div className="title display-when-fixed">
                                <FormattedMessage {...messages.affirmation} />
                            </div>
                        </div>
                    </div>
                    <div className="title">
                        <h2><FormattedMessage {...messages.affirmation} /></h2>
                    </div>
                </header>
                <div id="viewport-content">
                    {!loggedIn &&
                        <p>
                            <Link to={resolvePath(loginPath)} className="login-again">
                                <FormattedMessage {...messages.loginLink} />
                            </Link>
                        </p>
                    }
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        loggedIn: state.core.auth.loggedIn,
    }
}

export default connect(mapStateToProps)(Logout)
