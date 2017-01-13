import React from 'react'
import { Link, IndexLink, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { routerShape } from 'react-router/lib/PropTypes'

import { resolvePath, hasPermission } from '../Crudl'
import { toggleNavigation, hideNavigation } from '../actions/frontend'
import { setActiveFilters } from '../actions/filters'
import { hasParentId } from '../utils/frontend'
import { viewsShape, authShape } from '../PropTypes'
import messages from '../messages/logout'

/* FIXME (Vaclav): shouldn't navigation go to into containers instead of components? */

export class Navigation extends React.Component {

    static propTypes = {
        onLogout: React.PropTypes.func.isRequired,
        views: viewsShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        activeView: React.PropTypes.string,
        navigationVisible: React.PropTypes.bool.isRequired,
        menu: React.PropTypes.node,
        router: routerShape.isRequired,
        auth: authShape.isRequired,
    };

    constructor() {
        super()
        this.handleNavigationClick = this.handleNavigationClick.bind(this)
    }

    componentDidMount() {
        window.addEventListener('keyup', this.listenForEventOutside)
        window.addEventListener('click', this.listenForEventOutside)
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.listenForEventOutside)
        window.removeEventListener('click', this.listenForEventOutside)
    }

    listenForEventOutside = (e) => {
        if (!this.props.navigationVisible) {
            return
        }
        // If "ESC" then blur searchfield, close listbox and destroy search
        // otherwise check if target hasParentId
        if (e.key === 'Escape' || e.keyCode === 27) {
            this.props.dispatch(hideNavigation())
        } else if (!e.key) {
            // Use parentId to find out if event.target has a parent with a certain id
            const parentId = 'navigation'
            // Close all results if event.target is not a child of parentId
            // otherwise keep visual focus
            const isChild = hasParentId(e.target, parentId)
            if (!isChild) {
                this.props.dispatch(hideNavigation())
            }
        }
    }

    handleNavigationClick() {
        this.props.dispatch(toggleNavigation())
    }

    handleItemClick() {
        this.props.dispatch(setActiveFilters([]))
        this.props.dispatch(hideNavigation())
    }

    handleAdd(addViewPath) {
        this.props.router.push(resolvePath(addViewPath))
        this.props.dispatch(hideNavigation())
    }

    isActive(viewIDs) {
        const { activeView } = this.props
        return activeView && viewIDs.indexOf(activeView) >= 0
    }

    render() {
        const { views, onLogout, menu, auth } = this.props
        let username
        if (auth.info.username) {
            username = <li><span className="user">{auth.info.username}</span></li>
        }
        let custommenu
        if (menu) {
            custommenu = React.cloneElement(menu, {
                navigation: this,
                Link,
                resolvePath,
                views,
            })
        } else {
            custommenu = Object.keys(views).map((view) => {
                const d = views[view]
                const familyIDs = [d.listView.id, d.changeView.id, d.addView && d.addView.id]
                if (hasPermission(d.listView.id, 'list')) {
                    return (
                        <li key={view}>
                            <Link
                                to={resolvePath(d.listView.path)}
                                className={this.isActive(familyIDs) ? 'active' : ''}
                                onClick={() => this.handleItemClick()}
                                >{d.listView.title}</Link>
                            {d.addView && hasPermission(d.addView.id, 'add') &&
                                <button
                                    className="action-add icon-only"
                                    aria-disabled="false"
                                    onClick={() => this.handleAdd(d.addView.path)}
                                    >&zwnj;</button>
                            }
                        </li>
                    )
                }
                return null
            })
        }
        return (
            <nav id="navigation" role="navigation">
                <h2><button
                    id="toggle-navigation"
                    className="action-toggle-navigation icon-only"
                    aria-label="Toggle navigation" onClick={this.handleNavigationClick}
                                                   >&zwnj;</button>
                </h2>
                <div className="navigation-content">
                    <div className="navigation-scroll-container">
                        <ul>
                            <li>
                                <IndexLink
                                    to={resolvePath()}
                                    activeClassName="active"
                                    onClick={() => this.props.dispatch(hideNavigation())}
                                    >Dashboard</IndexLink>
                            </li>
                        </ul>
                        <ul>
                            {custommenu}
                        </ul>
                    </div>
                    {username &&
                        <ul className="account">
                            {username}
                            <li>
                                <FormattedMessage {...messages.logoutButton} >
                                    {msg => <span className="logout" onClick={onLogout}>{msg}</span>}
                                </FormattedMessage>
                            </li>
                        </ul>
                    }
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return {
        navigationVisible: state.frontend.navigation.visible,
        activeView: state.core.activeView,
        auth: state.core.auth,
    }
}

export default connect(mapStateToProps)(withRouter(Navigation))
