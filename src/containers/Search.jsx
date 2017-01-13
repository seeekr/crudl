import React from 'react'

/* FIXME (Vaclav): Shouldn't this be a component instead? */

class Search extends React.Component {

    static propTypes = {
        name: React.PropTypes.string.isRequired,
        onSearch: React.PropTypes.func.isRequired,
        onClear: React.PropTypes.func.isRequired,
    };

    static defaultProps = {
        setQuery: '',
    };

    state = {
        query: '',
        dirty: false,
    };


    componentWillReceiveProps(props) {
        if (!this.state.dirty) {
            this.setState({ query: props.setQuery, dirty: false })
        }
    }

    clear() {
        this.setState({ query: '', dirty: false })
        this.props.onClear(this.props.name)
    }

    search() {
        this.setState({ dirty: false })
        this.props.onSearch(this.props.name, this.state.query)
    }

    render() {
        return (
            <div className="field-container type-search">
                <div role="group" className="field-button-group field-button-inner">
                    <div className="field">
                        <input
                            onChange={e => this.setState({ query: e.target.value, dirty: true })}
                            type="text"
                            placeholder="Search"
                            id="listview-search"
                            value={this.state.query}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    this.search()
                                }
                            }}
                            />
                    </div>
                    <ul role="group" className="buttons">
                        <li><button
                            onClick={() => this.clear()}
                            aria-label="Clear search"
                            className="action-clear icon-only indicator"
                            aria-disabled={!this.state.query}
                            disabled={!this.state.query}
                            >&zwnj;</button></li>
                        <li><button
                            onClick={() => this.search()}
                            aria-label="Submit search"
                            className="action-search icon-only indicator"
                            aria-disabled={!this.state.query}
                            disabled={!this.state.query}
                            >&zwnj;</button></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Search
