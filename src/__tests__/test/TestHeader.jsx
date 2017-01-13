import React from 'react'

class Header extends React.Component {

    static propTypes = {
        loggedIn: React.PropTypes.bool,
        children: React.PropTypes.array,
    }

    render() {
        return (
            <header>
                {this.props.children}
                <div id="header-extra" className="headeritem">Extra</div>
            </header>
        )
    }
}

export default Header
