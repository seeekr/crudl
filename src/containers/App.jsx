import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Navigation from '../components/Navigation'
import { toggleNavigation } from '../actions/frontend'
import { resolvePath } from '../Crudl'

import { adminShape } from '../PropTypes'

import Messages from './Messages'
import ModalConfirm from './ModalConfirm'

class App extends React.Component {

    static propTypes = {
        admin: adminShape,
        loggedIn: React.PropTypes.bool.isRequired,
    };

    constructor() {
        super()
        this.handleLogout = this.handleLogout.bind(this)
        this.handleNavigationClick = this.handleNavigationClick.bind(this)
    }

    componentDidMount() {
        // Add eventListener for window resizes
        window.addEventListener('scroll', this.windowScroll)
        this.updateAppClassList()
    }

    componentDidUpdate() {
        this.updateAppClassList()
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.windowScroll)
    }

    windowScroll() {
        // Scroll behaviour if dom elements exist, checking for header is good enough
        // otherwise remove header-fixed classNames
        if (document.getElementById('viewport-header') !== null) {
            const toolbar = document.getElementById('header-toolbar')
            const toolbarHeight = toolbar ? document.getElementById('header-toolbar').clientHeight : '64'
            const scrollPosition = window.pageYOffset
            if (scrollPosition > toolbarHeight + 0) {
                document.getElementById('app').classList.add('header-prepare-fixed')
            } else {
                document.getElementById('app').classList.remove('header-prepare-fixed')
            }
            if (scrollPosition > toolbarHeight + 48) {
                document.getElementById('app').classList.add('header-fixed')
            } else {
                document.getElementById('app').classList.remove('header-fixed')
            }
        } else {
            document.getElementById('app').classList.remove('header-prepare-fixed')
            document.getElementById('app').classList.remove('header-fixed')
        }
    }

    updateAppClassList() {
        const appClassList = document.getElementById('app').classList
        const isNavigation = document.getElementById('navigation')
        const isFilters = document.getElementById('sidebar')
        isNavigation && this.props.navigationVisible ? appClassList.add('navigation-open') : appClassList.remove('navigation-open')
        isFilters && this.props.filtersVisible ? appClassList.add('app-aside-open') : appClassList.remove('app-aside-open')
    }

    handleLogout() {
        if (typeof this.props.admin.auth !== 'undefined') {
            this.props.router.push(resolvePath(this.props.admin.auth.logout.path))
        }
    }

    handleNavigationClick() {
        this.props.dispatch(toggleNavigation())
    }

    render() {
        const { admin, loggedIn, children } = this.props
        const authRequired = (typeof admin.auth !== 'undefined')
        return (
            <div id="app">
                <header id="app-title" aria-hidden="true"><h1>{admin.title}</h1></header>
                {(!authRequired || loggedIn) &&
                    <Navigation
                        onLogout={authRequired ? this.handleLogout : undefined}
                        views={admin.views}
                        menuComponent={admin.custom.menu}
                        />
                }
                <div id="main">{children}</div>
                <Messages />
                <ModalConfirm />
                <div id="block-ui-overlay" />
                <div id="viewport-overlay" onClick={this.handleNavigationClick} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loggedIn: state.core.auth.loggedIn,
        navigationVisible: state.frontend.navigation.visible,
        filtersVisible: state.frontend.filters.visible,
    }
}

export default connect(mapStateToProps)(withRouter(App))
