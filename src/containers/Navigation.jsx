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
import MenuContainer from '../components/MenuContainer'
import MenuGroup from '../components/MenuGroup'
import MenuItem from '../components/MenuItem'

export class Navigation extends React.Component {

    static propTypes = {
        onLogout: React.PropTypes.func,
        views: viewsShape.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        activeView: React.PropTypes.string,
        navigationVisible: React.PropTypes.bool.isRequired,
        menuComponent: React.PropTypes.func, // A react component
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
        const { views, onLogout, menuComponent, auth } = this.props
        let username
        if (auth.info.username) {
            username = <li><span className="user">{auth.info.username}</span></li>
        }
        let menu
        if (menuComponent) {
            menu = React.createElement(menuComponent, { resolvePath, views, MenuContainer, MenuGroup, MenuItem })
        } else {
            menu = (
                <MenuContainer>
                    {Object.keys(views).map((view) => {
                        const { listView, addView, changeView } = views[view]
                        const familyIDs = [listView.id, changeView.id, addView && addView.id]
                        const hasListPermission = hasPermission(listView.id, 'list')
                        const hasAddPermission = addView && hasPermission(addView.id, 'add')
                        if (hasListPermission) {
                            return (
                                <MenuItem
                                    key={listView.id}
                                    label={listView.title}
                                    listPath={resolvePath(listView.path)}
                                    addPath={hasAddPermission ? resolvePath(addView.path) : undefined}
                                    isActive={this.isActive(familyIDs)}
                                    />
                            )
                        }
                        return undefined
                    })}
                </MenuContainer>
            )
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
                        {menu}
                    </div>
                    {username &&
                        <ul className="account">
                            {username}
                            <li>
                                {onLogout &&
                                    <FormattedMessage {...messages.logoutButton} >
                                        {msg => <span className="logout" onClick={onLogout}>{msg}</span>}
                                    </FormattedMessage>
                                }
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
