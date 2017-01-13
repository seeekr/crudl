import React from 'react'

class Footer extends React.Component {

    static propTypes = {
        loggedIn: React.PropTypes.bool,
    }

    render() {
        return (
            <footer>
                <div id="footer-extra" className="footeritem">Footer</div>
            </footer>
        )
    }
}

export default Footer
