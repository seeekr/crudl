import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Header from './TestHeader'
import Footer from './TestFooter'


export class TestView extends React.Component {

    static propTypes = {
        desc: React.PropTypes.object.isRequired,
        loggedIn: React.PropTypes.bool.isRequired,
        onClicked: React.PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = { clickCounter: 0 }
        this.footer = React.createElement(Footer)
    }

    handleClickCounter(loggedIn) {
        if (loggedIn) {
            this.setState({ clickCounter: this.state.clickCounter + 1 })
        }
    }

    handleClick(props) {
        this.handleClickCounter(props.loggedIn)
        this.props.onClicked()
    }

    render() {
        const { desc, loggedIn } = this.props
        return (
            <main id="test">
                <Header loggedIn={loggedIn}>
                    <div id="header-toolbar" className="headeritem">Toolbar</div>
                    <div id="header-title" className="headeritem">{desc.title}</div>
                </Header>
                <div>
                    <button onClick={() => this.handleClick(this.props)}>Click</button>
                    <span id="clickcounter">{this.state.clickCounter}</span>
                </div>
                {React.cloneElement(this.footer, {})}
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        loggedIn: state.loggedIn,
    }
}

// export default connect(mapStateToProps)(TestView)
export default connect(mapStateToProps)(withRouter(TestView))
