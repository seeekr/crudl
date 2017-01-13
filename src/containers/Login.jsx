import React from 'react'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router'
import { routerShape, locationShape } from 'react-router/lib/PropTypes'
import { injectIntl, intlShape } from 'react-intl'
import { connect } from 'react-redux'

import LoginForm from '../forms/LoginForm'
import getValidator from '../utils/getValidator'
import { successMessage, errorMessage } from '../actions/messages'
import { auth } from '../actions/core'
import { req, options } from '../Crudl'
import { loginShape } from '../PropTypes'
import messages from '../messages/login'

/* FIXME (Vaclav): Shouldn't this be a component instead? */

class Login extends React.Component {

    static propTypes = {
        desc: loginShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        router: routerShape.isRequired,
        location: locationShape.isRequired,
        intl: intlShape.isRequired,
    }

    componentWillMount() {
        // Create the Form Container
        const { desc, intl } = this.props
        const formSpec = {
            form: desc.id,
            validate: getValidator(desc),
            touchOnBlur: false,
            loginButtonLabel: intl.formatMessage(messages.loginButton),
        }
        const formProps = {
            desc: this.props.desc,
            onSubmit: this.handleSubmit.bind(this),
        }
        this.LoginForm = React.createElement(reduxForm(formSpec)(LoginForm), formProps)
    }

    componentDidMount() {
        // Add page specific className
        document.getElementById('app').classList.add('login')
        // Focus first input field
        document.querySelectorAll('input')[0].focus()
    }

    componentWillUnmount() {
        // Remove page specific className
        document.getElementById('app').classList.remove('login')
    }

    handleSubmit(data) {
        const { dispatch, intl, desc } = this.props
        return desc.actions.login(req(data))
        .then((res) => {
            dispatch(auth.login(res.data))
            dispatch(successMessage(intl.formatMessage(messages.loginSuccess)))
            const next = this.props.location.query.next || options.basePath
            this.props.router.push(next)
        })
        .catch((e) => {
            dispatch(errorMessage(intl.formatMessage(messages.loginFailure)))
            throw e
        })
    }

    render() {
        const { desc } = this.props
        return (
            <main id="viewport">
                <header id="viewport-header" className="viewport-full-spread">
                    <div id="header-toolbar" className="toolbar">
                        <div className="tools">
                            <div className="title display-when-fixed">{desc.title}</div>
                        </div>
                    </div>
                    <div className="title">
                        <h2>{desc.title}</h2>
                    </div>
                </header>
                <div id="viewport-content">
                    {this.LoginForm}
                </div>
            </main>
        )
    }
}

export default connect()(withRouter(injectIntl(Login)))
